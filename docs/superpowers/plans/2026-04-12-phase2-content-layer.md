# Phase 2: Content Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the TypeScript type system and content loading utilities so all pages can access discography (108 releases), shows (8 seed entries), press (3 entries), and the about page MDX content.

**Architecture:** File-based content system. JSON files are read at build time via Node.js `fs` and typed with TypeScript interfaces. MDX content is loaded via next-mdx-remote for server-side rendering. All content functions are async and designed for Next.js App Router server components (no "use client").

**Tech Stack:** TypeScript, next-mdx-remote, gray-matter (frontmatter parsing), Node.js fs/promises

**Reference data:**
- `content/releases/discography.json` — 108 releases, fields: year, artist, title, type (Single/Remix/Album), label, tracks[], links{}, date, artwork
- `content/shows/shows.json` — 8 shows, fields: venue, city, country, date (nullable), year_approx, event, notes, status
- `content/press/press.json` — 3 entries, fields: title, publication, date, url, pullQuote, context
- `content/pages/about.mdx` — Bio content, no frontmatter

---

## File Structure

```
src/
├── types/
│   └── content.ts          # All content type definitions
└── lib/
    ├── releases.ts         # Load and query discography data
    ├── shows.ts            # Load and query shows data
    ├── press.ts            # Load press data
    └── mdx.ts              # Load and render MDX pages
```

---

### Task 1: Install MDX Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

```bash
npm install next-mdx-remote gray-matter
```

- [ ] **Step 2: Verify installation**

```bash
npm ls next-mdx-remote gray-matter
```

Expected: Both packages listed without errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install next-mdx-remote and gray-matter"
```

---

### Task 2: Content Type Definitions

**Files:**
- Create: `src/types/content.ts`

- [ ] **Step 1: Create the type definitions**

Create `src/types/content.ts`:

```typescript
/* ── Release (Discography) ── */

export type ReleaseType = "Single" | "Remix" | "Album";

export interface ReleaseLinks {
  spotify?: string;
  beatport?: string;
  youtube?: string;
  soundcloud?: string;
  apple?: string;
  smartlink?: string;
  [key: string]: string | undefined; // handles apple_1, apple_2, etc.
}

export interface Release {
  year: number;
  artist: string;
  title: string;
  type: ReleaseType;
  label: string;
  tracks: string[];
  links: ReleaseLinks;
  date: string;        // ISO date string "YYYY-MM-DD"
  artwork: string | null;
}

/* ── Show ── */

export type ShowStatus = "upcoming" | "past" | "cancelled";

export interface Show {
  venue: string;
  city: string;
  country: string;
  date: string | null;       // ISO date or null for approximate dates
  year_approx: string | null; // e.g. "2000s", "2005"
  event: string | null;
  notes: string | null;
  status: ShowStatus;
}

/* ── Press ── */

export interface PressFeature {
  title: string;
  publication: string;
  date: string | null;
  url: string;
  pullQuote: string | null;
  context: string | null;
}

/* ── MDX Page ── */

export interface MDXPage {
  content: string;          // Raw MDX string
  frontmatter: Record<string, unknown>;
}

/* ── Feed Post Types (for Phase 3) ── */

export type PostType = "note" | "article" | "release" | "show" | "mix";

export interface FeedPost {
  type: PostType;
  date: string;
  slug: string;
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/content.ts
git commit -m "feat: content type definitions — Release, Show, PressFeature, MDXPage"
```

---

### Task 3: Releases Content Loader

**Files:**
- Create: `src/lib/releases.ts`

- [ ] **Step 1: Create the releases loader**

Create `src/lib/releases.ts`:

```typescript
import { promises as fs } from "fs";
import path from "path";
import type { Release } from "@/types/content";

const DATA_PATH = path.join(process.cwd(), "content/releases/discography.json");

let cachedReleases: Release[] | null = null;

export async function getAllReleases(): Promise<Release[]> {
  if (cachedReleases) return cachedReleases;
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const data: Release[] = JSON.parse(raw);
  // Sort by date descending (newest first)
  data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  cachedReleases = data;
  return data;
}

export async function getReleasesByYear(): Promise<Map<number, Release[]>> {
  const releases = await getAllReleases();
  const byYear = new Map<number, Release[]>();
  for (const release of releases) {
    const existing = byYear.get(release.year) ?? [];
    existing.push(release);
    byYear.set(release.year, existing);
  }
  return byYear;
}

export async function getReleasesByArtist(artist: string): Promise<Release[]> {
  const releases = await getAllReleases();
  return releases.filter(
    (r) => r.artist.toLowerCase().includes(artist.toLowerCase())
  );
}

export async function getUniqueArtists(): Promise<string[]> {
  const releases = await getAllReleases();
  const artists = new Set<string>();
  for (const release of releases) {
    // Extract the primary alias (before "feat." or "&")
    const primary = release.artist.split(/\s+feat\.?\s+|\s+&\s+/i)[0].trim();
    artists.add(primary);
  }
  return Array.from(artists).sort();
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Quick smoke test — create a temporary test page**

Create `src/app/test-content/page.tsx`:

```typescript
import { getAllReleases, getUniqueArtists } from "@/lib/releases";

export default async function TestContent() {
  const releases = await getAllReleases();
  const artists = await getUniqueArtists();

  return (
    <div className="p-8 font-mono text-sm text-text">
      <h1 className="font-display text-2xl mb-4">Content Test</h1>
      <p>Total releases: {releases.length}</p>
      <p>Unique artists: {artists.length}</p>
      <p>First release: {releases[0]?.title} ({releases[0]?.year})</p>
      <p>Last release: {releases[releases.length - 1]?.title} ({releases[releases.length - 1]?.year})</p>
      <h2 className="mt-4 mb-2 font-bold">Artists:</h2>
      <ul>{artists.map((a) => <li key={a}>{a}</li>)}</ul>
    </div>
  );
}
```

Run `npm run dev` and visit http://localhost:3001/test-content. Verify: shows 108 releases, lists all unique artist aliases.

- [ ] **Step 4: Commit (without test page)**

Delete the test page, then commit:

```bash
rm -rf src/app/test-content
git add src/lib/releases.ts
git commit -m "feat: releases content loader — getAllReleases, getReleasesByYear, getUniqueArtists"
```

---

### Task 4: Shows Content Loader

**Files:**
- Create: `src/lib/shows.ts`

- [ ] **Step 1: Create the shows loader**

Create `src/lib/shows.ts`:

```typescript
import { promises as fs } from "fs";
import path from "path";
import type { Show } from "@/types/content";

const DATA_PATH = path.join(process.cwd(), "content/shows/shows.json");

let cachedShows: Show[] | null = null;

export async function getAllShows(): Promise<Show[]> {
  if (cachedShows) return cachedShows;
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const data: Show[] = JSON.parse(raw);
  cachedShows = data;
  return data;
}

export async function getUpcomingShows(): Promise<Show[]> {
  const shows = await getAllShows();
  return shows.filter((s) => s.status === "upcoming");
}

export async function getPastShows(): Promise<Show[]> {
  const shows = await getAllShows();
  return shows
    .filter((s) => s.status === "past")
    .sort((a, b) => {
      // Sort by date if available, otherwise by year_approx
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      // Put entries with exact dates first
      if (a.date && !b.date) return -1;
      if (!a.date && b.date) return 1;
      // Both approximate: sort by year_approx string
      return (b.year_approx ?? "").localeCompare(a.year_approx ?? "");
    });
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/shows.ts
git commit -m "feat: shows content loader — getAllShows, getUpcomingShows, getPastShows"
```

---

### Task 5: Press Content Loader

**Files:**
- Create: `src/lib/press.ts`

- [ ] **Step 1: Create the press loader**

Create `src/lib/press.ts`:

```typescript
import { promises as fs } from "fs";
import path from "path";
import type { PressFeature } from "@/types/content";

const DATA_PATH = path.join(process.cwd(), "content/press/press.json");

let cachedPress: PressFeature[] | null = null;

export async function getAllPress(): Promise<PressFeature[]> {
  if (cachedPress) return cachedPress;
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const data: PressFeature[] = JSON.parse(raw);
  // Sort by date descending, nulls last
  data.sort((a, b) => {
    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return 0;
  });
  cachedPress = data;
  return data;
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/press.ts
git commit -m "feat: press content loader — getAllPress"
```

---

### Task 6: MDX Page Loader

**Files:**
- Create: `src/lib/mdx.ts`

- [ ] **Step 1: Create the MDX loader**

Create `src/lib/mdx.ts`:

```typescript
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { MDXPage } from "@/types/content";

const PAGES_DIR = path.join(process.cwd(), "content/pages");

export async function getMDXPage(slug: string): Promise<MDXPage> {
  const filePath = path.join(PAGES_DIR, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    content,
    frontmatter: data,
  };
}

export async function renderMDXPage(slug: string) {
  const filePath = path.join(PAGES_DIR, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf-8");
  const { content, frontmatter } = await compileMDX<Record<string, unknown>>({
    source: raw,
    options: { parseFrontmatter: true },
  });
  return { content, frontmatter };
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: No errors. If there are type issues with next-mdx-remote and React 19, add type assertions as needed.

- [ ] **Step 3: Commit**

```bash
git add src/lib/mdx.ts
git commit -m "feat: MDX page loader — getMDXPage, renderMDXPage"
```

---

### Task 7: Integration Verification

**Files:**
- Create: `src/app/test-content/page.tsx` (temporary, deleted after verification)

- [ ] **Step 1: Create a test page that loads all content types**

Create `src/app/test-content/page.tsx`:

```typescript
import { getAllReleases, getUniqueArtists, getReleasesByYear } from "@/lib/releases";
import { getAllShows, getUpcomingShows, getPastShows } from "@/lib/shows";
import { getAllPress } from "@/lib/press";
import { renderMDXPage } from "@/lib/mdx";

export default async function TestContent() {
  const releases = await getAllReleases();
  const artists = await getUniqueArtists();
  const byYear = await getReleasesByYear();
  const shows = await getAllShows();
  const upcoming = await getUpcomingShows();
  const past = await getPastShows();
  const press = await getAllPress();
  const about = await renderMDXPage("about");

  return (
    <div className="p-8 font-mono text-sm text-text bg-bg min-h-screen">
      <h1 className="font-display text-3xl text-accent mb-6">Content Layer Test</h1>

      <section className="mb-6">
        <h2 className="font-body text-lg font-bold mb-2">Releases</h2>
        <p>Total: {releases.length}</p>
        <p>Unique artists/aliases: {artists.length}</p>
        <p>Years covered: {Array.from(byYear.keys()).sort().join(", ")}</p>
        <p>Types: {[...new Set(releases.map((r) => r.type))].join(", ")}</p>
      </section>

      <section className="mb-6">
        <h2 className="font-body text-lg font-bold mb-2">Shows</h2>
        <p>Total: {shows.length}</p>
        <p>Upcoming: {upcoming.length}</p>
        <p>Past: {past.length}</p>
      </section>

      <section className="mb-6">
        <h2 className="font-body text-lg font-bold mb-2">Press</h2>
        <p>Total: {press.length}</p>
        {press.map((p) => (
          <p key={p.url}>{p.publication}: {p.title}</p>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="font-body text-lg font-bold mb-2">About (MDX)</h2>
        <div className="prose prose-invert max-w-prose">
          {about.content}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Run and verify**

Visit http://localhost:3001/test-content. Verify:
- 108 releases loaded
- Artist aliases listed
- 8 shows (0 upcoming, 8 past)
- 3 press entries
- About page MDX renders as HTML

- [ ] **Step 3: Run the build**

```bash
npm run build
```

Expected: Build passes with no errors. Both `/` and `/test-content` generated.

- [ ] **Step 4: Delete test page and commit**

```bash
rm -rf src/app/test-content
git add -A
git commit -m "feat: Phase 2 complete — content layer verified with all data sources"
```

---

## Verification Checklist

- [ ] `npm run build` passes
- [ ] All 108 releases load from discography.json
- [ ] Releases sort by date descending
- [ ] getReleasesByYear groups correctly
- [ ] getUniqueArtists extracts primary aliases
- [ ] All 8 shows load from shows.json
- [ ] getUpcomingShows / getPastShows filter correctly
- [ ] All 3 press entries load from press.json
- [ ] About MDX page renders to React components
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Types match actual data shapes in JSON files
