"use client";

import { DeleteButton } from "./delete-button";
import { deleteShow } from "@/app/admin/(protected)/shows/actions";

export function DeleteShowButton({ index, label }: { index: number; label: string }) {
  return <DeleteButton label={label} onDelete={() => deleteShow(index)} />;
}
