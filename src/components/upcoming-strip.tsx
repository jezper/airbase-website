import Link from "next/link";
import type { Show } from "@/types/content";

function formatShort(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d
    .toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })
    .toUpperCase();
}

/**
 * Thin strip above the hero announcing the next upcoming show. Renders nothing
 * when there are no upcoming shows. Independent of the starred hero item.
 */
export default function UpcomingStrip({ shows }: { shows: Show[] }) {
  if (shows.length === 0) return null;

  const next = shows[0];
  const more = shows.length - 1;
  const date = formatShort(next.date);
  const location = `${next.city}, ${next.country}`;

  return (
    <Link
      href="/shows"
      aria-label={`Next show: ${next.event ?? next.venue}, ${location}. View all shows.`}
      className="group block border-b transition-colors"
      style={{
        background: "linear-gradient(90deg, rgba(196,168,124,0.12) 0%, rgba(196,168,124,0.04) 100%)",
        borderColor: "rgba(196,168,124,0.25)",
      }}
    >
      <div className="max-w-content mx-auto px-6 md:px-12 py-2.5 flex items-center gap-3 text-[13px]">
        <span
          className="font-mono font-bold uppercase tracking-[0.18em] shrink-0"
          style={{ color: "var(--gd)" }}
        >
          Next Show
        </span>
        <span className="text-border-strong shrink-0" aria-hidden="true">/</span>
        {date && (
          <span className="font-mono uppercase tracking-[0.08em] shrink-0" style={{ color: "var(--gd)" }}>
            {date}
          </span>
        )}
        <span className="font-body font-semibold text-text truncate">
          {next.event ?? next.venue}
        </span>
        <span className="font-body text-text-muted truncate hidden sm:inline">
          {location}
        </span>
        <span
          className="font-body font-bold uppercase tracking-[0.08em] ml-auto shrink-0 transition-transform group-hover:translate-x-0.5"
          style={{ color: "var(--gd)" }}
        >
          {more > 0 ? `+${more} more →` : "→"}
        </span>
      </div>
    </Link>
  );
}
