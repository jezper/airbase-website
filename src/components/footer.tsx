import { Logo } from "./logo";

const SOCIAL_LINKS = [
  { label: "Spotify", href: "https://open.spotify.com/artist/0DgL6pCI4mC68FVMPlzx3L" },
  { label: "Apple Music", href: "https://music.apple.com/artist/airbase" },
  { label: "Beatport", href: "https://www.beatport.com/artist/airbase/8317" },
  { label: "SoundCloud", href: "https://soundcloud.com/airbasemusic" },
  { label: "YouTube", href: "https://youtube.com/@airbasemusic" },
  { label: "Instagram", href: "https://instagram.com/airbasemusic" },
  { label: "X", href: "https://x.com/airbasemusic" },
  { label: "Facebook", href: "https://facebook.com/airbasemusic" },
];

const LABELS = [
  "Black Hole",
  "Armada",
  "ASOT",
  "In Trance We Trust",
  "Platipus",
  "Flashover",
  "Anjunabeats",
  "High Contrast",
  "Magik Muzik",
  "Discover",
  "Mondo",
  "Moonrising",
  "Intuition",
];

export function Footer() {
  // Duplicate the label list so the seamless loop works:
  // the keyframe moves -50%, so two copies fill the scroll.
  const labelText = [...LABELS, ...LABELS].join("  ·  ");

  return (
    <footer className="border-t border-border-section mt-16">
      {/* Label scroller */}
      <div
        className="overflow-hidden py-4 border-b border-border-section"
        aria-hidden="true"
      >
        <div
          className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint animate-scroll-left"
        >
          {labelText}
        </div>
      </div>

      <div className="px-6 md:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <Logo className="h-4 text-text-faint mb-3" aria-label="Airbase" />
          <p className="font-mono text-[11px] text-text-faint">
            &copy; {new Date().getFullYear()} Jezper S&ouml;derlund. All rights reserved.
          </p>
        </div>

        <nav aria-label="Social links">
          <ul className="flex flex-wrap gap-4 list-none m-0 p-0">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-text-faint hover:text-accent transition-colors duration-150"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
