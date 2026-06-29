import type { Show } from "@/types/content";
import { readShows } from "./content-writer";
import { showSlug, getShowStatus, showSortKey } from "./show-utils";

// Re-export pure utilities
export { showSlug, getShowStatus, isUpcomingShow, showSortKey } from "./show-utils";

export async function getShowBySlug(slug: string): Promise<Show | undefined> {
  const shows = await getAllShows();
  return shows.find((s) => showSlug(s) === slug);
}

export async function getAllShows(): Promise<Show[]> {
  return readShows();
}

export async function getUpcomingShows(): Promise<Show[]> {
  const shows = await getAllShows();
  return shows
    .filter((s) => getShowStatus(s) === "upcoming")
    .sort((a, b) => showSortKey(a).localeCompare(showSortKey(b))); // soonest first
}

export async function getPastShows(): Promise<Show[]> {
  const shows = await getAllShows();
  return shows
    .filter((s) => getShowStatus(s) === "past")
    .sort((a, b) => showSortKey(b).localeCompare(showSortKey(a)));
}
