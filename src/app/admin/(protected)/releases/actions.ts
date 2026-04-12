"use server";

import { revalidatePath } from "next/cache";
import { readReleases, writeReleases } from "@/lib/content-writer";
import type { Release } from "@/types/content";

export async function saveRelease(
  release: Release,
  editIndex?: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const releases = await readReleases();

    if (editIndex !== undefined && editIndex >= 0) {
      releases[editIndex] = release;
    } else {
      releases.unshift(release);
    }

    // Sort by date descending
    releases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    await writeReleases(releases);
    revalidatePath("/discography");
    revalidatePath("/admin/releases");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deleteRelease(
  index: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const releases = await readReleases();
    if (index < 0 || index >= releases.length) {
      return { success: false, error: "Release not found." };
    }
    releases.splice(index, 1);
    await writeReleases(releases);
    revalidatePath("/discography");
    revalidatePath("/admin/releases");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
