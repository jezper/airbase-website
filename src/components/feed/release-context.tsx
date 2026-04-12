import type { Release } from "@/types/content";

function ArtworkPlaceholder({ title }: { title: string }) {
  const initial = (title[0] ?? "A").toUpperCase();
  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-card) 50%, var(--bg) 100%)",
      }}
      aria-hidden="true"
    >
      <span
        className="font-display font-black text-[80px] leading-none select-none opacity-[0.06]"
        style={{ color: "var(--ac)" }}
      >
        {initial}
      </span>
    </div>
  );
}

/** Displayed above a post that references a release (featured) */
export default function ReleaseContext({ release }: { release: Release }) {
  const { artist, title, type, label, year, artwork, links } = release;

  const streamLinks: { label: string; href: string }[] = [
    links.spotify && { label: "Spotify", href: links.spotify },
    links.beatport && { label: "Beatport", href: links.beatport },
    links.apple && { label: "Apple Music", href: links.apple },
    links.youtube && { label: "YouTube", href: links.youtube },
    links.tidal && { label: "Tidal", href: links.tidal },
    links.deezer && { label: "Deezer", href: links.deezer },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="bg-bg-card rounded-t-lg border border-b-0 border-border overflow-hidden">
      {/* Square artwork — no text overlay, respects the artwork as its own design */}
      <div className="w-full aspect-square overflow-hidden">
        {artwork ? (
          <img src={artwork} alt={`${title} by ${artist}`} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <ArtworkPlaceholder title={title} />
        )}
      </div>

      {/* Metadata below artwork — badge here, not on the image */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="font-mono text-[12px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm"
            style={{ backgroundColor: "rgba(232,93,38,0.15)", color: "var(--ac)" }}
          >
            {type}
          </span>
          <span className="font-mono text-[13px] text-text-muted">
            {label} &mdash; {year}
          </span>
        </div>
        <p className="font-body text-[13px] font-bold uppercase tracking-[0.12em] text-text-muted mb-0.5">
          {artist}
        </p>
        <h3 className="font-display text-2xl sm:text-3xl font-black leading-tight text-text mb-2">
          {title}
        </h3>
        {streamLinks.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {streamLinks.map((sl) => (
              <a
                key={sl.label}
                href={sl.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm font-bold uppercase tracking-[0.06em] text-accent hover:text-accent-hover transition-colors py-1 inline-block"
              >
                {sl.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
