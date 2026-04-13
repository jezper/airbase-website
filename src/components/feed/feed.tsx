"use client";

import type { FeedItem } from "@/types/content";
import NoteCard from "./note-card";
import ArticleCard from "./article-card";
import ReleaseContext from "./release-context";
import ReleaseTag from "./release-tag";
import ShowContext from "./show-context";
import ShowTag from "./show-tag";

export default function Feed({ items }: { items: FeedItem[] }) {
  return (
    <section className="px-6 md:px-12 py-12" aria-label="Feed">
      <h2 className="font-body text-[13px] font-bold uppercase tracking-[0.12em] text-text-faint mb-8">
        Feed
      </h2>

      <div className="flex flex-col gap-6 max-w-content mx-auto">
        {items.length === 0 ? (
          <p className="text-center text-text-faint font-body py-16">
            No posts to show right now.
          </p>
        ) : (
          items.map((item, i) => {
            const isFeatured = item.post.featured === true;

            return (
              <div key={`${item.post.type}-${item.post.date}-${i}`}>
                {/* Featured: big context card above the post */}
                {isFeatured && item.release && <ReleaseContext release={item.release} relatedRelease={item.relatedRelease} />}
                {isFeatured && item.show && <ShowContext show={item.show} />}

                {/* The post card */}
                {item.post.type === "note" && (
                  <NoteCard
                    post={item.post}
                    hasContext={isFeatured && (!!item.release || !!item.show)}
                  >
                    {!isFeatured && item.release && <ReleaseTag release={item.release} />}
                    {!isFeatured && item.show && <ShowTag show={item.show} />}
                  </NoteCard>
                )}
                {item.post.type === "article" && (
                  <ArticleCard
                    post={item.post}
                    hasContext={isFeatured && (!!item.release || !!item.show)}
                    featured={isFeatured}
                  >
                    {!isFeatured && item.release && <ReleaseTag release={item.release} />}
                    {!isFeatured && item.show && <ShowTag show={item.show} />}
                  </ArticleCard>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
