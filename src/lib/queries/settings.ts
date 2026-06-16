import { eq } from "drizzle-orm";
import { db } from "@/db";
import { businessHours, salonSettings } from "@/db/schema";
import { SALON_CONTACT, SALON_NAME } from "@/lib/constants";

export async function getSalonSettings() {
  const settings = await db.query.salonSettings.findFirst();
  return (
    settings ?? {
      id: "",
      name: SALON_NAME,
      address: SALON_CONTACT.address,
      phone: SALON_CONTACT.phone,
      timezone: "Asia/Kolkata",
    }
  );
}

export async function getBusinessHours() {
  return db.query.businessHours.findMany({
    orderBy: (hours, { asc }) => [asc(hours.dayOfWeek)],
  });
}

export async function getBusinessHoursForDay(dayOfWeek: number) {
  return db.query.businessHours.findFirst({
    where: eq(businessHours.dayOfWeek, dayOfWeek),
  });
}

export async function getAllStaff() {
  return db.query.staffProfiles.findMany({
    orderBy: (staff, { asc }) => [asc(staff.displayName)],
  });
}
