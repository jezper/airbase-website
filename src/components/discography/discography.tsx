"use client";

import { useState, useMemo } from "react";
import type { Release, ReleaseType } from "@/types/content";
import { releaseMatchesAlias } from "@/lib/release-utils";
import YearGroup from "./year-group";

interface DiscographyProps {
  releases: Release[];
  aliases: string[];
  remixedArtists: string[];
}

const RELEASE_TYPES: ReleaseType[] = ["Single", "Remix", "Album"];

function Pill({
  label,
  count,
  active,
  onClick,
  size = "md",
  accent = "orange",
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  size?: "md" | "sm";
  accent?: "orange" | "gold";
}) {
  const colors = accent === "gold"
    ? { bg: "rgba(196,168,124,0.12)", border: "rgba(196,168,124,0.3)", text: "var(--gd)" }
    : { bg: "rgba(232,93,38,0.12)", border: "rgba(232,93,38,0.3)", text: "var(--ac)" };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-mono uppercase tracking-[0.07em] rounded-full border transition-all duration-150 whitespace-nowrap cursor-pointer ${
        size === "sm" ? "text-[10px] px-2.5 py-1" : "text-[11px] px-3 py-1.5"
      }`}
      style={
        active
          ? { backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }
          : { backgroundColor: "transparent", borderColor: "var(--bd)", color: "var(--tx-muted)" }
      }
      aria-pressed={active}
    >
      {label} <span style={{ opacity: active ? 0.7 : 0.5 }}>({count})</span>
    </button>
  );
}

export default function Discography({ releases, aliases, remixedArtists }: DiscographyProps) {
  const [activeAlias, setActiveAlias] = useState<string | null>(null);
  const [activeRemixed, setActiveRemixed] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ReleaseType | null>(null);

  // Count per alias
  const aliasCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const alias of aliases) {
      counts.set(alias, releases.filter((r) => releaseMatchesAlias(r, alias)).length);
    }
    return counts;
  }, [releases, aliases]);

  // Count per remixed artist
  const remixedCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const artist of remixedArtists) {
      counts.set(artist, releases.filter((r) =>
        r.type === "Remix" && r.artist.toLowerCase().startsWith(artist.toLowerCase())
      ).length);
    }
    return counts;
  }, [releases, remixedArtists]);

  // Apply filters
  const filtered = useMemo(() => {
    return releases.filter((r) => {
      if (activeAlias && !releaseMatchesAlias(r, activeAlias)) return false;
      if (activeRemixed) {
        if (r.type !== "Remix") return false;
        if (!r.artist.toLowerCase().startsWith(activeRemixed.toLowerCase())) return false;
      }
      if (activeType && r.type !== activeType) return false;
      return true;
    });
  }, [releases, activeAlias, activeRemixed, activeType]);

  // Type counts for current alias/remixed filter
  const typeCounts = useMemo(() => {
    const base = releases.filter((r) => {
      if (activeAlias && !releaseMatchesAlias(r, activeAlias)) return false;
      if (activeRemixed) {
        if (r.type !== "Remix") return false;
        if (!r.artist.toLowerCase().startsWith(activeRemixed.toLowerCase())) return false;
      }
      return true;
    });
    const counts = new Map<ReleaseType, number>();
    for (const r of base) counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
    return counts;
  }, [releases, activeAlias, activeRemixed]);

  // Group by year
  const byYear = useMemo(() => {
    const map = new Map<number, Release[]>();
    for (const r of filtered) {
      const existing = map.get(r.year) ?? [];
      existing.push(r);
      map.set(r.year, existing);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b - a);
  }, [filtered]);

  function handleAliasClick(alias: string) {
    setActiveAlias((prev) => (prev === alias ? null : alias));
    setActiveRemixed(null);
    setActiveType(null);
  }

  function handleRemixedClick(artist: string) {
    setActiveRemixed((prev) => (prev === artist ? null : artist));
    setActiveAlias(null);
    setActiveType(null);
  }

  const isFiltered = activeAlias !== null || activeRemixed !== null || activeType !== null;

  return (
    <div>
      {/* Alias filter */}
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint mb-2">
          My Aliases
        </p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by alias">
          <Pill
            label="All"
            count={releases.length}
            active={activeAlias === null && activeRemixed === null}
            onClick={() => { setActiveAlias(null); setActiveRemixed(null); setActiveType(null); }}
          />
          {aliases.map((alias) => {
            const count = aliasCounts.get(alias) ?? 0;
            if (count === 0) return null;
            return (
              <Pill
                key={alias}
                label={alias}
                count={count}
                active={activeAlias === alias}
                onClick={() => handleAliasClick(alias)}
              />
            );
          })}
        </div>
      </div>

      {/* Remixed artists filter */}
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint mb-2">
          Remixed
        </p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by remixed artist">
          {remixedArtists.map((artist) => {
            const count = remixedCounts.get(artist) ?? 0;
            if (count === 0) return null;
            return (
              <Pill
                key={artist}
                label={artist}
                count={count}
                active={activeRemixed === artist}
                onClick={() => handleRemixedClick(artist)}
                size="sm"
                accent="gold"
              />
            );
          })}
        </div>
      </div>

      {/* Type filter */}
      <div className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint mb-2">
          Type
        </p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by release type">
          {RELEASE_TYPES.map((type) => {
            const count = typeCounts.get(type) ?? 0;
            if (count === 0) return null;
            return (
              <Pill
                key={type}
                label={type}
                count={count}
                active={activeType === type}
                onClick={() => setActiveType((prev) => (prev === type ? null : type))}
                size="sm"
                accent="gold"
              />
            );
          })}
        </div>
      </div>

      {/* Year groups */}
      {byYear.length > 0 ? (
        <div className="flex flex-col gap-16">
          {byYear.map(([year, yearReleases]) => (
            <YearGroup key={year} year={year} releases={yearReleases} />
          ))}
        </div>
      ) : (
        <p className="font-body text-text-muted text-sm py-12 text-center">
          No releases match this filter combination.
        </p>
      )}

      <p className="font-mono text-[11px] text-text-faint mt-12 text-center">
        {isFiltered
          ? `${filtered.length} release${filtered.length !== 1 ? "s" : ""} shown (from ${releases.length})`
          : `${releases.length} releases`}
      </p>
    </div>
  );
}
