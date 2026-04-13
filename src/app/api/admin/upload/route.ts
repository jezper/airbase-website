import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { isAuthenticated } from "@/lib/auth";

const MAX_SIZE = 1200;
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  if (file.size > MAX_FILE_BYTES) return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const slug = ((formData.get("slug") as string) ?? "upload")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const filename = `${slug}.jpg`;
  const dir = path.join(process.cwd(), "public/artwork");
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);

  // Resize to max 1200px, convert to JPEG, compress to 80% quality
  try {
    await sharp(buffer)
      .resize(MAX_SIZE, MAX_SIZE, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(filePath);
  } catch {
    return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
  }

  const stat = await fs.stat(filePath);
  const sizeKB = Math.round(stat.size / 1024);

  return NextResponse.json({
    path: `/artwork/${filename}`,
    size: `${sizeKB}KB`,
  });
}
