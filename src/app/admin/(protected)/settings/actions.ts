"use server";

import { revalidatePath } from "next/cache";
import { writeSiteConfig } from "@/lib/content-writer";
import type { SiteConfig } from "@/lib/content-writer";

export async function saveSiteConfig(
  config: SiteConfig,
): Promise<{ success: boolean; error?: string }> {
  try {
    await writeSiteConfig(config);
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
