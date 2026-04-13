"use server";

import { revalidatePath } from "next/cache";
import { readShows, writeShows } from "@/lib/content-writer";
import { isAuthenticated } from "@/lib/auth";
import type { Show } from "@/types/content";

export async function saveShow(
  show: Show,
  editIndex?: number,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAuthenticated())) return { success: false, error: "Unauthorized" };
  try {
    const shows = await readShows();

    if (editIndex !== undefined && editIndex >= 0) {
      shows[editIndex] = show;
    } else {
      shows.unshift(show);
    }

    await writeShows(shows);
    revalidatePath("/shows");
    revalidatePath("/admin/shows");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deleteShow(
  index: number,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAuthenticated())) return { success: false, error: "Unauthorized" };
  try {
    const shows = await readShows();
    if (index < 0 || index >= shows.length) {
      return { success: false, error: "Show not found." };
    }
    shows.splice(index, 1);
    await writeShows(shows);
    revalidatePath("/shows");
    revalidatePath("/admin/shows");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
