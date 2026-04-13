# Spotify Enrichment Script

## Overview

A CLI script that uses the Spotify Web API to enrich the discography with tracklists, compilation appearances, and artwork. Complements the existing Odesli enrichment script (which handles cross-platform streaming links).

## Credentials

- Auth: Client Credentials flow (no user login)
- Env vars: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` in `.env.local`
- Token endpoint: `https://accounts.spotify.com/api/token`
- Token is valid for 1 hour, script refreshes if needed

## Spotify Artist ID

Airbase: `0DgL6pCI4mC68FVMPlzx3L` (from the existing footer link)

Note: Airbase has multiple aliases. The script starts with this artist ID but also searches by title+artist for releases under other aliases that may not be linked to this Spotify artist profile.

## Script Location

`scripts/enrich-spotify.ts`

Run: `npx tsx scripts/enrich-spotify.ts`

Loads env from `.env.local` via `dotenv/config` (add `dotenv` as dev dependency).

## What It Enriches

### 1. Tracklists

For releases where `tracks` is empty or has fewer tracks than Spotify reports:
- Search Spotify: `GET /v1/search?q=artist:Airbase+album:{title}&type=album`
- Match by normalized title comparison
- Fetch tracks: `GET /v1/albums/{id}/tracks`
- Write track names to the `tracks` array

Does not overwrite existing non-empty tracklists.

### 2. Compilation Appearances

New field on Release: `appearsOn?: { title: string; year: number; label?: string }[]`

Approach:
- Fetch all "appears_on" albums for the artist: `GET /v1/artists/{id}/albums?include_groups=appears_on&limit=50` (paginated)
- For each compilation album, fetch its tracks: `GET /v1/albums/{id}/tracks`
- Match track names against our discography releases
- When a match is found, add the compilation to that release's `appearsOn` array

Matching logic: normalize both track titles (lowercase, strip remix/mix suffixes, strip parentheticals) and compare. Accept fuzzy matches above a threshold to handle slight naming differences.

### 3. Artwork

For releases where `artwork` is null:
- Use the matched Spotify album's `images` array
- Download the largest available image (typically 640x640)
- Save to `/public/artwork/{slug}.jpg`
- Set the `artwork` field on the release

Does not overwrite existing artwork.

### 4. Spotify Links

For releases missing a `links.spotify` value:
- If we matched a Spotify album, store its external URL
- Complements the Odesli script (which also does this, but may miss some)

## Rate Limiting

Spotify allows ~30 requests/second for Client Credentials. The script uses a conservative 200ms delay between requests. For ~109 releases plus compilation lookups, total runtime should be under 2 minutes.

If rate limited (HTTP 429), the script reads the `Retry-After` header and waits.

## Matching Strategy

Releases in our discography may not have exact title matches on Spotify. The script uses:

1. **Exact match first**: Normalized title comparison (lowercase, trimmed)
2. **Contains match**: Our title appears within the Spotify album title or vice versa
3. **Artist search fallback**: For non-Airbase aliases, search by `artist:{alias}+album:{title}`

Aliases to search: all entries from `KNOWN_ALIASES` in `src/lib/release-utils.ts`.

## Data Shape Change

```typescript
// Added to Release interface in src/types/content.ts
appearsOn?: { title: string; year: number; label?: string }[];
```

## Display Change

The release page (`/discography/[slug]`) gets an "Appears on" section below the tracklist, showing compilation names and years. Simple list, no links (compilations don't have their own pages).

## Safety

- Safe to re-run: skips releases that already have tracklists, artwork, and appearsOn data
- Writes updated `discography.json` at the end (single write, not per-release)
- Logs progress to stdout: `[1/109] Airbase - Medusa (Darren Porter Remix) ... 0 tracks added, 2 compilations found`
- Dry-run mode: `--dry-run` flag logs what would change without writing

## Dependencies

New dev dependency: `dotenv` (for loading `.env.local` in scripts)
