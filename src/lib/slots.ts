import "server-only";

import { addMinutes, format, isBefore, isAfter, parseISO } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { and, eq, gte, lt, ne } from "drizzle-orm";
import { db } from "@/db";
import { appointments, businessHours } from "@/db/schema";
import { getSalonTimezone } from "@/lib/constants";

export { formatSlot, formatSlotDate } from "@/lib/datetime";

export async function getAvailableSlots(
  dateStr: string,
  serviceDurationMinutes: number
): Promise<string[]> {
  const timezone = getSalonTimezone();
  const salonDate = toZonedTime(parseISO(`${dateStr}T12:00:00`), timezone);
  const dayOfWeek = salonDate.getDay();
  const [year, month, day] = dateStr.split("-").map(Number);

  const hours = await db.query.businessHours.findFirst({
    where: eq(businessHours.dayOfWeek, dayOfWeek),
  });

  if (!hours || hours.isClosed) return [];

  const [openH, openM] = hours.openTime.split(":").map(Number);
  const [closeH, closeM] = hours.closeTime.split(":").map(Number);

  const dayStart = fromZonedTime(
    new Date(year, month - 1, day, openH, openM),
    timezone
  );
  const dayEnd = fromZonedTime(
    new Date(year, month - 1, day, closeH, closeM),
    timezone
  );

  const nextDayStart = fromZonedTime(
    new Date(year, month - 1, day + 1, 0, 0),
    timezone
  );
  const existingAppointments = await db.query.appointments.findMany({
    where: and(
      gte(appointments.scheduledAt, dayStart),
      lt(appointments.scheduledAt, nextDayStart),
      ne(appointments.status, "cancelled")
    ),
  });

  const slots: string[] = [];
  let current = dayStart;
  const slotInterval = 30;

  while (isBefore(addMinutes(current, serviceDurationMinutes), dayEnd) || 
         format(addMinutes(current, serviceDurationMinutes), "HH:mm") === format(dayEnd, "HH:mm")) {
    const slotEnd = addMinutes(current, serviceDurationMinutes);
    const hasConflict = existingAppointments.some((appt) => {
      const apptStart = new Date(appt.scheduledAt);
      const apptEnd = addMinutes(apptStart, serviceDurationMinutes);
      return current < apptEnd && slotEnd > apptStart;
    });

    const now = new Date();
    if (!hasConflict && isAfter(current, now)) {
      slots.push(current.toISOString());
    }

    current = addMinutes(current, slotInterval);
  }

  return slots;
}

export async function isSalonOpenToday(): Promise<boolean> {
  const timezone = getSalonTimezone();
  const now = toZonedTime(new Date(), timezone);
  const dayOfWeek = now.getDay();

  const hours = await db.query.businessHours.findFirst({
    where: eq(businessHours.dayOfWeek, dayOfWeek),
  });

  return !!hours && !hours.isClosed;
}
