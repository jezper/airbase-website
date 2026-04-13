"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import type { Release } from "@/types/content";
import { releaseSlug } from "@/lib/release-utils";
import { usePreview } from "@/components/preview-player";
import { ArtworkPlaceholder } from "@/components/artwork-placeholder";

interface ReleaseGridCardProps {
  release: Release;
}

export default function ReleaseGridCard({ release }: ReleaseGridCardProps) {
  const { artist, title, label, type, artwork, links, deezerTrackId } = release;
  const slug = releaseSlug(release);
  const { playingId, play, stop } = usePreview();
  const isPlaying = playingId === deezerTrackId;

  const streamingEntries: Array<{ href: string; label: string }> = [
    links.spotify && { href: links.spotify, label: "Spotify" },
    links.beatport && { href: links.beatport, label: "Beatport" },
    links.apple && { href: links.apple, label: "Apple" },
    links.youtube && { href: links.youtube, label: "YouTube" },
    links.tidal && { href: links.tidal, label: "Tidal" },
    links.deezer && { href: links.deezer, label: "Deezer" },
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  const displayArtist = artist.split(/\s+feat\.?\s+/i)[0].trim();

  return (
    <article className="bg-bg-card rounded-lg border border-border hover:border-border-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
      {/* Artwork with play button overlay */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Link href={`/discography/${slug}`} className="block w-full h-full">
          {artwork ? (
            <Image
              src={artwork}
              alt={`${title} by ${artist}`}
              className="w-full h-full object-cover"
              width={600} height={600}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized={artwork.startsWith("http")}
            />
          ) : (
            <ArtworkPlaceholder artist={artist} title={title} />
          )}
        </Link>

        {/* Play button - z-index above the Link */}
        {deezerTrackId && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); isPlaying ? stop() : play(deezerTrackId); }}
            style={{ width: 40, height: 40, borderRadius: "50%" }}
            className="absolute bottom-2 right-2 z-10 bg-accent flex items-center justify-center cursor-pointer shadow-lg transition-transform duration-150 hover:scale-110"
            aria-label={isPlaying ? `Pause ${title}` : `Play preview of ${title}`}
          >
            {isPlaying ? (
              <Pause size={16} fill="#0C0B0A" stroke="#0C0B0A" />
            ) : (
              <Play size={16} fill="#0C0B0A" stroke="#0C0B0A" className="ml-0.5" />
            )}
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className="px-3 py-3 flex flex-col gap-0.5">
        {/* Title (primary) */}
        <Link
          href={`/discography/${slug}`}
          className="font-display text-sm sm:text-[15px] font-bold leading-snug text-text hover:text-accent transition-colors duration-150 line-clamp-2 block"
        >
          {title}
        </Link>

        {/* Artist (secondary) */}
        <p className="font-body text-[13px] text-text-muted leading-snug truncate">
          {displayArtist}
        </p>

        {/* Type · Label (third) */}
        <p className="font-body text-[13px] text-text-muted leading-snug truncate opacity-60">
          {type} · {label}
        </p>

        {/* Streaming links (last) */}
        {streamingEntries.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1">
            {streamingEntries.map(({ href, label: lbl }) => (
              <a
                key={lbl}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[13px] text-text-muted hover:text-accent transition-colors duration-150 opacity-50 hover:opacity-100"
                aria-label={lbl}
              >
                {lbl}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
