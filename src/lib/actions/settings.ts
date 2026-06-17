"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { businessHours, salonSettings, staffProfiles } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import {
  businessHoursDaySchema,
  salonSettingsSchema,
  staffIdSchema,
  staffPhoneSchema,
  staffRoleSchema,
} from "@/lib/validators/settings";

export async function updateSalonSettings(formData: FormData) {
  await requireAdmin();

  const parsed = salonSettingsSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    timezone: formData.get("timezone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, address, phone, timezone } = parsed.data;
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

    const parsed = businessHoursDaySchema.safeParse({
      dayOfWeek: day,
      openTime,
      closeTime,
      isClosed,
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid hours" };
    }

    const row = parsed.data;
    await db
      .insert(businessHours)
      .values({
        dayOfWeek: row.dayOfWeek,
        openTime: row.openTime,
        closeTime: row.closeTime,
        isClosed: row.isClosed,
      })
      .onConflictDoUpdate({
        target: businessHours.dayOfWeek,
        set: {
          openTime: row.openTime,
          closeTime: row.closeTime,
          isClosed: row.isClosed,
        },
      });
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function updateStaffRole(staffId: string, role: "admin" | "staff") {
  await requireAdmin();

  const idParsed = staffIdSchema.safeParse(staffId);
  const roleParsed = staffRoleSchema.safeParse(role);
  if (!idParsed.success || !roleParsed.success) {
    return { error: "Invalid input" };
  }

  const profile = await db.query.staffProfiles.findFirst({
    where: eq(staffProfiles.id, idParsed.data),
  });
  if (!profile) return { error: "Staff member not found" };

  const client = await clerkClient();
  await client.users.updateUserMetadata(profile.clerkUserId, {
    publicMetadata: { role: roleParsed.data },
  });

  await db
    .update(staffProfiles)
    .set({ role: roleParsed.data })
    .where(eq(staffProfiles.id, idParsed.data));

  revalidatePath("/admin/staff");
  return { success: true };
}

export async function toggleStaffActive(staffId: string, isActive: boolean) {
  await requireAdmin();

  const idParsed = staffIdSchema.safeParse(staffId);
  if (!idParsed.success) return { error: "Invalid staff ID" };

  const profile = await db.query.staffProfiles.findFirst({
    where: eq(staffProfiles.id, idParsed.data),
  });
  if (!profile) return { error: "Staff member not found" };

  const client = await clerkClient();

  if (isActive) {
    await client.users.updateUserMetadata(profile.clerkUserId, {
      publicMetadata: { role: profile.role },
    });
  } else {
    await client.users.updateUserMetadata(profile.clerkUserId, {
      publicMetadata: { role: null },
    });
  }

  await db
    .update(staffProfiles)
    .set({ isActive })
    .where(eq(staffProfiles.id, idParsed.data));

  revalidatePath("/admin/staff");
  return { success: true };
}

export async function updateStaffPhone(staffId: string, phone: string) {
  await requireAdmin();

  const idParsed = staffIdSchema.safeParse(staffId);
  if (!idParsed.success) return { error: "Invalid staff ID" };

  const phoneParsed = staffPhoneSchema.safeParse(phone.trim());
  if (!phoneParsed.success) {
    return { error: phoneParsed.error.issues[0]?.message ?? "Invalid phone" };
  }

  await db
    .update(staffProfiles)
    .set({ phone: phoneParsed.data || null })
    .where(eq(staffProfiles.id, idParsed.data));

  revalidatePath("/admin/staff");
  return { success: true };
}
