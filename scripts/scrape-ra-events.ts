/**
 * Airbase Historical Show Scraper
 *
 * Attempts to find historical Airbase DJ events from multiple sources:
 *
 *   1. Resident Advisor (ra.co) — GraphQL API probe + HTML fetch
 *      RA's web pages are protected by Cloudflare (returns bot challenge HTML).
 *      Their GraphQL endpoint allows schema introspection but returns null for
 *      the artist(slug: "airbase") query, suggesting either the artist doesn't
 *      have an RA profile or the query requires authentication. The script
 *      documents both attempts and their results.
 *
 *   2. Setlist.fm — HTML scrape (no API key needed for basic HTML)
 *      Airbase has a confirmed profile (mbid: 73d6c6d9) with 3 documented shows.
 *      Parses artist page + individual setlist pages for full date/venue detail.
 *
 *   3. Wayback Machine CDX API — archived RA page discovery
 *      Probes the Internet Archive's CDX search API for any snapshots of
 *      ra.co/dj/airbase pages.
 *
 *   4. Mixcloud API — public REST API
 *      Airbase has cloudcasts but they are all podcast episodes (Touchdown Airbase
 *      series), not live sets with venue data. Included for completeness.
 *
 * Usage:
 *   npx tsx scripts/scrape-ra-events.ts
 *
 * Output:
 *   scripts/ra-events-output.json
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUTPUT_PATH = join(process.cwd(), "scripts/ra-events-output.json");

// --- Types ---

interface ShowEntry {
  venue: string;
  city: string;
  country: string;
  date: string | null;
  year_approx: string | null;
  event: string | null;
  notes: string;
  status: "past";
  source_url?: string;
}

interface ScraperResult {
  source: string;
  status: "success" | "blocked" | "empty" | "error" | "no_profile";
  message: string;
  events: ShowEntry[];
}

// --- Utilities ---

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Converts a setlist.fm date string like "July 24, 2010" to "YYYY-MM-DD".
 * Returns null if parsing fails.
 */
function parseSetlistDate(raw: string): string | null {
  const monthMap: Record<string, string> = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };
  // e.g. "July 24, 2010" or "June 14, 2008"
  const m = raw.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (!m) return null;
  const [, month, day, year] = m;
  const mm = monthMap[month];
  if (!mm) return null;
  return `${year}-${mm}-${day.padStart(2, "0")}`;
}

/**
 * Extracts the value of a meta tag from HTML.
 *   extractMeta('<meta name="description" content="foo bar"/>', "description")
 *   => "foo bar"
 */
function extractMeta(html: string, name: string): string | null {
  // Matches both name= and property= attributes
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const m = html.match(re);
  if (m) return m[1];
  // Also try reversed attribute order: content= first
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`,
    "i"
  );
  const m2 = html.match(re2);
  return m2 ? m2[1] : null;
}

const RA_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://ra.co/",
  Origin: "https://ra.co",
};

// --- Source 1: Resident Advisor ---

async function scrapeRA(): Promise<ScraperResult> {
  console.log("\n[1/4] Resident Advisor (ra.co)");

  // Step 1a: Try fetching the artist HTML page
  console.log("  Fetching https://ra.co/dj/airbase/past-events ...");
  let htmlStatus = 0;
  try {
    const res = await fetch("https://ra.co/dj/airbase/past-events", {
      headers: RA_HEADERS,
    });
    htmlStatus = res.status;
    console.log(`  HTML page status: ${htmlStatus}`);

    if (res.ok) {
      const html = await res.text();
      // Check if we got real content or a bot challenge
      if (html.includes("Please enable JS and disable any ad blocker") ||
          html.includes("data-cfasync") ||
          html.includes("Cloudflare")) {
        console.log("  Blocked by Cloudflare bot protection.");
      } else if (html.includes("__NEXT_DATA__")) {
        // Try to extract SSR data from Next.js
        const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
        if (match) {
          try {
            const nextData = JSON.parse(match[1]);
            const events = nextData?.props?.pageProps?.artist?.pastEvents?.data ?? [];
            if (events.length > 0) {
              const found: ShowEntry[] = events.map((e: Record<string, unknown>) => ({
                venue: (e.venue as Record<string, unknown>)?.name ?? "Unknown",
                city: (e.venue as Record<string, unknown>)?.area?.name ?? "",
                country: (e.venue as Record<string, unknown>)?.country?.name ?? "",
                date: e.date ? String(e.date).slice(0, 10) : null,
                year_approx: null,
                event: (e.title as string) ?? null,
                notes: "Source: Resident Advisor",
                status: "past" as const,
                source_url: `https://ra.co/events/${e.id}`,
              }));
              console.log(`  Found ${found.length} events from __NEXT_DATA__`);
              return { source: "Resident Advisor", status: "success", message: "Parsed from __NEXT_DATA__", events: found };
            }
          } catch {
            console.log("  Could not parse __NEXT_DATA__ JSON");
          }
        }
      }
    }
  } catch (e) {
    console.log(`  HTML fetch error: ${e}`);
  }

  // Step 1b: Try the RA GraphQL API
  console.log("  Trying RA GraphQL API...");
  const GRAPHQL_URL = "https://ra.co/graphql";
  const GRAPHQL_HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": RA_HEADERS["User-Agent"],
    Referer: "https://ra.co/dj/airbase",
    Origin: "https://ra.co",
  };

  // First check if the artist exists
  try {
    const artistCheck = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: GRAPHQL_HEADERS,
      body: JSON.stringify({
        query: `{ artist(slug: "airbase") { id name urlSafeName } }`,
      }),
    });
    const artistData = await artistCheck.json() as { data?: { artist: { id: string; name: string } | null } };
    console.log(`  GraphQL artist check: ${JSON.stringify(artistData.data?.artist)}`);

    if (!artistData.data?.artist) {
      // Artist not found via slug - could require auth or different slug
      // Try with a broader event search using the top-level events query
      const eventsCheck = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: GRAPHQL_HEADERS,
        body: JSON.stringify({
          query: `{
            events(type: ARCHIVE, limit: 5) {
              id title date
              venue { name area { name } country { name } }
              artists { name }
            }
          }`,
        }),
      });
      const eventsData = await eventsCheck.json() as { data?: { events: unknown[] } };
      const topEvents = eventsData.data?.events ?? [];
      console.log(`  Top-level events(ARCHIVE) returned ${topEvents.length} results`);
      // These are site-wide, not Airbase-specific — not useful without auth/context
      console.log("  RA GraphQL: artist query returns null. Profile may not exist or requires auth.");
      console.log(`  Note: HTML page returned HTTP ${htmlStatus} (Cloudflare protection)`);
    } else {
      // Artist found — query past events
      const artistId = artistData.data.artist.id;
      console.log(`  Found RA artist ID: ${artistId}`);
      const allEvents: ShowEntry[] = [];

      // Try by year from 2000 to current year
      const currentYear = new Date().getFullYear();
      for (let year = 2000; year <= currentYear; year++) {
        try {
          const evRes = await fetch(GRAPHQL_URL, {
            method: "POST",
            headers: GRAPHQL_HEADERS,
            body: JSON.stringify({
              query: `{
                artist(slug: "airbase") {
                  events(type: ARCHIVE, year: ${year}, limit: 100) {
                    id title date
                    venue { name area { name } country { name } }
                  }
                }
              }`,
            }),
          });
          const evData = await evRes.json() as { data?: { artist?: { events?: Array<{ id: string; title?: string; date: string; venue?: { name: string; area?: { name: string }; country?: { name: string } } }> } } };
          const yearEvents = evData.data?.artist?.events ?? [];
          if (yearEvents.length > 0) {
            console.log(`    ${year}: ${yearEvents.length} events`);
            for (const ev of yearEvents) {
              allEvents.push({
                venue: ev.venue?.name ?? "Unknown",
                city: ev.venue?.area?.name ?? "",
                country: ev.venue?.country?.name ?? "",
                date: ev.date ? String(ev.date).slice(0, 10) : null,
                year_approx: null,
                event: ev.title ?? null,
                notes: "Source: Resident Advisor",
                status: "past",
                source_url: `https://ra.co/events/${ev.id}`,
              });
            }
          }
          await sleep(200);
        } catch {
          // skip year
        }
      }

      if (allEvents.length > 0) {
        console.log(`  Total RA events found: ${allEvents.length}`);
        return { source: "Resident Advisor", status: "success", message: `${allEvents.length} events via GraphQL`, events: allEvents };
      }
    }
  } catch (e) {
    console.log(`  GraphQL error: ${e}`);
  }

  return {
    source: "Resident Advisor",
    status: htmlStatus === 403 ? "blocked" : "no_profile",
    message: htmlStatus === 403
      ? `HTML page blocked by Cloudflare (HTTP ${htmlStatus}). GraphQL returns null for artist(slug: "airbase") — artist may not have an RA profile or queries require authentication.`
      : `HTTP ${htmlStatus}. GraphQL artist query returned null.`,
    events: [],
  };
}

// --- Source 2: Setlist.fm ---

async function scrapeSetlistFm(): Promise<ScraperResult> {
  console.log("\n[2/4] Setlist.fm");

  const ARTIST_URL = "https://www.setlist.fm/setlists/airbase-73d6c6d9.html";
  const HEADERS = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Accept: "text/html",
  };

  console.log(`  Fetching ${ARTIST_URL} ...`);
  let artistHtml: string;
  try {
    const res = await fetch(ARTIST_URL, { headers: HEADERS });
    if (!res.ok) {
      return {
        source: "setlist.fm",
        status: "error",
        message: `HTTP ${res.status}`,
        events: [],
      };
    }
    artistHtml = await res.text();
  } catch (e) {
    return {
      source: "setlist.fm",
      status: "error",
      message: `Fetch error: ${e}`,
      events: [],
    };
  }

  // Extract setlist page paths: e.g. "setlist/airbase/2010/de-schorre-boom-belgium-bf8359e.html"
  const setlistPaths: string[] = [];
  const pathRe = /setlist\/airbase\/\d{4}\/[a-z0-9-]+-[a-f0-9]+\.html/g;
  let m: RegExpExecArray | null;
  while ((m = pathRe.exec(artistHtml)) !== null) {
    if (!setlistPaths.includes(m[0])) {
      setlistPaths.push(m[0]);
    }
  }

  console.log(`  Found ${setlistPaths.length} setlist paths: ${setlistPaths.join(", ")}`);

  if (setlistPaths.length === 0) {
    return {
      source: "setlist.fm",
      status: "empty",
      message: "No setlist links found on artist page",
      events: [],
    };
  }

  const events: ShowEntry[] = [];

  for (const path of setlistPaths) {
    const url = `https://www.setlist.fm/${path}`;
    console.log(`  Fetching ${url} ...`);
    await sleep(1500); // be polite

    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) {
        console.log(`    HTTP ${res.status}, skipping`);
        continue;
      }
      const html = await res.text();

      // Extract from <title>: "Airbase Concert Setlist at Tomorrowland 2010 on July 24, 2010 | setlist.fm"
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const pageTitle = titleMatch ? titleMatch[1] : "";

      // Extract from <meta name="description">
      const descMatch = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)
        ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+name="description"/i);
      const desc = descMatch ? descMatch[1] : "";

      // Description format: "Get the Airbase Setlist of the concert at De Schorre, Boom, Belgium on July 24, 2010 ..."
      let venue = "Unknown Venue";
      let city = "";
      let country = "";
      let dateStr: string | null = null;
      let eventName: string | null = null;

      // Parse description for location + date
      const descRe = /concert at (.+?) on ([A-Z][a-z]+ \d+, \d+)/;
      const descM = desc.match(descRe);
      if (descM) {
        // Location string: "De Schorre, Boom, Belgium" or "Pi, Oslo, Norway"
        const locationStr = descM[1];
        const parts = locationStr.split(",").map((s) => s.trim());
        if (parts.length >= 3) {
          venue = parts[0];
          city = parts[1];
          country = parts.slice(2).join(", ");
        } else if (parts.length === 2) {
          venue = parts[0];
          city = parts[1];
        } else {
          venue = parts[0] ?? "Unknown Venue";
        }
        dateStr = parseSetlistDate(descM[2]);
      }

      // Extract event/tour name from title: "Airbase Concert Setlist at Tomorrowland 2010 on July 24, 2010"
      const titleRe = /Concert Setlist at (.+?) on [A-Z]/;
      const titleM = pageTitle.match(titleRe);
      if (titleM) {
        const possibleEvent = titleM[1].trim();
        // If it matches "Venue, City" pattern or "Unknown Venue" it's not a named event
        if (!possibleEvent.includes(",") && possibleEvent !== venue) {
          eventName = possibleEvent;
        }
      }

      // og:title often gives the event name cleanly: "Airbase Setlist at Tomorrowland 2010"
      const ogTitle = extractMeta(html, "og:title");
      if (ogTitle) {
        const ogM = ogTitle.match(/Setlist at (.+)$/);
        if (ogM) {
          const candidate = ogM[1].trim();
          if (!candidate.includes(",")) {
            eventName = candidate;
          }
        }
      }

      const year = path.match(/\/(\d{4})\//)?.[1] ?? null;

      events.push({
        venue,
        city,
        country,
        date: dateStr,
        year_approx: dateStr ? null : year,
        event: eventName,
        notes: `Source: setlist.fm — ${url}`,
        status: "past",
        source_url: url,
      });

      console.log(`    Parsed: ${venue}, ${city}, ${country} — ${dateStr ?? year} — event: ${eventName ?? "none"}`);
    } catch (e) {
      console.log(`    Error fetching ${url}: ${e}`);
    }
  }

  return {
    source: "setlist.fm",
    status: events.length > 0 ? "success" : "empty",
    message: `${events.length} events found`,
    events,
  };
}

// --- Source 3: Wayback Machine CDX API ---

async function scrapeWayback(): Promise<ScraperResult> {
  console.log("\n[3/4] Wayback Machine (archive.org CDX API)");

  const targets = [
    "ra.co/dj/airbase*",
    "residentadvisor.net/dj/airbase*",
  ];

  const snapshots: string[] = [];
  for (const target of targets) {
    const url = `http://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(target)}&output=json&limit=20&fl=timestamp,statuscode,original&matchType=prefix&filter=statuscode:200`;
    console.log(`  CDX query: ${target}`);
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json() as (string[])[];
      if (!Array.isArray(data) || data.length <= 1) {
        console.log("  No snapshots found");
        continue;
      }
      // Skip header row
      for (const row of data.slice(1)) {
        snapshots.push(`https://web.archive.org/web/${row[0]}/${row[2]}`);
      }
    } catch (e) {
      console.log(`  CDX error: ${e}`);
    }
    await sleep(500);
  }

  if (snapshots.length === 0) {
    return {
      source: "Wayback Machine",
      status: "empty",
      message: "No archived snapshots of RA Airbase pages found",
      events: [],
    };
  }

  console.log(`  Found ${snapshots.length} snapshots. Trying first 3...`);

  const events: ShowEntry[] = [];

  for (const snapshotUrl of snapshots.slice(0, 3)) {
    console.log(`  Fetching ${snapshotUrl}...`);
    try {
      const res = await fetch(snapshotUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        },
      });
      if (!res.ok) {
        console.log(`  HTTP ${res.status}`);
        continue;
      }
      const html = await res.text();

      // Look for event data patterns in the archived page
      // Old RA used to show event listings in HTML tables or lists
      const eventMatches = html.matchAll(/<td[^>]*class="[^"]*date[^"]*"[^>]*>([^<]+)<\/td>[\s\S]{0,500}?<td[^>]*class="[^"]*venue[^"]*"[^>]*>([^<]+)<\/td>/gi);
      for (const em of eventMatches) {
        events.push({
          venue: em[2].trim(),
          city: "",
          country: "",
          date: null,
          year_approx: null,
          event: null,
          notes: `Source: Wayback Machine snapshot — ${snapshotUrl}`,
          status: "past",
          source_url: snapshotUrl,
        });
      }

      console.log(`  Parsed ${events.length} events from this snapshot`);
    } catch (e) {
      console.log(`  Error: ${e}`);
    }
    await sleep(1000);
  }

  return {
    source: "Wayback Machine",
    status: events.length > 0 ? "success" : "empty",
    message: events.length > 0
      ? `${events.length} events from archived snapshots`
      : `Found ${snapshots.length} snapshot URL(s) but no structured event data in HTML`,
    events,
    ...(snapshots.length > 0 ? { snapshot_urls: snapshots } as Record<string, unknown> : {}),
  };
}

// --- Source 4: Mixcloud API ---

async function scrapeMixcloud(): Promise<ScraperResult> {
  console.log("\n[4/4] Mixcloud API");

  const pages = [
    "https://api.mixcloud.com/airbase/cloudcasts/?limit=100",
    "https://api.mixcloud.com/airbase/cloudcasts/?limit=100&until=2014-02-10+11%3A22%3A08",
  ];

  const cloudcasts: Array<{ name: string; created_time: string; url: string }> = [];

  for (const pageUrl of pages) {
    try {
      const res = await fetch(pageUrl);
      if (!res.ok) continue;
      const data = await res.json() as { data?: Array<{ name: string; created_time: string; url: string }> };
      for (const item of data.data ?? []) {
        cloudcasts.push({ name: item.name, created_time: item.created_time, url: item.url });
      }
    } catch (e) {
      console.log(`  Mixcloud error: ${e}`);
    }
    await sleep(500);
  }

  console.log(`  Found ${cloudcasts.length} cloudcasts`);

  // Analyze cloudcast names for venue/event hints
  // "Touchdown Airbase" is the podcast series — not a live set
  // Look for anything that looks like a live set name
  const liveSetPatterns = [
    /live\s+at\s+(.+)/i,
    /set\s+at\s+(.+)/i,
    /@\s*(.+)/i,
    /(.+)\s+live/i,
  ];

  const events: ShowEntry[] = [];

  for (const cast of cloudcasts) {
    for (const pattern of liveSetPatterns) {
      const m = cast.name.match(pattern);
      if (m) {
        events.push({
          venue: m[1].trim(),
          city: "",
          country: "",
          date: cast.created_time.slice(0, 10),
          year_approx: null,
          event: cast.name,
          notes: `Source: Mixcloud — ${cast.url}`,
          status: "past",
          source_url: cast.url,
        });
        break;
      }
    }
  }

  if (events.length === 0) {
    console.log("  No live sets detected — all cloudcasts appear to be podcast episodes (Touchdown Airbase series).");
    console.log(`  Cloudcast names sample: ${cloudcasts.slice(0, 3).map((c) => c.name).join(", ")}`);
  } else {
    console.log(`  ${events.length} possible live sets found`);
  }

  return {
    source: "Mixcloud",
    status: events.length > 0 ? "success" : "empty",
    message: events.length === 0
      ? `${cloudcasts.length} cloudcasts found, all are 'Touchdown Airbase' podcast episodes or 'Airbase Deep' mix series — no live sets with venue data`
      : `${events.length} possible live sets detected`,
    events,
  };
}

// --- Main ---

async function main() {
  console.log("=== Airbase Historical Show Scraper ===");
  console.log("Searching across RA, setlist.fm, Wayback Machine, and Mixcloud.\n");

  const results: ScraperResult[] = [];

  // Run sequentially to avoid hammering servers
  results.push(await scrapeRA());
  results.push(await scrapeSetlistFm());
  results.push(await scrapeWayback());
  results.push(await scrapeMixcloud());

  // Deduplicate and merge events
  const allEvents: ShowEntry[] = [];
  for (const result of results) {
    allEvents.push(...result.events);
  }

  // Simple deduplication: by date + venue
  const seen = new Set<string>();
  const deduped: ShowEntry[] = [];
  for (const ev of allEvents) {
    const key = `${ev.date ?? ev.year_approx}-${ev.venue.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(ev);
    }
  }

  // Sort: events with exact dates first, then by date descending
  deduped.sort((a, b) => {
    const da = a.date ?? `${a.year_approx ?? "0000"}-12-31`;
    const db = b.date ?? `${b.year_approx ?? "0000"}-12-31`;
    return db.localeCompare(da);
  });

  const output = {
    generated: new Date().toISOString(),
    summary: {
      total_events_found: deduped.length,
      sources: results.map((r) => ({
        source: r.source,
        status: r.status,
        message: r.message,
        count: r.events.length,
      })),
    },
    events: deduped,
  };

  // Ensure scripts/ dir exists (it does, but defensive)
  mkdirSync(join(process.cwd(), "scripts"), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");

  console.log("\n=== Summary ===");
  for (const r of results) {
    console.log(`  ${r.source}: [${r.status}] ${r.message}`);
  }
  console.log(`\nTotal unique events: ${deduped.length}`);
  console.log(`Output written to: ${OUTPUT_PATH}`);

  if (deduped.length > 0) {
    console.log("\nEvents found:");
    for (const ev of deduped) {
      const dateStr = ev.date ?? ev.year_approx ?? "date unknown";
      const eventStr = ev.event ? ` (${ev.event})` : "";
      console.log(`  ${dateStr} — ${ev.venue}, ${ev.city}, ${ev.country}${eventStr}`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
