"use server";

import { revalidatePath } from "next/cache";
import { readReleases, writeReleases } from "@/lib/content-writer";
import { isAuthenticated } from "@/lib/auth";
import type { Release } from "@/types/content";

export async function saveRelease(
  release: Release,
  editIndex?: number,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAuthenticated())) return { success: false, error: "Unauthorized" };
  try {
    const releases = await readReleases();

    if (editIndex !== undefined && editIndex >= 0) {
      // Preserve enrichment fields not managed by the form
      const existing = releases[editIndex];
      releases[editIndex] = {
        ...release,
        ...(existing.deezerTrackId && { deezerTrackId: existing.deezerTrackId }),
        ...(existing.appearsOn && { appearsOn: existing.appearsOn }),
        ...(existing.relatedRelease && !release.relatedRelease && { relatedRelease: existing.relatedRelease }),
      };
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
  if (!(await isAuthenticated())) return { success: false, error: "Unauthorized" };
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
