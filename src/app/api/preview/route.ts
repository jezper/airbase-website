import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const trackId = req.nextUrl.searchParams.get("id");
  if (!trackId) {
    return NextResponse.json({ error: "Missing track id" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.deezer.com/track/${trackId}`);
    if (!res.ok) {
      return NextResponse.json({ error: "Deezer error" }, { status: 502 });
    }
    const data = await res.json();
    if (!data.preview) {
      return NextResponse.json({ error: "No preview available" }, { status: 404 });
    }
    return NextResponse.json({ url: data.preview });
  } catch {
    return NextResponse.json({ error: "Failed to fetch preview" }, { status: 500 });
  }
}
