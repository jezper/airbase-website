import type { Release } from "@/types/content";

interface ReleaseGridCardProps {
  release: Release;
}

function ArtworkPlaceholder({ artist, title }: { artist: string; title: string }) {
  const initial = title.charAt(0).toUpperCase();
  // Generate a deterministic hue from the title string for variety
  const hue = Array.from(title).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;
  const gradient = `linear-gradient(135deg, hsl(${hue}, 18%, 14%) 0%, hsl(${(hue + 40) % 360}, 14%, 10%) 100%)`;

  return (
    <div
      className="w-full aspect-square flex items-center justify-center select-none"
      style={{ background: gradient }}
      aria-hidden="true"
      title={`${artist} — ${title}`}
    >
      <span
        className="font-display font-black text-white/10 leading-none"
        style={{ fontSize: "clamp(3rem, 30%, 5rem)" }}
      >
        {initial}
      </span>
    </div>
  );
}

function TypeBadge({ type }: { type: Release["type"] }) {
  const isRemix = type === "Remix";
  const bg = isRemix
    ? "rgba(196,168,124,0.14)"
    : "rgba(232,93,38,0.12)";
  const border = isRemix
    ? "rgba(196,168,124,0.3)"
    : "rgba(232,93,38,0.3)";
  const color = isRemix ? "var(--gd)" : "var(--ac)";

  return (
    <span
      className="font-mono text-[9px] font-medium tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-sm inline-block"
      style={{ backgroundColor: bg, border: `1px solid ${border}`, color }}
    >
      {type}
    </span>
  );
}

function StreamingLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-faint hover:text-accent transition-colors duration-150"
      aria-label={label}
    >
      {label}
    </a>
  );
}

export default function ReleaseGridCard({ release }: ReleaseGridCardProps) {
  const { artist, title, label, type, artwork, links } = release;

  // Pick first available streaming link for the title href
  const primaryLink =
    links.spotify ||
    links.beatport ||
    links.smartlink ||
    links.apple ||
    links.soundcloud ||
    links.youtube ||
    null;

  const streamingEntries: Array<{ href: string; label: string }> = [
    links.spotify && { href: links.spotify, label: "Spotify" },
    links.beatport && { href: links.beatport, label: "Beatport" },
    links.apple && { href: links.apple, label: "Apple" },
    links.soundcloud && { href: links.soundcloud, label: "SoundCloud" },
    links.youtube && { href: links.youtube, label: "YouTube" },
    links.smartlink && { href: links.smartlink, label: "Listen" },
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  // Shorten artist for display (strip "feat." collaborators)
  const displayArtist = artist.split(/\s+feat\.?\s+/i)[0].trim();

  return (
    <article className="bg-bg-card rounded-lg border border-border hover:border-border-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
      {/* Artwork */}
      <div className="w-full aspect-square overflow-hidden">
        {artwork ? (
          <img
            src={artwork}
            alt={`${title} by ${artist}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <ArtworkPlaceholder artist={artist} title={title} />
        )}
      </div>

      {/* Metadata */}
      <div className="p-2.5 flex flex-col gap-1">
        {/* Type badge */}
        <TypeBadge type={type} />

        {/* Artist */}
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.08em] text-text-faint leading-tight mt-0.5">
          {displayArtist}
        </p>

        {/* Title */}
        {primaryLink ? (
          <a
            href={primaryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm font-bold leading-tight text-text hover:text-accent transition-colors duration-150 line-clamp-2"
          >
            {title}
          </a>
        ) : (
          <span className="font-display text-sm font-bold leading-tight text-text line-clamp-2">
            {title}
          </span>
        )}

        {/* Label */}
        <p className="font-mono text-[10px] text-text-faint leading-tight truncate">
          {label}
        </p>

        {/* Streaming links */}
        {streamingEntries.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
            {streamingEntries.map(({ href, label: lbl }) => (
              <StreamingLink key={lbl} href={href} label={lbl} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
