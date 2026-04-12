import { getAllReleases, getReleaseBySlug } from "./releases";
import { getShowBySlug } from "./shows";
import type { Post, FeedItem } from "@/types/content";

// Sample posts for Phase 3 demo (will be replaced by MDX/admin posts later)
const SAMPLE_POSTS: Post[] = [
  {
    type: "note",
    date: "2026-04-10",
    body: "Just finished a new sketch in the studio. Something different this time. Pushing the tempo, pushing the melody. Emotion first, details later.",
  },
  {
    type: "note",
    date: "2026-03-15",
    body: "Listening back to old Ozone tracks. The naivety in those productions is what made them work. You can't fake that energy.",
  },
  {
    type: "note",
    date: "2026-02-06",
    body: "It's out. Everything Else Could Wait, on Black Hole Recordings. A track about choosing presence over productivity. The title says it all.",
    releaseRef: "everything-else-could-wait",
    featured: true,
  },
  {
    type: "article",
    date: "2026-02-10",
    body: "An in-depth conversation with Beatportal about the return, the hiatus, and why melody still wins.",
    title: "People didn't fall in love with perfect production",
    excerpt: "An in-depth conversation with Beatportal about the return, the hiatus, and why melody still wins.",
    slug: "beatportal-interview-2026",
    releaseRef: "everything-else-could-wait",
  },
  {
    type: "note",
    date: "2026-01-20",
    body: "Tomorrowland confirmed for August. See you there.",
    showRef: "tomorrowland-2026",
  },
  {
    type: "note",
    date: "2026-01-15",
    body: "Heading back to the beach. Luminosity in June. Full live set. Can't wait.",
    showRef: "luminosity-beach-festival-2026",
  },
];

// Sample shows (will come from shows.json / admin later)
const SAMPLE_SHOW_DATA = [
  {
    slug: "luminosity-beach-festival-2026",
    show: {
      venue: "Luminosity Beach Festival",
      city: "Bloemendaal",
      country: "Netherlands",
      date: "2026-06-14",
      year_approx: null,
      event: "Luminosity Beach Festival",
      notes: "The return to the beach. Full live set.",
      image: null as string | null,
      status: "upcoming" as const,
    },
  },
  {
    slug: "tomorrowland-2026",
    show: {
      venue: "Tomorrowland",
      city: "Boom",
      country: "Belgium",
      date: "2026-08-22",
      year_approx: null,
      event: "Tomorrowland",
      notes: null,
      image: null as string | null,
      status: "upcoming" as const,
    },
  },
];

async function resolveShowRef(slug: string) {
  // First check the database
  const dbShow = await getShowBySlug(slug);
  if (dbShow) return dbShow;
  // Fall back to sample data
  return SAMPLE_SHOW_DATA.find((s) => s.slug === slug)?.show;
}

export async function getFeedItems(limit?: number): Promise<FeedItem[]> {
  const posts = SAMPLE_POSTS; // Will come from MDX files / admin later

  const feedItems: FeedItem[] = await Promise.all(
    posts.map(async (post) => {
      const item: FeedItem = { post };

      if (post.releaseRef) {
        const release = await getReleaseBySlug(post.releaseRef);
        if (release) item.release = release;
      }

      if (post.showRef) {
        const show = await resolveShowRef(post.showRef);
        if (show) item.show = show;
      }

      return item;
    })
  );

  feedItems.sort((a, b) => new Date(b.post.date).getTime() - new Date(a.post.date).getTime());

  return limit ? feedItems.slice(0, limit) : feedItems;
}

/** Find all posts that reference a given release (for discography page) */
export async function getPostsForRelease(releaseSlug: string): Promise<Post[]> {
  const posts = SAMPLE_POSTS; // Will come from MDX files / admin later
  return posts.filter((p) => p.releaseRef === releaseSlug);
}

/** Find all posts that reference a given show (for shows page) */
export async function getPostsForShow(showSlug: string): Promise<Post[]> {
  const posts = SAMPLE_POSTS;
  return posts.filter((p) => p.showRef === showSlug);
}

export function getFilterTypes() {
  return [
    { value: "all" as const, label: "All" },
    { value: "note" as const, label: "Notes" },
    { value: "article" as const, label: "Articles" },
  ];
}
