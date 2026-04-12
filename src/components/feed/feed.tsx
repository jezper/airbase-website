"use client";

import { useState } from "react";
import type { FeedItem } from "@/types/content";
import FilterPills, { type FilterType } from "./filter-pills";
import ReleaseCard from "./release-card";
import ShowCard from "./show-card";
import NoteCard from "./note-card";
import ArticleCard from "./article-card";

interface FeedProps {
  items: FeedItem[];
}

function countByType(items: FeedItem[]): Partial<Record<FilterType, number>> {
  const counts: Partial<Record<FilterType, number>> = {
    all: items.length,
    release: 0,
    show: 0,
    note: 0,
    article: 0,
  };
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
}

export default function Feed({ items }: FeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const counts = countByType(items);

  const filtered =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.type === activeFilter);

  return (
    <div>
      {/* Filter pills */}
      <div className="mb-6">
        <FilterPills
          active={activeFilter}
          onChange={setActiveFilter}
          counts={counts}
        />
      </div>

      {/* Feed grid */}
      {filtered.length === 0 ? (
        <p className="font-body text-[15px] text-text-faint py-12 text-center">
          No posts to show right now.
        </p>
      ) : (
        <div className="flex flex-col gap-4 max-w-prose mx-auto">
          {filtered.map((item, index) => {
            if (item.type === "release") {
              return (
                <div key={`release-${item.data.title}-${item.date}-${index}`}>
                  <ReleaseCard release={item.data} />
                </div>
              );
            }

            if (item.type === "show") {
              return (
                <div key={`show-${item.data.venue}-${item.date}-${index}`}>
                  <ShowCard show={item.data} date={item.date} />
                </div>
              );
            }

            if (item.type === "note") {
              return (
                <div key={`note-${item.date}-${index}`}>
                  <NoteCard date={item.date} data={item.data} />
                </div>
              );
            }

            if (item.type === "article") {
              return (
                <div key={`article-${item.data.slug}-${index}`}>
                  <ArticleCard date={item.date} data={item.data} />
                </div>
              );
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
}
