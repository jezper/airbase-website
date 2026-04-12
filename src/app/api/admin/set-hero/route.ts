import { NextRequest, NextResponse } from "next/server";
import { writeSiteConfig } from "@/lib/content-writer";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const config = await req.json();
  await writeSiteConfig(config);
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
