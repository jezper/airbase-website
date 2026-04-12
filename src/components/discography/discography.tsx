"use client";

import { useState, useMemo } from "react";
import type { Release, ReleaseType } from "@/types/content";
import YearGroup from "./year-group";

interface DiscographyProps {
  releases: Release[];
  aliases: string[];
}

const RELEASE_TYPES: ReleaseType[] = ["Single", "Remix", "Album"];

function AliasPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-[11px] uppercase tracking-[0.07em] px-3 py-1.5 rounded-full border transition-all duration-150 whitespace-nowrap cursor-pointer"
      style={
        active
          ? {
              backgroundColor: "rgba(232,93,38,0.12)",
              borderColor: "rgba(232,93,38,0.3)",
              color: "var(--ac)",
            }
          : {
              backgroundColor: "transparent",
              borderColor: "var(--bd)",
              color: "var(--tx-muted)",
            }
      }
      aria-pressed={active}
    >
      {label}{" "}
      <span style={{ opacity: active ? 0.7 : 0.5 }}>({count})</span>
    </button>
  );
}

function TypePill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-[10px] uppercase tracking-[0.07em] px-2.5 py-1 rounded-full border transition-all duration-150 whitespace-nowrap cursor-pointer"
      style={
        active
          ? {
              backgroundColor: "rgba(196,168,124,0.12)",
              borderColor: "rgba(196,168,124,0.3)",
              color: "var(--gd)",
            }
          : {
              backgroundColor: "transparent",
              borderColor: "var(--bd)",
              color: "var(--tx-faint)",
            }
      }
      aria-pressed={active}
    >
      {label}{" "}
      <span style={{ opacity: active ? 0.7 : 0.5 }}>({count})</span>
    </button>
  );
}

export default function Discography({ releases, aliases }: DiscographyProps) {
  const [activeAlias, setActiveAlias] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ReleaseType | null>(null);

  // Count aliases across all releases (non-remix primary artists)
  const aliasCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of releases) {
      const primary = r.artist.split(/\s+feat\.?\s+|\s+&\s+|\s+pres\.\s+/i)[0].trim();
      // Only count aliases that appear in the aliases list
      if (aliases.includes(primary)) {
        counts.set(primary, (counts.get(primary) ?? 0) + 1);
      }
    }
    return counts;
  }, [releases, aliases]);

  // Count type occurrences for type pills (across currently alias-filtered set)
  const typeCounts = useMemo(() => {
    const aliasFiltered = activeAlias
      ? releases.filter((r) => {
          const primary = r.artist.split(/\s+feat\.?\s+|\s+&\s+|\s+pres\.\s+/i)[0].trim();
          return primary === activeAlias;
        })
      : releases;

    const counts = new Map<ReleaseType, number>();
    for (const r of aliasFiltered) {
      counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
    }
    return counts;
  }, [releases, activeAlias]);

  // Apply both filters
  const filtered = useMemo(() => {
    return releases.filter((r) => {
      if (activeAlias) {
        const primary = r.artist.split(/\s+feat\.?\s+|\s+&\s+|\s+pres\.\s+/i)[0].trim();
        if (primary !== activeAlias) return false;
      }
      if (activeType && r.type !== activeType) return false;
      return true;
    });
  }, [releases, activeAlias, activeType]);

  // Group filtered by year (descending)
  const byYear = useMemo(() => {
    const map = new Map<number, Release[]>();
    for (const r of filtered) {
      const existing = map.get(r.year) ?? [];
      existing.push(r);
      map.set(r.year, existing);
    }
    // Sort years descending
    return Array.from(map.entries()).sort(([a], [b]) => b - a);
  }, [filtered]);

  const totalCount = releases.length;
  const filteredCount = filtered.length;
  const isFiltered = activeAlias !== null || activeType !== null;

  function handleAliasClick(alias: string) {
    setActiveAlias((prev) => (prev === alias ? null : alias));
    // Reset type filter when switching alias to avoid empty states
    setActiveType(null);
  }

  function handleTypeClick(type: ReleaseType) {
    setActiveType((prev) => (prev === type ? null : type));
  }

  return (
    <div>
      {/* Alias filter row */}
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint mb-2">
          Alias
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by alias">
          <AliasPill
            label="All"
            count={totalCount}
            active={activeAlias === null}
            onClick={() => setActiveAlias(null)}
          />
          {aliases.map((alias) => {
            const count = aliasCounts.get(alias) ?? 0;
            if (count === 0) return null;
            return (
              <AliasPill
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

      {/* Type filter row */}
      <div className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint mb-2">
          Type
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by release type">
          {RELEASE_TYPES.map((type) => {
            const count = typeCounts.get(type) ?? 0;
            if (count === 0) return null;
            return (
              <TypePill
                key={type}
                label={type}
                count={count}
                active={activeType === type}
                onClick={() => handleTypeClick(type)}
              />
            );
          })}
        </div>
      </div>

      {/* Release groups */}
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

      {/* Summary */}
      <p className="font-mono text-[11px] text-text-faint mt-12 text-center">
        {isFiltered
          ? `${filteredCount} release${filteredCount !== 1 ? "s" : ""} shown (filtered from ${totalCount})`
          : `${totalCount} releases`}
      </p>
    </div>
  );
}
