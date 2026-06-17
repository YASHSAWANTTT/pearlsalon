import { and, eq, gt, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { appointments, queueEntries } from "@/db/schema";

const EPOCH = new Date(0);

export async function getUnreadAppointmentCount(lastSeenAt: Date | null) {
  const seenAfter = lastSeenAt ?? EPOCH;

  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(appointments)
    .where(
      and(
        eq(appointments.status, "pending"),
        gt(appointments.createdAt, seenAfter)
      )
    );

  return result[0]?.count ?? 0;
}

export async function getUnreadQueueCount(
  queueDate: string,
  lastSeenAt: Date | null
) {
  const seenAfter = lastSeenAt ?? EPOCH;

  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(queueEntries)
    .where(
      and(
        eq(queueEntries.queueDate, queueDate),
        inArray(queueEntries.status, ["waiting", "called"]),
        gt(queueEntries.joinedAt, seenAfter)
      )
    );

  return result[0]?.count ?? 0;
}
