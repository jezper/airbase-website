"use client";

import { DeleteButton } from "./delete-button";
import { deletePressEntry } from "@/app/admin/(protected)/press/actions";

export function DeletePressButton({ index, label }: { index: number; label: string }) {
  return <DeleteButton label={label} onDelete={() => deletePressEntry(index)} />;
}
