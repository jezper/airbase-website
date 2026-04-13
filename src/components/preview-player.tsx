"use client";

import { createContext, useContext, useRef, useState, useCallback } from "react";

interface PreviewContextValue {
  /** Currently playing Deezer track ID, or null */
  playingId: number | null;
  play: (trackId: number) => void;
  stop: () => void;
}

const PreviewContext = createContext<PreviewContextValue>({
  playingId: null,
  play: () => {},
  stop: () => {},
});

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setPlayingId(null);
  }, []);

  const play = useCallback(
    async (trackId: number) => {
      if (typeof window === "undefined") return;

      // Toggle off if same track
      if (playingId === trackId) {
        stop();
        return;
      }

      // Stop current
      if (audioRef.current) {
        audioRef.current.pause();
      } else {
        audioRef.current = new Audio();
        audioRef.current.addEventListener("ended", () => setPlayingId(null));
      }

      setPlayingId(trackId);

      // Fetch fresh preview URL
      try {
        const res = await fetch(`/api/preview?id=${trackId}`);
        const data = await res.json();
        if (!data.url) {
          setPlayingId(null);
          return;
        }
        audioRef.current.src = data.url;
        audioRef.current.play().catch(() => setPlayingId(null));
      } catch {
        setPlayingId(null);
      }
    },
    [playingId, stop],
  );

  return (
    <PreviewContext.Provider value={{ playingId, play, stop }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  return useContext(PreviewContext);
}
