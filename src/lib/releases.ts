import { promises as fs } from "fs";
import path from "path";
import type { Release } from "@/types/content";

const DATA_PATH = path.join(process.cwd(), "content/releases/discography.json");

export function releaseSlug(release: Release): string {
  return release.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

let cachedReleases: Release[] | null = null;

export async function getAllReleases(): Promise<Release[]> {
  if (cachedReleases) return cachedReleases;
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const data: Release[] = JSON.parse(raw);
  data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  cachedReleases = data;
  return data;
}

export async function getReleasesByYear(): Promise<Map<number, Release[]>> {
  const releases = await getAllReleases();
  const byYear = new Map<number, Release[]>();
  for (const release of releases) {
    const existing = byYear.get(release.year) ?? [];
    existing.push(release);
    byYear.set(release.year, existing);
  }
  return byYear;
}

export async function getReleasesByArtist(artist: string): Promise<Release[]> {
  const releases = await getAllReleases();
  return releases.filter(
    (r) => r.artist.toLowerCase().includes(artist.toLowerCase())
  );
}

export async function getReleaseBySlug(slug: string): Promise<Release | undefined> {
  const releases = await getAllReleases();
  return releases.find((r) => releaseSlug(r) === slug);
}

export async function getUniqueArtists(): Promise<string[]> {
  const releases = await getAllReleases();
  const artists = new Set<string>();
  for (const release of releases) {
    const primary = release.artist.split(/\s+feat\.?\s+|\s+&\s+/i)[0].trim();
    artists.add(primary);
  }
  return Array.from(artists).sort();
}

export async function getOwnAliases(): Promise<string[]> {
  const releases = await getAllReleases();
  const aliases = new Set<string>();
  for (const release of releases) {
    if (release.type !== "Remix") {
      const primary = release.artist.split(/\s+feat\.?\s+|\s+&\s+|\s+pres\.\s+/i)[0].trim();
      aliases.add(primary);
    }
  }
  return Array.from(aliases).sort();
}
