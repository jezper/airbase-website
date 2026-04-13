"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Post, Release, Show } from "@/types/content";
import { TiptapEditor } from "./tiptap-editor";
import { releaseSlug } from "@/lib/release-utils";
import { showSlug } from "@/lib/show-utils";
import { savePost } from "@/app/admin/(protected)/posts/actions";
import { MetaPreview } from "./meta-preview";

interface PostFormProps {
  releases: Release[];
  shows: Show[];
  initialPost?: Post;
  editIndex?: number;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-body text-sm font-medium text-text-muted mb-1.5">
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-bg-card border border-border-hover rounded px-3 py-2.5 font-body text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

const selectClass =
  "w-full bg-bg-card border border-border-hover rounded px-3 py-2.5 font-body text-sm text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

export function PostForm({ releases, shows, initialPost, editIndex }: PostFormProps) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [type, setType] = useState<"note" | "article">(initialPost?.type ?? "note");
  const [body, setBody] = useState(initialPost?.body ?? "");
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [date, setDate] = useState(initialPost?.date ?? today);
  const [releaseRef, setReleaseRef] = useState(initialPost?.releaseRef ?? "");
  const [showRef, setShowRef] = useState(initialPost?.showRef ?? "");
  const [featured, setFeatured] = useState(initialPost?.featured ?? false);
  const [image, setImage] = useState(initialPost?.image ?? "");
  const [link, setLink] = useState(initialPost?.link ?? "");
  const [linkLabel, setLinkLabel] = useState(initialPost?.linkLabel ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function autoSlug(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!initialPost?.slug) {
      setSlug(autoSlug(val));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) {
      setError("Body is required.");
      return;
    }
    if (type === "article" && !title.trim()) {
      setError("Title is required for articles.");
      return;
    }

    setSaving(true);
    setError("");

    const post: Post = {
      type,
      date,
      body,
      ...(type === "article" && { title, excerpt: excerpt || undefined, slug: slug || autoSlug(title) }),
      ...(image.trim() && { image: image.trim() }),
      ...(link.trim() && { link: link.trim() }),
      ...(linkLabel.trim() && { linkLabel: linkLabel.trim() }),
      ...(releaseRef && { releaseRef }),
      ...(showRef && { showRef }),
      ...(featured && { featured }),
    };

    const result = await savePost(post, editIndex);

    if (result.success) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      setError(result.error ?? "Failed to save post.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Type toggle */}
      <Field label="Post type" required>
        <div className="flex gap-2">
          {(["note", "article"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded font-body text-sm font-medium transition-colors capitalize ${
                type === t
                  ? "bg-accent text-bg"
                  : "bg-bg-card border border-border text-text-muted hover:text-text"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      {/* Article fields */}
      {type === "article" && (
        <>
          <Field label="Title" required>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article title"
              className={inputClass}
            />
          </Field>

          <Field label="Excerpt">
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary (auto-generated from body if left blank)"
              className={inputClass}
            />
          </Field>

          <Field label="Slug">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(autoSlug(e.target.value))}
              placeholder="url-friendly-slug"
              className={`${inputClass} font-mono`}
            />
          </Field>
        </>
      )}

      {/* Body */}
      <Field label="Body" required>
        {type === "article" ? (
          <TiptapEditor
            content={body}
            onChange={setBody}
            placeholder="Write the full article..."
          />
        ) : (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="What's on your mind? Add a link below to share it."
            className={`${inputClass} resize-y`}
          />
        )}
      </Field>

      {/* Link URL + Link Label (note type only, shown early for easy access) */}
      {type === "note" && (
        <>
          <Field label="Link URL">
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>

          {link && (
            <Field label="Link label">
              <input
                type="text"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                placeholder="e.g. Read more, Listen now..."
                className={inputClass}
              />
            </Field>
          )}
        </>
      )}

      {/* Date */}
      <Field label="Date" required>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`${inputClass} font-mono`}
        />
      </Field>

      {/* Release ref */}
      <Field label="Release reference">
        <select value={releaseRef} onChange={(e) => setReleaseRef(e.target.value)} className={selectClass}>
          <option value="">None</option>
          {releases.map((r, i) => (
            <option key={`${releaseSlug(r)}-${i}`} value={releaseSlug(r)}>
              {r.artist} — {r.title} ({r.year})
            </option>
          ))}
        </select>
      </Field>

      {/* Show ref */}
      <Field label="Show reference">
        <select value={showRef} onChange={(e) => setShowRef(e.target.value)} className={selectClass}>
          <option value="">None</option>
          {shows.map((s, i) => (
            <option key={`${showSlug(s)}-${i}`} value={showSlug(s)}>
              {s.venue}, {s.city} ({s.date ?? s.year_approx ?? "date unknown"})
            </option>
          ))}
        </select>
      </Field>

      {/* Optional fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Image URL">
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>

        {type === "article" && (
          <Field label="Link URL">
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>
        )}
      </div>

      {type === "article" && link && (
        <Field label="Link label">
          <input
            type="text"
            value={linkLabel}
            onChange={(e) => setLinkLabel(e.target.value)}
            placeholder="e.g. Read more, Listen now..."
            className={inputClass}
          />
        </Field>
      )}

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          id="featured"
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-4 h-4 accent-accent"
        />
        <label htmlFor="featured" className="font-body text-sm text-text-muted cursor-pointer">
          Featured (displays with expanded release/show context)
        </label>
      </div>

      {/* Meta preview */}
      {(title || body) && type === "article" && (
        <div>
          <p className="font-body text-sm font-medium text-text-muted mb-3">Search & social preview</p>
          <MetaPreview
            title={title ? `${title} | Airbase` : "Airbase"}
            description={body.slice(0, 160)}
            url={slug ? `https://airbasemusic.com/feed/${slug}` : "https://airbasemusic.com"}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 font-body text-sm" role="alert">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-accent hover:bg-accent-hover text-bg font-body text-sm font-bold px-5 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : editIndex !== undefined ? "Update post" : "Publish post"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="font-body text-sm text-text-muted hover:text-text transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
