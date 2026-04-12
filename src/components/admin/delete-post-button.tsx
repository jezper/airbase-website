"use client";

import { DeleteButton } from "./delete-button";
import { deletePost } from "@/app/admin/(protected)/posts/actions";

export function DeletePostButton({ index, label }: { index: number; label: string }) {
  return <DeleteButton label={label} onDelete={() => deletePost(index)} />;
}
