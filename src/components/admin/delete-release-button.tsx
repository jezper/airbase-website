"use client";

import { DeleteButton } from "./delete-button";
import { deleteRelease } from "@/app/admin/(protected)/releases/actions";

export function DeleteReleaseButton({ index, label }: { index: number; label: string }) {
  return <DeleteButton label={label} onDelete={() => deleteRelease(index)} />;
}
