import { getReleaseBySlug } from "./releases";
import { getShowBySlug } from "./shows";
import { readPosts } from "./content-writer";
import type { Post, FeedItem } from "@/types/content";

async function resolveShowRef(slug: string) {
  return getShowBySlug(slug);
}

export async function getFeedItems(limit?: number): Promise<FeedItem[]> {
  const posts = await readPosts();

  const feedItems: FeedItem[] = await Promise.all(
    posts.map(async (post) => {
      const item: FeedItem = { post };

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
