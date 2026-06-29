import { getReleaseBySlug } from "./releases";
import { getShowBySlug, getAllShows } from "./shows";
import { showSlug, showSortKey, getShowStatus } from "./show-utils";
import { readPosts } from "./content-writer";
import type { Post, FeedItem } from "@/types/content";

async function resolveShowRef(slug: string) {
  return getShowBySlug(slug);
}

export async function getFeedItems(limit?: number): Promise<FeedItem[]> {
  const posts = await readPosts();

  // Posts (with their resolved release/show references)
  const postItems: FeedItem[] = await Promise.all(
    posts.map(async (post) => {
      const item: FeedItem = { post, date: post.date };

      if (post.releaseRef) {
        const release = await getReleaseBySlug(post.releaseRef);
        if (release) {
          item.release = release;
          if (release.relatedRelease) {
            const related = await getReleaseBySlug(release.relatedRelease);
            if (related) item.relatedRelease = related;
          }
        }
      }

      if (post.showRef) {
        const show = await resolveShowRef(post.showRef);
        if (show) item.show = show;
      }

      return item;
    })
  );

  // Standalone shows — every show flows into the feed on its own, except
  // cancelled ones and shows already referenced by a post (avoid duplicates).
  const referencedShowSlugs = new Set(
    postItems.map((i) => i.show && showSlug(i.show)).filter(Boolean) as string[]
  );
  const shows = await getAllShows();
  const showItems: FeedItem[] = shows
    .filter((s) => getShowStatus(s) !== "cancelled" && !referencedShowSlugs.has(showSlug(s)))
    .map((show) => ({ show, date: showSortKey(show) }));

  const feedItems = [...postItems, ...showItems];
  feedItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
