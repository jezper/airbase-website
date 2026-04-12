import type { Release } from "@/types/content";

/** Subtle inline reference to a release — small thumbnail + title. Used for non-featured posts. */
export default function ReleaseTag({ release }: { release: Release }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      {/* Small artwork thumbnail */}
      <div className="w-10 h-10 rounded shrink-0 overflow-hidden">
        {release.artwork ? (
          <img
            src={release.artwork}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "var(--bg-elevated)" }}
          >
            <span className="font-display font-black text-xs opacity-20" style={{ color: "var(--ac)" }}>
              {(release.title[0] ?? "A").toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint">
          About
        </p>
        <p className="font-display text-sm font-bold leading-tight text-text truncate">
          {release.title}
        </p>
      </div>
    </div>
  );
}
