import { readSiteConfig, readReleases, readPosts } from "@/lib/content-writer";
import { HeroSettingsForm } from "@/components/admin/hero-settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [config, releases, posts] = await Promise.all([
    readSiteConfig(),
    readReleases(),
    readPosts(),
  ]);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-text">Settings</h1>
        <p className="text-text-muted font-body text-sm mt-0.5">Site-wide configuration</p>
      </div>

      <section>
        <h2 className="font-display text-base font-semibold text-text mb-1">Hero</h2>
        <p className="font-body text-sm text-text-muted mb-5">
          Controls what appears in the hero section on the home page.
        </p>
        <HeroSettingsForm config={config} releases={releases} posts={posts} />
      </section>
    </div>
  );
}
