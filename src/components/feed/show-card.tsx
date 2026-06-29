import Link from "next/link";
import Image from "next/image";
import type { Show } from "@/types/content";
import { isUpcomingShow } from "@/lib/show-utils";

/** Standalone show entry in the feed (a show not attached to an authored post). */
export default function ShowCard({ show }: { show: Show }) {
  const { venue, city, country, event, date, year_approx, image, notes, ticketLink, eventLink } = show;
  const isUpcoming = isUpcomingShow(show);

  const dateParts = date
    ? (() => {
        const d = new Date(date);
        return {
          day: String(d.getUTCDate()).padStart(2, "0"),
          month: d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }).toUpperCase(),
          year: String(d.getUTCFullYear()),
        };
      })()
    : null;

  return (
    <article
      className="rounded-lg border overflow-hidden"
      style={{
        background: isUpcoming
          ? "linear-gradient(135deg, rgba(196,168,124,0.08) 0%, var(--bg-card) 60%)"
          : "var(--bg-card)",
        borderColor: isUpcoming ? "rgba(196,168,124,0.25)" : "var(--bd)",
      }}
    >
      {image && (
        <a
          href={image}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden hover:opacity-90 transition-opacity"
        >
          <Image
            src={image}
            alt={`${event ?? venue} flyer`}
            className="w-full max-h-72 object-contain bg-bg"
            width={800} height={320} sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={image.startsWith("http")}
          />
        </a>
      )}

      <div className="px-5 pt-4 pb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span
            className="font-mono text-[12px] font-bold uppercase tracking-[0.15em] inline-block mb-2"
            style={{ color: isUpcoming ? "var(--gd)" : "var(--tx-faint)" }}
          >
            {isUpcoming ? "Upcoming Show" : "Show"}
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-black leading-tight text-text">
            {event ?? venue}
          </h3>
          <p className="font-body text-[14px] text-text-muted mt-0.5">
            {event && event !== venue ? `${venue} — ` : ""}{city}, {country}
          </p>
          {notes && (
            <p className="font-body text-[13px] text-text-faint mt-2">{notes}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {isUpcoming && ticketLink && (
              <a
                href={ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-body text-[13px] font-bold uppercase tracking-[0.1em] px-4 py-2 rounded-sm transition-opacity hover:opacity-85"
                style={{ backgroundColor: "var(--gd)", color: "var(--bg)" }}
              >
                Tickets
              </a>
            )}
            {eventLink && (
              <a
                href={eventLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-body text-[13px] font-bold uppercase tracking-[0.1em] px-4 py-2 rounded-sm border transition-colors hover:bg-[rgba(196,168,124,0.1)]"
                style={{ borderColor: "var(--gd)", color: "var(--gd)" }}
              >
                Event Page
              </a>
            )}
            <Link
              href="/shows"
              className="inline-block font-body text-[13px] font-bold uppercase tracking-[0.08em] px-4 py-2 text-text-muted hover:text-accent transition-colors"
            >
              All shows &rarr;
            </Link>
          </div>
        </div>

        <div className="shrink-0 text-right">
          {dateParts ? (
            <>
              <span
                className="font-display text-4xl sm:text-5xl font-black leading-none block"
                style={{ color: isUpcoming ? "var(--gd)" : "var(--tx-muted)" }}
              >
                {dateParts.day}
              </span>
              <span
                className="font-mono text-[13px] uppercase tracking-[0.08em] block"
                style={{ color: isUpcoming ? "var(--gd)" : "var(--tx-faint)" }}
              >
                {dateParts.month} {dateParts.year}
              </span>
            </>
          ) : (
            year_approx && (
              <span className="font-mono text-[13px] uppercase tracking-[0.08em] block text-text-faint">
                {year_approx}
              </span>
            )
          )}
        </div>
      </div>
    </article>
  );
}
