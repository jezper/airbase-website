---
description: UX and UI design principles for the Airbase website. The ruling design authority. Use when building any page, component, layout, or interaction. Overrides frontend-design when there is a conflict.
when_to_use: Use this skill whenever creating, modifying, or reviewing any visual component, page layout, interaction pattern, or accessibility feature.
---

# UX & UI Design — Ruling Authority

> **This skill overrides all other design guidance when there is a conflict.** No technical shortcut, generic pattern, or implementation convenience overrides UX and UI quality.

## Design Thinking Process

Before writing any component or page code, work through these:

1. **Purpose:** What does this page or component help the visitor do?
2. **Tone:** "Analog warmth meets editorial precision." Organic, not futuristic. Textured, not flat. Confident, not flashy.
3. **Differentiation:** Typography and texture carry the personality. This should feel like a print designer built an electronic music artist's website.
4. **Constraints:** WCAG 2.1 AA. Mobile-first. Both light and dark themes.

## UX Principles

### Information Architecture
- The feed (home page) is the center of gravity. Everything flows from there.
- Release posts auto-populate Discography. Show posts auto-populate Shows. Data entered once.
- Navigation is minimal: Feed, Discography, Shows, About, Contact. No dropdowns, no mega-menus.
- Each page has a single clear purpose. No competing CTAs.

### Content Hierarchy
- Most important content visible without scrolling on desktop.
- Dates and metadata in monospace, visually secondary to titles and body text.
- Streaming links are icon buttons, not text links. Compact and recognizable.
- Release type badges (Single / Remix / Album) use pill shapes and muted accent colors.

### Mobile-First
- Design for 320px first, then enhance.
- Touch targets minimum 44x44px.
- Feed cards stack cleanly. No horizontal scrolling for content.
- Navigation collapses to hamburger with full-screen overlay.

### Accessibility as Design
- Accessibility shapes every decision, not a checklist at the end.
- Focus indicators visible and styled to match design language (not default browser blue).
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`.
- Skip-to-content link, visually hidden until focused.
- Every icon-only button has an `aria-label`.
- Color choices verified for contrast in both themes before committing.

### State Design
- Empty states: warm language ("No upcoming shows right now. Follow along for announcements."), never blank.
- Loading states: skeleton screens matching card shapes, using bg-alt color.
- Error states: friendly, human language. Never raw error messages.

## Feed Post Type UX

Each post type has a distinct visual footprint:

**Note (tweet-like):**
- Compact. No title. Text-forward with optional image and link.
- Quick and informal, a thought shared in passing.
- Date in monospace, small.

**Article:**
- Taller card. Title in display font. Excerpt in body font. Optional cover image.
- Clear "Read more" affordance (link or arrow, not a button).
- Feels like a magazine article preview.

**Release:**
- Artwork-forward. Square cover art (or patterned placeholder) as dominant visual.
- Metadata (artist, label, type) secondary. Streaming icons compact.
- Type badge visible. Year visible.
- Feels like a record in a shop.

**Show:**
- Date formatted large and bold (day + month) as anchor visual.
- Venue and location secondary. Ticket link if upcoming.
- Upcoming shows get accent color treatment.
- Feels like a calendar entry with personality.

### Discography Page UX
- Grouped by year. Year headings large, visual anchors when scrolling.
- Alias filter: discoverable but not dominant. Horizontal row of toggleable tags.
- Artwork thumbnails where available. Consistent placeholder pattern where not.
- Clicking a release expands inline or opens detail view. Don't force a page load for browsing.

### Shows Page UX
- Two sections: Upcoming (prominent) and Archive (newest first).
- Upcoming shows visually elevated: different background, accent border, ticket button.
- Archive more compact. Historical record, not promotion.
- Shows without exact dates display gracefully with approximate year.

## Component Design Checklist

Before shipping any component, verify:

- [ ] Works in both light and dark themes
- [ ] Looks correct at 320px, 768px, 1024px, 1440px
- [ ] Has appropriate hover/focus/active states
- [ ] Touch targets are 44px+ on mobile
- [ ] Text meets contrast ratios (4.5:1 body, 3:1 large)
- [ ] Animations respect prefers-reduced-motion
- [ ] Uses semantic HTML elements
- [ ] Icon-only interactive elements have aria-label
- [ ] Feels like it belongs in this design system (warm, editorial, textured)
