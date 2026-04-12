import { Play } from "lucide-react";
import { getFeedItems } from "@/lib/feed";
import { getAllReleases } from "@/lib/releases";
import Feed from "@/components/feed/feed";

const STATS = [
  { number: "25+", label: "Years Active" },
  { number: "100+", label: "Releases" },
  { number: "14", label: "Aliases" },
  { number: "138", label: "BPM" },
];

export default async function Home() {
  const [feedItems, releases] = await Promise.all([
    getFeedItems(20),
    getAllReleases(),
  ]);

  const latest = releases[0];
  const heroLinks: { label: string; href: string }[] = latest
    ? [
        latest.links.spotify && { label: "Spotify", href: latest.links.spotify },
        latest.links.beatport && { label: "Beatport", href: latest.links.beatport },
        latest.links.soundcloud && { label: "SoundCloud", href: latest.links.soundcloud },
        latest.links.smartlink && { label: "Listen", href: latest.links.smartlink },
      ].filter(Boolean) as { label: string; href: string }[]
    : [];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col justify-end px-6 md:px-12 pb-16 md:pb-20 overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute -top-[30%] -right-[20%] w-[80%] h-[140%] rounded-full pointer-events-none blur-[60px] motion-safe:animate-glow-breathe"
          style={{
            background: "radial-gradient(ellipse at center, var(--ac-glow) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <div
          className="relative z-10"
          style={{
            display: "grid",
            gridTemplateColumns: latest?.artwork ? "1fr 240px" : "1fr",
            alignItems: "end",
            gap: "3rem",
          }}
        >
          {/* Text — always takes priority */}
          <div>
            <p className="font-mono text-[13px] font-medium uppercase tracking-[0.2em] text-accent mb-4 md:mb-5">
              New Release / {latest?.year ?? 2026}
            </p>

            <h1 className="font-display text-hero font-black leading-hero tracking-hero mb-5 md:mb-6">
              Everything<br />
              Else Could<br />
              Wait
            </h1>

            <p className="font-body text-[15px] font-extrabold uppercase tracking-[0.15em] text-accent mb-8">
              {latest?.artist ?? "Airbase"} &mdash; {latest?.label ?? "Black Hole Recordings"}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <button
                className="w-16 h-16 rounded-full bg-accent flex items-center justify-center hover:scale-110 transition-transform duration-150 shrink-0"
                aria-label={`Play ${latest?.title ?? ""}`}
              >
                <Play size={22} fill="#0C0B0A" stroke="#0C0B0A" className="ml-1" />
              </button>
              <div>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {heroLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-[13px] font-bold uppercase tracking-[0.08em] text-accent hover:border-b-2 hover:border-accent pb-0.5 transition-all duration-150"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <p className="font-mono text-xs text-text-faint mt-2">
                  {latest?.type ?? "Single"} &mdash; {latest?.tracks.length ?? 0} tracks
                </p>
              </div>
            </div>
          </div>

          {/* Artwork — fixed 240px column, can't grow */}
          {latest?.artwork && (
            <img
              src={latest.artwork}
              alt={`${latest.title} by ${latest.artist}`}
              style={{ width: "240px", height: "240px", objectFit: "cover" }}
              className="rounded-lg shadow-2xl hidden md:block"
            />
          )}
        </div>
      </section>

      {/* Accent line */}
      <div className="accent-line mx-6 md:mx-12" />

      {/* Stats bar */}
      <section
        className="flex flex-wrap justify-between px-6 md:px-12 py-8 border-b border-border-section"
        aria-label="Career statistics"
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center px-4 py-3 flex-1 min-w-[120px]">
            <div
              className="font-display text-5xl font-black text-accent"
              style={{ fontVariationSettings: "'opsz' 144" }}
            >
              {stat.number}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* Feed */}
      <Feed items={feedItems} />
    </>
  );
}
