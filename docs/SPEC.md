# Airbase Artist Website — Project Specification

## Overview

A personal artist website for **Airbase** (Jezper Söderlund), a Swedish trance producer and DJ active since the mid-1990s. The site replaces the current WordPress site at airbasemusic.com and is built for deployment on Vercel with Git version control.

The site is not a typical electronic music artist site. It deliberately avoids the cliché trance/EDM aesthetic of space imagery, futuristic neon, and dark cyber themes. Instead, it leans into warmth, organic texture, and editorial craft — a site that feels like it was designed by someone who cares about design, not by someone who Googled "DJ website template."

---

## Design Direction

### Aesthetic: "Analog Warmth Meets Editorial Precision"

Think: the tactile quality of a vinyl sleeve, the typography of an independent magazine, the warmth of a well-lit studio. Not hipster, not retro-nostalgic — contemporary and confident, but with texture and soul.

**Core principles:**
- Warm, organic color palette. Cream/off-white base tones, muted earth accents (terracotta, sage, warm gray, aged gold). Dark mode option should feel like a dimly lit studio, not a spaceship cockpit.
- Typographic-led design. A distinctive serif or slab-serif display font paired with a clean humanist sans-serif body font. Typography carries the personality.
- Texture over flatness. Subtle grain overlays, paper-like backgrounds, gentle shadows that suggest physicality. Nothing glossy or clinical.
- Generous whitespace. Let content breathe. The discography is dense — the layout should give it room.
- Motion with restraint. Smooth page transitions, subtle scroll reveals, hover states that feel tactile. No particle effects, no parallax gimmicks.
- Photography-forward where available. Artwork and images should be treated as editorial content, not thumbnails.

**What to avoid:**
- Purple/blue neon gradients
- Space/galaxy backgrounds
- Geometric wireframe aesthetics
- "Futuristic" sans-serif everything
- Generic music website templates
- Hipster/vintage/retro-filter aesthetics

### Logo

The existing Airbase logo (SVG provided separately) is the one constant. It should be used as-is. The logo is a wordmark in a clean style — it works well against both light and dark backgrounds.

### Color System (starting point, refine during design)

```
--color-bg:         #F5F0EB    /* warm cream */
--color-bg-alt:     #EDE6DD    /* slightly deeper warm */
--color-text:       #2C2826    /* warm near-black */
--color-text-muted: #7A716A    /* warm gray */
--color-accent:     #C4784A    /* terracotta */
--color-accent-alt: #8B9A7E    /* sage */
--color-gold:       #B8A07A    /* aged gold, for labels/badges */
--color-border:     #D9D2CA    /* subtle warm border */

/* Dark mode */
--color-bg-dark:         #1E1C1A
--color-bg-alt-dark:     #2A2725
--color-text-dark:       #E8E2DA
--color-text-muted-dark: #9A928A
```

### Typography

Font selection is a design task, not a default. Claude Code will act as typographic designer in Phase 1a and select a pairing that embodies the site's warmth and editorial character. See CLAUDE-CODE-INSTRUCTIONS.md for the full process, criteria, and candidate list.

The only hard rules:
- A distinctive serif or slab-serif display font with real personality
- A warm humanist sans-serif body font optimized for screen reading
- A monospace for dates and metadata
- No Inter, Roboto, Arial, system fonts, Space Grotesk, or Poppins
- All fonts from Google Fonts

---

## Tech Stack

### Framework: Next.js 14+ (App Router)

- **Why:** SSG for performance, App Router for modern patterns, excellent Vercel integration, built-in image optimization, MDX support. The site is mostly static content with a lightweight admin layer.
- **Rendering:** Static Site Generation (SSG) for all public pages. ISR (Incremental Static Regeneration) where dynamic content warrants it.
- **Styling:** Tailwind CSS with a custom theme configuration matching the design system above. CSS variables for theming/dark mode.
- **Content:** File-based content system using MDX and JSON data files. No external CMS dependency.
- **Deployment:** Vercel. Automatic deployments from Git pushes.
- **Language:** TypeScript throughout.

### Content Architecture

All content lives in the repository under `/content/`:

```
/content/
  /posts/           # Blog/feed posts (MDX files)
  /releases/        # Discography entries (JSON or MDX)
  /shows/           # Performance entries (JSON)
  /press/           # Press features and links (JSON)
  /pages/           # Static pages like bio (MDX)
```

### Admin Interface

A lightweight, password-protected admin UI at `/admin` that provides:
- A form-based editor for creating new posts (with post-type selector)
- Rich text editing via a lightweight editor component (Tiptap or similar)
- Image upload (stored in `/public/uploads/` or a Vercel Blob store)
- Preview before publish
- Fields adapt based on post type (release posts get extra fields for streaming links, label, artwork; show posts get venue, city, country, date fields)

The admin writes content files to the repository (via Git API or local filesystem during dev). This keeps the site fully static and deployable.

---

## Site Structure

### Navigation

Persistent top navigation, minimal:
- **Logo** (left, links to home)
- **Feed** (home/blog)
- **Discography**
- **Shows**
- **About**
- **Contact**

Mobile: hamburger menu with full-screen overlay.

### Pages

#### 1. Feed (Home) — `/`

The start page. A reverse-chronological feed of all post types, visually distinguished:

**Post types:**

| Type | Visual treatment | Fields |
|------|-----------------|--------|
| **Note** | Compact, tweet-like card. No title required. Shows text, optional image, optional link. | body, image?, link?, date |
| **Article** | Larger card with title, excerpt, read-more link. | title, body (MDX), excerpt, coverImage?, date |
| **Release** | Artwork-forward card. Shows cover art, track name, artist, label, type badge (Single/Remix/Album), streaming links. Auto-populates to Discography. | title, artist, type, label, year, artwork?, streamingLinks{}, date |
| **Show** | Event-style card. Date prominent, venue, city/country, optional ticket link, optional status (upcoming/past/cancelled). Auto-populates to Shows. | venue, city, country, date, ticketLink?, status, notes? |

All four types flow in one unified feed. Each has a distinct visual shape/layout so they're scannable. Filter pills at the top: All / Notes / Articles / Releases / Shows.

#### 2. Discography — `/discography`

Auto-populated from Release posts. Grouped by year (newest first). Each entry shows:
- Artwork (if available, placeholder pattern if not)
- Release type badge (Single / Remix / Album)
- Artist name — Alias (important: shows which alias, e.g. "Ozone" or "Airbase")
- Track title(s) as links
- Label name
- Streaming links (Spotify, Beatport, YouTube — icon buttons)

**Alias filter:** A subtle filter bar or toggle to view by alias. Default shows all. The aliases are: Airbase, Ozone, Rah, Narthex, The Scarab, First & Andre, Loken, Mono, One Man Army, J., J.L.N.D., Jezper, Inner State, Parc.

**Search:** Optional text search across titles, artists, labels.

#### 3. Shows — `/shows`

Auto-populated from Show posts. Two sections:
- **Upcoming** (if any exist, prominently displayed with ticket links)
- **Archive** (chronological, newest first)

Each entry: date, venue, city, country, optional notes. Minimal but clean.

#### 4. About — `/about`

The bio page. Content from the rewritten bio (see BIO.md in this package). Structured as:
- A strong opening paragraph (who Airbase is, in his own voice)
- Career narrative, broken into readable sections
- Notable facts woven in naturally (trance.nu co-founder, Sensation Belgium anthem, Slashat podcast, Steve Jobs email)
- A closing that reflects his current mindset (from the Beatportal interview voice)

Optional: a portrait photo if available.

#### 5. Press — `/press`

A simple list of press features, interviews, and notable mentions. Each entry:
- Title/headline
- Publication name
- Date
- Link (external)
- Optional pull quote

Pre-populated with the Beatportal interview.

#### 6. Contact — `/contact`

A simple contact form (name, email, subject, message) that sends via a serverless function (e.g., Resend, SendGrid, or Vercel's email integration). Also shows:
- Booking email: dj@airbasemusic.com
- General: jezper@airbasemusic.com
- Social links

---

## Global Elements

### Footer

- Social icon links: Spotify, Apple Music, Beatport, SoundCloud, YouTube, Instagram, X (Twitter), Facebook
- Copyright line
- **Label scroller:** A horizontal scrolling or marquee strip showing logos/names of notable labels Airbase has released on. Key labels: Black Hole Recordings, Armada Music, A State Of Trance, In Trance We Trust, Platipus, Flashover Recordings, Intuition Recordings, Anjunabeats, High Contrast Recordings, Magik Muzik, Discover, Mondo Records, Moonrising Records

### Dark/Light Mode Toggle

Accessible toggle in the nav. Respects system preference by default.

### Meta / SEO

- Open Graph tags for all pages
- Structured data (JSON-LD) for MusicGroup, MusicRecording, Event
- Sitemap generation
- Canonical URLs

### Accessibility

- WCAG 2.1 AA compliance minimum
- Semantic HTML throughout
- Keyboard navigable (all interactive elements)
- Focus indicators that match the design language (not default browser blue)
- Skip-to-content link
- Alt text for all images
- Color contrast ratios verified for both themes
- Reduced motion media query respected (disable animations)
- ARIA labels where semantic HTML isn't sufficient
- Screen reader friendly navigation and landmark regions

---

## Content Data

### Initial Discography Data

See `DISCOGRAPHY.json` in this package — the complete discography from 2001-2026, structured and ready for import.

### Initial Shows Data

See `SHOWS.json` — a seed file with confirmed historical performances (from bio, Wikipedia, and known events). This will be incomplete and is designed to be grown over time.

### Bio Content

See `BIO.md` — a rewritten bio using the Beatportal interview voice as source material.

---

## Build Phases (for Claude Code)

### Phase 1: Foundation
- Next.js project setup with TypeScript, Tailwind, App Router
- Design system: colors, typography, spacing tokens in Tailwind config
- Layout components: Nav, Footer, Page wrapper
- Dark/light mode theming
- Basic responsive grid

### Phase 2: Content Layer
- Content schemas (TypeScript types for Post, Release, Show, Press)
- File-based content loading utilities
- MDX configuration
- Initial content files imported from data package

### Phase 3: Feed (Home Page)
- Feed page with unified post stream
- Card components for each post type (Note, Article, Release, Show)
- Filter pills
- Pagination or infinite scroll

### Phase 4: Discography
- Discography page with year grouping
- Release cards with artwork, streaming links
- Alias filter
- Artwork fetching (where possible from Spotify/external sources)

### Phase 5: Shows
- Shows page with upcoming/archive split
- Show entry component

### Phase 6: Static Pages
- About page with bio content
- Press page
- Contact page with form + serverless email function

### Phase 7: Admin Interface
- Protected `/admin` route (simple password auth or session-based)
- Post creation form with type selector
- Rich text editor (Tiptap)
- Image upload
- Preview mode
- Git-based content persistence (writes to content directory)

### Phase 8: Polish & Accessibility
- Animation and transitions
- Label scroller in footer
- SEO meta tags, structured data, sitemap
- Accessibility audit and fixes
- Performance optimization (image lazy loading, code splitting)
- Lighthouse score targets: 95+ across all categories

### Phase 9: Artwork & External Links
- Script to attempt Spotify API artwork fetching for discography entries
- Populate Beatport and YouTube links where discoverable
- Fallback artwork pattern/placeholder design

### Phase 10: Deployment
- Vercel project configuration
- Domain setup (airbasemusic.com)
- Environment variables
- CI/CD via Git

---

## File Manifest

This spec package contains:

| File | Purpose |
|------|---------|
| `SPEC.md` | This document — full project specification |
| `BIO.md` | Rewritten bio content |
| `DISCOGRAPHY.json` | Complete discography data (2001-2026) |
| `SHOWS.json` | Seed data for historical performances |
| `PRESS.json` | Initial press/features data |
| `DESIGN-TOKENS.md` | Detailed design system reference |
| `ADMIN-SPEC.md` | Admin interface specification |
| `CLAUDE-CODE-INSTRUCTIONS.md` | Instructions and skills for the Claude Code agent |
