import {
  SALON_FULL_NAME,
  SALON_NAME,
  SALON_SEO_DESCRIPTION,
  SALON_TAGLINE,
} from "@/lib/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "https://www.trypearlbeauty.com";

export const SITE_METADATA = {
  name: SALON_FULL_NAME,
  shortName: SALON_NAME,
  tagline: SALON_TAGLINE,
  description: SALON_SEO_DESCRIPTION,
  locale: "en_IN",
  location: "Thane West, Maharashtra",
} as const;

export const PUBLIC_SITEMAP_ROUTES = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/book", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/queue", priority: 0.7, changeFrequency: "monthly" as const },
] as const;
