"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import type { Release, ReleaseType } from "@/types/content";
import { saveRelease } from "@/app/admin/(protected)/releases/actions";

interface ReleaseFormProps {
  initialRelease?: Release;
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
  "w-full bg-bg border border-border rounded px-3 py-2 font-body text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

const selectClass =
  "w-full bg-bg border border-border rounded px-3 py-2 font-body text-sm text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

export function ReleaseForm({ initialRelease, editIndex }: ReleaseFormProps) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState(initialRelease?.title ?? "");
  const [artist, setArtist] = useState(initialRelease?.artist ?? "Airbase");
  const [type, setType] = useState<ReleaseType>(initialRelease?.type ?? "Single");
  const [label, setLabel] = useState(initialRelease?.label ?? "");
  const [year, setYear] = useState(initialRelease?.year ?? new Date().getFullYear());
  const [date, setDate] = useState(initialRelease?.date ?? today);
  const [artwork, setArtwork] = useState(initialRelease?.artwork ?? "");
  const [tracks, setTracks] = useState<string[]>(
    initialRelease?.tracks?.length ? initialRelease.tracks : [""],
  );

  // Links
  const [spotify, setSpotify] = useState(initialRelease?.links?.spotify ?? "");
  const [beatport, setBeatport] = useState(initialRelease?.links?.beatport ?? "");
  const [apple, setApple] = useState(initialRelease?.links?.apple ?? "");
  const [youtube, setYoutube] = useState(initialRelease?.links?.youtube ?? "");
  const [tidal, setTidal] = useState(initialRelease?.links?.tidal ?? "");
  const [deezer, setDeezer] = useState(initialRelease?.links?.deezer ?? "");
  const [soundcloud, setSoundcloud] = useState(initialRelease?.links?.soundcloud ?? "");
  const [smartlink, setSmartlink] = useState(initialRelease?.links?.smartlink ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addTrack() {
    setTracks((prev) => [...prev, ""]);
  }

  function removeTrack(index: number) {
    setTracks((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTrack(index: number, value: string) {
    setTracks((prev) => prev.map((t, i) => (i === index ? value : t)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!artist.trim()) {
      setError("Artist is required.");
      return;
    }
    if (!label.trim()) {
      setError("Label is required.");
      return;
    }
    if (!date) {
      setError("Date is required.");
      return;
    }

    setSaving(true);
    setError("");

    const release: Release = {
      title: title.trim(),
      artist: artist.trim(),
      type,
      label: label.trim(),
      year,
      date,
      artwork: artwork.trim() || null,
      tracks: tracks.map((t) => t.trim()).filter(Boolean),
      links: {
        ...(spotify.trim() && { spotify: spotify.trim() }),
        ...(beatport.trim() && { beatport: beatport.trim() }),
        ...(apple.trim() && { apple: apple.trim() }),
        ...(youtube.trim() && { youtube: youtube.trim() }),
        ...(tidal.trim() && { tidal: tidal.trim() }),
        ...(deezer.trim() && { deezer: deezer.trim() }),
        ...(soundcloud.trim() && { soundcloud: soundcloud.trim() }),
        ...(smartlink.trim() && { smartlink: smartlink.trim() }),
      },
    };

    const result = await saveRelease(release, editIndex);

    if (result.success) {
      router.push("/admin/releases");
      router.refresh();
    } else {
      setError(result.error ?? "Failed to save release.");
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
          placeholder="Track or album title"
          className={inputClass}
        />
      </Field>

      {/* Artist + Type row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Artist" required>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Airbase"
            className={inputClass}
          />
        </Field>

        <Field label="Type" required>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ReleaseType)}
            className={selectClass}
          >
            <option value="Single">Single</option>
            <option value="Remix">Remix</option>
            <option value="Album">Album</option>
          </select>
        </Field>
      </div>

      {/* Label */}
      <Field label="Label" required>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Black Hole Recordings"
          className={inputClass}
        />
      </Field>

      {/* Year + Date row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Year" required>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            min={1990}
            max={2099}
            className={`${inputClass} font-mono`}
          />
        </Field>

        <Field label="Release date" required>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputClass} font-mono`}
          />
        </Field>
      </div>

      {/* Artwork */}
      <Field label="Artwork URL">
        <input
          type="url"
          value={artwork}
          onChange={(e) => setArtwork(e.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
      </Field>

      {/* Tracks */}
      <Field label="Tracks">
        <div className="space-y-2">
          {tracks.map((track, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={track}
                onChange={(e) => updateTrack(i, e.target.value)}
                placeholder={`Track ${i + 1}`}
                className={inputClass}
              />
              {tracks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTrack(i)}
                  className="p-2 text-text-faint hover:text-text transition-colors flex-shrink-0"
                  aria-label="Remove track"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTrack}
            className="inline-flex items-center gap-1.5 font-body text-sm text-text-muted hover:text-accent transition-colors"
          >
            <Plus size={14} />
            Add track
          </button>
        </div>
      </Field>

      {/* Streaming links */}
      <div>
        <p className="font-body text-sm font-medium text-text-muted mb-3">Streaming links</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Spotify">
            <input
              type="url"
              value={spotify}
              onChange={(e) => setSpotify(e.target.value)}
              placeholder="https://open.spotify.com/..."
              className={inputClass}
            />
          </Field>
          <Field label="Beatport">
            <input
              type="url"
              value={beatport}
              onChange={(e) => setBeatport(e.target.value)}
              placeholder="https://www.beatport.com/..."
              className={inputClass}
            />
          </Field>
          <Field label="Apple Music">
            <input
              type="url"
              value={apple}
              onChange={(e) => setApple(e.target.value)}
              placeholder="https://music.apple.com/..."
              className={inputClass}
            />
          </Field>
          <Field label="YouTube">
            <input
              type="url"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              placeholder="https://www.youtube.com/..."
              className={inputClass}
            />
          </Field>
          <Field label="Tidal">
            <input
              type="url"
              value={tidal}
              onChange={(e) => setTidal(e.target.value)}
              placeholder="https://tidal.com/..."
              className={inputClass}
            />
          </Field>
          <Field label="Deezer">
            <input
              type="url"
              value={deezer}
              onChange={(e) => setDeezer(e.target.value)}
              placeholder="https://www.deezer.com/..."
              className={inputClass}
            />
          </Field>
          <Field label="SoundCloud">
            <input
              type="url"
              value={soundcloud}
              onChange={(e) => setSoundcloud(e.target.value)}
              placeholder="https://soundcloud.com/..."
              className={inputClass}
            />
          </Field>
          <Field label="Smart link">
            <input
              type="url"
              value={smartlink}
              onChange={(e) => setSmartlink(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>
        </div>
      </div>

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
          {saving ? "Saving..." : editIndex !== undefined ? "Update release" : "Save release"}
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
