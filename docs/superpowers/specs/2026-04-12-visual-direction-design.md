# Visual Direction Design Spec

Approved visual direction for the Airbase artist website. This document captures every design decision from Phase 0 brainstorming and serves as the source of truth for implementation.

## Design Philosophy

**"High-energy editorial."** The craft and intentionality of print design with the pulse and intensity of dance music. Not a literary magazine. Not a futuristic EDM template. A site that hits hard and looks like an artist built it.

Every detail signals artistry. Bold choices over safe ones. When in doubt, push harder.

## Typography

Three typefaces. Three voices. All Google Fonts.

### Fraunces (Display)

Variable serif with optical sizing. Weight 700-900 for display. Soft, organic serifs that contrast with the classical Airbase wordmark logo. At massive sizes (64-140px), it commands the page. The "voice" of the site.

```
font-family: 'Fraunces', serif;
font-variation-settings: 'opsz' 144;  /* at display sizes */
```

Used for: hero titles, release titles, section headings, pull quotes, large numbers in stats.

### Syne (Body / UI)

Geometric sans-serif designed for the Synesthesie art festival. Angular, assertive, art-world energy. Weight 400-800. The structural voice of the site. Every piece of UI text (nav, buttons, filters, body copy, captions) uses Syne.

```
font-family: 'Syne', sans-serif;
```

Used for: navigation, body text, buttons, filter pills, card descriptions, labels, meta text.

### JetBrains Mono (Metadata)

Monospace for dates, catalog numbers, durations, BPM, technical metadata. Weight 400-600. Used as a deliberate design element, not a fallback. The "index system" of the archive.

```
font-family: 'JetBrains Mono', monospace;
```

Used for: dates, release metadata, stats labels, streaming link labels, player timestamps.

### Type Scale

| Name | Size | Weight | Font | Usage |
|------|------|--------|------|-------|
| hero | clamp(64px, 10vw, 140px) | 900 | Fraunces | Hero title only |
| display-xl | 48px | 900 | Fraunces | Page titles, stats numbers |
| display-lg | 36px | 700 | Fraunces | Section headings |
| display-md | 28px | 700 | Fraunces | Sub-headings, card titles |
| heading | 20-22px | 700 | Fraunces | Card titles, release names |
| body-lg | 18px | 400 | Syne | Article body text |
| body | 16px | 400 | Syne | Default body text |
| body-sm | 14px | 400 | Syne | Captions, secondary text |
| ui | 13-15px | 600-700 | Syne | Nav links, buttons, labels |
| mono | 11-13px | 400-500 | JetBrains Mono | Dates, metadata |
| mono-sm | 10-11px | 500 | JetBrains Mono | Badges, tiny labels |

### Logo

The Airbase wordmark is a classical high-contrast serif SVG. It is the only voice in that tradition. No other font competes with it. In the nav at ~20px height. Fill color adapts to theme (light text on dark, dark text on light).

## Color System

### Dark Theme (Primary)

Dark-first. This is the default and primary experience. The dark base creates stage-like contrast for the fire orange accent.

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#0C0B0A` | Primary background. Near-black with warmth. |
| `bg-card` | `#141210` | Card backgrounds. Subtle lift. |
| `bg-elevated` | `#1A1816` | Modals, player, raised surfaces. |
| `text` | `#EDE7DF` | Primary text. Warm off-white. |
| `text-muted` | `#9A928A` | Secondary text, body descriptions. |
| `text-faint` | `#5A5550` | Tertiary text, inactive nav, placeholders. |
| `accent` | `#E85D26` | Fire orange. Primary accent. Links, buttons, highlights, play buttons. Used assertively. |
| `accent-hover` | `#F06D36` | Hover/active state for accent elements. |
| `accent-glow` | `rgba(232,93,38,0.12)` | Ambient glow behind hero and featured content. |
| `gold` | `#C4A87C` | Badges (Single/Remix/Album), label names. Aged gold. |
| `border` | `rgba(237,231,223,0.04)` | Subtle card borders. Nearly invisible. |
| `border-hover` | `rgba(237,231,223,0.10)` | Card borders on hover. |
| `border-section` | `rgba(237,231,223,0.06)` | Section dividers. |

### Light Theme (Secondary)

Available via toggle. Inverts the energy: warm cream base with the same fire orange punching through.

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#F4EEE8` | Warm cream base. |
| `bg-card` | `#EAE3D9` | Card surfaces. |
| `bg-elevated` | `#FDFBF8` | Raised surfaces. |
| `text` | `#1A1816` | Near-black text. |
| `text-muted` | `#78706A` | Secondary text. |
| `text-faint` | `#A49B93` | Tertiary text. |
| `accent` | `#D4551E` | Slightly darker fire for light backgrounds. |
| `accent-hover` | `#BF4A18` | Hover state. |
| `gold` | `#B09468` | Same gold. |
| `border` | `rgba(26,24,22,0.08)` | Subtle borders. |

## Layout

### Global Structure

- Dark-first default. System preference detection, user toggle in nav.
- Max content width: 1200px for grids, 780px for long-form text.
- Mobile-first. Design for 320px, enhance upward.
- Persistent audio player fixed to bottom viewport.
- Grain texture overlay on body (4-5% opacity noise SVG, fixed, pointer-events none).

### Navigation

Horizontal top bar. Logo (wordmark SVG) left, links right.

Links: **Feed** / **Discography** / **Shows** / **Mixes** / **About** / **Contact**

- Font: Syne, 13px, weight 700, uppercase, letter-spacing 0.12em
- Inactive: text-faint color. Active/hover: text color.
- Mobile: hamburger icon, full-screen overlay menu with large Syne type.
- Theme toggle accessible in nav (icon button).

### Hero Section (Home Page)

The first thing visitors see. Bold, cinematic, confident.

**Desktop:**
- Full viewport height (min-height 85vh)
- Content pushed to bottom (flex, justify-content: flex-end)
- Mono label top: "NEW RELEASE / 2026" in accent color
- Title: Fraunces 900, clamp(64px, 10vw, 140px), line-height 0.88, letter-spacing -0.02em
- Byline: Syne 800, 15px, uppercase, 0.15em spacing, accent color
- Play button (64px circle, accent bg) + streaming links (Syne 700, 13px, uppercase, accent color)
- Meta line: JetBrains Mono 12px, text-faint ("Single / 07:23 / 138 BPM")
- Warm ambient glow: radial gradient in accent-glow color, positioned top-right, blurred 60px, slow pulse animation (6s ease-in-out)
- Gradient accent line below hero: 3px, accent to transparent, left to right

**Mobile (320-768px):**
- Min-height 70vh
- Title scales down via clamp() but stays bold
- Play button + streaming links stack vertically
- Glow still present but scaled to viewport

### Stats Bar

Raw numbers. Confidence through data. Displayed between hero and feed.

Four stats in a horizontal row:
- **25+** Years Active
- **100+** Releases
- **14** Aliases
- **138** BPM

Numbers: Fraunces 900, 48px, accent color. Labels: JetBrains Mono 10px, uppercase, text-faint.

**Mobile:** 2x2 grid or horizontal scroll.

### Feed (Home Page)

Unified reverse-chronological stream below the hero. Four post types, each with distinct visual footprint.

**Header:** "FEED" label (Syne 700, 13px, uppercase, text-faint) + filter pills right-aligned.

**Filter pills:** JetBrains Mono 11px, uppercase, 0.06em spacing, 4px border-radius, border-only default, accent fill on active.

**Grid:** 2 columns on desktop (1.2fr 1fr), 1 column on mobile. 16px gap.

#### Release Card
- Spans 2 rows in grid
- Square artwork area (aspect-ratio 1:1) with abstract placeholder pattern when no artwork
- Badge overlay: top-left, mono 10px, accent bg at 15% opacity
- Below artwork: artist (Syne 11px, uppercase, text-faint), title (Fraunces 700, 20px), label + year (mono 11px, text-faint)
- Streaming links on hover (desktop) or always visible (mobile)

#### Show Card
- Horizontal layout: date block left (Fraunces 900, 44px day + mono 11px month, accent color), info right (venue name Fraunces 700 18px, location Syne 13px text-faint)
- Upcoming shows: accent "Tickets" button (Syne 700, 11px, uppercase, accent bg)
- Border-right on date block for separation

#### Note Card
- Simple text card. Syne 16px body, mono 11px date.
- No title, no artwork. Just text.

#### Article Card
- Title: Fraunces 700, 24px
- Excerpt: Syne 15px, text-muted
- "Read" link: Syne 13px, 700, uppercase, accent color

#### Mix Card
- Similar to release card but horizontal on desktop: artwork/event image left (16:9 or square), title + event name right (Fraunces 700, 18px), date + duration (mono), inline play button (accent circle)
- Tracklist expandable via chevron toggle
- On mobile: stacks vertically

**All cards:**
- bg-card background, 8px border-radius, 1px border
- Hover: translateY(-4px), border brightens to border-hover
- Mobile: single column, full width

### Discography Page

Dense catalog. 25 years of releases. The grid is the design.

- Year headings: Fraunces 900, 48px, text-faint. Typographic landmarks.
- Release grid: 3 columns desktop, 2 tablet, 1 mobile. Consistent card size.
- Each card: square artwork, artist, title, label, type badge, streaming icons on hover.
- Alias filter: horizontal row of toggleable pills at top. Syne 700, uppercase.
- Search: optional text input, JetBrains Mono, subtle.
- Placeholder artwork: abstract pattern using accent + bg colors, not a gray box.

### Mixes Page (/mixes)

Long-form audio: DJ sets, guest mixes, radio recordings.

- Single column layout, max-width 780px
- Each entry: event artwork/image, title (Fraunces 700), event name, date + duration (mono), embedded player (SoundCloud/Mixcloud)
- Optional expandable tracklist
- Chronological, newest first
- Also appears as filter option in feed

### Shows Page

- **Upcoming:** elevated cards with accent border-left, accent date, ticket button. Only shown when upcoming shows exist.
- **Archive:** compact list. Date (mono), venue (Fraunces 600), city/country (Syne, text-muted). Grouped by year if list grows.

### About Page

- Single column, max-width 680px
- Bio in Syne 18px body-lg, 1.6 line-height
- Pull quotes in Fraunces italic, display-md size, accent color
- Optional portrait: large, atmospheric, not a thumbnail
- EPK section or link to /epk at bottom

### EPK Page (/epk)

Professional one-sheet for promoters and press.

- Artist name (wordmark)
- One-line positioning (Fraunces italic)
- 2-3 high-res press photos, downloadable
- Short bio prominent, long bio expandable
- Key achievements (mono bullet list)
- Latest release with embedded player + streaming links
- Booking + press contact
- "Download press kit" button

### Press Page

- Publication name (Fraunces 700), date (mono), pull quote (Fraunces italic, text-muted), external link with arrow
- Simple list, chronological

### Contact Page

- Split: form left (name, email, subject, message), contact info right
- Booking: dj@airbasemusic.com
- General: jezper@airbasemusic.com
- Social links as icon buttons
- Newsletter signup integrated

## Audio Player

Persistent mini-bar fixed to bottom of viewport.

- Height: 60px
- Background: bg-elevated, top border border-section
- Progress bar: 2-3px line at top edge, accent color, grows left to right
- Content: artwork thumbnail (36px, 4px radius) / track title (Syne 14px 600) + artist (mono 11px, text-faint) / time (mono 11px) / play-pause control
- When nothing playing: collapsed to a 2px accent line at bottom (hint that audio exists)
- Expands with 300ms ease-out on first play
- Mobile: same layout but simplified controls

## Texture and Atmosphere

### Grain
SVG noise overlay on body via ::after pseudo-element. 4-5% opacity. Fixed position, covers entire viewport. Gives every surface a physical quality. Pointer-events: none.

### Shadows
Warm-toned: `rgba(12, 11, 10, 0.3)` for dark theme. Cards get subtle shadow on hover.

### Ambient Glow
Radial gradient in accent-glow color behind hero and optionally behind featured content. Blurred 60px. Slow breathe animation (6s). Not on every page, used for emphasis.

### Gradient Accent Lines
3px horizontal lines that fade from accent to transparent. Used as section dividers instead of hairline rules. Energy flows left to right.

## Motion

| Interaction | Motion | Duration | Easing |
|------------|--------|----------|--------|
| Card hover | translateY(-4px) + border brightens | 150ms | ease-out |
| Page load content | Fade up (opacity + translateY 16px) | 400ms | ease-out |
| Feed card stagger | Each card delays | +60ms per card | - |
| Route change | Crossfade | 300ms | ease-in-out |
| Player expand | Height + content fade | 300ms | ease-out |
| Hero glow | Scale + opacity breathe | 6000ms | ease-in-out |
| Link hover | Underline slides in from left | 150ms | ease-out |
| Button hover | Background shifts to accent-hover | 120ms | ease-out |
| Filter pill activate | Background + border color | 120ms | ease-out |
| Stats numbers | Count-up on scroll into view | 800ms | ease-out |

All wrapped in `@media (prefers-reduced-motion: no-preference)`. Without that preference: instant state changes, no animation.

## Newsletter

- **Footer:** inline email field + subscribe button + one line: "New music and updates. Nothing else."
- **Feed callout:** subtle card-sized invitation every 8-10 posts in the feed stream
- Integration: Buttondown or ConvertKit
- Syne for form text, accent color submit button

## Footer

- Social icon links: Spotify, Apple Music, Beatport, SoundCloud, YouTube, Instagram, X, Facebook
- Label scroller: horizontal marquee of label names (JetBrains Mono 11px, uppercase, text-faint). Key labels: Black Hole, Armada, ASOT, In Trance We Trust, Platipus, Flashover, Anjunabeats, High Contrast, Magik Muzik, Discover, Mondo, Moonrising, Intuition
- Newsletter signup
- Copyright line
- Above the persistent player (player is the true bottom)

## Mobile-First Priorities

Most traffic is mobile. Every element must feel just as bold at 320px.

- Hero title scales via clamp() but stays massive relative to screen
- Stats bar: 2x2 grid on mobile
- Feed: single column, full-width cards
- Navigation: hamburger with full-screen overlay, large Syne type
- Player: simplified, always accessible
- Touch targets: 44px minimum
- No horizontal scrolling for content
- Cards stack cleanly
- Filter pills: horizontal scroll if needed, not wrapping

## Accessibility

- WCAG 2.1 AA compliance
- Fire orange (#E85D26) on dark bg (#0C0B0A): passes AA for large text and UI components (3:1 threshold). Not used for small body text. Body text uses #EDE7DF on #0C0B0A which exceeds AA at all sizes.
- Accent color used for large text, interactive elements, and decorative elements only. Never for small body text.
- Focus indicators: 2px solid accent, 2px offset, :focus-visible only
- Skip-to-content link
- Semantic HTML: nav, main, article, section, aside, footer
- All icon-only buttons have aria-label
- Alt text for all images
- Reduced motion respected
- Screen reader friendly navigation and landmarks

## What This Is Not

- Not a literary magazine or writer's blog
- Not neon/futuristic/space/cyber
- Not hipster/vintage/retro
- Not safe, muted, or calm
- Not a generic music website template

This is a site built by an artist who has nothing to prove and everything to share. It hits hard because it's confident, not because it's loud.
