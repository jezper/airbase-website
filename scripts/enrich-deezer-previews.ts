/**
 * Enrich discography.json with Deezer track IDs for 30-second previews.
 * Preview URLs are resolved at playback time via /api/preview?id={trackId}
 *
 * Usage:
 *   npx tsx scripts/enrich-deezer-previews.ts
 *   npx tsx scripts/enrich-deezer-previews.ts --dry-run
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DISCO_PATH = join(process.cwd(), "content/releases/discography.json");
const DELAY_MS = 300;
const DRY_RUN = process.argv.includes("--dry-run");

interface Release {
  artist: string;
  title: string;
  deezerTrackId?: number;
  previewUrl?: string;
  [key: string]: unknown;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\(\[\{].*?[\)\]\}]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface DeezerTrack {
  id: number;
  title: string;
  artist: { name: string };
  preview: string;
}

function findBestMatch(tracks: DeezerTrack[], artist: string, title: string): DeezerTrack | null {
  const na = normalize(artist);
  const nt = normalize(title);

  for (const t of tracks) {
    const tArtist = normalize(t.artist.name);
    const tTitle = normalize(t.title);
    const artistMatch = tArtist.includes(na) || na.includes(tArtist);
    const titleMatch = tTitle === nt || tTitle.includes(nt) || nt.includes(tTitle);
    if (artistMatch && titleMatch && t.preview) {
      return t;
    }
  }
  return null;
}

async function searchDeezerTrack(artist: string, title: string): Promise<number | null> {
  const searchArtist = artist.split(/\s+feat\.?\s+/i)[0].trim();
  const searchTitle = title.replace(/\s*[\(\[].*?[\)\]]\s*/g, "").trim();

  const q = `artist:"${searchArtist}" track:"${searchTitle}"`;
  const url = `https://api.deezer.com/search/track?q=${encodeURIComponent(q)}&limit=5`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.data?.length) {
      const match = findBestMatch(data.data, searchArtist, title);
      if (match) return match.id;
    }

    // Fallback: simpler search
    const q2 = `${searchArtist} ${searchTitle}`;
    const res2 = await fetch(`https://api.deezer.com/search/track?q=${encodeURIComponent(q2)}&limit=5`);
    if (!res2.ok) return null;
    const data2 = await res2.json();
    if (!data2.data?.length) return null;
    const match = findBestMatch(data2.data, searchArtist, title);
    return match?.id ?? null;
  } catch {
    return null;
  }
}

async function main() {
  console.log(DRY_RUN ? "=== DRY RUN ===" : "=== Deezer Track ID Enrichment ===");
  console.log();

  const raw = readFileSync(DISCO_PATH, "utf-8");
  const releases: Release[] = JSON.parse(raw);

  let added = 0;
  let skipped = 0;
  let notFound = 0;
  let migrated = 0;

  for (let i = 0; i < releases.length; i++) {
    const r = releases[i];

    // Clean up old previewUrl field
    if (r.previewUrl) {
      delete r.previewUrl;
      migrated++;
    }

    if (r.deezerTrackId) {
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${releases.length}] ${r.artist} - ${r.title}`);

    const trackId = await searchDeezerTrack(r.artist as string, r.title as string);
    await sleep(DELAY_MS);

    if (trackId) {
      r.deezerTrackId = trackId;
      added++;
      console.log(`    Found: ${trackId}`);
    } else {
      console.log(`    Not found`);
      notFound++;
    }
  }

  if (!DRY_RUN) {
    writeFileSync(DISCO_PATH, JSON.stringify(releases, null, 2) + "\n");
  }

  console.log("\n--- Done ---");
  console.log(`Track IDs added: ${added}`);
  console.log(`Already had ID: ${skipped}`);
  console.log(`Old previewUrl cleaned: ${migrated}`);
  console.log(`Not found: ${notFound}`);
  if (DRY_RUN) console.log("\n(Dry run - no files modified)");
}

main().catch(console.error);
