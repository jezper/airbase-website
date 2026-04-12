# Design Tokens — Airbase Website

## Philosophy

The design system is rooted in "analog warmth meets editorial precision." Every token should contribute to a feeling of tactile quality, as if the site were printed on fine paper and then brought to life with subtle motion.

---

## Color Palette

### Light Theme

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#F5F0EB` | Primary background. Warm cream, like unbleached paper. |
| `bg-alt` | `#EDE6DD` | Card backgrounds, alternating sections. |
| `bg-elevated` | `#FFFFFF` | Modals, dropdowns, tooltips — raised surfaces. |
| `text` | `#2C2826` | Primary text. Warm near-black, never pure #000. |
| `text-muted` | `#7A716A` | Secondary text, captions, metadata. |
| `text-faint` | `#A49B93` | Placeholder text, disabled states. |
| `accent` | `#C4784A` | Terracotta. Primary accent for links, buttons, highlights. |
| `accent-hover` | `#A8623A` | Darker terracotta for hover states. |
| `accent-alt` | `#8B9A7E` | Sage green. Secondary accent for tags, badges. |
| `gold` | `#B8A07A` | Aged gold. Label badges, special callouts. |
| `border` | `#D9D2CA` | Subtle borders, dividers. |
| `border-strong` | `#B5ADA4` | Stronger borders for emphasis. |

### Dark Theme

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#1E1C1A` | Primary background. Warm dark, like aged leather. |
| `bg-alt` | `#2A2725` | Card backgrounds. |
| `bg-elevated` | `#343130` | Raised surfaces. |
| `text` | `#E8E2DA` | Primary text. Warm off-white. |
| `text-muted` | `#9A928A` | Secondary text. |
| `text-faint` | `#6B6460` | Placeholder, disabled. |
| `accent` | `#D4895A` | Lighter terracotta for dark backgrounds. |
| `accent-hover` | `#E09A6B` | Hover state. |
| `accent-alt` | `#9AAD8E` | Lighter sage. |
| `gold` | `#C8B08A` | Lighter gold. |
| `border` | `#3D3A38` | Subtle borders. |
| `border-strong` | `#524F4C` | Stronger borders. |

---

## Typography

### Font Stack

The font pairing is selected during Phase 1a of the build (see CLAUDE-CODE-INSTRUCTIONS.md). The implementing agent acts as typographic designer and commits to a pairing that meets the design criteria: warm, editorial, distinctive, readable.

Once selected, define as:
```css
--font-display: '[Selected Display Font]', 'Georgia', serif;
--font-body: '[Selected Body Font]', 'Helvetica Neue', sans-serif;
--font-mono: 'JetBrains Mono', 'Menlo', monospace;
```

**Constraints (non-negotiable):**
- No Inter, Roboto, Arial, system fonts, Space Grotesk, or Poppins
- Display font must have visible character and warmth (serif or slab-serif preferred)
- Body font must be a humanist sans-serif (warm, not geometric)
- All fonts from Google Fonts
- See CLAUDE-CODE-INSTRUCTIONS.md Phase 1a for the full selection process and candidate list

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| `display-xl` | 3rem (48px) | 700 | 1.1 | Hero headings, page titles |
| `display-lg` | 2.25rem (36px) | 700 | 1.15 | Section headings |
| `display-md` | 1.75rem (28px) | 600 | 1.2 | Sub-section headings |
| `heading` | 1.25rem (20px) | 600 | 1.3 | Card titles, sidebar headings |
| `body-lg` | 1.125rem (18px) | 400 | 1.6 | Article body text |
| `body` | 1rem (16px) | 400 | 1.6 | Default body text |
| `body-sm` | 0.875rem (14px) | 400 | 1.5 | Captions, metadata |
| `mono` | 0.8125rem (13px) | 400 | 1.5 | Dates, technical metadata |

### Font loading

Use `font-display: swap` for all custom fonts. Load via Google Fonts or self-hosted WOFF2 for performance.

---

## Spacing

Based on a 4px grid with Tailwind defaults:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight internal padding |
| `sm` | 8px | Between inline elements |
| `md` | 16px | Standard padding, card gutters |
| `lg` | 24px | Section padding on mobile |
| `xl` | 32px | Card spacing |
| `2xl` | 48px | Section gaps |
| `3xl` | 64px | Major section separators |
| `4xl` | 96px | Page-level vertical rhythm |

---

## Borders & Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Buttons, tags, small elements |
| `radius-md` | 8px | Cards, input fields |
| `radius-lg` | 12px | Modals, larger containers |
| `radius-full` | 9999px | Pill shapes, avatar circles |

Border width: 1px default, using `border` color tokens.

---

## Shadows

Warm-toned shadows, never cool gray or blue:

```css
--shadow-sm: 0 1px 2px rgba(44, 40, 38, 0.06);
--shadow-md: 0 4px 12px rgba(44, 40, 38, 0.08);
--shadow-lg: 0 8px 24px rgba(44, 40, 38, 0.12);
--shadow-xl: 0 16px 48px rgba(44, 40, 38, 0.16);
```

---

## Texture & Atmosphere

- **Grain overlay:** A subtle noise texture applied to the background via CSS (pseudo-element with a tiny noise SVG or PNG at low opacity ~3-5%). Gives the "printed paper" feel.
- **No glossy gradients.** Any gradients should be extremely subtle, warm-to-warm transitions.
- **Dividers:** Prefer thin (1px) horizontal rules in `border` color over heavy separators.

---

## Motion

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| Hover transitions | 200ms | `ease-out` | Color, opacity, transform changes |
| Card reveals | 400ms | `ease-out` | Scroll-triggered fade-up |
| Page transitions | 300ms | `ease-in-out` | Route changes |
| Stagger delay | 50-80ms | — | Between items in a list |

**Reduced motion:** All animations wrapped in `@media (prefers-reduced-motion: no-preference)`. Fallback: instant state changes, no movement.

---

## Component Patterns

### Post Cards

Each post type has a distinct silhouette in the feed:

- **Note:** Compact, borderless, text-forward. Resembles a tweet. Date in mono font.
- **Article:** Taller card with optional cover image, title in display font, excerpt in body. Clear "Read more" affordance.
- **Release:** Square artwork thumbnail (or patterned placeholder) on the left, metadata on the right. Streaming link icons. Type badge (Single/Remix/Album) in `gold` or `accent-alt`.
- **Show:** Date formatted large and bold on the left (day/month), venue and location on the right. Upcoming shows get the `accent` color treatment.

### Buttons

- **Primary:** `accent` background, white text, `radius-sm`, subtle shadow on hover.
- **Secondary:** Transparent with `accent` border and text.
- **Ghost:** Text-only with underline on hover.
- **Icon buttons:** For streaming links — circular, subtle background on hover.

### Tags/Badges

- Release type badges: Pill-shaped, `mono` font, `accent-alt` or `gold` background at 15% opacity with matching text color.
- Alias filter tags: Same style, toggleable.

---

## Responsive Breakpoints

| Name | Min-width | Usage |
|------|-----------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

Content max-width: `720px` for article/bio text, `1200px` for grid layouts.

---

## Accessibility Tokens

- Focus ring: 2px solid `accent`, 2px offset. Visible on keyboard navigation only (`:focus-visible`).
- Minimum touch target: 44x44px on mobile.
- Color contrast: All text/background combinations must meet WCAG AA (4.5:1 for body text, 3:1 for large text).
- Skip link: Visually hidden until focused, then positioned at top of viewport.
