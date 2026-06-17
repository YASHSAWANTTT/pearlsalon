"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { staffProfiles } from "@/db/schema";
import { getStaffProfile, requireAuth } from "@/lib/auth";

async function getActiveStaffProfile() {
  const userId = await requireAuth();
  const profile = await getStaffProfile();
  if (!profile || profile.clerkUserId !== userId) return null;
  return profile;
}

export async function markAppointmentsSeen() {
  const profile = await getActiveStaffProfile();
  if (!profile) return;

  await db
    .update(staffProfiles)
    .set({ lastSeenAppointmentsAt: new Date() })
    .where(eq(staffProfiles.id, profile.id));

  revalidatePath("/staff", "layout");
}

export async function markQueueSeen() {
  const profile = await getActiveStaffProfile();
  if (!profile) return;

  await db
    .update(staffProfiles)
    .set({ lastSeenQueueAt: new Date() })
    .where(eq(staffProfiles.id, profile.id));

  revalidatePath("/staff", "layout");
}
