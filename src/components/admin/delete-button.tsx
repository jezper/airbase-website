"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  label: string;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
}

export function DeleteButton({ label, onDelete }: DeleteButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setBusy(true);
    const result = await onDelete();
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error ?? "Delete failed.");
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="font-body text-xs transition-colors disabled:opacity-40"
      style={{ color: "#e55" }}
      aria-label={`Delete ${label}`}
    >
      {busy ? "Deleting..." : "Delete"}
    </button>
  );
}
