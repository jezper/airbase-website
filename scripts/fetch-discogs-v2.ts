/**
 * Discogs artwork fetch v2 - uses more specific search queries
 * and tries multiple search strategies.
 *
 * Usage: npx tsx scripts/fetch-discogs-v2.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DISCO_PATH = join(process.cwd(), "content/releases/discography.json");
const ARTWORK_DIR = join(process.cwd(), "public/artwork");
const DISCOGS_API = "https://api.discogs.com";
const RATE_DELAY_MS = 2000;

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

const HEADERS = { "User-Agent": "AirbaseWebsite/1.0 +https://airbasemusic.com" };

async function searchDiscogs(release: Release): Promise<string | null> {
  // Strategy 1: search with exact title and artist
  const strategies = [
    `${release.artist} - ${release.title}`,
    `${release.title} ${release.artist}`,
    // For remixes, try the clean title
    release.title.replace(/\s*\([^)]*\)\s*/g, "").trim() + " " + release.artist,
    // Just the title
    release.title,
  ];

  for (const query of strategies) {
    try {
      const url = `${DISCOGS_API}/database/search?q=${encodeURIComponent(query)}&type=release&per_page=10`;
      const res = await fetch(url, { headers: HEADERS });

      if (res.status === 429) {
        console.log("    Rate limited, waiting 15s...");
        await sleep(15000);
        continue;
      }
      if (!res.ok) continue;

      const data = await res.json();
      const results = data.results ?? [];

      // Look for a result that matches our title closely
      for (const result of results) {
        const resultTitle = (result.title ?? "").toLowerCase();
        const ourTitle = release.title.toLowerCase();
        const ourArtist = release.artist.toLowerCase().split(/\s+feat/)[0].trim();

        if (
          (resultTitle.includes(ourTitle) || ourTitle.includes(resultTitle.split(" - ").pop() ?? "")) &&
          result.cover_image &&
          !result.cover_image.includes("spacer.gif")
        ) {
          return result.cover_image;
        }
      }

      await sleep(RATE_DELAY_MS);
    } catch {
      continue;
    }
  }

  return null;
}

async function downloadImage(url: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: HEADERS });
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

    console.log(`[${i + 1}/${missing.length}] ${r.artist} - ${r.title} (${r.label})`);

    const imageUrl = await searchDiscogs(r);
    if (imageUrl) {
      const artPath = await downloadImage(imageUrl, slug);
      if (artPath) {
        r.artwork = artPath;
        found++;
        console.log(`    Found!`);
      } else {
        console.log("    Download failed");
      }
    } else {
      console.log("    Not found");
    }

    await sleep(RATE_DELAY_MS);
  }

  writeFileSync(DISCO_PATH, JSON.stringify(releases, null, 2) + "\n");
  console.log(`\n--- Done ---`);
  console.log(`Found: ${found}`);
  console.log(`Still missing: ${missing.length - found}`);
}

main().catch(console.error);
