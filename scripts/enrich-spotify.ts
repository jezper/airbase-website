/**
 * Enrich discography.json with Spotify data:
 * - Tracklists (fill empty tracks arrays)
 * - Compilation appearances (appearsOn field)
 * - Artwork (download from Spotify)
 * - Spotify links (fill missing)
 *
 * Usage:
 *   npx tsx scripts/enrich-spotify.ts
 *   npx tsx scripts/enrich-spotify.ts --dry-run
 *
 * Requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const DISCO_PATH = join(process.cwd(), "content/releases/discography.json");
const ARTWORK_DIR = join(process.cwd(), "public/artwork");
const AIRBASE_ARTIST_ID = "3R3fc4fBMzzmJoSrRgVdKe";
const REQUEST_DELAY_MS = 200;

const DRY_RUN = process.argv.includes("--dry-run");

// ── Types ──

interface Release {
  year: number;
  artist: string;
  title: string;
  type: string;
  label: string;
  tracks: string[];
  links: Record<string, string | undefined>;
  date: string;
  artwork: string | null;
  relatedRelease?: string;
  appearsOn?: { title: string; year: number; label?: string }[];
}

interface SpotifyToken {
  access_token: string;
  expires_at: number;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: string;
  release_date: string;
  label?: string;
  images: { url: string; width: number; height: number }[];
  external_urls: { spotify: string };
  artists: { name: string }[];
  total_tracks: number;
}

interface SpotifyTrack {
  name: string;
  track_number: number;
  artists: { name: string }[];
}

// ── Auth ──

let token: SpotifyToken | null = null;

async function getToken(): Promise<string> {
  if (token && Date.now() < token.expires_at - 60_000) {
    return token.access_token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local");
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`Spotify auth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  token = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
  return token.access_token;
}

// ── API helpers ──

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function spotifyGet(path: string): Promise<unknown | null> {
  const accessToken = await getToken();
  const url = path.startsWith("http") ? path : `https://api.spotify.com/v1${path}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get("Retry-After") ?? "5", 10);
    console.log(`    Rate limited, waiting ${retryAfter}s...`);
    await sleep(retryAfter * 1000);
    return spotifyGet(path);
  }

  if (!res.ok) {
    if (res.status === 404) return null;
    console.log(`    Spotify returned ${res.status} for ${path}`);
    return null;
  }

  return res.json();
}

// ── Normalize for matching ──

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\(\[\{].*?[\)\]\}]/g, "") // strip parentheticals
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titlesMatch(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return true;
  // Only allow contains match if the shorter string is at least 60% of the longer
  const shorter = na.length < nb.length ? na : nb;
  const longer = na.length < nb.length ? nb : na;
  if (shorter.length / longer.length >= 0.6 && longer.includes(shorter)) return true;
  return false;
}

/** Strict artist check: at least one Spotify artist name overlaps with our artist */
function artistsOverlap(spotifyArtists: { name: string }[], ourArtist: string): boolean {
  const ourParts = ourArtist
    .split(/\s+(?:feat\.?|&|vs\.?|and)\s+/i)
    .map((p) => normalize(p));
  for (const sa of spotifyArtists) {
    const sn = normalize(sa.name);
    if (ourParts.some((p) => p === sn || sn.includes(p) || p.includes(sn))) return true;
  }
  return false;
}

// ── Search for a release on Spotify ──

async function searchAlbum(artist: string, title: string): Promise<SpotifyAlbum | null> {
  // Try exact search first
  const q = encodeURIComponent(`artist:${artist} album:${title}`);
  const data = await spotifyGet(`/search?q=${q}&type=album&limit=5`) as {
    albums?: { items: SpotifyAlbum[] };
  } | null;

  if (!data?.albums?.items?.length) {
    // Fallback: broader search
    const q2 = encodeURIComponent(`${artist} ${title}`);
    const data2 = await spotifyGet(`/search?q=${q2}&type=album&limit=10`) as {
      albums?: { items: SpotifyAlbum[] };
    } | null;
    if (!data2?.albums?.items?.length) return null;
    return findBestMatch(data2.albums.items, artist, title);
  }

  return findBestMatch(data.albums.items, artist, title);
}

function findBestMatch(albums: SpotifyAlbum[], artist: string, title: string): SpotifyAlbum | null {
  // Require both artist AND title match
  for (const album of albums) {
    if (artistsOverlap(album.artists, artist) && titlesMatch(album.name, title)) {
      return album;
    }
  }
  return null;
}

// ── Get album tracks ──

async function getAlbumTracks(albumId: string): Promise<string[]> {
  const data = await spotifyGet(`/albums/${albumId}/tracks?limit=50`) as {
    items?: SpotifyTrack[];
  } | null;
  if (!data?.items) return [];
  return data.items
    .sort((a, b) => a.track_number - b.track_number)
    .map((t) => t.name);
}

// ── Get all "appears on" compilations for the artist ──

async function getAppearsOn(): Promise<SpotifyAlbum[]> {
  const albums: SpotifyAlbum[] = [];
  let url: string | null = `/artists/${AIRBASE_ARTIST_ID}/albums?include_groups=appears_on&limit=50`;

  while (url) {
    const data = await spotifyGet(url) as {
      items?: SpotifyAlbum[];
      next?: string | null;
    } | null;
    if (!data?.items) break;
    albums.push(...data.items);
    url = data.next ?? null;
    if (url) await sleep(REQUEST_DELAY_MS);
  }

  return albums;
}

// ── Download artwork ──

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function downloadArtwork(url: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = `${slug}.jpg`;
    const filepath = join(ARTWORK_DIR, filename);
    writeFileSync(filepath, buffer);
    return `/artwork/${filename}`;
  } catch {
    return null;
  }
}

// ── Match compilations to releases ──

async function matchCompilations(
  compilations: SpotifyAlbum[],
  releases: Release[]
): Promise<Map<number, { title: string; year: number; label?: string }[]>> {
  const matches = new Map<number, { title: string; year: number; label?: string }[]>();

  console.log(`\nMatching ${compilations.length} compilations to releases...`);

  for (let ci = 0; ci < compilations.length; ci++) {
    const comp = compilations[ci];
    const compYear = parseInt(comp.release_date.slice(0, 4), 10);

    // Get tracks on this compilation
    const tracks = await getAlbumTracks(comp.id);
    await sleep(REQUEST_DELAY_MS);

    for (const trackName of tracks) {
      // Try to match this track to one of our releases
      for (let ri = 0; ri < releases.length; ri++) {
        const release = releases[ri];

        // Check if the track name matches the release title or any of its tracks
        const releaseTrackNames = [release.title, ...release.tracks];
        const matched = releaseTrackNames.some((rt) => titlesMatch(trackName, rt));

        if (matched) {
          const existing = matches.get(ri) ?? [];
          // Avoid duplicates
          if (!existing.some((e) => normalize(e.title) === normalize(comp.name))) {
            existing.push({
              title: comp.name,
              year: compYear,
              ...(comp.label && { label: comp.label }),
            });
            matches.set(ri, existing);
          }
        }
      }
    }

    if ((ci + 1) % 10 === 0) {
      console.log(`  Processed ${ci + 1}/${compilations.length} compilations`);
    }
  }

  return matches;
}

// ── Main ──

async function main() {
  mkdirSync(ARTWORK_DIR, { recursive: true });

  console.log(DRY_RUN ? "=== DRY RUN (no changes will be written) ===" : "=== Spotify Enrichment ===");
  console.log();

  // Authenticate
  await getToken();
  console.log("Authenticated with Spotify\n");

  // Load discography
  const raw = readFileSync(DISCO_PATH, "utf-8");
  const releases: Release[] = JSON.parse(raw);

  let tracksAdded = 0;
  let artworkAdded = 0;
  let linksAdded = 0;
  let notFound = 0;

  // Phase 1: Enrich each release (tracklists, artwork, links)
  console.log("Phase 1: Enriching releases...\n");

  for (let i = 0; i < releases.length; i++) {
    const r = releases[i];
    const needsTracks = r.tracks.length === 0;
    const needsArtwork = !r.artwork;
    const needsLink = !r.links.spotify;

    if (!needsTracks && !needsArtwork && !needsLink) {
      continue;
    }

    console.log(`[${i + 1}/${releases.length}] ${r.artist} - ${r.title} (${r.year})`);

    // Extract primary artist name for search
    const searchArtist = r.artist.split(/\s+feat\.?\s+/i)[0].trim();
    const album = await searchAlbum(searchArtist, r.title);
    await sleep(REQUEST_DELAY_MS);

    if (!album) {
      console.log("    Not found on Spotify");
      notFound++;
      continue;
    }

    console.log(`    Matched: ${album.name} by ${album.artists.map((a) => a.name).join(", ")}`);

    // Tracklist
    if (needsTracks) {
      const tracks = await getAlbumTracks(album.id);
      await sleep(REQUEST_DELAY_MS);
      if (tracks.length > 0) {
        r.tracks = tracks;
        tracksAdded++;
        console.log(`    Added ${tracks.length} tracks`);
      }
    }

    // Artwork
    if (needsArtwork && album.images.length > 0) {
      const bestImage = album.images.sort((a, b) => b.width - a.width)[0];
      if (!DRY_RUN) {
        const slug = slugify(r.title);
        const artPath = await downloadArtwork(bestImage.url, slug);
        if (artPath) {
          r.artwork = artPath;
          artworkAdded++;
          console.log(`    Downloaded artwork (${bestImage.width}px)`);
        }
      } else {
        artworkAdded++;
        console.log(`    Would download artwork (${bestImage.width}px)`);
      }
    }

    // Spotify link
    if (needsLink) {
      r.links.spotify = album.external_urls.spotify;
      linksAdded++;
      console.log(`    Added Spotify link`);
    }
  }

  // Phase 2: Compilation appearances
  console.log("\nPhase 2: Finding compilation appearances...\n");

  const compilations = await getAppearsOn();
  console.log(`Found ${compilations.length} "appears on" albums\n`);

  const compMatches = await matchCompilations(compilations, releases);
  let compsAdded = 0;

  for (const [ri, comps] of compMatches) {
    const r = releases[ri];
    const existing = r.appearsOn ?? [];
    const newComps = comps.filter(
      (c) => !existing.some((e) => normalize(e.title) === normalize(c.title))
    );
    if (newComps.length > 0) {
      r.appearsOn = [...existing, ...newComps].sort((a, b) => a.year - b.year);
      compsAdded += newComps.length;
      console.log(`  ${r.artist} - ${r.title}: +${newComps.length} compilations`);
    }
  }

  // Write back
  if (!DRY_RUN) {
    writeFileSync(DISCO_PATH, JSON.stringify(releases, null, 2) + "\n");
  }

  console.log("\n--- Done ---");
  console.log(`Tracklists filled: ${tracksAdded}`);
  console.log(`Artwork downloaded: ${artworkAdded}`);
  console.log(`Spotify links added: ${linksAdded}`);
  console.log(`Compilation appearances added: ${compsAdded}`);
  console.log(`Not found on Spotify: ${notFound}`);
  if (DRY_RUN) console.log("\n(Dry run - no files were modified)");
}

main().catch(console.error);
