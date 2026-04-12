import type { Show } from "@/types/content";

interface ShowCardProps {
  show: Show;
  date: string | null;
}

function formatDateParts(dateStr: string | null): {
  day: string;
  month: string;
  year: string;
} {
  if (!dateStr) return { day: "--", month: "---", year: "----" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { day: "--", month: "---", year: "----" };
  return {
    day: String(d.getUTCDate()).padStart(2, "0"),
    month: d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }).toUpperCase(),
    year: String(d.getUTCFullYear()),
  };
}

export default function ShowCard({ show, date }: ShowCardProps) {
  const { venue, city, country, year_approx, event, notes, status } = show;
  const isUpcoming = status === "upcoming";
  const isCancelled = status === "cancelled";

  const { day, month, year } = formatDateParts(date);

  // Fallback display when we have only an approximate year
  const showYear = year_approx ?? year;

  return (
    <article
      className="bg-bg-card rounded-lg border hover:border-border-hover hover:-translate-y-px transition-all duration-150 p-5 flex gap-5"
      style={{
        borderColor: isUpcoming
          ? "rgba(232,93,38,0.3)"
          : "var(--bd)",
      }}
      aria-label={`Show: ${venue}, ${city}, ${country}`}
    >
      {/* Date block */}
      <div
        className="shrink-0 flex flex-col items-center justify-start pt-0.5 w-10"
        aria-hidden="true"
      >
        {date ? (
          <>
            <span
              className="font-display text-4xl font-black leading-none"
              style={{ color: isUpcoming ? "var(--ac)" : "var(--tx-muted)" }}
            >
              {day}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-faint mt-0.5">
              {month}
            </span>
            <span className="font-mono text-[10px] text-text-faint">
              {year}
            </span>
          </>
        ) : (
          <>
            <span
              className="font-display text-2xl font-black leading-none text-text-muted"
            >
              {showYear}
            </span>
          </>
        )}
      </div>

      {/* Divider */}
      <div
        className="w-px self-stretch rounded-full shrink-0"
        style={{
          backgroundColor: isUpcoming
            ? "rgba(232,93,38,0.3)"
            : "var(--bd)",
        }}
        aria-hidden="true"
      />

      {/* Venue info */}
      <div className="flex-1 min-w-0">
        {isCancelled && (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-faint mb-1 block line-through">
            Cancelled
          </span>
        )}
        {isUpcoming && (
          <span
            className="font-mono text-[10px] uppercase tracking-[0.12em] mb-1 block"
            style={{ color: "var(--ac)" }}
          >
            Upcoming
          </span>
        )}

        {event && (
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint mb-0.5 truncate">
            {event}
          </p>
        )}

        <h3 className="font-display text-base font-bold leading-snug text-text truncate">
          {venue}
        </h3>

        <p className="font-body text-[13px] text-text-muted mt-0.5">
          {city}, {country}
        </p>

        {notes && (
          <p className="font-body text-[12px] text-text-faint mt-1 line-clamp-2">
            {notes}
          </p>
        )}

        {isUpcoming && (
          <div className="mt-3">
            <span
              className="font-body text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-sm"
              style={{
                backgroundColor: "rgba(232,93,38,0.12)",
                color: "var(--ac)",
              }}
            >
              Get Tickets
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
