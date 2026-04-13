import type { Post } from "@/types/content";

export function postPermalink(post: Post): string {
  if (post.slug) return `/feed/${post.slug}`;
  return `/feed/${post.date}-${post.id}`;
}
