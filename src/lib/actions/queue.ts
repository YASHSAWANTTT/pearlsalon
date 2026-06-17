"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { and, asc, eq } from "drizzle-orm";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { db } from "@/db";
import { queueEntries } from "@/db/schema";
import { requireStaff } from "@/lib/auth";
import { getSalonTimezone } from "@/lib/constants";
import { getNextQueuePosition, getQueueEntryById } from "@/lib/queries/queue";
import { getServiceById } from "@/lib/queries/services";
import {
  joinQueueSchema,
  updateQueueStatusSchema,
} from "@/lib/validators/queue";
import { isSalonOpenToday } from "@/lib/slots";
import { notifyQueueJoined, notifyQueueStatus } from "@/lib/notifications/notify";
import { getClientIp, rateLimitQueueJoin } from "@/lib/rate-limit";

function generateToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  let token = "";
  for (let i = 0; i < 8; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}

export async function joinQueue(formData: FormData) {
  const ip = await getClientIp();
  const limited = await rateLimitQueueJoin(ip);
  if (!limited.ok) {
    return { error: "Too many queue requests. Please wait and try again." };
  }

  const open = await isSalonOpenToday();
  if (!open) {
    return { error: "The salon is closed today. Please come back during business hours." };
  }

  const raw = {
    customerName: formData.get("customerName") as string,
    customerPhone: formData.get("customerPhone") as string,
    serviceId: formData.get("serviceId") as string,
  };

  const parsed = joinQueueSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const timezone = getSalonTimezone();
  const today = format(toZonedTime(new Date(), timezone), "yyyy-MM-dd");
  const position = await getNextQueuePosition(today);

  const [entry] = await db
    .insert(queueEntries)
    .values({
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      serviceId: parsed.data.serviceId,
      position,
      lookupToken: generateToken(),
      queueDate: today,
      status: "waiting",
    })
    .returning();

  const service = await getServiceById(parsed.data.serviceId);
  await notifyQueueJoined({
    customerName: entry.customerName,
    customerPhone: entry.customerPhone,
    serviceName: service?.name ?? "your service",
    position: entry.position,
  });

  revalidatePath("/staff", "layout");
  revalidatePath("/staff/queue");

  return { success: true, entry };
}

export async function updateQueueStatus(formData: FormData) {
  await requireStaff();

  const raw = {
    id: formData.get("id") as string,
    status: formData.get("status") as string,
  };

  const parsed = updateQueueStatusSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  const updates: Partial<typeof queueEntries.$inferInsert> = {
    status: parsed.data.status,
  };

  if (parsed.data.status === "called") {
    updates.calledAt = new Date();
  }
  if (parsed.data.status === "completed") {
    updates.completedAt = new Date();
  }

  await db
    .update(queueEntries)
    .set(updates)
    .where(eq(queueEntries.id, parsed.data.id));

  if (parsed.data.status === "called" || parsed.data.status === "left") {
    const record = await getQueueEntryById(parsed.data.id);
    if (record) {
      await notifyQueueStatus(
        {
          customerName: record.entry.customerName,
          customerPhone: record.entry.customerPhone,
          serviceName: record.service.name,
          position: record.entry.position,
        },
        parsed.data.status
      );
    }
  }

  revalidatePath("/staff", "layout");
  revalidatePath("/staff/queue");
  return { success: true };
}

export async function callNextInQueue(queueDate: string) {
  await requireStaff();

  const [waiting] = await db
    .select()
    .from(queueEntries)
    .where(
      and(
        eq(queueEntries.queueDate, queueDate),
        eq(queueEntries.status, "waiting")
      )
    )
    .orderBy(asc(queueEntries.position))
    .limit(1);

  if (!waiting) {
    return { error: "No one waiting in queue" };
  }

  await db
    .update(queueEntries)
    .set({ status: "called", calledAt: new Date() })
    .where(eq(queueEntries.id, waiting.id));

  const service = await getServiceById(waiting.serviceId);
  await notifyQueueStatus(
    {
      customerName: waiting.customerName,
      customerPhone: waiting.customerPhone,
      serviceName: service?.name ?? "your service",
      position: waiting.position,
    },
    "called"
  );

  revalidatePath("/staff", "layout");
  revalidatePath("/staff/queue");
  return { success: true, entry: waiting };
}
