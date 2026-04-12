"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";

interface SetHeroButtonProps {
  type: "release" | "post" | "show" | "custom";
  index: number;
  isCurrentHero: boolean;
}

export function SetHeroButton({ type, index, isCurrentHero }: SetHeroButtonProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleClick() {
    if (isCurrentHero) return;
    setSaving(true);
    try {
      const config = {
        hero: {
          type,
          ...(type === "release" ? { releaseIndex: index } : {}),
          ...(type === "post" ? { postIndex: index } : {}),
          ...(type === "show" ? { showIndex: index } : {}),
        },
      };
      // Write directly via the settings action
      const res = await fetch("/api/admin/set-hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={saving || isCurrentHero}
      className={`font-body text-xs transition-colors ${
        isCurrentHero
          ? "text-accent font-bold cursor-default"
          : "text-text-faint hover:text-accent"
      }`}
      title={isCurrentHero ? "Currently featured on home page" : "Set as hero on home page"}
    >
      <Star size={13} fill={isCurrentHero ? "currentColor" : "none"} />
    </button>
  );
}
