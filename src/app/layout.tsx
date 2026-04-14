import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { fraunces, syne, jetbrainsMono } from "@/lib/fonts";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Airbase",
    template: "%s — Airbase",
  },
  description:
    "Airbase — Swedish trance producer and DJ. 25 years of melody and restraint.",
  metadataBase: new URL("https://airbasemusic.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Airbase",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${syne.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body bg-bg text-text antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              name: "Airbase",
              alternateName: "Jezper Söderlund",
              url: "https://airbasemusic.com",
              genre: ["Trance", "Progressive Trance"],
              foundingLocation: { "@type": "Place", name: "Gothenburg, Sweden" },
              sameAs: [
                "https://open.spotify.com/artist/3R3fc4fBMzzmJoSrRgVdKe",
                "https://www.beatport.com/artist/airbase/8317",
                "https://music.apple.com/artist/airbase",
                "https://youtube.com/@airbasemusic",
                "https://instagram.com/airbasemusic",
                "https://x.com/airbasemusic",
                "https://facebook.com/airbasemusic",
              ],
            }),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:rounded font-body text-sm font-bold"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main-content">
            {children}
          </main>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
