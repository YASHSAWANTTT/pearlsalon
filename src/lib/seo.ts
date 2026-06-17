import type { BusinessHour } from "@/db/schema";
import {
  SALON_ADDRESS,
  SALON_CONTACT,
  SALON_COORDINATES,
  SALON_FULL_NAME,
  SALON_SEO_DESCRIPTION,
} from "@/lib/constants";
import { SITE_METADATA, SITE_URL } from "@/lib/site";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const DEFAULT_HOURS: BusinessHour[] = DAY_NAMES.map((_, dayOfWeek) => ({
  dayOfWeek,
  openTime: "11:00:00",
  closeTime: "19:00:00",
  isClosed: false,
}));

function formatSchemaTime(time: string) {
  return time.slice(0, 5);
}

function buildOpeningHoursSpecification(hours: BusinessHour[]) {
  return hours
    .filter((hour) => !hour.isClosed)
    .map((hour) => ({
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: DAY_NAMES[hour.dayOfWeek],
      opens: formatSchemaTime(hour.openTime),
      closes: formatSchemaTime(hour.closeTime),
    }));
}

export function buildLocalBusinessJsonLd(hours: BusinessHour[] = DEFAULT_HOURS) {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: SALON_FULL_NAME,
    description: SALON_SEO_DESCRIPTION,
    url: SITE_URL,
    telephone: SALON_CONTACT.phone,
    image: `${SITE_URL}/opengraph-image`,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: SALON_ADDRESS.street,
      addressLocality: SALON_ADDRESS.locality,
      addressRegion: SALON_ADDRESS.region,
      postalCode: SALON_ADDRESS.postalCode,
      addressCountry: SALON_ADDRESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SALON_COORDINATES.latitude,
      longitude: SALON_COORDINATES.longitude,
    },
    openingHoursSpecification: buildOpeningHoursSpecification(hours),
    sameAs: [
      SALON_CONTACT.instagramUrl,
      SALON_CONTACT.facebookUrl,
      SALON_CONTACT.mapsUrl,
    ],
    areaServed: {
      "@type": "City",
      name: SITE_METADATA.location,
    },
  };
}
