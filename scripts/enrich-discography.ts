/**
 * Enrich discography.json with streaming links via Odesli API
 * and download artwork from the thumbnails returned.
 *
 * Usage: npx tsx scripts/enrich-discography.ts
 *
 * Odesli API: free, ~10 req/min rate limit
 * No Spotify API needed - Odesli returns Spotify links for us.
 *
 * What it does:
 * 1. For each release with at least one link, calls Odesli
 * 2. Merges returned platform links (Spotify, Apple, YouTube, Beatport, etc.)
 * 3. Downloads artwork thumbnail if available
 * 4. Writes updated discography.json
 *
 * Safe to re-run: won't overwrite existing links or artwork.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DISCO_PATH = join(process.cwd(), "content/releases/discography.json");
const ARTWORK_DIR = join(process.cwd(), "public/artwork");
const ODESLI_API = "https://api.song.link/v1-alpha.1/links";
const RATE_DELAY_MS = 6500; // ~9 req/min, well under the limit

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
}

interface OdesliResponse {
  entityUniqueId: string;
  entitiesByUniqueId: Record<string, {
    id: string;
    title?: string;
    artistName?: string;
    thumbnailUrl?: string;
    thumbnailWidth?: number;
    thumbnailHeight?: number;
    apiProvider: string;
    platforms: string[];
  }>;
  linksByPlatform: Record<string, {
    entityUniqueId: string;
    url: string;
    nativeAppUriDesktop?: string;
  }>;
}

// Map Odesli platform names to our link field names
const PLATFORM_MAP: Record<string, string> = {
  spotify: "spotify",
  appleMusic: "apple",
  youtube: "youtube",
  youtubeMusic: "youtube_music",
  beatport: "beatport",
  soundcloud: "soundcloud",
  deezer: "deezer",
  tidal: "tidal",
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getSeedUrl(release: Release): string | null {
  // Pick the best seed URL for Odesli lookup
  // Prefer Spotify > Apple > Beatport > SoundCloud > smartlink > any other
  const priority = ["spotify", "apple", "beatport", "soundcloud", "smartlink"];
  for (const key of priority) {
    // Handle apple_1, apple_2, etc.
    for (const [k, v] of Object.entries(release.links)) {
      if (v && k.startsWith(key)) return v;
    }
  }
  // Fall back to any link
  for (const v of Object.values(release.links)) {
    if (v) return v;
  }
  return null;
}

async function fetchOdesli(url: string): Promise<OdesliResponse | null> {
  try {
    const apiUrl = `${ODESLI_API}?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);
    if (res.status === 429) {
      console.log("    Rate limited, waiting 30s...");
      await sleep(30000);
      const retry = await fetch(apiUrl);
      if (!retry.ok) return null;
      return retry.json();
    }
    if (!res.ok) {
      console.log(`    Odesli returned ${res.status}`);
      return null;
    }
    return res.json();
  } catch (e) {
    console.log(`    Fetch error: ${e}`);
    return null;
  }
}

async function downloadArtwork(url: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const ext = url.includes(".png") ? "png" : "jpg";
    const filename = `${slug}.${ext}`;
    const filepath = join(ARTWORK_DIR, filename);
    writeFileSync(filepath, buffer);
    return `/artwork/${filename}`;
  } catch {
    return null;
  }
}

async function main() {
  mkdirSync(ARTWORK_DIR, { recursive: true });

  const raw = readFileSync(DISCO_PATH, "utf-8");
  const releases: Release[] = JSON.parse(raw);

  let enriched = 0;
  let artworkDownloaded = 0;
  let skipped = 0;
  let noLinks = 0;

  for (let i = 0; i < releases.length; i++) {
    const r = releases[i];
    const seedUrl = getSeedUrl(r);

    console.log(`[${i + 1}/${releases.length}] ${r.artist} - ${r.title} (${r.year})`);

    if (!seedUrl) {
      console.log("    No seed URL, skipping");
      noLinks++;
      continue;
    }

    // Check if already fully enriched (has spotify + apple + artwork)
    if (r.links.spotify && r.links.apple && r.artwork) {
      console.log("    Already enriched, skipping");
      skipped++;
      continue;
    }

    const data = await fetchOdesli(seedUrl);
    if (!data) {
      console.log("    No Odesli data");
      await sleep(RATE_DELAY_MS);
      continue;
    }

    // Merge links (don't overwrite existing)
    let newLinks = 0;
    for (const [platform, fieldName] of Object.entries(PLATFORM_MAP)) {
      const link = data.linksByPlatform[platform];
      if (link?.url && !r.links[fieldName]) {
        r.links[fieldName] = link.url;
        newLinks++;
      }
    }

    if (newLinks > 0) {
      console.log(`    Added ${newLinks} new links`);
      enriched++;
    }

    // Download artwork if we don't have one
    if (!r.artwork) {
      // Find the best thumbnail from Odesli entities
      let bestThumb: string | null = null;
      let bestWidth = 0;
      for (const entity of Object.values(data.entitiesByUniqueId)) {
        if (entity.thumbnailUrl && (entity.thumbnailWidth ?? 0) > bestWidth) {
          bestThumb = entity.thumbnailUrl;
          bestWidth = entity.thumbnailWidth ?? 0;
        }
      }
      // If no width info, just take the first thumbnail
      if (!bestThumb) {
        for (const entity of Object.values(data.entitiesByUniqueId)) {
          if (entity.thumbnailUrl) {
            bestThumb = entity.thumbnailUrl;
            break;
          }
        }
      }

      if (bestThumb) {
        const slug = slugify(r.title);
        const artPath = await downloadArtwork(bestThumb, slug);
        if (artPath) {
          r.artwork = artPath;
          artworkDownloaded++;
          console.log(`    Downloaded artwork (${bestWidth}px)`);
        }
      }
    }

    await sleep(RATE_DELAY_MS);
  }

  // Clean up links: remove apple_1, apple_2 etc. if we now have a proper apple link
  for (const r of releases) {
    if (r.links.apple) {
      for (const key of Object.keys(r.links)) {
        if (key.startsWith("apple_")) {
          delete r.links[key];
        }
      }
    }
    // Remove smartlink if we have platform-specific links
    if (r.links.spotify && r.links.apple && r.links.smartlink) {
      delete r.links.smartlink;
    }
  }

  // Write back
  writeFileSync(DISCO_PATH, JSON.stringify(releases, null, 2) + "\n");

  console.log("\n--- Done ---");
  console.log(`Enriched links: ${enriched}`);
  console.log(`Artwork downloaded: ${artworkDownloaded}`);
  console.log(`Already complete: ${skipped}`);
  console.log(`No seed URL: ${noLinks}`);
}

main().catch(console.error);
