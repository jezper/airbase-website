"use server";

import { revalidatePath } from "next/cache";
import { readPress, writePress } from "@/lib/content-writer";
import { isAuthenticated } from "@/lib/auth";
import type { PressFeature } from "@/types/content";

export async function savePressEntry(
  entry: PressFeature,
  editIndex?: number,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAuthenticated())) return { success: false, error: "Unauthorized" };
  try {
    const items = await readPress();

    if (editIndex !== undefined && editIndex >= 0) {
      items[editIndex] = entry;
    } else {
      items.unshift(entry);
    }

    await writePress(items);
    revalidatePath("/press");
    revalidatePath("/admin/press");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deletePressEntry(
  index: number,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAuthenticated())) return { success: false, error: "Unauthorized" };
  try {
    const items = await readPress();
    if (index < 0 || index >= items.length) {
      return { success: false, error: "Press entry not found." };
    }
    items.splice(index, 1);
    await writePress(items);
    revalidatePath("/press");
    revalidatePath("/admin/press");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
