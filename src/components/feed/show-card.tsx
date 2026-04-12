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
  const showYear = year_approx ?? year;

  const image = show.image ?? null;

  return (
    <article
      className="bg-bg-card rounded-lg border hover:border-border-hover transition-all duration-150 overflow-hidden group"
      style={{
        borderColor: isUpcoming ? "rgba(232,93,38,0.3)" : "var(--bd)",
      }}
      aria-label={`Show: ${venue}, ${city}, ${country}`}
    >
      {/* Banner/flyer image when available */}
      {image && (
        <div className="w-full aspect-[2.5/1] relative overflow-hidden">
          <img
            src={image}
            alt={`${event ?? venue} flyer`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {isUpcoming && (
            <span
              className="absolute top-3 left-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-sm"
              style={{
                backgroundColor: "rgba(232,93,38,0.2)",
                color: "var(--ac)",
                backdropFilter: "blur(6px)",
              }}
            >
              Upcoming
            </span>
          )}
        </div>
      )}

      {/* Content area */}
      <div className="p-5 flex gap-5">
        {/* Date block */}
        <div className="shrink-0 flex flex-col items-center justify-start pt-0.5 w-12" aria-hidden="true">
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
              <span className="font-mono text-[10px] text-text-faint">{year}</span>
            </>
          ) : (
            <span className="font-display text-2xl font-black leading-none text-text-muted">
              {showYear}
            </span>
          )}
        </div>

        {/* Divider */}
        <div
          className="w-px self-stretch rounded-full shrink-0"
          style={{ backgroundColor: isUpcoming ? "rgba(232,93,38,0.3)" : "var(--bd)" }}
          aria-hidden="true"
        />

        {/* Venue info */}
        <div className="flex-1 min-w-0">
          {isCancelled && (
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-faint mb-1 block line-through">
              Cancelled
            </span>
          )}
          {isUpcoming && !image && (
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] mb-1 block" style={{ color: "var(--ac)" }}>
              Upcoming
            </span>
          )}

          {event && (
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint mb-0.5 truncate">
              {event}
            </p>
          )}

          <h3 className="font-display text-lg font-bold leading-snug text-text group-hover:text-accent transition-colors truncate">
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
                className="font-body text-[12px] font-bold uppercase tracking-[0.08em] px-4 py-1.5 rounded-sm inline-block"
                style={{ backgroundColor: "var(--ac)", color: "var(--bg)" }}
              >
                Tickets
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
