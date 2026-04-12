import type { Metadata } from "next";
import { getAllReleases, getOwnAliases } from "@/lib/releases";
import Discography from "@/components/discography/discography";

export const metadata: Metadata = {
  title: "Discography — Airbase",
  description: "Complete discography of Airbase (Jezper Söderlund) — 25 years of trance music across 14 aliases.",
};

export default async function DiscographyPage() {
  const [releases, aliases] = await Promise.all([
    getAllReleases(),
    getOwnAliases(),
  ]);

  return (
    <div className="px-6 md:px-12 py-12">
      <h1 className="font-display text-5xl md:text-6xl font-black leading-tight mb-2">
        Discography
      </h1>
      <p className="font-body text-[15px] text-text-muted mb-10 max-w-prose">
        {releases.length} releases across {new Set(releases.map(r => r.year)).size} years and {aliases.length} aliases.
      </p>
      <Discography releases={releases} aliases={aliases} />
    </div>
  );
}
