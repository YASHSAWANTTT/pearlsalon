const MAX_BYTES = 10 * 1024 * 1024;

type DetectedImage = {
  mime: string;
};

function detectImageType(buffer: Buffer): DetectedImage | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg" };
  }
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { mime: "image/png" };
  }
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { mime: "image/webp" };
  }
  return null;
}

/** Read and validate an upload for AI extraction — not persisted. */
export async function readLogbookImage(file: File): Promise<{ buffer: Buffer; mime: string }> {
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be under 10 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectImageType(buffer);
  if (!detected) {
    throw new Error("Please upload a JPEG, PNG, or WebP image.");
  }

  return { buffer, mime: detected.mime };
}
