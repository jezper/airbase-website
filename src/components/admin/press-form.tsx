"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PressFeature } from "@/types/content";
import { savePressEntry } from "@/app/admin/(protected)/press/actions";

interface PressFormProps {
  initialEntry?: PressFeature;
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

export function PressForm({ initialEntry, editIndex }: PressFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialEntry?.title ?? "");
  const [publication, setPublication] = useState(initialEntry?.publication ?? "");
  const [date, setDate] = useState(initialEntry?.date ?? "");
  const [url, setUrl] = useState(initialEntry?.url ?? "");
  const [pullQuote, setPullQuote] = useState(initialEntry?.pullQuote ?? "");
  const [context, setContext] = useState(initialEntry?.context ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!publication.trim()) {
      setError("Publication is required.");
      return;
    }
    if (!url.trim()) {
      setError("URL is required.");
      return;
    }

    setSaving(true);
    setError("");

    const entry: PressFeature = {
      title: title.trim(),
      publication: publication.trim(),
      date: date || null,
      url: url.trim(),
      pullQuote: pullQuote.trim() || null,
      context: context.trim() || null,
    };

    const result = await savePressEntry(entry, editIndex);

    if (result.success) {
      router.push("/admin/press");
      router.refresh();
    } else {
      setError(result.error ?? "Failed to save press entry.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Title */}
      <Field label="Title" required>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article or interview headline"
          className={inputClass}
        />
      </Field>

      {/* Publication + Date row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Publication" required>
          <input
            type="text"
            value={publication}
            onChange={(e) => setPublication(e.target.value)}
            placeholder="Beatportal, Mixmag, etc."
            className={inputClass}
          />
        </Field>

        <Field label="Date">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputClass} font-mono`}
          />
        </Field>
      </div>

      {/* URL */}
      <Field label="URL" required>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
      </Field>

      {/* Pull quote */}
      <Field label="Pull quote">
        <textarea
          value={pullQuote}
          onChange={(e) => setPullQuote(e.target.value)}
          rows={3}
          placeholder="A memorable excerpt from the piece..."
          className={`${inputClass} resize-y`}
        />
      </Field>

      {/* Context */}
      <Field label="Context">
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. Cover feature, Artist of the month..."
          className={inputClass}
        />
      </Field>

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
          {saving ? "Saving..." : editIndex !== undefined ? "Update entry" : "Save entry"}
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
