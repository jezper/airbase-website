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

export async function getPastShows(): Promise<Show[]> {
  const shows = await getAllShows();
  return shows
    .filter((s) => s.status === "past")
    .sort((a, b) => {
      if (a.date && b.date)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (a.date && !b.date) return -1;
      if (!a.date && b.date) return 1;
      return (b.year_approx ?? "").localeCompare(a.year_approx ?? "");
    });
}
