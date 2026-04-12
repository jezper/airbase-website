# Phase 7: Admin Interface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a password-protected admin at `/admin` for managing posts (notes, articles), releases, shows, and press entries. Content model: releases and shows are standalone entities; posts can reference them.

**Architecture:** Next.js App Router with a dedicated `/admin` route group. Simple password auth via server actions + HTTP-only cookie. Admin reads/writes JSON files in `/content/`. No database. Tiptap for rich text editing in articles. All admin pages are client components behind auth middleware.

**Tech Stack:** Next.js 16 server actions, iron-session (encrypted cookies), @tiptap/react + extensions, Tailwind CSS v4

**Content model recap:**
- Posts (notes/articles) live in `content/posts/` as JSON (for now, MDX later)
- Releases live in `content/releases/discography.json`
- Shows live in `content/shows/shows.json`
- Press lives in `content/press/press.json`
- Posts can reference releases/shows via `releaseRef`/`showRef` + `featured` flag

---

## File Structure

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx              # Admin layout with sidebar nav
│       ├── page.tsx                # Dashboard (redirect to posts)
│       ├── login/
│       │   └── page.tsx            # Login form
│       ├── posts/
│       │   ├── page.tsx            # Posts list
│       │   └── new/
│       │       └── page.tsx        # Create/edit post
│       ├── releases/
│       │   ├── page.tsx            # Releases list
│       │   └── new/
│       │       └── page.tsx        # Create/edit release
│       ├── shows/
│       │   ├── page.tsx            # Shows list
│       │   └── new/
│       │       └── page.tsx        # Create/edit show
│       └── press/
│           ├── page.tsx            # Press list
│           └── new/
│               └── page.tsx        # Create/edit press entry
├── lib/
│   ├── auth.ts                     # Session config, login/logout actions
│   └── content-writer.ts           # Write content to JSON files
└── components/
    └── admin/
        ├── admin-sidebar.tsx        # Sidebar navigation
        ├── post-form.tsx            # Note/article form with optional release/show ref
        ├── release-form.tsx         # Release entity form
        ├── show-form.tsx            # Show entity form
        ├── press-form.tsx           # Press entry form
        └── tiptap-editor.tsx        # Tiptap rich text editor
```

---

### Task 1: Install Admin Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

```bash
npm install iron-session @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder @tiptap/pm
```

- [ ] **Step 2: Create .env.local with admin password**

```bash
echo 'ADMIN_PASSWORD=airbase-admin-2026' > .env.local
echo 'SESSION_SECRET=change-this-to-a-random-32-char-string-in-production' >> .env.local
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install iron-session and tiptap for admin"
```

Do NOT commit .env.local (it's in .gitignore).

---

### Task 2: Authentication — Session + Login

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/admin/login/page.tsx`

- [ ] **Step 1: Create auth utilities**

Create `src/lib/auth.ts`:

```typescript
"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface SessionData {
  isLoggedIn: boolean;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET ?? "fallback-secret-change-in-production-32chars!",
  cookieName: "airbase-admin",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true;
}

export async function login(password: string): Promise<{ success: boolean; error?: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return { success: false, error: "ADMIN_PASSWORD not configured" };
  }
  if (password !== adminPassword) {
    return { success: false, error: "Wrong password" };
  }
  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();
  return { success: true };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
```

- [ ] **Step 2: Create login page**

Create `src/app/admin/login/page.tsx` as a client component with a form that calls the login server action. On success, redirect to /admin. On failure, show error. Simple password field + submit button. Use the site's design tokens for styling (bg-bg, text-text, etc.).

- [ ] **Step 3: Commit**

```bash
git add src/lib/auth.ts src/app/admin/login/page.tsx
git commit -m "feat: admin auth — iron-session login with password"
```

---

### Task 3: Admin Layout + Sidebar

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/admin-sidebar.tsx`

- [ ] **Step 1: Create admin sidebar**

Create `src/components/admin/admin-sidebar.tsx` — a `"use client"` component with links to: Posts, Releases, Shows, Press, and a logout button. Highlight the active route. Use `usePathname()`. Style: compact, functional, bg-bg-card sidebar.

- [ ] **Step 2: Create admin layout**

Create `src/app/admin/layout.tsx` — a server component that checks `isAuthenticated()`. If not authenticated and not on the login page, redirect to `/admin/login`. If authenticated, render a two-column layout: sidebar left (fixed width ~220px), main content right. Don't use the public site's Nav/Footer.

- [ ] **Step 3: Create admin dashboard**

Create `src/app/admin/page.tsx` — simple redirect to `/admin/posts` or a dashboard showing counts of posts, releases, shows, press.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/ src/components/admin/
git commit -m "feat: admin layout with sidebar, auth-protected routing"
```

---

### Task 4: Content Writer Utilities

**Files:**
- Create: `src/lib/content-writer.ts`

- [ ] **Step 1: Create content write utilities**

Create `src/lib/content-writer.ts` — server-only module with functions to read/write the JSON content files:

- `readPosts()` / `writePosts(posts)` — reads/writes `content/posts/posts.json`
- `readReleases()` / `writeReleases(releases)` — reads/writes `content/releases/discography.json`
- `readShows()` / `writeShows(shows)` — reads/writes `content/shows/shows.json`
- `readPress()` / `writePress(press)` — reads/writes `content/press/press.json`

For posts, create the `content/posts/posts.json` file if it doesn't exist (initialize with the sample posts from the current feed.ts hardcoded data).

Each write function reads the current file, applies the change, and writes back with `JSON.stringify(data, null, 2)`.

- [ ] **Step 2: Create initial posts.json**

Create `content/posts/posts.json` with the sample posts currently hardcoded in `src/lib/feed.ts`, then update feed.ts to read from this file instead of hardcoded data.

- [ ] **Step 3: Commit**

```bash
git add src/lib/content-writer.ts content/posts/posts.json src/lib/feed.ts
git commit -m "feat: content writer utilities, externalize posts to posts.json"
```

---

### Task 5: Posts Management (List + Create)

**Files:**
- Create: `src/app/admin/posts/page.tsx`
- Create: `src/app/admin/posts/new/page.tsx`
- Create: `src/components/admin/post-form.tsx`

- [ ] **Step 1: Create posts list page**

`src/app/admin/posts/page.tsx` — server component that reads all posts and displays them in a table/list. Shows: type (note/article), date, body preview (first 80 chars), releaseRef if any, featured flag. "New Post" button at top. Each row links to edit (reuses the /new page with ?id= param).

- [ ] **Step 2: Create post form component**

`src/components/admin/post-form.tsx` — `"use client"` form with fields:
- Type: toggle between "note" and "article"
- Body: textarea for notes, Tiptap editor for articles (Task 6)
- Title: text input (shown only for articles)
- Excerpt: text input (shown only for articles)
- Date: date input (defaults to today)
- Release ref: dropdown of all releases (optional)
- Show ref: dropdown of all shows (optional)
- Featured: checkbox
- Image URL: text input (optional)
- Link + Link label: text inputs (optional, for notes)

Form submits via server action that calls content-writer to append/update posts.json.

- [ ] **Step 3: Create new post page**

`src/app/admin/posts/new/page.tsx` — server component that loads releases list and shows list (for the dropdowns), passes them to PostForm.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/posts/ src/components/admin/post-form.tsx
git commit -m "feat: admin posts list and create/edit form"
```

---

### Task 6: Tiptap Rich Text Editor

**Files:**
- Create: `src/components/admin/tiptap-editor.tsx`

- [ ] **Step 1: Create the Tiptap editor component**

`src/components/admin/tiptap-editor.tsx` — `"use client"` component wrapping Tiptap with:
- StarterKit (bold, italic, headings, lists, blockquote, code block, horizontal rule)
- Link extension
- Placeholder extension
- A toolbar with buttons for: Bold, Italic, H2, H3, Blockquote, Bullet List, Ordered List, Link, Horizontal Rule
- Output as HTML string via `editor.getHTML()`
- Accept `content` prop for initial value and `onChange` callback
- Style the editor area to match the site's design (bg-bg-card, text-text, font-body)

- [ ] **Step 2: Integrate into post form**

Update `src/components/admin/post-form.tsx` to use TiptapEditor for article body instead of textarea.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/tiptap-editor.tsx src/components/admin/post-form.tsx
git commit -m "feat: Tiptap rich text editor for article posts"
```

---

### Task 7: Releases Management

**Files:**
- Create: `src/app/admin/releases/page.tsx`
- Create: `src/app/admin/releases/new/page.tsx`
- Create: `src/components/admin/release-form.tsx`

- [ ] **Step 1: Create releases list**

`src/app/admin/releases/page.tsx` — shows all releases in a table: year, artist, title, type, label, has artwork (yes/no). Sorted newest first. "New Release" button. Each row links to edit.

- [ ] **Step 2: Create release form**

`src/components/admin/release-form.tsx` — form with fields matching the Release type:
- Title, Artist (defaults to "Airbase"), Type (Single/Remix/Album select), Label, Year, Date
- Tracks: repeatable text inputs (add/remove)
- Links: Spotify, Beatport, Apple Music, YouTube, Tidal, Deezer URL inputs
- Artwork URL: text input (manual for now, upload later)

Server action appends to or updates discography.json via content-writer.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/releases/ src/components/admin/release-form.tsx
git commit -m "feat: admin releases CRUD"
```

---

### Task 8: Shows Management

**Files:**
- Create: `src/app/admin/shows/page.tsx`
- Create: `src/app/admin/shows/new/page.tsx`
- Create: `src/components/admin/show-form.tsx`

- [ ] **Step 1: Create shows list**

`src/app/admin/shows/page.tsx` — shows all shows: date/year_approx, venue, city, country, status. Sorted newest first. Upcoming shows highlighted.

- [ ] **Step 2: Create show form**

`src/components/admin/show-form.tsx` — form fields: Venue, City, Country, Event name, Date, Year approx (for when no exact date), Status (upcoming/past/cancelled), Notes, Image URL, Ticket link.

Server action via content-writer.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/shows/ src/components/admin/show-form.tsx
git commit -m "feat: admin shows CRUD"
```

---

### Task 9: Press Management

**Files:**
- Create: `src/app/admin/press/page.tsx`
- Create: `src/app/admin/press/new/page.tsx`
- Create: `src/components/admin/press-form.tsx`

- [ ] **Step 1: Create press list and form**

Same pattern: list page + form. Fields: Title, Publication, Date, URL, Pull Quote, Context.

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/press/ src/components/admin/press-form.tsx
git commit -m "feat: admin press CRUD"
```

---

## Verification Checklist

- [ ] `npm run build` passes with all /admin routes
- [ ] Visiting /admin redirects to /admin/login when not authenticated
- [ ] Login with correct password grants access
- [ ] Login with wrong password shows error
- [ ] Admin sidebar shows all sections
- [ ] Posts: can create a note, appears in feed after page reload
- [ ] Posts: can create an article with Tiptap editor
- [ ] Posts: can link a post to a release (releaseRef dropdown)
- [ ] Posts: can mark a post as featured
- [ ] Releases: list shows all 108 releases
- [ ] Releases: can create a new release, appears in discography
- [ ] Shows: list shows all shows
- [ ] Shows: can create a new show
- [ ] Press: can create a new press entry
- [ ] All forms save to the correct JSON files
- [ ] Content persists after dev server restart
