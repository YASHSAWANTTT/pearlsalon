"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { dailyLogEntries } from "@/db/schema";
import { getStaffProfile, requireStaff } from "@/lib/auth";
import {
  bulkLogEntrySchema,
  logEntrySchema,
  updateLogEntrySchema,
} from "@/lib/validators/logbook";

function revalidateLogbookPaths() {
  revalidatePath("/staff/logbook");
  revalidatePath("/admin/logbook");
  revalidatePath("/admin");
  revalidatePath("/staff");
}

export async function createLogEntry(formData: FormData) {
  await requireStaff();
  const profile = await getStaffProfile();

  const raw = {
    logDate: formData.get("logDate") as string,
    entryType: formData.get("entryType") as string,
    customerName: (formData.get("customerName") as string) || undefined,
    description: formData.get("description") as string,
    amount: formData.get("amount") as string,
    referenceId: (formData.get("referenceId") as string) || undefined,
    serviceId: (formData.get("serviceId") as string) || undefined,
    photoUrl: (formData.get("photoUrl") as string) || undefined,
    source: (formData.get("source") as string) || "manual",
  };

  const parsed = logEntrySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.insert(dailyLogEntries).values({
    logDate: parsed.data.logDate,
    entryType: parsed.data.entryType,
    customerName: parsed.data.customerName?.trim() || null,
    description: parsed.data.description,
    amount: parsed.data.amount?.toString() ?? null,
    staffId: profile?.id ?? null,
    referenceId: parsed.data.referenceId ?? null,
    serviceId: parsed.data.serviceId || null,
    photoUrl: parsed.data.photoUrl ?? null,
    source: parsed.data.source ?? "manual",
  });

  revalidateLogbookPaths();
  return { success: true };
}

export async function updateLogEntry(formData: FormData) {
  await requireStaff();

  const raw = {
    id: formData.get("id") as string,
    logDate: formData.get("logDate") as string,
    entryType: formData.get("entryType") as string,
    customerName: (formData.get("customerName") as string) || undefined,
    description: formData.get("description") as string,
    amount: formData.get("amount") as string,
    serviceId: (formData.get("serviceId") as string) || undefined,
  };

  const parsed = updateLogEntrySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db
    .update(dailyLogEntries)
    .set({
      logDate: parsed.data.logDate,
      entryType: parsed.data.entryType,
      customerName: parsed.data.customerName?.trim() || null,
      description: parsed.data.description,
      amount: parsed.data.amount?.toString() ?? null,
      serviceId: parsed.data.serviceId || null,
    })
    .where(eq(dailyLogEntries.id, parsed.data.id));

  revalidateLogbookPaths();
  return { success: true };
}

export async function deleteLogEntry(id: string) {
  await requireStaff();

  if (!id) return { error: "Entry ID is required" };

  await db.delete(dailyLogEntries).where(eq(dailyLogEntries.id, id));

  revalidateLogbookPaths();
  return { success: true };
}

export async function bulkCreateLogEntries(payload: unknown) {
  await requireStaff();
  const profile = await getStaffProfile();

  const parsed = bulkLogEntrySchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { items, photoUrl } = parsed.data;

  await db.insert(dailyLogEntries).values(
    items.map((item) => ({
      logDate: item.logDate,
      entryType: item.entryType,
      customerName: item.customerName?.trim() || null,
      description: item.description,
      amount: item.amount.toString(),
      staffId: profile?.id ?? null,
      serviceId: item.serviceId ?? null,
      photoUrl: photoUrl ?? null,
      source: "ai" as const,
    }))
  );

  revalidateLogbookPaths();
  return { success: true, count: items.length };
}
