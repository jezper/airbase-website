"use client";

import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface HeroPlayButtonProps {
  title: string;
  streamingUrl?: string;
  deezerTrackId?: number;
}

export function HeroPlayButton({ title, streamingUrl, deezerTrackId }: HeroPlayButtonProps) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // If we have a streaming link and no preview, link externally
  if (streamingUrl && !deezerTrackId) {
    return (
      <a
        href={streamingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-16 h-16 rounded-full bg-accent flex items-center justify-center hover:scale-110 transition-transform duration-150 shrink-0"
        aria-label={`Play ${title}`}
      >
        <Play size={22} fill="#0C0B0A" stroke="#0C0B0A" className="ml-1" />
      </a>
    );
  }

  // If we have a Deezer track ID, play inline via our API
  if (deezerTrackId) {
    async function toggle() {
      if (playing) {
        audioRef.current?.pause();
        setPlaying(false);
      } else {
        if (!audioRef.current) {
          audioRef.current = new Audio();
          audioRef.current.addEventListener("ended", () => setPlaying(false));
        }
        setPlaying(true);
        try {
          const res = await fetch(`/api/preview?id=${deezerTrackId}`);
          const data = await res.json();
          if (!data.url) { setPlaying(false); return; }
          audioRef.current.src = data.url;
          audioRef.current.play().catch(() => setPlaying(false));
        } catch {
          setPlaying(false);
        }
      }
    }

    return (
      <button
        type="button"
        onClick={toggle}
        className="w-16 h-16 rounded-full bg-accent flex items-center justify-center hover:scale-110 transition-transform duration-150 shrink-0 cursor-pointer"
        aria-label={playing ? `Pause ${title}` : `Play preview of ${title}`}
      >
        {playing ? (
          <Pause size={22} fill="#0C0B0A" stroke="#0C0B0A" />
        ) : (
          <Play size={22} fill="#0C0B0A" stroke="#0C0B0A" className="ml-1" />
        )}
      </button>
    );
  }

  return null;
}
