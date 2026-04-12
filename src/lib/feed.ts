import { getReleaseBySlug } from "./releases";
import { getShowBySlug } from "./shows";
import { readPosts } from "./content-writer";
import type { Post, FeedItem } from "@/types/content";

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
  const posts = await readPosts();

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
  const posts = await readPosts();
  return posts.filter((p) => p.releaseRef === releaseSlug);
}

/** Find all posts that reference a given show (for shows page) */
export async function getPostsForShow(showSlug: string): Promise<Post[]> {
  const posts = await readPosts();
  return posts.filter((p) => p.showRef === showSlug);
}

export function getFilterTypes() {
  return [
    { value: "all" as const, label: "All" },
    { value: "note" as const, label: "Notes" },
    { value: "article" as const, label: "Articles" },
  ];
}
