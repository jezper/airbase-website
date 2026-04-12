import type { Release } from "@/types/content";

function ArtworkPlaceholder({ title, size }: { title: string; size: "lg" | "sm" }) {
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
        className={`font-display font-black leading-none select-none opacity-[0.08] ${
          size === "lg" ? "text-[120px]" : "text-[48px]"
        }`}
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

function StreamLinks({ links }: { links: Release["links"] }) {
  const streamLinks: { label: string; href: string }[] = [
    links.spotify && { label: "Spotify", href: links.spotify },
    links.beatport && { label: "Beatport", href: links.beatport },
    links.youtube && { label: "YouTube", href: links.youtube },
    links.apple && { label: "Apple", href: links.apple },
    links.soundcloud && { label: "SoundCloud", href: links.soundcloud },
    links.smartlink && { label: "Listen", href: links.smartlink },
  ].filter(Boolean) as { label: string; href: string }[];

  if (streamLinks.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
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
  );
}

/** Featured release — big, full width, artwork prominent */
export function FeaturedReleaseCard({ release }: { release: Release }) {
  const { artist, title, type, label, year, artwork, links } = release;

  return (
    <article
      className="bg-bg-card rounded-lg border border-border hover:border-border-hover transition-all duration-150 overflow-hidden group"
      aria-label={`${type}: ${title} by ${artist}`}
    >
      {/* Artwork — wide, shorter than square */}
      <div className="w-full aspect-[2.2/1] relative overflow-hidden">
        {artwork ? (
          <img
            src={artwork}
            alt={`${title} by ${artist}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <ArtworkPlaceholder title={title} size="lg" />
        )}
        <span
          className="absolute top-3 left-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm"
          style={{
            backgroundColor: "rgba(232,93,38,0.18)",
            color: "var(--ac)",
            backdropFilter: "blur(4px)",
          }}
        >
          {type}
        </span>
      </div>

      <div className="p-5">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-text-faint mb-1">
          {artist}
        </p>
        <h3 className="font-display text-2xl sm:text-3xl font-black leading-tight text-text group-hover:text-accent transition-colors duration-150 mb-1">
          {title}
        </h3>
        <p className="font-mono text-[12px] text-text-faint mb-3">
          {label} &mdash; {year}
        </p>
        <StreamLinks links={links} />
      </div>
    </article>
  );
}

/** Compact release — horizontal, small artwork, info right */
export default function ReleaseCard({ release }: { release: Release }) {
  const { artist, title, type, label, year, artwork, links } = release;

  return (
    <article
      className="bg-bg-card rounded-lg border border-border hover:border-border-hover hover:-translate-y-1 transition-all duration-150 overflow-hidden group flex"
      aria-label={`${type}: ${title} by ${artist}`}
    >
      <div className="w-20 sm:w-28 shrink-0 relative">
        {artwork ? (
          <img
            src={artwork}
            alt={`${title} by ${artist}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <ArtworkPlaceholder title={title} size="sm" />
        )}
        <span
          className="absolute top-1.5 left-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm"
          style={{
            backgroundColor: "rgba(232,93,38,0.18)",
            color: "var(--ac)",
            backdropFilter: "blur(4px)",
          }}
        >
          {type}
        </span>
      </div>

      <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-center">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.1em] text-text-faint truncate">
          {artist}
        </p>
        <h3 className="font-display text-base font-bold leading-tight text-text group-hover:text-accent transition-colors truncate">
          {title}
        </h3>
        <p className="font-mono text-[10px] text-text-faint mt-0.5">
          {label} &mdash; {year}
        </p>
        <div className="mt-1.5">
          <StreamLinks links={links} />
        </div>
      </div>
    </article>
  );
}
