---
description: Accessibility audit and enforcement for the Airbase website. Covers contrast, legibility, keyboard navigation, screen readers, and motion. Run as a checkpoint after building any component or page.
argument-hint: (no arguments)
when_to_use: Use after building any new component, page, or layout change. Also use before any commit that touches visual styling.
---

# Accessibility — Non-Negotiable Quality Gate

> **WCAG 2.1 AA is the minimum.** Every component, every page, every interaction.

## The Contract

This site is dark-first with a fire orange accent (#E85D26). That's a bold palette. Bold doesn't mean inaccessible. Every design choice must clear these bars.

## Color Contrast

### Rules

| Text type | Minimum ratio | How to check |
|-----------|--------------|--------------|
| Body text (text on bg) | 4.5:1 | #EDE7DF on #0C0B0A = ~16:1. Passes. |
| Muted text (text-muted on bg) | 4.5:1 | #9A928A on #0C0B0A = ~5.5:1. Passes. |
| Faint text (text-faint on bg) | 3:1 for UI, not for body | #5A5550 on #0C0B0A = ~2.8:1. FAILS for body. OK for decorative/non-essential only. |
| Accent on bg (large text/UI) | 3:1 | #E85D26 on #0C0B0A. Verify. Use for headings and interactive elements only. |
| Accent on bg (small body text) | 4.5:1 | May not pass. Never use accent for small body text. |
| Light theme: text on bg | 4.5:1 | #1A1816 on #F4EEE8. Verify. |
| Light theme: accent on bg | 3:1 | #D4551E on #F4EEE8. Verify for large text/UI. |

### text-faint: Use With Care

`text-faint` (#5A5550) on dark bg does NOT meet 4.5:1 for body text. It is only acceptable for:
- Decorative text (label scroller, background elements)
- Placeholder text in inputs
- Disabled states
- Non-essential metadata that is also conveyed another way

If information is important and only conveyed through text-faint, the color must be upgraded to text-muted.

### Always Verify Both Themes

Every contrast check must pass in BOTH dark and light mode. A color that passes on dark may fail on light, and vice versa.

## Typography and Legibility

- Body text minimum 16px (1rem). Never smaller for readable content.
- Line height minimum 1.5 for body text, 1.3 for headings.
- Maximum line length: 80 characters (max-w-prose handles this).
- Monospace metadata (JetBrains Mono) at small sizes (11-13px) is acceptable for dates and labels but must meet contrast requirements.
- Font weight: Syne at 400 weight is legible at 16px+. Below 14px, increase to 500.

## Keyboard Navigation

### Every interactive element must be:
- Focusable via Tab key
- Activatable via Enter (links, buttons) or Space (buttons, toggles)
- Visually indicated when focused (focus ring: 2px solid accent, 2px offset, :focus-visible only)

### Focus order must be logical:
- Skip-to-content link first
- Navigation links left to right
- Main content top to bottom
- Footer links

### Trap focus in modals:
- Mobile menu overlay must trap focus (Tab cycles within the overlay)
- Escape key closes the overlay
- Focus returns to the trigger button on close

## Screen Readers

### Semantic HTML first:
- `<nav>` for navigation
- `<main>` for primary content
- `<article>` for feed posts
- `<section>` with `aria-label` when the section has no visible heading
- `<footer>` for footer
- `<h1>` through `<h6>` in logical order (never skip levels)

### ARIA when HTML isn't enough:
- Icon-only buttons: `aria-label="Play"`, `aria-label="Open menu"`, etc.
- Theme toggle: `aria-label` changes based on current state
- Mobile menu: `role="dialog"`, `aria-modal="true"`
- Filter pills: use `role="tablist"` / `role="tab"` with `aria-selected`
- Live regions: use `aria-live="polite"` for content that updates (e.g., filter results count)

### Announce dynamic changes:
- When filters change feed content, announce the result count
- When theme toggles, the button label updates (screen reader picks this up)
- When audio player starts, announce track name

## Motion and Animation

### prefers-reduced-motion:
- ALL animations wrapped in `@media (prefers-reduced-motion: no-preference)` or `motion-safe:` Tailwind prefix
- When reduced motion is preferred: instant state changes, no movement, no glow pulse
- The grain overlay is static and doesn't need motion gating
- Page transitions: crossfade is acceptable even with reduced motion (it's opacity, not movement)

### No motion that conveys meaning:
- Don't rely on animation to communicate state (e.g., "pulsing means loading")
- All states must be understandable without animation

## Images and Media

- Every `<img>` has descriptive `alt` text
- Decorative images: `alt=""` and `aria-hidden="true"`
- Release artwork: alt text is "{Artist} - {Title} album artwork"
- Logo SVG: `role="img"` and `aria-label="Airbase"`
- Audio player: all controls labeled, track info readable by screen reader

## Touch Targets

- Minimum 44x44px for all interactive elements on mobile
- This applies to: nav links (use padding), play button, streaming links, filter pills, theme toggle, social links, form inputs, player controls
- Small text links in the footer: wrap in sufficient padding

## Component Checklist

Run this against every component before shipping:

- [ ] Contrast passes in dark theme (check each text color against its background)
- [ ] Contrast passes in light theme
- [ ] Keyboard focusable and operable
- [ ] Focus indicator visible and styled (not default browser blue)
- [ ] Touch targets 44px+ on mobile
- [ ] Semantic HTML used (no div soup)
- [ ] Icon-only elements have aria-label
- [ ] Headings in logical order
- [ ] Works with prefers-reduced-motion
- [ ] Tested at 200% browser zoom (content doesn't break or overlap)
- [ ] No information conveyed by color alone (use shape, text, or icon too)

## Page-Level Checklist

Run this after assembling a complete page:

- [ ] Skip-to-content link works
- [ ] Page has exactly one `<h1>`
- [ ] Heading hierarchy is logical (h1 > h2 > h3, no skips)
- [ ] Landmark regions present (nav, main, footer)
- [ ] Tab order follows visual order
- [ ] No keyboard traps (except intentional modal traps with Escape exit)
- [ ] Page title is descriptive (`<title>Discography — Airbase</title>`)
- [ ] Language attribute on `<html>` (`lang="en"`)
