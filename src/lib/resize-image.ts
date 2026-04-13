/**
 * Resize an image file on the client before uploading.
 * Returns a Blob under the target size.
 */
export async function resizeImage(
  file: File,
  maxSize = 1200,
  maxBytes = 4 * 1024 * 1024, // 4MB to stay under Vercel's 4.5MB limit
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  let targetW = width;
  let targetH = height;

  if (width > maxSize || height > maxSize) {
    const ratio = Math.min(maxSize / width, maxSize / height);
    targetW = Math.round(width * ratio);
    targetH = Math.round(height * ratio);
  }

  const canvas = new OffscreenCanvas(targetW, targetH);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  let quality = 0.85;
  let blob = await canvas.convertToBlob({ type: "image/jpeg", quality });

  // Reduce quality until under maxBytes
  while (blob.size > maxBytes && quality > 0.3) {
    quality -= 0.1;
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
  }

  return blob;
}
