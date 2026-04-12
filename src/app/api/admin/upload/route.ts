import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const exec = promisify(execFile);
const MAX_SIZE = 1200; // Max dimension in pixels

async function resizeImage(filePath: string): Promise<void> {
  try {
    // Use sips (macOS) to resize if larger than MAX_SIZE
    const { stdout } = await exec("sips", ["-g", "pixelWidth", "-g", "pixelHeight", filePath]);
    const width = parseInt(stdout.match(/pixelWidth:\s*(\d+)/)?.[1] ?? "0");
    const height = parseInt(stdout.match(/pixelHeight:\s*(\d+)/)?.[1] ?? "0");

    if (width > MAX_SIZE || height > MAX_SIZE) {
      await exec("sips", ["-Z", MAX_SIZE.toString(), filePath]);
      // Also compress JPEG quality
      if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
        await exec("sips", ["-s", "formatOptions", "80", filePath]);
      }
    }
  } catch {
    // sips not available (Linux/production) — skip resize, serve original
    // In production, use Next.js Image component for on-the-fly optimization
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const slug = ((formData.get("slug") as string) ?? "upload")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const filename = `${slug}.${ext}`;
  const dir = path.join(process.cwd(), "public/artwork");
  await fs.mkdir(dir, { recursive: true });

  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, buffer);

  // Auto-resize to max 1200px
  await resizeImage(filePath);

  const stat = await fs.stat(filePath);
  const sizeMB = (stat.size / 1024 / 1024).toFixed(1);

  return NextResponse.json({
    path: `/artwork/${filename}`,
    size: `${sizeMB}MB`,
  });
}
