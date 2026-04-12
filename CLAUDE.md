# Airbase Artist Website

Personal website for Airbase (Jezper Söderlund), Swedish trance producer and DJ. Replaces WordPress site at airbasemusic.com. Vercel + Git.

## Skills (.claude/skills/)

Three project skills. The hierarchy matters:

1. **`/ux-ui-design`** — THE RULING SKILL. UX and UI principles override all other design decisions.
2. **`/frontend-design`** — Aesthetics and implementation. Subordinate to /ux-ui-design.
3. **`/visual-brainstorm`** — Phase 0 creative direction conversation. Run before any code.

## Project Docs

@./docs/SPEC.md
@./docs/DESIGN-TOKENS.md
@./docs/ADMIN-SPEC.md
@./docs/BUILD-GUIDE.md

## Content Data (content/, mirrors production)

- `content/releases/discography.json` — Complete discography, 100+ entries (2001-2026)
- `content/shows/shows.json` — Seed data for historical performances
- `content/press/press.json` — Initial press features
- `content/pages/about.mdx` — Rewritten bio

## Tech Stack

- Next.js 14+ (App Router), TypeScript, Tailwind CSS
- File-based content (MDX + JSON in /content/)
- Password-protected /admin with Tiptap editor
- Vercel deployment, domain: airbasemusic.com

## Showcase Additions (beyond original spec)

The original spec is strong on archive and editorial content but light on what makes an artist website a showcase. These additions fill the gaps:

1. **Audio Presence** - The site should let visitors hear the music without leaving. A persistent mini-player (footer-anchored) with featured tracks, and inline play buttons on release cards. Source: embedded SoundCloud/Spotify previews or self-hosted clips. The player should feel integrated with the design language, not bolted on.

2. **Hero Landing** - The home page needs a strong visual entry point before the feed begins. A hero section featuring the latest release (artwork, title, play button, streaming links) or a moody atmospheric image with the Airbase wordmark. This rotates or updates with new featured content. The feed lives below it.

3. **Mixes and Sets** - A new content type and page (`/mixes`) for DJ mixes, guest mixes, radio show recordings, and live sets. These are separate from the discography (studio releases). Each entry: title, event/show name, date, duration, tracklist (optional), embed (SoundCloud/Mixcloud), download link (optional). Also appears as a filter option in the feed.

4. **Newsletter Signup** - An email capture component. Appears inline in the footer and optionally as a subtle callout on the feed page. Integration with a service like Buttondown, Mailchimp, or ConvertKit. Simple: email field, subscribe button, one-line pitch ("New music and occasional updates. No spam.").

5. **EPK (Electronic Press Kit)** - A `/epk` page or a downloadable section within `/about`. Contains: high-res press photos (downloadable), short and long bio versions, tech rider (if applicable), booking contact, notable achievements summary, embed of latest track. Designed for promoters and journalists who need assets fast.

## Key Rules

- Start with `/visual-brainstorm` before any code. No exceptions.
- `/ux-ui-design` overrides `/frontend-design` on any conflict.
- No em dashes in any writing. Direct, conversational tone. No AI phrases.
- WCAG 2.1 AA accessibility is non-negotiable.
- This site must NOT look like a typical electronic music website. No space/neon/futuristic. Warm, organic, editorial.
