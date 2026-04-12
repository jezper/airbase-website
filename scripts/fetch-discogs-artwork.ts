/**
 * Fetch missing artwork from Discogs API.
 * Discogs has a public API with generous rate limits (60 req/min for unauthenticated).
 *
 * Usage: npx tsx scripts/fetch-discogs-artwork.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DISCO_PATH = join(process.cwd(), "content/releases/discography.json");
const ARTWORK_DIR = join(process.cwd(), "public/artwork");
const DISCOGS_API = "https://api.discogs.com";
const RATE_DELAY_MS = 1500; // 60 req/min = 1 per second, we go slower

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function searchDiscogs(artist: string, title: string): Promise<string | null> {
  try {
    // Clean up title for search (remove remix credits, brackets etc.)
    const cleanTitle = title.replace(/\s*\([^)]*\)\s*/g, "").trim();
    const cleanArtist = artist.replace(/\s*feat\.?\s+.*/i, "").trim();

    const query = `${cleanArtist} ${cleanTitle}`;
    const url = `${DISCOGS_API}/database/search?q=${encodeURIComponent(query)}&type=release&per_page=5`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "AirbaseWebsite/1.0 +https://airbasemusic.com",
      },
    });

    if (res.status === 429) {
      console.log("    Rate limited, waiting 10s...");
      await sleep(10000);
      return null;
    }

    if (!res.ok) {
      console.log(`    Discogs returned ${res.status}`);
      return null;
    }

    const data = await res.json();
    const results = data.results ?? [];

    // Find the best match with a cover image
    for (const result of results) {
      if (result.cover_image && !result.cover_image.includes("spacer.gif")) {
        return result.cover_image;
      }
    }

    // Try with just the title if artist search failed
    if (results.length === 0) {
      const fallbackUrl = `${DISCOGS_API}/database/search?q=${encodeURIComponent(title)}&type=release&per_page=3`;
      const fallbackRes = await fetch(fallbackUrl, {
        headers: { "User-Agent": "AirbaseWebsite/1.0 +https://airbasemusic.com" },
      });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        for (const result of fallbackData.results ?? []) {
          if (result.cover_image && !result.cover_image.includes("spacer.gif")) {
            return result.cover_image;
          }
        }
      }
    }

    return null;
  } catch (e) {
    console.log(`    Discogs error: ${e}`);
    return null;
  }
}

async function downloadImage(url: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "AirbaseWebsite/1.0 +https://airbasemusic.com" },
    });
    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 3000) return null;

    const ext = url.includes(".png") ? "png" : "jpg";
    const filename = `${slug}.${ext}`;
    writeFileSync(join(ARTWORK_DIR, filename), buffer);
    return `/artwork/${filename}`;
  } catch {
    return null;
  }
}

async function main() {
  mkdirSync(ARTWORK_DIR, { recursive: true });

  const raw = readFileSync(DISCO_PATH, "utf-8");
  const releases: Release[] = JSON.parse(raw);

  const missing = releases.filter((r) => !r.artwork);
  console.log(`${missing.length} releases missing artwork\n`);

  let found = 0;

  for (let i = 0; i < missing.length; i++) {
    const r = missing[i];
    const slug = slugify(r.title);

    if (existsSync(join(ARTWORK_DIR, `${slug}.jpg`)) || existsSync(join(ARTWORK_DIR, `${slug}.png`))) {
      const ext = existsSync(join(ARTWORK_DIR, `${slug}.png`)) ? "png" : "jpg";
      r.artwork = `/artwork/${slug}.${ext}`;
      found++;
      console.log(`[${i + 1}/${missing.length}] ${r.artist} - ${r.title}: already exists`);
      continue;
    }

    console.log(`[${i + 1}/${missing.length}] ${r.artist} - ${r.title}`);

    const imageUrl = await searchDiscogs(r.artist, r.title);

    if (imageUrl) {
      const artPath = await downloadImage(imageUrl, slug);
      if (artPath) {
        r.artwork = artPath;
        found++;
        console.log(`    Found: ${artPath}`);
      } else {
        console.log("    Download failed");
      }
    } else {
      console.log("    Not found on Discogs");
    }

    await sleep(RATE_DELAY_MS);
  }

  writeFileSync(DISCO_PATH, JSON.stringify(releases, null, 2) + "\n");

  console.log(`\n--- Done ---`);
  console.log(`Found: ${found}`);
  console.log(`Still missing: ${missing.length - found}`);
}

main().catch(console.error);
