import { ImageResponse } from "next/og";
import { SALON_NAME } from "@/lib/constants";
import { PearlMark } from "@/lib/brand-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          background: "radial-gradient(circle at 30% 18%, #FFFCFA 0%, #F6F1EF 55%, #EBE2DE 100%)",
        }}
      >
        <PearlMark size={112} variant="light" />
        <p
          style={{
            margin: 0,
            fontSize: 28,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#8E1B2E",
            fontFamily: "Georgia, serif",
          }}
        >
          {SALON_NAME}
        </p>
      </div>
    ),
    { ...size }
  );
}
