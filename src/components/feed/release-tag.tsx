import Link from "next/link";
import type { Release } from "@/types/content";
import { releaseSlug } from "@/lib/release-utils";

/** Subtle inline reference to a release — small thumbnail + title, linked to release page. */
export default function ReleaseTag({ release }: { release: Release }) {
  const slug = releaseSlug(release);

  return (
    <Link
      href={`/discography/${slug}`}
      className="flex items-center gap-3 mb-3 group"
    >
      {/* Small artwork thumbnail */}
      <div className="w-10 h-10 rounded shrink-0 overflow-hidden">
        {release.artwork ? (
          <img
            src={release.artwork}
            alt={`${release.title} by ${release.artist}`}
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
        <p className="font-display text-sm font-bold leading-tight text-text-muted group-hover:text-accent transition-colors truncate">
          {release.artist} &ndash; {release.title}
        </p>
        <p className="font-mono text-[12px] text-text-faint">
          {release.type} &middot; {release.label}
        </p>
      </div>
    </Link>
  );
}
