import type { Metadata } from "next";
import { renderMDXPage } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jezper Söderlund, aka Airbase. Swedish trance producer and DJ from Gothenburg, active since the mid-1990s.",
};

export default async function AboutPage() {
  const { content } = await renderMDXPage("about");

  return (
    <div className="px-6 md:px-12 py-12 max-w-content mx-auto">
      <h1 className="font-display text-5xl md:text-6xl font-black leading-tight mb-12">
        About
      </h1>
      <div className="max-w-prose-narrow mx-auto md:mx-0">
        <div
          className={[
            "font-body text-[17px] leading-relaxed text-text space-y-6",
            "[&>h1]:font-display [&>h1]:text-3xl [&>h1]:font-black [&>h1]:mt-12 [&>h1]:mb-4",
            "[&>h1]:hidden",
            "[&>p]:text-text-muted",
            "[&>p:first-of-type]:text-text [&>p:first-of-type]:text-[19px] [&>p:first-of-type]:leading-relaxed",
            "[&>em]:text-text [&>p>em]:text-text",
            "[&>p>a]:text-accent [&>p>a]:underline [&>p>a]:underline-offset-2 [&>p>a]:hover:text-accent-hover",
          ].join(" ")}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
