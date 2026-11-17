// Prerendered and cached for a day. Both read the database, and crawlers
// request them often.
export const revalidate = 86400;

import { MetadataRoute } from "next";
import { getAllReleases } from "@/lib/releases";
import { releaseSlug } from "@/lib/release-utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const releases = await getAllReleases();

  const releasePages: MetadataRoute.Sitemap = releases.map((r) => ({
    url: `https://airbasemusic.com/discography/${releaseSlug(r)}`,
    lastModified: new Date(r.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: "https://airbasemusic.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://airbasemusic.com/discography",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...releasePages,
    {
      url: "https://airbasemusic.com/shows",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://airbasemusic.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://airbasemusic.com/contact",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
