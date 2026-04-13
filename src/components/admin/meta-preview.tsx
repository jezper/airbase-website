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
            <div className="w-full aspect-[1.91/1] bg-bg-card overflow-hidden relative">
              {image ? (
                <img
                  src={image}
                  alt="Social card preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Simulates the auto-generated OG image */
                <div className="w-full h-full flex flex-col justify-end p-6" style={{ backgroundColor: "#0C0B0A" }}>
                  <div
                    className="absolute -top-[20%] -right-[10%] w-[70%] h-[120%] rounded-full"
                    style={{ background: "radial-gradient(ellipse at center, rgba(232,93,38,0.15) 0%, transparent 65%)" }}
                  />
                  <div className="absolute top-4 left-6 right-6 h-[2px]" style={{ background: "linear-gradient(90deg, #E85D26 0%, rgba(232,93,38,0.3) 50%, transparent 100%)" }} />
                  <p className="font-display text-2xl font-black text-[#EDE7DF] leading-tight relative z-10">
                    {truncTitle || "Airbase"}
                  </p>
                  <p className="font-body text-[11px] text-[#9A928A] mt-1 relative z-10">
                    Auto-generated from title
                  </p>
                </div>
              )}
            </div>
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
