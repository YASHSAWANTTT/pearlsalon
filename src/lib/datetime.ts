import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { getSalonTimezone } from "@/lib/constants";

export function formatSlot(isoString: string, timezone?: string) {
  const tz = timezone ?? getSalonTimezone();
  const zoned = toZonedTime(new Date(isoString), tz);
  return format(zoned, "h:mm a");
}

export function formatSlotDate(isoString: string, timezone?: string) {
  const tz = timezone ?? getSalonTimezone();
  const zoned = toZonedTime(new Date(isoString), tz);
  return format(zoned, "EEEE, MMMM d, yyyy 'at' h:mm a");
}

export function formatAppointmentDate(isoString: string, timezone?: string) {
  const tz = timezone ?? getSalonTimezone();
  const zoned = toZonedTime(new Date(isoString), tz);
  return format(zoned, "EEEE, MMMM d, yyyy");
}

export function formatAppointmentTime(isoString: string, timezone?: string) {
  return formatSlot(isoString, timezone);
}

export function getSalonHour(isoString: string, timezone?: string) {
  const tz = timezone ?? getSalonTimezone();
  return toZonedTime(new Date(isoString), tz).getHours();
}
