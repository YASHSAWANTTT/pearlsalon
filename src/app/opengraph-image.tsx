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
          background: `linear-gradient(135deg, ${OG_COLORS.cream} 0%, ${OG_COLORS.blush} 50%, #EDE4E0 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: -100,
            right: -60,
            width: 380,
            height: 380,
            borderRadius: "50%",
            border: "1px solid rgba(142, 27, 46, 0.1)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: -140,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(142, 27, 46, 0.05)",
          }}
        />

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 64,
            padding: "48px 72px",
          }}
        >
          {/* Logo — square source, render at native aspect ratio */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 340,
              height: 340,
              borderRadius: 24,
              background: "rgba(255,255,255,0.72)",
              boxShadow: "0 24px 60px rgba(142, 27, 46, 0.1)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt=""
              width={300}
              height={300}
              style={{ objectFit: "contain" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              width: 4,
              height: 220,
              background: `linear-gradient(180deg, transparent 0%, ${OG_COLORS.burgundy} 50%, transparent 100%)`,
              opacity: 0.35,
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              maxWidth: 560,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 20,
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color: OG_COLORS.burgundy,
                fontFamily: "Helvetica, Arial, sans-serif",
              }}
            >
              {SALON_NAME} Beauty & Spa
            </p>

            <h1
              style={{
                margin: "20px 0 0",
                fontSize: 58,
                fontWeight: 400,
                lineHeight: 1.12,
                color: OG_COLORS.ink,
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
              }}
            >
              {SALON_TAGLINE}
            </h1>

            <p
              style={{
                margin: "28px 0 0",
                fontSize: 24,
                color: OG_COLORS.muted,
                fontFamily: "Helvetica, Arial, sans-serif",
              }}
            >
              {SITE_METADATA.location}
            </p>

            <p
              style={{
                margin: "12px 0 0",
                fontSize: 18,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: OG_COLORS.burgundy,
                fontFamily: "Helvetica, Arial, sans-serif",
                opacity: 0.85,
              }}
            >
              Book online · Walk-ins welcome
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            height: 5,
            width: "100%",
            background: `linear-gradient(90deg, ${OG_COLORS.burgundy} 0%, #B83248 50%, ${OG_COLORS.burgundy} 100%)`,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
