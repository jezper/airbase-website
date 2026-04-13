import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    return [
      // Old Squarespace/WordPress URLs
      { source: "/biography", destination: "/about", permanent: true },
      { source: "/blog/:slug*", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      // Old WordPress feed
      { source: "/feed", destination: "/feed.xml", permanent: true },
    ];
  },
};

export default nextConfig;
