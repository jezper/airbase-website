import { promises as fs } from "fs";
import path from "path";
import type { Show } from "@/types/content";

const DATA_PATH = path.join(process.cwd(), "content/shows/shows.json");

export function showSlug(show: Show): string {
  const name = (show.event ?? show.venue).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const year = show.date ? new Date(show.date).getFullYear() : show.year_approx ?? "unknown";
  return `${name}-${year}`;
}

export async function getShowBySlug(slug: string): Promise<Show | undefined> {
  const shows = await getAllShows();
  return shows.find((s) => showSlug(s) === slug);
}

let cachedShows: Show[] | null = null;

export async function getAllShows(): Promise<Show[]> {
  if (cachedShows) return cachedShows;
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const data: Show[] = JSON.parse(raw);
  cachedShows = data;
  return data;
}

export async function getUpcomingShows(): Promise<Show[]> {
  const shows = await getAllShows();
  return shows.filter((s) => s.status === "upcoming");
}

function showSortKey(s: Show): string {
  // Returns a sortable string: exact date or year_approx padded for consistency
  if (s.date) return s.date;
  if (s.year_approx) {
    // Pad "2008-08" to "2008-08-15" (mid-month), "2010" to "2010-06-15" (mid-year)
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
