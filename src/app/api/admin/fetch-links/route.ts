import { NextRequest, NextResponse } from "next/server";

interface OdesliResponse {
  linksByPlatform: Record<string, { url: string }>;
}

const PLATFORM_MAP: Record<string, string> = {
  spotify: "spotify",
  appleMusic: "apple",
  youtube: "youtube",
  youtubeMusic: "youtube_music",
  beatport: "beatport",
  deezer: "deezer",
  tidal: "tidal",
  soundcloud: "soundcloud",
};

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url)
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });

  try {
    const res = await fetch(
      `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)}`,
    );
    if (!res.ok)
      return NextResponse.json(
        { error: `Odesli returned ${res.status}` },
        { status: 502 },
      );

    const data: OdesliResponse = await res.json();
    const links: Record<string, string> = {};

    for (const [platform, fieldName] of Object.entries(PLATFORM_MAP)) {
      const link = data.linksByPlatform[platform];
      if (link?.url) links[fieldName] = link.url;
    }

    return NextResponse.json({ links });
  } catch {
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}
