import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllReleases, getReleaseBySlug } from "@/lib/releases";
import { releaseSlug } from "@/lib/release-utils";
import { getPostsForRelease } from "@/lib/feed";
import NoteCard from "@/components/feed/note-card";
import ArticleCard from "@/components/feed/article-card";
import { ReleasePlayButton } from "@/components/release-play-button";
import { ArtworkPlaceholder } from "@/components/artwork-placeholder";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const releases = await getAllReleases();
  return releases.map((r) => ({ slug: releaseSlug(r) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);
  if (!release) return { title: "Release Not Found" };

  const trackCount = release.tracks.length;
  const description = `${release.type} on ${release.label} (${release.year}).${trackCount > 0 ? ` ${trackCount} track${trackCount !== 1 ? "s" : ""}.` : ""}`;

  return {
    title: `${release.artist} - ${release.title} | Airbase`,
    description,
    openGraph: {
      title: `${release.artist} - ${release.title}`,
      description,
      ...(release.artwork && { images: [{ url: release.artwork }] }),
    },
  };
}

export default async function ReleasePage({ params }: Props) {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);
  if (!release) notFound();

  const related = release.relatedRelease
    ? await getReleaseBySlug(release.relatedRelease)
    : null;

  const posts = await getPostsForRelease(slug);

  const streamLinks: { label: string; href: string }[] = [
    release.links.spotify && { label: "Spotify", href: release.links.spotify },
    release.links.beatport && { label: "Beatport", href: release.links.beatport },
    release.links.apple && { label: "Apple Music", href: release.links.apple },
    release.links.youtube && { label: "YouTube", href: release.links.youtube },
    release.links.tidal && { label: "Tidal", href: release.links.tidal },
    release.links.deezer && { label: "Deezer", href: release.links.deezer },
    release.links.smartlink && { label: "Listen", href: release.links.smartlink },
  ].filter(Boolean) as { label: string; href: string }[];

  const isRemix = release.type === "Remix";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": release.type === "Album" ? "MusicAlbum" : "MusicRecording",
    name: release.title,
    byArtist: { "@type": "MusicGroup", name: release.artist },
    datePublished: release.date,
    recordLabel: { "@type": "Organization", name: release.label },
    url: `https://airbasemusic.com/discography/${slug}`,
    ...(release.artwork && { image: `https://airbasemusic.com${release.artwork}` }),
    ...(release.tracks.length > 0 &&
      release.type === "Album" && {
        numTracks: release.tracks.length,
        track: release.tracks.map((t, i) => ({
          "@type": "MusicRecording",
          name: t,
          position: i + 1,
        })),
      }),
  };

  return (
    <div className="px-6 md:px-12 py-12 max-w-content mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back link */}
      <Link
        href="/discography"
        className="font-mono text-[13px] uppercase tracking-[0.1em] text-text-faint hover:text-accent transition-colors inline-block mb-10"
      >
        &larr; Discography
      </Link>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* Artwork */}
        <div>
          {release.artwork ? (
            <Image
              src={release.artwork}
              alt={`${release.title} by ${release.artist}`}
              className="w-full aspect-square rounded-lg shadow-2xl object-cover"
              width={600} height={600} sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized={release.artwork.startsWith("http")}
            />
          ) : (
            <ArtworkPlaceholder artist={release.artist} title={release.title} className="rounded-lg" />
          )}
        </div>

        {/* Release info */}
        <div>
          {/* Type badge + label + year */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="font-mono text-[12px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm"
              style={{
                backgroundColor: isRemix ? "rgba(196,168,124,0.14)" : "rgba(232,93,38,0.12)",
                color: isRemix ? "var(--gd)" : "var(--ac)",
              }}
            >
              {release.type}
            </span>
            <span className="font-mono text-[13px] text-text-muted">
              {release.label}
            </span>
            <span className="font-mono text-[13px] text-text-faint">
              {release.year}
            </span>
          </div>

          {/* Artist */}
          <p className="font-body text-[15px] font-extrabold uppercase tracking-[0.15em] text-accent mb-2">
            {release.artist}
          </p>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl font-black leading-tight mb-4">
            {release.title}
          </h1>

          {/* Related release */}
          {related && (
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-faint mb-6">
              Original:{" "}
              <Link
                href={`/discography/${releaseSlug(related)}`}
                className="text-text-muted hover:text-accent transition-colors"
              >
                {related.artist} &ndash; {related.title} ({related.year})
              </Link>
            </p>
          )}

          {/* Tracklist */}
          {release.tracks.length > 0 && (
            <div className="mb-6">
              <h2 className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-faint mb-3">
                Tracklist
              </h2>
              <ol className="list-none space-y-1.5">
                {release.tracks.map((track, i) => (
                  <li key={i} className="flex items-baseline gap-3">
                    <span className="font-mono text-[13px] text-text-faint w-5 text-right shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-body text-[15px] text-text">
                      {track}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Listen */}
          {(streamLinks.length > 0 || release.deezerTrackId) && (
            <div className="mb-6">
              <h2 className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-faint mb-3">
                Listen
              </h2>
              <div className="flex items-center gap-5">
                {release.deezerTrackId && (
                  <ReleasePlayButton title={release.title} deezerTrackId={release.deezerTrackId} />
                )}
                {streamLinks.length > 0 && (
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {streamLinks.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-[13px] font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover transition-colors"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appears on */}
          {release.appearsOn && release.appearsOn.length > 0 && (
            <div>
              <h2 className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-faint mb-3">
                Appears on
              </h2>
              <ul className="list-none space-y-1">
                {release.appearsOn.map((comp, i) => (
                  <li key={i} className="font-body text-[14px] text-text-muted">
                    {comp.title}
                    <span className="font-mono text-[12px] text-text-faint ml-2">
                      {comp.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related posts */}
      {posts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-border-section" aria-label="Related posts">
          <h2 className="font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-text-faint mb-8">
            From the feed
          </h2>
          <div className="flex flex-col gap-6 max-w-prose">
            {posts.map((post, i) => (
              post.type === "note" ? (
                <NoteCard key={`${post.date}-${i}`} post={post} />
              ) : (
                <ArticleCard key={`${post.date}-${i}`} post={post} />
              )
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
