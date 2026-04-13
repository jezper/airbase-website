export const dynamic = "force-dynamic";

import Image from "next/image";
import { getFeedItems } from "@/lib/feed";
import { getAllReleases, getReleaseBySlug } from "@/lib/releases";
import { releaseSlug } from "@/lib/release-utils";
import { getAllShows } from "@/lib/shows";
import { readSiteConfig, readPosts } from "@/lib/content-writer";
import Feed from "@/components/feed/feed";
import { HeroPlayButton } from "@/components/hero-play-button";

const STATS = [
  { number: "25+", label: "Years Active" },
  { number: "100+", label: "Releases" },
  { number: "14", label: "Aliases" },
];

export default async function Home() {
  const [feedItems, releases, shows, posts, siteConfig] = await Promise.all([
    getFeedItems(20),
    getAllReleases(),
    getAllShows(),
    readPosts(),
    readSiteConfig(),
  ]);

  const hero = siteConfig.hero;
  const heroRelease = hero.type === "release" ? (releases[hero.releaseIndex ?? 0] ?? releases[0]) : null;
  const heroRelated = heroRelease?.relatedRelease ? await getReleaseBySlug(heroRelease.relatedRelease) : null;
  const heroPost = hero.type === "post" ? posts[hero.postIndex ?? 0] : null;
  const heroShow = hero.type === "show" ? shows[hero.showIndex ?? 0] : null;

  return (
    <>
      {/* Hero */}
      <section className={`relative flex flex-col justify-center px-6 md:px-12 overflow-hidden ${
        heroRelease ? "min-h-[85vh] py-24 md:py-28" : "pt-32 md:pt-48 pb-16 md:pb-20"
      }`}>
        {/* Ambient glow */}
        <div
          className="absolute -top-[30%] -right-[20%] w-[80%] h-[140%] rounded-full pointer-events-none blur-[60px] motion-safe:animate-glow-breathe"
          style={{
            background: "radial-gradient(ellipse at center, var(--ac-glow) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        {/* Release hero */}
        {heroRelease && (() => {
          const isUpcoming = heroRelease.date > new Date().toISOString().slice(0, 10);
          const links = [
            heroRelease.links.spotify && { label: "Spotify", href: heroRelease.links.spotify },
            heroRelease.links.beatport && { label: "Beatport", href: heroRelease.links.beatport },
            heroRelease.links.apple && { label: "Apple Music", href: heroRelease.links.apple },
            heroRelease.links.youtube && { label: "YouTube", href: heroRelease.links.youtube },
            heroRelease.links.tidal && { label: "Tidal", href: heroRelease.links.tidal },
            heroRelease.links.deezer && { label: "Deezer", href: heroRelease.links.deezer },
          ].filter(Boolean) as { label: string; href: string }[];

          return (
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16 max-w-content mx-auto">
              {heroRelease.artwork && (
                <div className="order-1 flex justify-center md:justify-end">
                  <Image src={heroRelease.artwork} alt={`${heroRelease.title} by ${heroRelease.artist}`}
                    className="w-full max-w-md aspect-square rounded-lg shadow-2xl object-cover"
                    width={600} height={600} sizes="(max-width: 768px) 100vw, 50vw" priority
                    unoptimized={heroRelease.artwork.startsWith("http")} />
                </div>
              )}
              <div className="order-2">
                <p className="font-mono text-[13px] font-medium uppercase tracking-[0.2em] text-accent mb-4 md:mb-5">
                  {isUpcoming ? `Out ${heroRelease.date}` : `New Release / ${heroRelease.year}`}
                </p>
                <h1 className="font-display text-hero font-black leading-hero tracking-hero mb-5 md:mb-6">
                  {heroRelease.title}
                </h1>
                <p className="font-body text-[15px] font-extrabold uppercase tracking-[0.15em] text-accent mb-2">
                  {heroRelease.artist}
                </p>
                <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-text-muted mb-4">
                  {heroRelease.label}
                </p>
                {heroRelated && (
                  <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-faint mb-8">
                    Original: <a href={`/discography/${releaseSlug(heroRelated)}`}
                      className="text-text-muted hover:text-accent transition-colors">
                      {heroRelated.artist} &ndash; {heroRelated.title} ({heroRelated.year})
                    </a>
                  </p>
                )}
                {!heroRelated && <div className="mb-4" />}
                {(links.length > 0 || heroRelease.deezerTrackId) && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <HeroPlayButton
                      title={heroRelease.title}
                      streamingUrl={links[0]?.href}
                      deezerTrackId={heroRelease.deezerTrackId}
                    />
                    {links.length > 0 && (
                      <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {links.map((l) => (
                          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                            className="font-body text-[13px] font-bold uppercase tracking-[0.08em] text-accent hover:border-b-2 hover:border-accent pb-0.5 transition-all duration-150">
                            {l.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Note hero — the text IS the statement */}
        {heroPost?.type === "note" && (
          <div className="relative z-10 max-w-prose mx-auto">
            <div className="border-l-3 pl-8" style={{ borderColor: "var(--ac)" }}>
              <p className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-text mb-6">
                {heroPost.body}
              </p>
              {heroPost.link && (
                <a href={heroPost.link} target="_blank" rel="noopener noreferrer"
                  className="font-body text-[14px] font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover transition-colors">
                  {heroPost.linkLabel ?? "Read more"} &rarr;
                </a>
              )}
              <p className="font-mono text-[13px] text-text-faint mt-4">
                {new Date(heroPost.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
              </p>
            </div>
          </div>
        )}

        {/* Article hero — big title + excerpt */}
        {heroPost?.type === "article" && (
          <div className="relative z-10 max-w-content mx-auto">
            <p className="font-mono text-[13px] font-medium uppercase tracking-[0.2em] text-accent mb-4 md:mb-5">
              {new Date(heroPost.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
            </p>
            <h1 className="font-display text-hero font-black leading-hero tracking-hero mb-5 md:mb-6 max-w-[900px]">
              {heroPost.title}
            </h1>
            {heroPost.excerpt && (
              <p className="font-body text-lg text-text-muted max-w-xl mb-6">
                {heroPost.excerpt}
              </p>
            )}
            {heroPost.slug && (
              <a href={`/feed/${heroPost.slug}`}
                className="font-body text-[14px] font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover transition-colors">
                Read &rarr;
              </a>
            )}
          </div>
        )}

        {/* Show hero — gold accent, date, venue, tickets */}
        {heroShow && (() => {
          const isUpcoming = heroShow.status === "upcoming";
          const d = heroShow.date ? new Date(heroShow.date) : null;
          return (
            <div className="relative z-10 max-w-content mx-auto">
              {heroShow.image && (
                <div className="mb-8">
                  <Image src={heroShow.image} alt={`${heroShow.event ?? heroShow.venue} flyer`}
                    className="w-full max-w-md rounded-lg shadow-2xl object-cover"
                    width={600} height={600} sizes="(max-width: 768px) 100vw, 50vw" priority
                    unoptimized={heroShow.image.startsWith("http")} />
                </div>
              )}
              {isUpcoming && (
                <p className="font-mono text-[13px] font-medium uppercase tracking-[0.2em] mb-4 md:mb-5"
                  style={{ color: "var(--gd)" }}>
                  Upcoming{d ? ` / ${d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}` : ""}
                </p>
              )}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-3">
                {heroShow.event ?? heroShow.venue}
              </h1>
              <p className="font-body text-lg text-text-muted mb-6">
                {heroShow.event && heroShow.event !== heroShow.venue ? `${heroShow.venue} — ` : ""}
                {heroShow.city}, {heroShow.country}
              </p>
              {isUpcoming && (
                <a href="#" className="inline-block font-body text-[13px] font-bold uppercase tracking-[0.1em] px-6 py-3 rounded-sm transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "var(--gd)", color: "var(--bg)" }}>
                  Tickets
                </a>
              )}
            </div>
          );
        })()}

        {/* Custom hero */}
        {hero.type === "custom" && (
          <div className="relative z-10 max-w-content mx-auto">
            {hero.image && (
              <div className="mb-8">
                <Image src={hero.image} alt={hero.title ?? ""} className="w-48 h-48 rounded-lg shadow-2xl object-cover"
                  width={192} height={192} priority
                  unoptimized={hero.image.startsWith("http")} />
              </div>
            )}
            <h1 className="font-display text-hero font-black leading-hero tracking-hero mb-5 md:mb-6">
              {hero.title}
            </h1>
            {hero.subtitle && (
              <p className="font-body text-lg text-text-muted max-w-xl">{hero.subtitle}</p>
            )}
          </div>
        )}

        {/* Fallback */}
        {!heroRelease && !heroPost && !heroShow && hero.type !== "custom" && (
          <div className="relative z-10 max-w-content mx-auto">
            <h1 className="font-display text-hero font-black leading-hero tracking-hero">
              Airbase
            </h1>
          </div>
        )}
      </section>

      {/* Accent line */}
      <div className="accent-line mx-6 md:mx-12" />

      {/* Stats bar */}
      <section
        className="flex justify-between px-6 md:px-12 py-8 border-b border-border-section"
        aria-label="Career statistics"
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center px-2 md:px-4 py-3 flex-1">
            <div
              className="font-display text-5xl font-black text-accent"
              style={{ fontVariationSettings: "'opsz' 144" }}
            >
              {stat.number}
            </div>
            <div className="font-mono text-[12px] uppercase tracking-[0.15em] text-text-faint mt-1">
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
