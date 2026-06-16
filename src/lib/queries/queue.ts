import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { queueEntries, services } from "@/db/schema";

export async function getQueueByDate(queueDate: string) {
  return db
    .select({
      entry: queueEntries,
      service: services,
    })
    .from(queueEntries)
    .innerJoin(services, eq(queueEntries.serviceId, services.id))
    .where(eq(queueEntries.queueDate, queueDate))
    .orderBy(asc(queueEntries.position));
}

export async function getQueueEntryByToken(token: string) {
  const [result] = await db
    .select({
      entry: queueEntries,
      service: services,
    })
    .from(queueEntries)
    .innerJoin(services, eq(queueEntries.serviceId, services.id))
    .where(eq(queueEntries.lookupToken, token.toUpperCase()))
    .limit(1);

  return result ?? null;
}

export async function getQueueEntryById(id: string) {
  const [result] = await db
    .select({
      entry: queueEntries,
      service: services,
    })
    .from(queueEntries)
    .innerJoin(services, eq(queueEntries.serviceId, services.id))
    .where(eq(queueEntries.id, id))
    .limit(1);

  return result ?? null;
}

export async function getNextQueuePosition(queueDate: string) {
  const result = await db
    .select({ maxPos: sql<number>`COALESCE(MAX(${queueEntries.position}), 0)` })
    .from(queueEntries)
    .where(eq(queueEntries.queueDate, queueDate));

  return (result[0]?.maxPos ?? 0) + 1;
}

export async function getActiveQueueCount(queueDate: string) {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(queueEntries)
    .where(
      and(
        eq(queueEntries.queueDate, queueDate),
        sql`${queueEntries.status} IN ('waiting', 'called', 'in_service')`
      )
    );

  return result[0]?.count ?? 0;
}

export async function getWaitingAhead(
  queueDate: string,
  position: number
) {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(queueEntries)
    .where(
      and(
        eq(queueEntries.queueDate, queueDate),
        eq(queueEntries.status, "waiting"),
        sql`${queueEntries.position} < ${position}`
      )
    );

  return result[0]?.count ?? 0;
}
