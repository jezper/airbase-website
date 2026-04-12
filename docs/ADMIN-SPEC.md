# Admin Interface Specification

## Overview

A lightweight, password-protected admin UI at `/admin` for creating and managing content. This is not a full CMS — it's a purpose-built posting interface tailored to the four content types (Note, Article, Release, Show) plus Press entries.

---

## Authentication

Simple session-based auth with a single admin password:
- Environment variable: `ADMIN_PASSWORD`
- Login page at `/admin/login`
- Session stored in an HTTP-only cookie
- No user management, no registration — single-user system

---

## Admin Layout

A clean, functional interface. No need for design extravagance here — clarity and speed matter most. A sidebar or top nav with:

- **New Post** (primary action)
- **Posts** (list view of all posts)
- **Releases** (list view, links to discography data)
- **Shows** (list view)
- **Press** (list view)
- **Settings** (future: site metadata, social links)

---

## New Post Flow

### Step 1: Choose Post Type

Four large, clear buttons:
- **Note** — Quick text, link, or image. Like a tweet.
- **Article** — Long-form with rich text.
- **Release** — New music release (auto-populates discography).
- **Show** — Performance date (auto-populates shows archive).

### Step 2: Post Form (adapts by type)

#### Note
| Field | Type | Required |
|-------|------|----------|
| Body | Rich text (short) | Yes |
| Image | Upload | No |
| Link | URL | No |
| Link label | Text | No |
| Published date | Date picker | Yes (defaults to now) |
| Draft | Toggle | No |

#### Article
| Field | Type | Required |
|-------|------|----------|
| Title | Text | Yes |
| Excerpt | Text (short) | No (auto-generated from body if empty) |
| Cover image | Upload | No |
| Body | Rich text (full) | Yes |
| Published date | Date picker | Yes |
| Slug | Auto-generated from title, editable | Yes |
| Draft | Toggle | No |

#### Release
| Field | Type | Required |
|-------|------|----------|
| Title | Text | Yes |
| Artist | Text (defaults to "Airbase") | Yes |
| Release type | Select: Single / Remix / Album | Yes |
| Label | Text | Yes |
| Track names | Repeatable text field | No |
| Artwork | Upload | No |
| Spotify link | URL | No |
| Beatport link | URL | No |
| YouTube link | URL | No |
| Apple Music link | URL | No |
| SoundCloud link | URL | No |
| Smart link | URL | No |
| Release date | Date picker | Yes |
| Body | Rich text (optional accompanying text) | No |
| Draft | Toggle | No |

When published, this creates both a feed post AND a discography entry.

#### Show
| Field | Type | Required |
|-------|------|----------|
| Venue | Text | Yes |
| City | Text | Yes |
| Country | Text | Yes |
| Event name | Text | No |
| Date | Date picker | Yes |
| Time | Time picker | No |
| Ticket link | URL | No |
| Status | Select: upcoming / past / cancelled | Yes |
| Notes | Text | No |
| Body | Rich text (optional accompanying text) | No |
| Draft | Toggle | No |

When published, this creates both a feed post AND a shows entry.

---

## Rich Text Editor

Use **Tiptap** (https://tiptap.dev) — a headless, extensible rich text editor built on ProseMirror. It provides:

- Bold, italic, strikethrough
- Headings (H2, H3)
- Blockquotes
- Ordered and unordered lists
- Links
- Images (inline upload)
- Embeds (YouTube, SoundCloud — via URL paste)
- Code blocks (for the rare technical post)
- Horizontal rule

The editor should have a clean toolbar and render a live preview. Output is stored as MDX.

---

## Image Handling

- Upload via drag-and-drop or file picker in the editor
- Images stored in `/public/uploads/` (organized by year/month) or Vercel Blob storage
- Automatic WebP conversion and responsive sizing via Next.js Image component
- Alt text field required on upload

---

## Content Storage

The admin writes files to the `/content/` directory structure:

- Notes → `/content/posts/YYYY-MM-DD-note-[slug].mdx`
- Articles → `/content/posts/YYYY-MM-DD-[slug].mdx`
- Releases → `/content/releases/YYYY-[slug].json` (also creates a feed post)
- Shows → `/content/shows/YYYY-MM-DD-[venue-slug].json` (also creates a feed post)
- Press → `/content/press/[slug].json`

Each file has YAML frontmatter (for MDX) or structured JSON with all the metadata fields.

### Example: Note frontmatter

```yaml
---
type: note
date: 2026-04-12T14:30:00Z
image: /uploads/2026/04/studio-shot.jpg
link: https://example.com
linkLabel: Check this out
draft: false
---

Just finished a new sketch in the studio. Something different this time.
```

### Example: Release JSON

```json
{
  "title": "Everything Else Could Wait",
  "artist": "Airbase",
  "type": "Single",
  "label": "Black Hole Recordings",
  "tracks": ["Everything Else Could Wait", "Everything Else Could Wait (Extended Mix)"],
  "artwork": "/uploads/2026/02/everything-else-could-wait.jpg",
  "links": {
    "spotify": "https://open.spotify.com/album/...",
    "beatport": "https://www.beatport.com/track/...",
    "youtube": null,
    "apple": null,
    "soundcloud": "https://soundcloud.com/airbasemusic/...",
    "smartlink": "https://blackhole.lnk.to/EverythingWait"
  },
  "date": "2026-02-06",
  "body": "A deeply personal track about choosing presence over productivity.",
  "draft": false
}
```

---

## Post List View

A simple table/list showing:
- Type icon/badge
- Title or first line (for notes)
- Date
- Status (published / draft)
- Edit / Delete actions

Sortable by date. Filterable by type and status.

---

## Preview Mode

Before publishing, a "Preview" button renders the post as it would appear on the live site, in a modal or side panel. This uses the same components as the public site.

---

## Git Integration (stretch goal)

For production, the admin should commit content changes to the Git repository, triggering a Vercel rebuild. Options:
- GitHub API for direct file commits
- A local workflow where `npm run build` processes content files

For development/MVP, writing directly to the filesystem is fine — Vercel will pick up changes on the next deploy.

---

## Future Considerations (not in MVP)

- Bulk import tool (CSV/JSON for backfilling discography or shows)
- Image gallery management
- Analytics dashboard (basic page view counts)
- Scheduled publishing (draft with future date auto-publishes)
- RSS feed generation
