import type { Release } from "@/types/content";

// Jezper's known production aliases — authoritative list
export const KNOWN_ALIASES = [
  "Airbase",
  "First & Andre",
  "Inner State",
  "J.",
  "J.L.N.D.",
  "Jezper",
  "Loken",
  "Mono",
  "Narthex",
  "One Man Army",
  "Ozone",
  "Parc",
  "Rah",
  "The Scarab",
];

/** Check if a release belongs to a given alias (as artist or remixer) */
export function releaseMatchesAlias(r: Release, alias: string): boolean {
  const lower = alias.toLowerCase();
  if (r.artist.toLowerCase().includes(lower)) return true;
  if (r.type === "Remix" && r.title.toLowerCase().includes(lower)) return true;
  return false;
}

export function releaseSlug(release: Release): string {
  return release.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
