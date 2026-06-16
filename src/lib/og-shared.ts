import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_COLORS = {
  cream: "#FCFBFA",
  blush: "#F6F1EF",
  burgundy: "#8E1B2E",
  ink: "#17120F",
  muted: "#6E6662",
} as const;

export async function loadPearlLogoDataUrl() {
  const buffer = await readFile(join(process.cwd(), "public/pearl-logo.png"));
  return `data:image/png;base64,${buffer.toString("base64")}`;
}
