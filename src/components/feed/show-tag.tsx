import type { Show } from "@/types/content";

/** Subtle inline reference to a show. Used for non-featured posts. */
export default function ShowTag({ show }: { show: Show }) {
  const isUpcoming = show.status === "upcoming";

  return (
    <div className="flex items-center gap-3 mb-3">
      <div
        className="w-10 h-10 rounded shrink-0 flex items-center justify-center"
        style={{
          background: isUpcoming ? "rgba(196,168,124,0.1)" : "var(--bg-elevated)",
        }}
      >
        <span
          className="font-display font-black text-sm leading-none"
          style={{ color: isUpcoming ? "var(--gd)" : "var(--tx-faint)" }}
        >
          {show.date ? new Date(show.date).getUTCDate().toString().padStart(2, "0") : "?"}
        </span>
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint">
          {isUpcoming ? "Upcoming" : "Show"}
        </p>
        <p className="font-display text-sm font-bold leading-tight text-text truncate">
          {show.event ?? show.venue}
        </p>
      </div>
    </div>
  );
}
