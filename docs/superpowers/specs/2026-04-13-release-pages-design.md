# Individual Release Pages

## Overview

Each release in the discography gets its own page at `/discography/[slug]`. The slug is generated from the release title using the existing `releaseSlug()` utility. Pages are statically generated at build time.

## Data Sources

All data already exists, no new content structures needed.

- **Release data:** from `content/releases/discography.json` via `getAllReleases()` / `getReleaseBySlug()`
- **Related release:** resolved via the `relatedRelease` slug field on the Release type
- **Related posts:** via `getPostsForRelease()` in `src/lib/feed.ts` (already exists)

## Route

`src/app/discography/[slug]/page.tsx`

Uses `generateStaticParams()` to pre-render all release pages at build time. Each release's slug is computed from its title.

## Layout

Two-column on desktop (`md:grid-cols-2`), single column stacked on mobile.

### Top Section (two columns)

**Left column:**
- Artwork, square aspect ratio, rounded corners, shadow
- Placeholder pattern (existing `ArtworkPlaceholder` component) when no artwork

**Right column, top to bottom:**
1. Type badge (Single / Remix / Album) in accent color, same style as feed cards
2. Label name and year (separated, not dashed)
3. Artist name in accent color, bold uppercase
4. Release title in display font, large (text-4xl to text-5xl range)
5. Related release link if present: "Original: Artist - Title (year)" linking to `/discography/[related-slug]`
6. Tracklist as a numbered list. Font-body, normal weight. Track numbers in mono, muted.
7. Streaming links row: platform name buttons matching existing style (bold uppercase, accent color, external links)

### Bottom Section (full width)

**Related posts:** Any posts from `posts.json` that have `releaseRef` matching this release's slug.

- Heading: "From the feed" (small mono label, same style as feed section header)
- Uses existing `NoteCard` and `ArticleCard` components
- If no related posts, this section is omitted entirely

## Discography Listing Changes

The existing release cards on `/discography` become clickable links to `/discography/[slug]`. Wrap each card in a Next.js `Link`. The listing page otherwise stays the same.

## SEO

Each release page gets:
- `<title>`: "Artist - Title | Airbase"
- `<meta description>`: "{type} on {label} ({year}). {track count} tracks."
- Open Graph image: artwork if available

## No New Dependencies

Everything needed already exists:
- `releaseSlug()` in `src/lib/release-utils.ts`
- `getReleaseBySlug()` in `src/lib/releases.ts`
- `getPostsForRelease()` in `src/lib/feed.ts`
- `NoteCard`, `ArticleCard` components in `src/components/feed/`
- Artwork placeholder in `src/components/feed/release-context.tsx` (extract to shared if needed)

## Future

- Guestbook / "What does this release mean to you" submissions (requires database layer, email verification, moderation). Deferred to a later phase.
