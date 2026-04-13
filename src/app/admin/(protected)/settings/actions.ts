"use server";

import { revalidatePath } from "next/cache";
import { writeSiteConfig } from "@/lib/content-writer";
import { isAuthenticated } from "@/lib/auth";
import type { SiteConfig } from "@/lib/content-writer";

export async function saveSiteConfig(
  config: SiteConfig,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAuthenticated())) return { success: false, error: "Unauthorized" };
  try {
    await writeSiteConfig(config);
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
