import { NextRequest, NextResponse } from "next/server";
import { writeSiteConfig } from "@/lib/content-writer";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await req.json();
  await writeSiteConfig(config);
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
