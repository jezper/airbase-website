import type { Show, ShowStatus } from "@/types/content";

/**
 * Derive a show's status. "cancelled" is the only manually-set state (stored in
 * the `status` field). Everything else is computed from the date: a future date
 * is upcoming, anything else (including date-less archive entries) is past.
 */
export function getShowStatus(show: Show, now?: Date): ShowStatus {
  if (show.status === "cancelled") return "cancelled";
  if (show.date) {
    const today = (now ?? new Date()).toISOString().slice(0, 10);
    if (show.date > today) return "upcoming";
  }
  return "past";
}

export function isUpcomingShow(show: Show, now?: Date): boolean {
  return getShowStatus(show, now) === "upcoming";
}

/** Sortable key for a show: exact date if present, otherwise derived from year_approx. */
export function showSortKey(s: Show): string {
  if (s.date) return s.date;
  if (s.year_approx) {
    const parts = s.year_approx.split("-");
    if (parts.length === 2) return `${parts[0]}-${parts[1]}-15`;
    if (parts.length === 1) return `${parts[0]}-06-15`;
  }
  return "1900-01-01";
}

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
