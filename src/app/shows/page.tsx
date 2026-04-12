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
  };
}

export default async function ShowsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingShows(),
    getPastShows(),
  ]);

  return (
    <div className="px-6 md:px-12 py-12 max-w-content mx-auto">
      <div className="max-w-prose mx-auto md:mx-0 md:max-w-none">
        <h1 className="font-display text-5xl md:text-6xl font-black leading-tight mb-2">
          Shows
        </h1>
        <p className="font-body text-[15px] text-text-muted mb-16 max-w-prose">
          {upcoming.length > 0
            ? `${upcoming.length} upcoming. Plus highlights from two decades of shows.`
            : "Highlights from two decades of shows."}
        </p>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="mb-20" aria-label="Upcoming shows">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-accent mb-8">
              Upcoming
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((show, i) => {
                const date = formatDate(show.date);
                return (
                  <article
                    key={`upcoming-${i}`}
                    className="rounded-lg overflow-hidden p-6"
                    style={{
                      background: "linear-gradient(135deg, rgba(196,168,124,0.08) 0%, var(--bg-card) 60%)",
                      border: "1px solid rgba(196,168,124,0.25)",
                    }}
                  >
                    {/* Flyer — handles any aspect ratio, clickable to open full size */}
                    {show.image && (
                      <a
                        href={show.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mb-5 -mx-6 -mt-6 overflow-hidden rounded-t-lg hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={show.image}
                          alt={`${show.event ?? show.venue} flyer`}
                          className="w-full max-h-80 object-contain bg-bg"
                          loading="lazy"
                        />
                      </a>
                    )}

                    {/* Date row */}
                    {date && (
                      <div className="flex items-baseline gap-2 mb-4">
                        <span
                          className="font-display text-4xl font-black leading-none"
                          style={{ color: "var(--gd)", fontVariationSettings: "'opsz' 144" }}
                        >
                          {date.day}
                        </span>
                        <span className="font-mono text-[12px] uppercase tracking-[0.08em]" style={{ color: "var(--gd)" }}>
                          {date.month} {date.year}
                        </span>
                      </div>
                    )}

                    <h3 className="font-display text-2xl font-black leading-tight text-text mb-1">
                      {show.event ?? show.venue}
                    </h3>
                    <p className="font-body text-[14px] text-text-muted mb-1">
                      {show.event && show.event !== show.venue ? `${show.venue} — ` : ""}
                      {show.city}, {show.country}
                    </p>
                    {show.notes && (
                      <p className="font-body text-[13px] text-text-faint mt-2">
                        {show.notes}
                      </p>
                    )}
                    <a
                      href="#"
                      className="inline-block mt-5 font-body text-[12px] font-bold uppercase tracking-[0.1em] px-5 py-2.5 rounded-sm transition-colors"
                      style={{ backgroundColor: "var(--gd)", color: "var(--bg)" }}
                    >
                      Tickets
                    </a>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Archive */}
        {past.length > 0 && (
          <section aria-label="Past shows">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-text-faint mb-8">
              Archive
            </h2>
            <div className="flex flex-col max-w-prose">
              {past.map((show, i) => {
                const date = formatDate(show.date);
                return (
                  <article
                    key={`past-${i}`}
                    className="py-5 border-b border-border-section"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {show.image && (
                        <a
                          href={show.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={show.image}
                            alt={`${show.event ?? show.venue} flyer`}
                            className="w-20 h-20 rounded object-cover"
                            loading="lazy"
                          />
                        </a>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-bold text-text leading-snug">
                          {show.event ?? show.venue}
                        </h3>
                        <p className="font-body text-[13px] text-text-muted mt-1">
                          {show.event && show.event !== show.venue ? `${show.venue} — ` : ""}
                          {show.city}, {show.country}
                        </p>
                        {show.notes && (
                          <p className="font-body text-[12px] text-text-faint mt-1">
                            {show.notes}
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-text-faint shrink-0 pt-1">
                        {date ? `${date.day} ${date.month} ${date.year}` : show.year_approx}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
