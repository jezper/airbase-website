# Phase 4: Discography Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/discography` page showing all 108 releases grouped by year (newest first) with alias filtering, in a responsive grid with compact release cards.

**Architecture:** Server component loads all releases and groups by year. Passes data to a client component that handles alias filtering. Each release is a compact card with artwork (or placeholder), type badge, artist, title, label, and streaming links. Year headings are large typographic anchors. The alias filter uses Jezper's own production aliases (not artists he remixed).

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4

**Existing code:**
- `src/lib/releases.ts` — `getAllReleases()`, `getReleasesByYear()`, `getUniqueArtists()`, `releaseSlug()`
- `src/lib/feed.ts` — `getPostsForRelease()` (bidirectional link, for future use)
- `src/types/content.ts` — `Release`, `ReleaseType`, `ReleaseLinks`
- Design tokens in `src/app/globals.css`

**Data:** 108 releases, 20 years (2001-2026), 18 own aliases, 3 types (Single/Remix/Album), 1 with artwork, 107 with placeholder.

**Alias filter logic:** The discography has releases where Jezper is the primary artist (under various aliases like Airbase, Ozone, Rah, etc.) and remixes where someone else is the primary artist. The alias filter shows only Jezper's own aliases. "All" shows everything including remixes. Selecting an alias shows releases where that alias is the primary artist.

---

## File Structure

```
src/
├── app/
│   └── discography/
│       └── page.tsx            # Create: discography page (server component)
├── components/
│   └── discography/
│       ├── discography.tsx     # Create: client component — filter state + rendering
│       ├── release-grid-card.tsx  # Create: compact card for the grid
│       └── year-group.tsx      # Create: year heading + grid of releases
└── lib/
    └── releases.ts            # Modify: add getOwnAliases() function
```

---

### Task 1: Add getOwnAliases to releases loader

**Files:**
- Modify: `src/lib/releases.ts`

- [ ] **Step 1: Add the function**

The known own aliases (from the spec): Airbase, Ozone, Rah, Narthex, The Scarab, First & Andre, Loken, Mono, One Man Army, J., J.L.N.D., Jezper, Inner State, Parc. We derive these from the data: any artist on a non-Remix release is an own alias.

Add to the end of `src/lib/releases.ts`:

```typescript
export async function getOwnAliases(): Promise<string[]> {
  const releases = await getAllReleases();
  const aliases = new Set<string>();
  for (const release of releases) {
    if (release.type !== "Remix") {
      const primary = release.artist.split(/\s+feat\.?\s+|\s+&\s+|\s+pres\.\s+/i)[0].trim();
      aliases.add(primary);
    }
  }
  return Array.from(aliases).sort();
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/releases.ts
git commit -m "feat: getOwnAliases — extract Jezper's production aliases from non-remix releases"
```

---

### Task 2: Compact Release Grid Card

**Files:**
- Create: `src/components/discography/release-grid-card.tsx`

- [ ] **Step 1: Create the card**

Compact card for the discography grid. Square artwork on top, metadata below. No text overlaid on artwork.

Create `src/components/discography/release-grid-card.tsx`:

```typescript
import type { Release } from "@/types/content";

function ArtworkPlaceholder({ title }: { title: string }) {
  const initial = (title[0] ?? "A").toUpperCase();
  return (
    <div
      className="w-full aspect-square flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-card) 50%, var(--bg) 100%)",
      }}
      aria-hidden="true"
    >
      <span
        className="font-display font-black text-5xl leading-none select-none opacity-[0.06]"
        style={{ color: "var(--ac)" }}
      >
        {initial}
      </span>
    </div>
  );
}

export default function ReleaseGridCard({ release }: { release: Release }) {
  const { artist, title, type, label, year, artwork, links } = release;

  const firstLink = links.spotify ?? links.beatport ?? links.soundcloud ?? links.apple ?? links.smartlink;

  return (
    <article className="bg-bg-card rounded-lg border border-border hover:border-border-hover hover:-translate-y-1 transition-all duration-150 overflow-hidden group">
      {/* Square artwork */}
      <div className="w-full aspect-square overflow-hidden">
        {artwork ? (
          <img
            src={artwork}
            alt={`${title} by ${artist}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <ArtworkPlaceholder title={title} />
        )}
      </div>

      {/* Metadata */}
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className="font-mono text-[9px] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-sm"
            style={{ backgroundColor: "rgba(232,93,38,0.15)", color: "var(--ac)" }}
          >
            {type}
          </span>
          <span className="font-mono text-[10px] text-text-faint">{year}</span>
        </div>
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.08em] text-text-faint truncate">
          {artist}
        </p>
        <h3 className="font-display text-sm font-bold leading-tight text-text group-hover:text-accent transition-colors truncate">
          {firstLink ? (
            <a href={firstLink} target="_blank" rel="noopener noreferrer">{title}</a>
          ) : (
            title
          )}
        </h3>
        <p className="font-mono text-[10px] text-text-faint truncate mt-0.5">{label}</p>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/discography/release-grid-card.tsx
git commit -m "feat: compact release grid card for discography"
```

---

### Task 3: Year Group Component

**Files:**
- Create: `src/components/discography/year-group.tsx`

- [ ] **Step 1: Create the year group**

Large year heading as a typographic anchor, then a responsive grid of release cards.

Create `src/components/discography/year-group.tsx`:

```typescript
import type { Release } from "@/types/content";
import ReleaseGridCard from "./release-grid-card";

export default function YearGroup({ year, releases }: { year: number; releases: Release[] }) {
  return (
    <section aria-label={`Releases from ${year}`}>
      <h2
        className="font-display text-5xl md:text-6xl font-black text-text-faint mb-6"
        style={{ fontVariationSettings: "'opsz' 144" }}
      >
        {year}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {releases.map((release, i) => (
          <ReleaseGridCard key={`${release.title}-${i}`} release={release} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/discography/year-group.tsx
git commit -m "feat: year group component — large year heading + release grid"
```

---

### Task 4: Discography Client Component (with alias filter)

**Files:**
- Create: `src/components/discography/discography.tsx`

- [ ] **Step 1: Create the client component**

Manages filter state and renders year groups with filtered releases.

Create `src/components/discography/discography.tsx`:

```typescript
"use client";

import { useState, useMemo } from "react";
import type { Release } from "@/types/content";
import YearGroup from "./year-group";

interface DiscographyProps {
  releases: Release[];
  aliases: string[];
}

export default function Discography({ releases, aliases }: DiscographyProps) {
  const [activeAlias, setActiveAlias] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = releases;
    if (activeAlias) {
      result = result.filter((r) =>
        r.artist.toLowerCase().includes(activeAlias.toLowerCase())
      );
    }
    if (activeType) {
      result = result.filter((r) => r.type === activeType);
    }
    return result;
  }, [releases, activeAlias, activeType]);

  // Group filtered releases by year
  const byYear = useMemo(() => {
    const map = new Map<number, Release[]>();
    for (const r of filtered) {
      const existing = map.get(r.year) ?? [];
      existing.push(r);
      map.set(r.year, existing);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b - a);
  }, [filtered]);

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-10 space-y-3">
        {/* Alias pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveAlias(null)}
            className={`font-mono text-[11px] uppercase tracking-[0.06em] px-4 py-1.5 rounded whitespace-nowrap transition-all ${
              activeAlias === null
                ? "text-accent border border-transparent"
                : "text-text-faint border border-border hover:border-border-hover hover:text-text-muted"
            }`}
            style={activeAlias === null ? {
              backgroundColor: "rgba(232,93,38,0.12)",
              borderColor: "rgba(232,93,38,0.3)",
            } : undefined}
          >
            All ({releases.length})
          </button>
          {aliases.map((alias) => {
            const count = releases.filter((r) =>
              r.artist.toLowerCase().includes(alias.toLowerCase())
            ).length;
            return (
              <button
                key={alias}
                onClick={() => setActiveAlias(activeAlias === alias ? null : alias)}
                className={`font-mono text-[11px] uppercase tracking-[0.06em] px-4 py-1.5 rounded whitespace-nowrap transition-all ${
                  activeAlias === alias
                    ? "text-accent border border-transparent"
                    : "text-text-faint border border-border hover:border-border-hover hover:text-text-muted"
                }`}
                style={activeAlias === alias ? {
                  backgroundColor: "rgba(232,93,38,0.12)",
                  borderColor: "rgba(232,93,38,0.3)",
                } : undefined}
              >
                {alias} ({count})
              </button>
            );
          })}
        </div>

        {/* Type pills */}
        <div className="flex gap-1.5">
          {(["Single", "Remix", "Album"] as const).map((type) => {
            const count = filtered.filter((r) => r.type === type).length;
            if (count === 0) return null;
            return (
              <button
                key={type}
                onClick={() => setActiveType(activeType === type ? null : type)}
                className={`font-mono text-[10px] uppercase tracking-[0.06em] px-3 py-1 rounded whitespace-nowrap transition-all ${
                  activeType === type
                    ? "text-gold border border-transparent"
                    : "text-text-faint border border-border hover:border-border-hover hover:text-text-muted"
                }`}
                style={activeType === type ? {
                  backgroundColor: "rgba(196,168,124,0.12)",
                  borderColor: "rgba(196,168,124,0.3)",
                } : undefined}
              >
                {type}s ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Year groups */}
      <div className="space-y-16">
        {byYear.length === 0 ? (
          <p className="text-center text-text-faint font-body py-16">
            No releases match this filter.
          </p>
        ) : (
          byYear.map(([year, yearReleases]) => (
            <YearGroup key={year} year={year} releases={yearReleases} />
          ))
        )}
      </div>

      {/* Summary */}
      <p className="font-mono text-[11px] text-text-faint text-center mt-12">
        {filtered.length} release{filtered.length !== 1 ? "s" : ""} shown
        {activeAlias || activeType ? " (filtered)" : ""}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/discography/discography.tsx
git commit -m "feat: discography client component with alias and type filters"
```

---

### Task 5: Discography Page

**Files:**
- Create: `src/app/discography/page.tsx`

- [ ] **Step 1: Create the page**

Server component that loads data and passes to the client component.

Create `src/app/discography/page.tsx`:

```typescript
import type { Metadata } from "next";
import { getAllReleases, getOwnAliases } from "@/lib/releases";
import Discography from "@/components/discography/discography";

export const metadata: Metadata = {
  title: "Discography — Airbase",
  description: "Complete discography of Airbase (Jezper Söderlund) — 25 years of trance music across 14 aliases.",
};

export default async function DiscographyPage() {
  const [releases, aliases] = await Promise.all([
    getAllReleases(),
    getOwnAliases(),
  ]);

  return (
    <div className="px-6 md:px-12 py-12">
      <h1 className="font-display text-5xl md:text-6xl font-black leading-tight mb-2">
        Discography
      </h1>
      <p className="font-body text-[15px] text-text-muted mb-10 max-w-prose">
        {releases.length} releases across {new Set(releases.map(r => r.year)).size} years
        and {aliases.length} aliases.
      </p>

      <Discography releases={releases} aliases={aliases} />
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run `npm run build`. Expected: builds with `/discography` route.

Visit http://localhost:3001/discography. Verify:
- Page title renders
- All 108 releases shown grouped by year (2026 at top, 2001 at bottom)
- Year headings are large typographic anchors
- Grid: 2 columns mobile, 3 tablet, 4 desktop
- Alias pills filter correctly
- Type pills filter correctly
- Cards show artwork placeholder, badge, artist, title, label
- The one release with artwork (Everything Else Could Wait) shows the actual image
- Both themes work

- [ ] **Step 3: Commit**

```bash
git add src/app/discography/page.tsx
git commit -m "feat: Phase 4 complete — discography page with year groups, alias + type filters"
```

---

## Verification Checklist

- [ ] `npm run build` passes with `/discography` route
- [ ] 108 releases displayed, grouped by 20 years
- [ ] Year headings: large Fraunces, text-faint
- [ ] Grid: 2-col mobile, 3-col tablet, 4-col desktop
- [ ] Alias filter shows own aliases only (not remixed artists)
- [ ] Clicking alias filters the grid
- [ ] Type filter (Singles/Remixes/Albums) works
- [ ] Filters combine (alias + type)
- [ ] Release count updates with filters
- [ ] Cards: artwork/placeholder, type badge, artist, title, label
- [ ] Everything Else Could Wait shows actual cover art
- [ ] Hover effects on cards
- [ ] Nav link to /discography works
- [ ] Page title in browser tab: "Discography — Airbase"
- [ ] Dark and light themes both work
- [ ] Mobile responsive at 320px
