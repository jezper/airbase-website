"use client";

import { useState } from "react";
import type { FeedItem, Post } from "@/types/content";
import NoteCard from "./note-card";
import ArticleCard from "./article-card";
import ReleaseContext from "./release-context";
import ShowContext from "./show-context";

type FilterValue = "all" | Post["type"];

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "note", label: "Notes" },
  { value: "article", label: "Articles" },
];

export default function Feed({ items }: { items: FeedItem[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = filter === "all"
    ? items
    : items.filter((item) => item.post.type === filter);

  return (
    <section className="px-6 md:px-12 py-12" aria-label="Feed">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h2 className="font-body text-[13px] font-bold uppercase tracking-[0.12em] text-text-faint">
          Feed
        </h2>
        <div className="flex gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`font-mono text-[11px] uppercase tracking-[0.06em] px-4 py-1.5 rounded whitespace-nowrap transition-all duration-120 ${
                filter === f.value
                  ? "text-accent border border-transparent"
                  : "text-text-faint border border-border hover:border-border-hover hover:text-text-muted"
              }`}
              style={filter === f.value ? {
                backgroundColor: "rgba(232,93,38,0.12)",
                borderColor: "rgba(232,93,38,0.3)",
              } : undefined}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-prose mx-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-text-faint font-body py-16">
            No posts to show right now.
          </p>
        ) : (
          filtered.map((item, i) => (
            <div key={`${item.post.type}-${item.post.date}-${i}`}>
              {/* Referenced release context (artwork + links) */}
              {item.release && <ReleaseContext release={item.release} />}

              {/* Referenced show context */}
              {item.show && <ShowContext show={item.show} />}

              {/* The post itself */}
              {item.post.type === "note" && (
                <NoteCard post={item.post} hasContext={!!item.release || !!item.show} />
              )}
              {item.post.type === "article" && (
                <ArticleCard post={item.post} hasContext={!!item.release || !!item.show} />
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
