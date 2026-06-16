"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { businessHours, salonSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export async function updateSalonSettings(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const timezone = formData.get("timezone") as string;

  const existing = await db.query.salonSettings.findFirst();

  if (existing) {
    await db
      .update(salonSettings)
      .set({ name, address, phone, timezone })
      .where(eq(salonSettings.id, existing.id));
  } else {
    await db.insert(salonSettings).values({ name, address, phone, timezone });
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}

export async function updateBusinessHours(formData: FormData) {
  await requireAdmin();

  for (let day = 0; day <= 6; day++) {
    const isClosed = formData.get(`closed_${day}`) === "on";
    const openTime = (formData.get(`open_${day}`) as string) || "09:00";
    const closeTime = (formData.get(`close_${day}`) as string) || "17:00";

    await db
      .insert(businessHours)
      .values({ dayOfWeek: day, openTime, closeTime, isClosed })
      .onConflictDoUpdate({
        target: businessHours.dayOfWeek,
        set: { openTime, closeTime, isClosed },
      });
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updateStaffRole(staffId: string, role: "admin" | "staff") {
  await requireAdmin();

  const { staffProfiles } = await import("@/db/schema");
  await db
    .update(staffProfiles)
    .set({ role })
    .where(eq(staffProfiles.id, staffId));

  revalidatePath("/admin/staff");
  return { success: true };
}

export async function toggleStaffActive(staffId: string, isActive: boolean) {
  await requireAdmin();

  const { staffProfiles } = await import("@/db/schema");
  await db
    .update(staffProfiles)
    .set({ isActive })
    .where(eq(staffProfiles.id, staffId));

  revalidatePath("/admin/staff");
  return { success: true };
}

export async function updateStaffPhone(staffId: string, phone: string) {
  await requireAdmin();

  const { staffProfiles } = await import("@/db/schema");
  const trimmed = phone.trim();
  await db
    .update(staffProfiles)
    .set({ phone: trimmed || null })
    .where(eq(staffProfiles.id, staffId));

  revalidatePath("/admin/staff");
  return { success: true };
}
