import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAuthenticated } from "@/lib/auth";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB (client already resizes)

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  if (file.size > MAX_FILE_BYTES) return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const slug = ((formData.get("slug") as string) ?? "upload")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const filename = `artwork/${slug}.jpg`;

  // Upload to Vercel Blob in production
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, buffer, {
      access: "public",
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    const sizeKB = Math.round(buffer.length / 1024);
    return NextResponse.json({ path: blob.url, size: `${sizeKB}KB` });
  }

  // Local dev fallback: write to filesystem
  const { promises: fs } = await import("fs");
  const path = await import("path");
  const dir = path.join(process.cwd(), "public/artwork");
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.jpg`);
  await fs.writeFile(filePath, buffer);
  const sizeKB = Math.round(buffer.length / 1024);
  return NextResponse.json({ path: `/artwork/${slug}.jpg`, size: `${sizeKB}KB` });
}
