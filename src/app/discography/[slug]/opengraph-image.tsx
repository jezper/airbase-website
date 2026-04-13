import { ImageResponse } from "next/og";
import { getReleaseBySlug } from "@/lib/releases";

export const alt = "Airbase release";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);

  const fraunces = await fetch(
    new URL("https://fonts.gstatic.com/s/fraunces/v32/6NUh6KiaMDqEM4WnOr4g.woff2"),
  ).then((res) => res.arrayBuffer());

  const title = release?.title ?? "Release";
  const artist = release?.artist ?? "Airbase";
  const label = release?.label ?? "";
  const year = release?.year ?? "";
  const artworkUrl = release?.artwork
    ? `https://airbasemusic.com${release.artwork}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0C0B0A",
          fontFamily: "Fraunces",
        }}
      >
        {/* Artwork left half */}
        {artworkUrl ? (
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artworkUrl}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #1A1816 0%, #0C0B0A 100%)",
            }}
          >
            <div
              style={{
                fontSize: 200,
                fontWeight: 900,
                color: "rgba(232,93,38,0.08)",
              }}
            >
              {title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Text right half */}
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px 50px",
          }}
        >
          {/* Type + label */}
          <div
            style={{
              fontSize: 14,
              color: "#E85D26",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              marginBottom: 12,
            }}
          >
            {release?.type ?? "Release"} · {label}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 30 ? 36 : 48,
              fontWeight: 900,
              color: "#EDE7DF",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            {title}
          </div>

          {/* Artist */}
          <div
            style={{
              fontSize: 18,
              color: "#E85D26",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              marginBottom: 8,
            }}
          >
            {artist}
          </div>

          {/* Year */}
          <div
            style={{
              fontSize: 14,
              color: "#9A928A",
              fontFamily: "sans-serif",
            }}
          >
            {year}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fraunces",
          data: fraunces,
          style: "normal",
          weight: 900,
        },
      ],
    },
  );
}
