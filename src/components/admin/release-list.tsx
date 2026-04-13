"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Release, ReleaseType } from "@/types/content";
import { releaseSlug, releaseMatchesAlias, KNOWN_ALIASES } from "@/lib/release-utils";
import { DeleteReleaseButton } from "./delete-release-button";
import { SetHeroButton } from "./set-hero-button";

const RELEASE_TYPES: ReleaseType[] = ["Single", "Remix", "Album"];

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-mono text-[12px] uppercase tracking-[0.07em] rounded-full border px-2.5 py-1 transition-all duration-150 whitespace-nowrap cursor-pointer ${
        active
          ? "bg-accent/12 border-accent/30 text-accent"
          : "bg-transparent border-border text-text-muted hover:border-border-hover"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

interface ReleaseListProps {
  releases: Release[];
  heroReleaseIndex: number;
}

export function ReleaseList({ releases, heroReleaseIndex }: ReleaseListProps) {
  const [search, setSearch] = useState("");
  const [activeAlias, setActiveAlias] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ReleaseType | null>(null);

  // Only show aliases that have releases
  const activeAliases = useMemo(() => {
    return KNOWN_ALIASES.filter((alias) =>
      releases.some((r) => releaseMatchesAlias(r, alias))
    );
  }, [releases]);

  const filtered = useMemo(() => {
    return releases
      .map((r, i) => ({ release: r, originalIndex: i }))
      .filter(({ release }) => {
        if (activeAlias && !releaseMatchesAlias(release, activeAlias)) return false;
        if (activeType && release.type !== activeType) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const haystack = `${release.artist} ${release.title} ${release.label}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });
  }, [releases, activeAlias, activeType, search]);

  const isFiltered = activeAlias !== null || activeType !== null || search.trim() !== "";

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search artist, title, or label..."
          className="w-full bg-bg border border-border rounded px-3 py-2 font-body text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Alias pills */}
        <div className="flex flex-wrap gap-1.5">
          <Pill
            label="All"
            active={activeAlias === null}
            onClick={() => setActiveAlias(null)}
          />
          {activeAliases.map((alias) => (
            <Pill
              key={alias}
              label={alias}
              active={activeAlias === alias}
              onClick={() => setActiveAlias((prev) => (prev === alias ? null : alias))}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-border hidden sm:block" />

        {/* Type pills */}
        <div className="flex flex-wrap gap-1.5">
          {RELEASE_TYPES.map((type) => (
            <Pill
              key={type}
              label={type}
              active={activeType === type}
              onClick={() => setActiveType((prev) => (prev === type ? null : type))}
            />
          ))}
        </div>
      </div>

      {/* Count */}
      {isFiltered && (
        <p className="font-mono text-[12px] text-text-faint mb-3">
          {filtered.length} of {releases.length} releases
        </p>
      )}

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-card">
              <th className="px-4 py-3 w-12"></th>
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3">Year</th>
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3">Artist</th>
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3">Title</th>
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3 hidden md:table-cell">Label</th>
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Type</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ release: r, originalIndex: i }) => {
              const isUpcoming = r.date > new Date().toISOString().slice(0, 10);
              return (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-card/50 transition-colors">
                  <td className="px-4 py-2.5 w-12">
                    {r.artwork ? (
                      <img src={r.artwork} alt="" className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-bg-elevated" />
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-xs text-text-muted">{r.year}</span>
                    {isUpcoming && (
                      <span className="ml-1.5 font-mono text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(196,168,124,0.15)", color: "var(--gd)" }}>
                        upcoming
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-body text-sm text-text">{r.artist}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div>
                      <Link
                        href={`/discography/${releaseSlug(r)}`}
                        className="font-body text-sm text-text hover:text-accent transition-colors"
                        target="_blank"
                      >
                        {r.title}
                      </Link>
                      <p className="font-mono text-[12px] text-text-faint mt-0.5">{releaseSlug(r)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 hidden md:table-cell">
                    <span className="font-body text-xs text-text-muted">{r.label}</span>
                  </td>
                  <td className="px-4 py-2.5 hidden sm:table-cell">
                    <span className="font-mono text-[12px] text-gold bg-gold/10 px-1.5 py-0.5 rounded">{r.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <SetHeroButton type="release" index={i} isCurrentHero={heroReleaseIndex === i} />
                      <Link
                        href={`/admin/releases/new?id=${i}`}
                        className="font-body text-xs text-text-muted hover:text-accent transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteReleaseButton
                        index={i}
                        label={`${r.artist} — ${r.title}`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center font-body text-sm text-text-faint">
                  No releases match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
