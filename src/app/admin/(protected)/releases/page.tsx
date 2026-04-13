import Link from "next/link";
import { Plus } from "lucide-react";
import { readReleases, readSiteConfig } from "@/lib/content-writer";
import { ReleaseList } from "@/components/admin/release-list";

export const dynamic = "force-dynamic";

export default async function ReleasesPage() {
  const [releases, siteConfig] = await Promise.all([readReleases(), readSiteConfig()]);
  const heroReleaseIndex = siteConfig.hero.type === "release" ? (siteConfig.hero.releaseIndex ?? 0) : -1;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text">Releases</h1>
          <p className="text-text-muted font-body text-sm mt-0.5">
            {releases.length} entries in discography.json
          </p>
        </div>
        <Link
          href="/admin/releases/new"
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg font-body text-sm font-bold px-4 py-2 rounded transition-colors"
        >
          <Plus size={15} />
          New Release
        </Link>
      </div>

      <ReleaseList releases={releases} heroReleaseIndex={heroReleaseIndex} />
    </div>
  );
}
