import type { Show } from "@/types/content";
import { readShows } from "./content-writer";
import { showSlug } from "./show-utils";

// Re-export pure utility
export { showSlug } from "./show-utils";

export async function getShowBySlug(slug: string): Promise<Show | undefined> {
  const shows = await getAllShows();
  return shows.find((s) => showSlug(s) === slug);
}

export async function getAllShows(): Promise<Show[]> {
  return readShows();
}

export async function getUpcomingShows(): Promise<Show[]> {
  const shows = await getAllShows();
  return shows.filter((s) => s.status === "upcoming");
}

function showSortKey(s: Show): string {
  if (s.date) return s.date;
  if (s.year_approx) {
    const parts = s.year_approx.split("-");
    if (parts.length === 2) return `${parts[0]}-${parts[1]}-15`;
    if (parts.length === 1) return `${parts[0]}-06-15`;
  }
  return "1900-01-01";
}

export async function getPastShows(): Promise<Show[]> {
  const shows = await getAllShows();
  return shows
    .filter((s) => s.status === "past")
    .sort((a, b) => showSortKey(b).localeCompare(showSortKey(a)));
}
