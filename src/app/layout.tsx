import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { fraunces, syne, jetbrainsMono } from "@/lib/fonts";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
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
          <div id="main-content">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
