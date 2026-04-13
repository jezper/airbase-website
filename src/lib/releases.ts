import type { Release } from "@/types/content";
import { readReleases } from "./content-writer";
import { releaseSlug, KNOWN_ALIASES } from "./release-utils";

// Re-export utilities
export { releaseSlug, releaseMatchesAlias, KNOWN_ALIASES } from "./release-utils";

export async function getAllReleases(): Promise<Release[]> {
  return readReleases();
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

export function getOwnAliases(): string[] {
  return KNOWN_ALIASES;
}

export async function getRemixedArtists(): Promise<string[]> {
  const releases = await getAllReleases();
  const artists = new Set<string>();
  for (const r of releases) {
    if (r.type === "Remix") {
      const primary = r.artist.split(/\s+feat\.?\s+/i)[0].trim();
      artists.add(primary);
    }
  }
  return Array.from(artists).sort();
}
