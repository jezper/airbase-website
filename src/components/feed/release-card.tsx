import type { Release } from "@/types/content";

function ArtworkPlaceholder({ title }: { title: string }) {
  const initial = (title[0] ?? "A").toUpperCase();
  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-card) 60%, var(--bg) 100%)",
      }}
      aria-hidden="true"
    >
      <span
        className="font-display font-black text-[48px] leading-none select-none opacity-[0.08]"
        style={{ color: "var(--ac)" }}
      >
        {initial}
      </span>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--tx) 0px, var(--tx) 1px, transparent 1px, transparent 16px), repeating-linear-gradient(90deg, var(--tx) 0px, var(--tx) 1px, transparent 1px, transparent 16px)",
        }}
      />
    </div>
  );
}

export default function ReleaseCard({ release }: { release: Release }) {
  const { artist, title, type, label, year, artwork, links } = release;

  const streamLinks: { label: string; href: string }[] = [
    links.spotify && { label: "Spotify", href: links.spotify },
    links.beatport && { label: "Beatport", href: links.beatport },
    links.youtube && { label: "YouTube", href: links.youtube },
    links.apple && { label: "Apple", href: links.apple },
    links.soundcloud && { label: "SoundCloud", href: links.soundcloud },
    links.smartlink && { label: "Listen", href: links.smartlink },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <article
      className="bg-bg-card rounded-lg border border-border hover:border-border-hover hover:-translate-y-1 transition-all duration-150 overflow-hidden group flex"
      aria-label={`${type}: ${title} by ${artist}`}
    >
      {/* Artwork — fixed square, left side */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 relative">
        {artwork ? (
          <img
            src={artwork}
            alt={`${title} by ${artist}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <ArtworkPlaceholder title={title} />
        )}
        {/* Type badge */}
        <span
          className="absolute top-2 left-2 font-mono text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm"
          style={{
            backgroundColor: "rgba(232,93,38,0.18)",
            color: "var(--ac)",
            backdropFilter: "blur(4px)",
          }}
        >
          {type}
        </span>
      </div>

      {/* Info — right side */}
      <div className="flex-1 min-w-0 p-4 flex flex-col justify-center">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.1em] text-text-faint mb-0.5 truncate">
          {artist}
        </p>
        <h3 className="font-display text-lg font-bold leading-tight text-text group-hover:text-accent transition-colors duration-150 truncate">
          {title}
        </h3>
        <p className="font-mono text-[11px] text-text-faint mt-1">
          {label} &mdash; {year}
        </p>

        {streamLinks.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {streamLinks.map((sl) => (
              <a
                key={sl.label}
                href={sl.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[11px] font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover transition-colors duration-150"
              >
                {sl.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
