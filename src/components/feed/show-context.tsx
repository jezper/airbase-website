import type { Show } from "@/types/content";

/** Displayed above a post that references a show */
export default function ShowContext({ show }: { show: Show }) {
  const { venue, city, country, event, date, status, image } = show;
  const isUpcoming = status === "upcoming";

  const dateParts = date ? (() => {
    const d = new Date(date);
    return {
      day: String(d.getUTCDate()).padStart(2, "0"),
      month: d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }).toUpperCase(),
      year: String(d.getUTCFullYear()),
    };
  })() : null;

  return (
    <div
      className="rounded-t-lg border border-b-0 overflow-hidden"
      style={{
        background: isUpcoming
          ? "linear-gradient(135deg, rgba(196,168,124,0.08) 0%, var(--bg-card) 60%)"
          : "var(--bg-card)",
        borderColor: isUpcoming ? "rgba(196,168,124,0.25)" : "var(--bd)",
      }}
    >
      {image && (
        <div className="w-full aspect-[2.5/1] overflow-hidden">
          <img src={image} alt={`${event ?? venue} flyer`} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-4">
        <div>
          {isUpcoming && (
            <span
              className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] inline-block mb-2 px-2 py-0.5 rounded-sm"
              style={{ backgroundColor: "rgba(196,168,124,0.15)", color: "var(--gd)" }}
            >
              Upcoming
            </span>
          )}
          <h3 className="font-display text-xl sm:text-2xl font-black leading-tight text-text">
            {event ?? venue}
          </h3>
          <p className="font-body text-[14px] text-text-muted mt-0.5">
            {event && event !== venue ? `${venue} — ` : ""}{city}, {country}
          </p>
          {isUpcoming && (
            <a
              href="#"
              className="inline-block mt-3 font-body text-[12px] font-bold uppercase tracking-[0.1em] px-5 py-2 rounded-sm transition-colors"
              style={{ backgroundColor: "var(--gd)", color: "var(--bg)" }}
            >
              Tickets
            </a>
          )}
        </div>
        {dateParts && (
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
        )}
      </div>
    </div>
  );
}
