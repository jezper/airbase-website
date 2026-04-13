import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Airbase";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const fraunces = await fetch(
    new URL("https://fonts.gstatic.com/s/fraunces/v32/6NUh6KiaMDqEM4WnOr4g.woff2"),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px 80px",
          backgroundColor: "#0C0B0A",
          fontFamily: "Fraunces",
        }}
      >
        {/* Accent gradient glow */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "70%",
            height: "120%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(232,93,38,0.15) 0%, transparent 65%)",
          }}
        />

        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "80px",
            right: "80px",
            height: "3px",
            background:
              "linear-gradient(90deg, #E85D26 0%, rgba(232,93,38,0.3) 50%, transparent 100%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: "#EDE7DF",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            Airbase
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#9A928A",
              marginTop: 16,
              fontFamily: "sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            Swedish trance producer and DJ
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
