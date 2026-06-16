import { SALON_NAME, SALON_TAGLINE } from "@/lib/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "https://www.trypearlbeauty.com";

export const SITE_METADATA = {
  name: SALON_NAME,
  tagline: SALON_TAGLINE,
  locale: "en_IN",
  location: "Thane West, Maharashtra",
} as const;
