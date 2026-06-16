export const SALON_NAME = "Pearl";
export const SALON_TAGLINE = "Where elegance meets relaxation";

export const SALON_CONTACT = {
  address:
    "Shop No 54, Vardhaman Vatika, Opp D mart, Dhokali, Thane West, Maharashtra 400607, India",
  phone: "+919987881614",
  phoneDisplay: "+91 99878 81614",
  whatsappUrl: "https://wa.me/+919987881614",
  facebookUrl: "https://www.facebook.com/pearlbeautyandspasalon/",
  instagramUrl: "https://www.instagram.com/pearlbeautyandspasalon/",
  mapsUrl: "https://maps.app.goo.gl/nV28jQSntsKDN7LW9",
  mapsEmbedUrl:
    "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=19.2239083,72.9788826&z=16&ie=UTF8&iwloc=B&output=embed",
} as const;

export const APPOINTMENT_STATUSES = [
  "pending",
  "confirmed",
  "checked_in",
  "completed",
  "cancelled",
  "no_show",
] as const;

export const QUEUE_STATUSES = [
  "waiting",
  "called",
  "in_service",
  "completed",
  "left",
] as const;

export const LOG_ENTRY_TYPES = [
  "revenue",
  "expense",
  "note",
  "appointment",
  "queue",
] as const;

export const SERVICE_CATEGORIES = [
  "Facials",
  "D-Tan",
  "Normal Waxing",
  "Rica Waxing",
  "Bleach",
  "Threading",
  "Head Massage",
  "Polishing",
] as const;

export function getSalonTimezone() {
  return (
    process.env.NEXT_PUBLIC_SALON_TIMEZONE ??
    process.env.SALON_TIMEZONE ??
    "Asia/Kolkata"
  );
}

export function formatPrice(price: string | number) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
