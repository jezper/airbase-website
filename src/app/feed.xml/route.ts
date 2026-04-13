import { readPosts } from "@/lib/content-writer";

const SITE_URL = "https://airbasemusic.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await readPosts();
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const items = sorted.map((post) => {
    const title =
      post.title ?? post.body?.slice(0, 80) + (post.body && post.body.length > 80 ? "..." : "");
    const link = SITE_URL;
    const description = post.excerpt ?? post.body ?? "";

    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <description>${escapeXml(description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${link}#${post.date}</guid>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Airbase</title>
    <link>${SITE_URL}</link>
    <description>Notes, articles, and releases from Airbase (Jezper Söderlund).</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
