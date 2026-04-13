"use client";

import { useState } from "react";

interface MetaPreviewProps {
  title: string;
  description: string;
  url: string;
  image?: string;
}

export function MetaPreview({ title, description, url, image }: MetaPreviewProps) {
  const [tab, setTab] = useState<"google" | "social">("google");

  const truncTitle = title.slice(0, 60) + (title.length > 60 ? "..." : "");
  const truncDesc = description.slice(0, 155) + (description.length > 155 ? "..." : "");
  const displayUrl = url.replace("https://", "").replace("http://", "");

  if (!title && !description) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setTab("google")}
          className={`px-4 py-2 font-body text-xs font-bold uppercase tracking-wider transition-colors ${
            tab === "google"
              ? "text-accent border-b-2 border-accent"
              : "text-text-faint hover:text-text-muted"
          }`}
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setTab("social")}
          className={`px-4 py-2 font-body text-xs font-bold uppercase tracking-wider transition-colors ${
            tab === "social"
              ? "text-accent border-b-2 border-accent"
              : "text-text-faint hover:text-text-muted"
          }`}
        >
          Social Card
        </button>
      </div>

      <div className="p-4 bg-bg">
        {tab === "google" && (
          <div className="max-w-lg">
            <p className="text-[13px] text-text-faint truncate">{displayUrl}</p>
            <p className="text-[18px] text-accent leading-snug mt-0.5 line-clamp-1">
              {truncTitle || "Page Title"}
            </p>
            <p className="text-[13px] text-text-muted leading-relaxed mt-1 line-clamp-2">
              {truncDesc || "Page description will appear here."}
            </p>
          </div>
        )}

        {tab === "social" && (
          <div className="max-w-md rounded-lg border border-border overflow-hidden">
            {image ? (
              <div className="w-full aspect-[1.91/1] bg-bg-card overflow-hidden">
                <img
                  src={image}
                  alt="Social card preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-[1.91/1] bg-bg-card flex items-center justify-center">
                <span className="font-body text-sm text-text-faint">No image</span>
              </div>
            )}
            <div className="p-3 bg-bg-card">
              <p className="font-body text-[11px] text-text-faint uppercase tracking-wider">
                airbasemusic.com
              </p>
              <p className="font-body text-[14px] text-text font-semibold leading-snug mt-0.5 line-clamp-2">
                {truncTitle || "Page Title"}
              </p>
              <p className="font-body text-[12px] text-text-muted leading-snug mt-0.5 line-clamp-2">
                {truncDesc || "Description"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
