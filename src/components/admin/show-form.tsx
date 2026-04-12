"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Show, ShowStatus } from "@/types/content";
import { saveShow } from "@/app/admin/(protected)/shows/actions";

interface ShowFormProps {
  initialShow?: Show;
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

export function ShowForm({ initialShow, editIndex }: ShowFormProps) {
  const router = useRouter();

  const [venue, setVenue] = useState(initialShow?.venue ?? "");
  const [city, setCity] = useState(initialShow?.city ?? "");
  const [country, setCountry] = useState(initialShow?.country ?? "");
  const [event, setEvent] = useState(initialShow?.event ?? "");
  const [date, setDate] = useState(initialShow?.date ?? "");
  const [yearApprox, setYearApprox] = useState(initialShow?.year_approx ?? "");
  const [status, setStatus] = useState<ShowStatus>(initialShow?.status ?? "past");
  const [notes, setNotes] = useState(initialShow?.notes ?? "");
  const [image, setImage] = useState(initialShow?.image ?? "");
  const [ticketLink, setTicketLink] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!venue.trim()) {
      setError("Venue is required.");
      return;
    }
    if (!city.trim()) {
      setError("City is required.");
      return;
    }
    if (!country.trim()) {
      setError("Country is required.");
      return;
    }
    if (!date && !yearApprox.trim()) {
      setError("Either a date or an approximate year is required.");
      return;
    }

    setSaving(true);
    setError("");

    const show: Show = {
      venue: venue.trim(),
      city: city.trim(),
      country: country.trim(),
      date: date || null,
      year_approx: yearApprox.trim() || null,
      event: event.trim() || null,
      notes: notes.trim() || null,
      image: image.trim() || null,
      status,
    };

    const result = await saveShow(show, editIndex);

    if (result.success) {
      router.push("/admin/shows");
      router.refresh();
    } else {
      setError(result.error ?? "Failed to save show.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Venue */}
      <Field label="Venue" required>
        <input
          type="text"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="Club name or venue"
          className={inputClass}
        />
      </Field>

      {/* City + Country row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="City" required>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Amsterdam"
            className={inputClass}
          />
        </Field>

        <Field label="Country" required>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Netherlands"
            className={inputClass}
          />
        </Field>
      </div>

      {/* Event */}
      <Field label="Event name">
        <input
          type="text"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="A State Of Trance, Sensation, etc."
          className={inputClass}
        />
      </Field>

      {/* Date + Year approx row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputClass} font-mono`}
          />
        </Field>

        <Field label="Approximate year (if no exact date)">
          <input
            type="text"
            value={yearApprox}
            onChange={(e) => setYearApprox(e.target.value)}
            placeholder="2003"
            className={`${inputClass} font-mono`}
          />
        </Field>
      </div>

      {/* Status */}
      <Field label="Status" required>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ShowStatus)}
          className={selectClass}
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </Field>

      {/* Notes */}
      <Field label="Notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any notes about this show..."
          className={`${inputClass} resize-y`}
        />
      </Field>

      {/* Image + Ticket link row */}
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

        <Field label="Ticket link">
          <input
            type="url"
            value={ticketLink}
            onChange={(e) => setTicketLink(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
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
          {saving ? "Saving..." : editIndex !== undefined ? "Update show" : "Save show"}
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
