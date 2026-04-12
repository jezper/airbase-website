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
        className="font-display font-black text-[100px] sm:text-[140px] leading-none select-none opacity-[0.06]"
        style={{ color: "var(--ac)" }}
      >
        {initial}
      </span>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--tx) 0px, var(--tx) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, var(--tx) 0px, var(--tx) 1px, transparent 1px, transparent 20px)",
        }}
      />
    </div>
  );
}

/** Displayed above a post that references a release */
export default function ReleaseContext({ release }: { release: Release }) {
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
    <div className="bg-bg-card rounded-t-lg border border-b-0 border-border overflow-hidden">
      <div className="w-full aspect-[2.2/1] relative overflow-hidden">
        {artwork ? (
          <img src={artwork} alt={`${title} by ${artist}`} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <ArtworkPlaceholder title={title} />
        )}
        <span
          className="absolute top-3 left-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-sm"
          style={{ backgroundColor: "rgba(232,93,38,0.2)", color: "var(--ac)", backdropFilter: "blur(6px)" }}
        >
          {type}
        </span>
      </div>
      <div className="px-5 pt-4 pb-3">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-text-faint mb-0.5">
          {artist}
        </p>
        <h3 className="font-display text-2xl sm:text-3xl font-black leading-tight text-text mb-1">
          {title}
        </h3>
        <p className="font-mono text-[12px] text-text-faint mb-2">
          {label} &mdash; {year}
        </p>
        {streamLinks.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {streamLinks.map((sl) => (
              <a
                key={sl.label}
                href={sl.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[12px] font-bold uppercase tracking-[0.06em] text-accent hover:text-accent-hover transition-colors"
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
