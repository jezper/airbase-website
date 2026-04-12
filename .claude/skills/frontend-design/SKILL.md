---
description: Frontend aesthetics and implementation guidelines for the Airbase website. Covers typography, color, motion, texture, spatial composition. Subordinate to ux-ui-design — UX/UI principles override when there is a conflict.
when_to_use: Use when implementing visual components, styling, animations, or any frontend code that affects appearance.
---

# Frontend Design — Aesthetics & Implementation

> **Subordinate to /ux-ui-design.** If any guidance here conflicts with UX/UI principles, the UX/UI skill wins.

## Typography
- Fonts define the personality. Must be beautiful, distinctive, and warm.
- Never use: Inter, Roboto, Arial, system fonts, Space Grotesk, Poppins.
- Pair a characterful display font (serif or slab-serif) with a refined humanist sans-serif body font.
- Typography should feel like an independent design magazine cover, not a SaaS landing page.

## Color & Theme
- Commit to the warm palette in docs/DESIGN-TOKENS.md.
- Dominant warm tones with sharp terracotta accents. No timid, evenly-distributed palettes.
- CSS variables for consistency. Both themes must feel intentional, not just "inverted."
- Dark mode: dimly lit studio, not spaceship cockpit.

## Motion & Interaction
- Restraint over spectacle. Smooth, purposeful transitions. No particle effects, no parallax.
- High-impact moments: well-orchestrated page load with staggered reveals over scattered micro-interactions.
- Hover states feel tactile, like pressing into paper.
- Scroll-triggered reveals for feed cards. Subtle, not dramatic.
- All motion wrapped in @media (prefers-reduced-motion: no-preference).

## Spatial Composition
- Generous negative space. Dense discography needs room to breathe.
- Content max-width: 720px for long-form text, 1200px for grid layouts.
- Consider asymmetry and editorial layout. Not every card same size.
- Feed has visual rhythm: different post types create different shapes.

## Backgrounds & Visual Details
- Atmosphere and depth. Grain texture overlay (subtle noise 3-5% opacity) is foundational.
- Warm-toned shadows, never cool gray or blue.
- No glossy gradients. Any gradients extremely subtle warm-to-warm.
- Dividers: thin (1px) horizontal rules, not heavy separators.
- Card surfaces feel physical. Subtle shadows, slight background differentiation.

## What to Avoid (Non-Negotiable)
- Generic AI aesthetics: cookie-cutter layouts, predictable patterns, purple gradients on white
- Space/galaxy/futuristic/neon themes
- Overused fonts (Inter, Roboto, system defaults)
- Cliché music website patterns (giant hero image centered text, dark-only)
- Hipster/vintage/retro-filter aesthetics
- Flat, textureless surfaces
