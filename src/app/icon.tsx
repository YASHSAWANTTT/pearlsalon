import { ImageResponse } from "next/og";
import { PearlMark } from "@/lib/brand-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<PearlMark size={32} variant="light" />, { ...size });
}
