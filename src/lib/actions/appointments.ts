"use server";

import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  bookAppointmentSchema,
  updateAppointmentStatusSchema,
} from "@/lib/validators/appointments";
import { requireStaff } from "@/lib/auth";
import { getSalonTimezone } from "@/lib/constants";
import { getServiceById } from "@/lib/queries/services";
import { getAppointmentById } from "@/lib/queries/appointments";
import { getAvailableSlots } from "@/lib/slots";
import {
  notifyAppointmentCreated,
  notifyAppointmentStatus,
} from "@/lib/notifications/notify";
import { getClientIp, rateLimitBooking } from "@/lib/rate-limit";

export async function createAppointment(formData: FormData) {
  const ip = await getClientIp();
  const limited = await rateLimitBooking(ip);
  if (!limited.ok) {
    return { error: "Too many booking attempts. Please wait and try again." };
  }

  const raw = {
    customerName: formData.get("customerName") as string,
    customerPhone: formData.get("customerPhone") as string,
    customerEmail: (formData.get("customerEmail") as string) || "",
    serviceId: formData.get("serviceId") as string,
    scheduledAt: formData.get("scheduledAt") as string,
    notes: (formData.get("notes") as string) || "",
  };

  const parsed = bookAppointmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const service = await getServiceById(parsed.data.serviceId);
  if (!service?.isActive) {
    return { error: "Please select a valid service." };
  }

  const scheduledAt = new Date(parsed.data.scheduledAt);
  if (Number.isNaN(scheduledAt.getTime())) {
    return { error: "Invalid appointment time." };
  }

  const timezone = getSalonTimezone();
  const dateStr = format(toZonedTime(scheduledAt, timezone), "yyyy-MM-dd");
  const available = await getAvailableSlots(dateStr, service.durationMinutes);
  const scheduledIso = scheduledAt.toISOString();

  if (!available.some((slot) => new Date(slot).toISOString() === scheduledIso)) {
    return { error: "This time slot is no longer available. Please choose another." };
  }

  const [appointment] = await db
    .insert(appointments)
    .values({
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerEmail: parsed.data.customerEmail || null,
      serviceId: parsed.data.serviceId,
      scheduledAt,
      notes: parsed.data.notes || null,
      status: "pending",
    })
    .returning();

  await notifyAppointmentCreated({
    customerName: appointment.customerName,
    customerPhone: appointment.customerPhone,
    customerEmail: appointment.customerEmail,
    serviceName: service.name,
    scheduledAtIso: appointment.scheduledAt.toISOString(),
  });

  return { success: true, appointment };
}

export async function updateAppointmentStatus(formData: FormData) {
  await requireStaff();

  const raw = {
    id: formData.get("id") as string,
    status: formData.get("status") as string,
  };

  const parsed = updateAppointmentStatusSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  await db
    .update(appointments)
    .set({ status: parsed.data.status })
    .where(eq(appointments.id, parsed.data.id));

  if (parsed.data.status === "confirmed" || parsed.data.status === "cancelled") {
    const record = await getAppointmentById(parsed.data.id);
    if (record) {
      await notifyAppointmentStatus(
        {
          customerName: record.appointment.customerName,
          customerPhone: record.appointment.customerPhone,
          customerEmail: record.appointment.customerEmail,
          serviceName: record.service.name,
          scheduledAtIso: record.appointment.scheduledAt.toISOString(),
        },
        parsed.data.status
      );
    }
  }

  revalidatePath("/staff/appointments");
  revalidatePath("/admin/appointments");
  return { success: true };
}
