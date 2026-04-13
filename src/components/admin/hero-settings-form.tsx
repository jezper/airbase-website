"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteConfig, HeroConfig } from "@/lib/content-writer";
import type { Release, Post } from "@/types/content";
import { saveSiteConfig } from "@/app/admin/(protected)/settings/actions";

interface HeroSettingsFormProps {
  config: SiteConfig;
  releases: Release[];
  posts: Post[];
}

const inputClass =
  "w-full bg-bg-card border border-border-hover rounded px-3 py-2.5 font-body text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

const selectClass =
  "w-full bg-bg-card border border-border-hover rounded px-3 py-2.5 font-body text-sm text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-body text-sm font-medium text-text-muted mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export function HeroSettingsForm({ config, releases, posts }: HeroSettingsFormProps) {
  const router = useRouter();
  const [heroType, setHeroType] = useState<HeroConfig["type"]>(config.hero.type);
  const [releaseIndex, setReleaseIndex] = useState(config.hero.releaseIndex ?? 0);
  const [postIndex, setPostIndex] = useState(config.hero.postIndex ?? 0);
  const [title, setTitle] = useState(config.hero.title ?? "");
  const [subtitle, setSubtitle] = useState(config.hero.subtitle ?? "");
  const [image, setImage] = useState(config.hero.image ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const hero: HeroConfig = { type: heroType };
    if (heroType === "release") {
      hero.releaseIndex = releaseIndex;
    } else if (heroType === "post") {
      hero.postIndex = postIndex;
    } else {
      if (title.trim()) hero.title = title.trim();
      if (subtitle.trim()) hero.subtitle = subtitle.trim();
      if (image.trim()) hero.image = image.trim();
    }

    const result = await saveSiteConfig({ hero });

    if (result.success) {
      setSaved(true);
      router.refresh();
    } else {
      setError(result.error ?? "Failed to save settings.");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-bg-card border border-border rounded-lg p-5">
      {/* Hero type selector */}
      <Field label="Hero type">
        <div className="flex gap-2">
          {(["release", "post", "custom"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setHeroType(t); setSaved(false); }}
              className={`px-4 py-2 rounded font-body text-sm font-medium transition-colors capitalize ${
                heroType === t
                  ? "bg-accent text-bg"
                  : "bg-bg border border-border text-text-muted hover:text-text"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      {/* Release picker */}
      {heroType === "release" && (
        <Field label="Release">
          <select
            value={releaseIndex}
            onChange={(e) => { setReleaseIndex(Number(e.target.value)); setSaved(false); }}
            className={selectClass}
          >
            {releases.map((r, i) => (
              <option key={i} value={i}>
                {i === 0 ? "[Latest] " : ""}{r.artist} — {r.title} ({r.year})
              </option>
            ))}
          </select>
        </Field>
      )}

      {/* Post picker */}
      {heroType === "post" && (
        <Field label="Post">
          <select
            value={postIndex}
            onChange={(e) => { setPostIndex(Number(e.target.value)); setSaved(false); }}
            className={selectClass}
          >
            {posts.map((p, i) => (
              <option key={i} value={i}>
                {p.title ?? p.body.slice(0, 60)}… ({p.date})
              </option>
            ))}
          </select>
        </Field>
      )}

      {/* Custom fields */}
      {heroType === "custom" && (
        <>
          <Field label="Title">
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
              placeholder="Hero heading"
              className={inputClass}
            />
          </Field>
          <Field label="Subtitle">
            <input
              type="text"
              value={subtitle}
              onChange={(e) => { setSubtitle(e.target.value); setSaved(false); }}
              placeholder="Supporting line"
              className={inputClass}
            />
          </Field>
          <Field label="Image URL">
            <input
              type="url"
              value={image}
              onChange={(e) => { setImage(e.target.value); setSaved(false); }}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>
        </>
      )}

      {error && (
        <p className="text-red-400 font-body text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="bg-accent hover:bg-accent-hover text-bg font-body text-sm font-bold px-5 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save settings"}
        </button>
        {saved && (
          <span className="font-body text-sm text-accent-alt">Saved.</span>
        )}
      </div>
    </form>
  );
}
