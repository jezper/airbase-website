import type { Show } from "@/types/content";

interface ShowCardProps {
  show: Show;
  date: string | null;
}

function formatDateParts(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return {
    day: String(d.getUTCDate()).padStart(2, "0"),
    month: d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }).toUpperCase(),
    year: String(d.getUTCFullYear()),
    weekday: d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" }).toUpperCase(),
  };
}

export default function ShowCard({ show, date }: ShowCardProps) {
  const { venue, city, country, year_approx, event, notes, status, image } = show;
  const isUpcoming = status === "upcoming";
  const dateParts = formatDateParts(date);

  return (
    <article
      className="rounded-lg overflow-hidden transition-all duration-150 group"
      style={{
        background: isUpcoming
          ? "linear-gradient(135deg, rgba(196,168,124,0.08) 0%, var(--bg-card) 60%)"
          : "var(--bg-card)",
        border: isUpcoming
          ? "1px solid rgba(196,168,124,0.25)"
          : "1px solid var(--bd)",
      }}
      aria-label={`Show: ${event ?? venue}, ${city}, ${country}`}
    >
      {/* Banner/flyer when available */}
      {image && (
        <div className="w-full aspect-[2.5/1] relative overflow-hidden">
          <img
            src={image}
            alt={`${event ?? venue} flyer`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-5">
        {/* Top row: status + date */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            {isUpcoming && (
              <span
                className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] inline-block mb-2 px-2 py-0.5 rounded-sm"
                style={{
                  backgroundColor: "rgba(196,168,124,0.15)",
                  color: "var(--gd)",
                }}
              >
                Upcoming
              </span>
            )}
            {event && event !== venue && (
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint">
                {event}
              </p>
            )}
            <h3 className="font-display text-xl sm:text-2xl font-black leading-tight text-text">
              {venue}
            </h3>
            <p className="font-body text-[14px] text-text-muted mt-0.5">
              {city}, {country}
            </p>
          </div>

          {/* Date block — right side, gold accent for shows */}
          {dateParts ? (
            <div className="shrink-0 text-right">
              <span
                className="font-display text-4xl sm:text-5xl font-black leading-none block"
                style={{ color: isUpcoming ? "var(--gd)" : "var(--tx-muted)" }}
              >
                {dateParts.day}
              </span>
              <span
                className="font-mono text-[11px] uppercase tracking-[0.08em] block"
                style={{ color: isUpcoming ? "var(--gd)" : "var(--tx-faint)" }}
              >
                {dateParts.month} {dateParts.year}
              </span>
            </div>
          ) : (
            <span className="font-display text-2xl font-black text-text-faint shrink-0">
              {year_approx}
            </span>
          )}
        </div>

        {notes && (
          <p className="font-body text-[13px] text-text-faint line-clamp-2 mb-3">
            {notes}
          </p>
        )}

        {isUpcoming && (
          <a
            href="#"
            className="inline-block font-body text-[12px] font-bold uppercase tracking-[0.1em] px-5 py-2 rounded-sm transition-colors"
            style={{ backgroundColor: "var(--gd)", color: "var(--bg)" }}
          >
            Tickets
          </a>
        )}
      </div>
    </article>
  );
}
