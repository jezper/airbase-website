# Build Guide — Airbase Website

## Before You Start

Read the skills in `.claude/skills/` and understand the hierarchy:
- `/ux-ui-design` is the ruling authority for all design decisions
- `/frontend-design` handles aesthetics, subordinate to UX/UI
- `/visual-brainstorm` is Phase 0, run before any code

Read the docs: SPEC.md, DESIGN-TOKENS.md, ADMIN-SPEC.md.

## Tech Stack (decided)

- Next.js 14+ with App Router, TypeScript
- Tailwind CSS with custom theme
- File-based content (MDX + JSON in /content/)
- Password-protected /admin with Tiptap editor
- Vercel deployment

## Build Order

**Phase 0 is a conversation, not code.** Do not write any code until the user has approved the visual direction.

---

### Phase 0: Visual Direction

Run `/visual-brainstorm`. That skill has the full process. No code until approved.

---

### Phase 1: Foundation (code starts here)

- `npx create-next-app@latest airbase-website --typescript --tailwind --app --src-dir`
- Configure tailwind.config.ts with design system from Phase 0 (using DESIGN-TOKENS.md as base, with refinements)
- CSS variables for light/dark theming
- Layout components: Nav, Footer, PageWrapper
- Dark/light mode toggle with system preference detection
- Grain/texture overlay from Phase 0
- Google Fonts with the pairing chosen in Phase 0
- Verify: renders with correct colors, fonts, theme toggle works

### Phase 2: Content Layer

- TypeScript types in /src/types/: Post (union: Note | Article | Release | Show), Release, Show, PressFeature
- Content loading utils in /src/lib/content.ts: getAllPosts(), getReleases(), getShows(), getPress()
- MDX configuration (next-mdx-remote or similar)
- Import initial data from content/releases/discography.json, content/shows/shows.json, content/press/press.json, content/pages/about.mdx
- Verify: content loads without errors

### Phase 3: Feed (Home Page)

- Feed page with unified post stream (reverse chronological)
- Card components for each post type (Note, Article, Release, Show) — follow /ux-ui-design skill for each type's UX
- Filter pills (All / Notes / Articles / Releases / Shows)
- Pagination or infinite scroll

### Phase 4: Discography

- Discography page with year grouping
- Release cards with artwork, streaming links
- Alias filter (horizontal toggleable tags)
- Artwork fetching where possible

### Phase 5: Shows

- Shows page with upcoming/archive split
- Show entry component
- Graceful handling of approximate dates

### Phase 6: Static Pages

- About page with bio content
- Press page
- Contact page with form + serverless email

### Phase 7: Admin Interface

- Protected /admin route (simple password auth)
- Post creation form with type selector
- Rich text editor (Tiptap)
- Image upload
- Preview mode
- Content file persistence

### Phase 8: Polish & Accessibility

- Animation and transitions (per /frontend-design skill)
- Label scroller in footer
- SEO meta tags, structured data, sitemap
- Accessibility audit against /ux-ui-design checklist
- Performance optimization
- Lighthouse targets: 95+ all categories

### Phase 9: Artwork & External Links

- Script to fetch Spotify API artwork for discography
- Populate Beatport and YouTube links
- Fallback artwork placeholder design

### Phase 10: Deployment

- Vercel project configuration
- Domain setup (airbasemusic.com)
- Environment variables
- CI/CD via Git

---

## Testing Checklist (after each phase)

- [ ] `npm run build` completes without errors
- [ ] `npm run dev` serves locally
- [ ] All pages render correctly
- [ ] Dark/light mode works
- [ ] No console errors
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] Keyboard navigation works
- [ ] Run /ux-ui-design component checklist on all new components

## Key Third-Party Packages

- next-mdx-remote — MDX rendering
- gray-matter — frontmatter parsing
- @tiptap/react + extensions — rich text editor
- lucide-react — icons
- next-themes — dark/light mode
- resend or @sendgrid/mail — contact form email

## Writing Style

No em dashes. Direct, conversational, unpretentious. No AI phrases ("delve into," "it's worth noting," "in conclusion"). Short sentences. Clear language.
