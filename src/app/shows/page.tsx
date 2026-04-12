import type { Metadata } from "next";
import { getUpcomingShows, getPastShows } from "@/lib/shows";

export const metadata: Metadata = {
  title: "Shows — Airbase",
  description: "Upcoming and past performances by Airbase.",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return {
    day: String(d.getUTCDate()).padStart(2, "0"),
    month: d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }).toUpperCase(),
    year: String(d.getUTCFullYear()),
    full: d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
  };
}

export default async function ShowsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingShows(),
    getPastShows(),
  ]);

  return (
    <div className="px-6 md:px-12 py-12">
      <h1 className="font-display text-5xl md:text-6xl font-black leading-tight mb-2">
        Shows
      </h1>
      <p className="font-body text-[15px] text-text-muted mb-12 max-w-prose">
        {upcoming.length > 0
          ? `${upcoming.length} upcoming. ${past.length} in the archive.`
          : `${past.length} shows in the archive.`}
      </p>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="mb-16" aria-label="Upcoming shows">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-accent mb-6">
            Upcoming
          </h2>
          <div className="flex flex-col gap-4 max-w-prose">
            {upcoming.map((show, i) => {
              const date = formatDate(show.date);
              return (
                <article
                  key={`upcoming-${i}`}
                  className="rounded-lg overflow-hidden p-6 flex gap-6"
                  style={{
                    background: "linear-gradient(135deg, rgba(196,168,124,0.08) 0%, var(--bg-card) 60%)",
                    border: "1px solid rgba(196,168,124,0.25)",
                  }}
                >
                  {/* Date */}
                  {date && (
                    <div className="shrink-0 text-center">
                      <span
                        className="font-display text-5xl font-black leading-none block"
                        style={{ color: "var(--gd)", fontVariationSettings: "'opsz' 144" }}
                      >
                        {date.day}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.08em] block mt-1" style={{ color: "var(--gd)" }}>
                        {date.month}
                      </span>
                      <span className="font-mono text-[11px] text-text-faint block">
                        {date.year}
                      </span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {show.event && show.event !== show.venue && (
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint mb-1">
                        {show.event}
                      </p>
                    )}
                    <h3 className="font-display text-2xl font-black leading-tight text-text mb-1">
                      {show.venue}
                    </h3>
                    <p className="font-body text-[15px] text-text-muted">
                      {show.city}, {show.country}
                    </p>
                    {show.notes && (
                      <p className="font-body text-[13px] text-text-faint mt-2">
                        {show.notes}
                      </p>
                    )}
                    <a
                      href="#"
                      className="inline-block mt-4 font-body text-[12px] font-bold uppercase tracking-[0.1em] px-5 py-2 rounded-sm transition-colors"
                      style={{ backgroundColor: "var(--gd)", color: "var(--bg)" }}
                    >
                      Tickets
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Archive */}
      {past.length > 0 && (
        <section aria-label="Past shows">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-text-faint mb-6">
            Archive
          </h2>
          <div className="max-w-prose">
            {past.map((show, i) => {
              const date = formatDate(show.date);
              return (
                <article
                  key={`past-${i}`}
                  className="flex items-baseline gap-4 py-3 border-b border-border-section"
                >
                  <span className="font-mono text-[12px] text-text-faint shrink-0 w-16">
                    {date ? `${date.day} ${date.month}` : show.year_approx}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-display text-base font-bold text-text">
                      {show.venue}
                    </span>
                    <span className="font-body text-[13px] text-text-muted ml-2">
                      {show.city}, {show.country}
                    </span>
                  </div>
                  {show.event && show.event !== show.venue && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint hidden sm:block">
                      {show.event}
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
