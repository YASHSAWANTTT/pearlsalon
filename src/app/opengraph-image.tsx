import { ImageResponse } from "next/og";
import { SALON_NAME, SALON_TAGLINE } from "@/lib/constants";
import { SITE_METADATA } from "@/lib/site";
import { loadPearlLogoDataUrl, OG_COLORS } from "@/lib/og-shared";

export const alt = `${SALON_NAME} — ${SALON_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await loadPearlLogoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${OG_COLORS.cream} 0%, ${OG_COLORS.blush} 48%, #EFE6E3 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            border: `1px solid rgba(142, 27, 46, 0.12)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -100,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(142, 27, 46, 0.04)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "72px 80px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={220} height={96} />

          <p
            style={{
              marginTop: 40,
              fontSize: 22,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: OG_COLORS.burgundy,
              fontFamily: "Georgia, serif",
            }}
          >
            Beauty & Spa Salon
          </p>

          <h1
            style={{
              marginTop: 16,
              fontSize: 72,
              fontWeight: 400,
              lineHeight: 1.05,
              color: OG_COLORS.ink,
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              maxWidth: 900,
            }}
          >
            {SALON_TAGLINE}
          </h1>

          <p
            style={{
              marginTop: 28,
              fontSize: 26,
              color: OG_COLORS.muted,
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            {SITE_METADATA.location} · Book online
          </p>
        </div>

        <div
          style={{
            height: 6,
            width: "100%",
            background: `linear-gradient(90deg, ${OG_COLORS.burgundy} 0%, #B83248 50%, ${OG_COLORS.burgundy} 100%)`,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
