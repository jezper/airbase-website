import type { Metadata } from "next";
import { fraunces, syne, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Airbase",
  description: "Airbase — Swedish trance producer and DJ",
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
        {children}
      </body>
    </html>
  );
}
