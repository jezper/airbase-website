/**
 * Fetch missing artwork via Google Images search.
 * Uses Google's undocumented image search endpoint.
 *
 * Usage: npx tsx scripts/fetch-missing-artwork.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DISCO_PATH = join(process.cwd(), "content/releases/discography.json");
const ARTWORK_DIR = join(process.cwd(), "public/artwork");
const RATE_DELAY_MS = 3000;

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

async function searchGoogleImages(query: string): Promise<string | null> {
  try {
    // Use Google's image search to find artwork
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&tbs=isz:m`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) {
      console.log(`    Google returned ${res.status}`);
      return null;
    }

    const html = await res.text();

    // Extract image URLs from Google's response
    // Google embeds base64 thumbnails and links to full images
    const imgMatches = html.match(/\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))",\d+,\d+\]/gi);
    if (imgMatches && imgMatches.length > 0) {
      // Extract the URL from the first match
      const match = imgMatches[0].match(/"(https?:\/\/[^"]+)"/);
      if (match) return match[1];
    }

    // Alternative: try extracting from data attributes
    const dataMatches = html.match(/data-src="(https?:\/\/[^"]+)"/g);
    if (dataMatches && dataMatches.length > 0) {
      const match = dataMatches[0].match(/"(https?:\/\/[^"]+)"/);
      if (match) return match[1];
    }

    return null;
  } catch (e) {
    console.log(`    Search error: ${e}`);
    return null;
  }
}

async function searchBeatport(artist: string, title: string): Promise<string | null> {
  try {
    const query = `${artist} ${title} site:beatport.com`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&tbs=isz:m`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html",
      },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const imgMatches = html.match(/\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))",\d+,\d+\]/gi);
    if (imgMatches) {
      const match = imgMatches[0].match(/"(https?:\/\/[^"]+)"/);
      if (match) return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

async function downloadImage(url: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        "Referer": "https://www.google.com/",
      },
    });
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("image")) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 5000) return null; // Skip tiny images (likely broken)

    const ext = contentType.includes("png") ? "png" : "jpg";
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

  const missing = releases.filter((r) => !r.artwork);
  console.log(`${missing.length} releases missing artwork\n`);

  let found = 0;

  for (let i = 0; i < missing.length; i++) {
    const r = missing[i];
    const slug = slugify(r.title);

    // Skip if artwork file already exists (from a previous run)
    if (existsSync(join(ARTWORK_DIR, `${slug}.jpg`)) || existsSync(join(ARTWORK_DIR, `${slug}.png`))) {
      const ext = existsSync(join(ARTWORK_DIR, `${slug}.png`)) ? "png" : "jpg";
      r.artwork = `/artwork/${slug}.${ext}`;
      found++;
      console.log(`[${i + 1}/${missing.length}] ${r.artist} - ${r.title}: already exists`);
      continue;
    }

    console.log(`[${i + 1}/${missing.length}] ${r.artist} - ${r.title}`);

    // Search with artist + title + "album art" or "cover"
    const query = `"${r.artist}" "${r.title}" album cover art`;
    let imageUrl = await searchGoogleImages(query);

    // If nothing found, try Beatport-specific search
    if (!imageUrl) {
      console.log("    Trying Beatport search...");
      imageUrl = await searchBeatport(r.artist, r.title);
    }

    if (imageUrl) {
      const artPath = await downloadImage(imageUrl, slug);
      if (artPath) {
        r.artwork = artPath;
        found++;
        console.log(`    Downloaded: ${artPath}`);
      } else {
        console.log("    Download failed");
      }
    } else {
      console.log("    No image found");
    }

    await sleep(RATE_DELAY_MS);
  }

  writeFileSync(DISCO_PATH, JSON.stringify(releases, null, 2) + "\n");

  console.log(`\n--- Done ---`);
  console.log(`Found artwork: ${found}`);
  console.log(`Still missing: ${missing.length - found}`);
}

main().catch(console.error);
