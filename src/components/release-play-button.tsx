"use client";

import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface ReleasePlayButtonProps {
  title: string;
  deezerTrackId: number;
}

export function ReleasePlayButton({ title, deezerTrackId }: ReleasePlayButtonProps) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      style={{ width: 48, height: 48, borderRadius: "50%" }}
      className="bg-accent flex items-center justify-center hover:scale-110 transition-transform duration-150 cursor-pointer shadow-lg"
      aria-label={playing ? `Pause ${title}` : `Play preview of ${title}`}
    >
      {playing ? (
        <Pause size={18} fill="#0C0B0A" stroke="#0C0B0A" />
      ) : (
        <Play size={18} fill="#0C0B0A" stroke="#0C0B0A" className="ml-0.5" />
      )}
    </button>
  );
}
