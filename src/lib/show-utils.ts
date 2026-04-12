import type { Show } from "@/types/content";

export function showSlug(show: Show): string {
  const name = (show.event ?? show.venue)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const year = show.date
    ? new Date(show.date).getFullYear()
    : show.year_approx ?? "unknown";
  return `${name}-${year}`;
}
