import type { Release } from "@/types/content";

interface ReleaseCardProps {
  release: Release;
}

function ArtworkPlaceholder({ artist, title }: { artist: string; title: string }) {
  // Generate a subtle gradient from the first chars — purely decorative
  const initial = (title[0] ?? "A").toUpperCase();
  return (
    <div
      className="w-full aspect-square flex items-end p-3 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-card) 60%, var(--bg) 100%)",
      }}
      aria-hidden="true"
    >
      {/* Decorative large letter */}
      <span
        className="font-display font-black text-[80px] leading-none select-none absolute bottom-0 right-2 opacity-[0.06]"
        style={{ color: "var(--ac)" }}
      >
        {initial}
      </span>
      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--tx) 0px, var(--tx) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, var(--tx) 0px, var(--tx) 1px, transparent 1px, transparent 24px)",
        }}
      />
      <span className="sr-only">{`${artist} — ${title} — no artwork available`}</span>
    </div>
  );
}

function StreamingLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-body text-[11px] font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover transition-colors duration-150"
    >
      {label}
    </a>
  );
}

export default function ReleaseCard({ release }: ReleaseCardProps) {
  const { artist, title, type, label, artwork, links } = release;

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
      className="bg-bg-card rounded-lg border border-border hover:border-border-hover hover:-translate-y-1 transition-all duration-150 overflow-hidden group"
      aria-label={`${type}: ${title} by ${artist}`}
    >
      {/* Artwork area */}
      <div className="relative">
        {artwork ? (
          <img
            src={artwork}
            alt={`${title} by ${artist}`}
            className="w-full aspect-square object-cover"
            loading="lazy"
          />
        ) : (
          <ArtworkPlaceholder artist={artist} title={title} />
        )}

        {/* Type badge — absolute over artwork */}
        <span
          className="absolute top-2 left-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm"
          style={{
            backgroundColor: "rgba(232,93,38,0.18)",
            color: "var(--ac)",
            backdropFilter: "blur(4px)",
          }}
        >
          {type}
        </span>
      </div>

      {/* Metadata */}
      <div className="p-4 space-y-1.5">
        {/* Artist */}
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.1em] text-text-faint">
          {artist}
        </p>

        {/* Title */}
        <h3 className="font-display text-lg font-bold leading-tight text-text group-hover:text-accent transition-colors duration-150">
          {title}
        </h3>

        {/* Label */}
        <p className="font-mono text-[11px] text-text-faint">{label}</p>

        {/* Streaming links */}
        {streamLinks.length > 0 && (
          <div
            className="flex flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-border"
            aria-label="Streaming links"
          >
            {streamLinks.map((sl) => (
              <StreamingLink key={sl.label} label={sl.label} href={sl.href} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
