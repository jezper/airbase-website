"use client";

import type { FeedItem } from "@/types/content";
import NoteCard from "./note-card";
import ArticleCard from "./article-card";
import ReleaseTag from "./release-tag";
import ShowTag from "./show-tag";
import ShowCard from "./show-card";

export default function Feed({ items }: { items: FeedItem[] }) {
  return (
    <section className="px-6 md:px-12 py-12" aria-label="Feed">
      <h2 className="font-body text-[13px] font-bold uppercase tracking-[0.12em] text-text-faint mb-8">
        Feed
      </h2>

      <div className="flex flex-col max-w-content mx-auto divide-y divide-border">
        {items.length === 0 ? (
          <p className="text-center text-text-faint font-body py-16">
            No posts to show right now.
          </p>
        ) : (
          items.map((item, i) => {
            const post = item.post;

            return (
              <div key={`${post ? post.type : "show"}-${item.date}-${i}`} className="py-8 first:pt-0">
                {/* Authored post */}
                {post?.type === "note" && (
                  <NoteCard post={post}>
                    {item.release && <ReleaseTag release={item.release} />}
                    {item.show && <ShowTag show={item.show} />}
                  </NoteCard>
                )}
                {post?.type === "article" && (
                  <ArticleCard
                    post={post}
                    featured={post.featured === true}
                  >
                    {item.release && <ReleaseTag release={item.release} />}
                    {item.show && <ShowTag show={item.show} />}
                  </ArticleCard>
                )}
                {/* Standalone show (no attached post) */}
                {!post && item.show && <ShowCard show={item.show} />}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
