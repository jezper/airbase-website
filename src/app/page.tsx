import { Play } from "lucide-react";
import { getFeedItems } from "@/lib/feed";
import { getAllReleases } from "@/lib/releases";
import { readSiteConfig, readPosts } from "@/lib/content-writer";
import Feed from "@/components/feed/feed";

const STATS = [
  { number: "25+", label: "Years Active" },
  { number: "100+", label: "Releases" },
  { number: "14", label: "Aliases" },
  { number: "14", label: "Countries" },
];

export default async function Home() {
  const [feedItems, releases, posts, siteConfig] = await Promise.all([
    getFeedItems(20),
    getAllReleases(),
    readPosts(),
    readSiteConfig(),
  ]);

  const hero = siteConfig.hero;

  // Resolve hero content based on type
  let heroRelease = releases[0]; // default fallback
  let heroTitle = "";
  let heroSubtitle = "";
  let heroImage: string | null = null;
  let heroIsCustom = false;

  if (hero.type === "release") {
    heroRelease = releases[hero.releaseIndex ?? 0] ?? releases[0];
  } else if (hero.type === "post") {
    const heroPost = posts[hero.postIndex ?? 0];
    heroTitle = heroPost?.title ?? heroPost?.body?.slice(0, 80) ?? "";
    heroSubtitle = heroPost?.excerpt ?? "";
    heroImage = heroPost?.image ?? null;
    heroIsCustom = true;
  } else if (hero.type === "custom") {
    heroTitle = hero.title ?? "";
    heroSubtitle = hero.subtitle ?? "";
    heroImage = hero.image ?? null;
    heroIsCustom = true;
  }

  const heroLinks: { label: string; href: string }[] = heroRelease
    ? [
        heroRelease.links.spotify && { label: "Spotify", href: heroRelease.links.spotify },
        heroRelease.links.beatport && { label: "Beatport", href: heroRelease.links.beatport },
        heroRelease.links.apple && { label: "Apple Music", href: heroRelease.links.apple },
        heroRelease.links.youtube && { label: "YouTube", href: heroRelease.links.youtube },
        heroRelease.links.tidal && { label: "Tidal", href: heroRelease.links.tidal },
        heroRelease.links.deezer && { label: "Deezer", href: heroRelease.links.deezer },
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

        {heroIsCustom ? (
          /* Custom / post hero */
          <div className="relative z-10 max-w-content mx-auto w-full">
            {heroImage && (
              <div className="mb-8 flex justify-start">
                <img
                  src={heroImage}
                  alt={heroTitle}
                  className="w-48 h-48 rounded-lg shadow-2xl object-cover"
                />
              </div>
            )}
            <h1 className="font-display text-hero font-black leading-hero tracking-hero mb-5 md:mb-6">
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="font-body text-lg text-text-muted max-w-xl">{heroSubtitle}</p>
            )}
          </div>
        ) : (
          /* Release hero */
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[2fr_3fr] items-center gap-8 md:gap-12 max-w-content mx-auto">
            {/* Artwork — left on desktop, top on mobile */}
            {heroRelease?.artwork && (
              <div className="order-1 flex justify-center">
                <img
                  src={heroRelease.artwork}
                  alt={`${heroRelease.title} by ${heroRelease.artist}`}
                  className="w-full md:w-full aspect-square rounded-lg shadow-2xl object-cover"
                />
              </div>
            )}

            {/* Text — right on desktop, below on mobile */}
            <div className="order-2">
              <p className="font-mono text-[13px] font-medium uppercase tracking-[0.2em] text-accent mb-4 md:mb-5">
                {heroRelease && heroRelease.date > new Date().toISOString().slice(0, 10)
                  ? `Upcoming / ${heroRelease.date}`
                  : `New Release / ${heroRelease?.year ?? 2026}`}
              </p>

              <h1 className="font-display text-hero font-black leading-hero tracking-hero mb-5 md:mb-6">
                {heroRelease?.title ?? "Airbase"}
              </h1>

              <p className="font-body text-[15px] font-extrabold uppercase tracking-[0.15em] text-accent mb-8">
                {heroRelease?.artist ?? "Airbase"} &mdash; {heroRelease?.label ?? ""}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {heroLinks.length > 0 && (
                  <a
                    href={heroRelease?.links.spotify ?? heroLinks[0]?.href ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 rounded-full bg-accent flex items-center justify-center hover:scale-110 transition-transform duration-150 shrink-0"
                    aria-label={`Play ${heroRelease?.title ?? ""} on Spotify`}
                  >
                    <Play size={22} fill="#0C0B0A" stroke="#0C0B0A" className="ml-1" />
                  </a>
                )}
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
                    {heroRelease?.type ?? "Single"} &mdash; {heroRelease?.tracks.length ?? 0} tracks
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
