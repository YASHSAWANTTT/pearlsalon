import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { appointments, services } from "@/db/schema";

export async function getAppointmentsByDate(start: Date, end: Date) {
  return db
    .select({
      appointment: appointments,
      service: services,
    })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(
      and(
        gte(appointments.scheduledAt, start),
        lt(appointments.scheduledAt, end)
      )
    )
    .orderBy(appointments.scheduledAt);
}

export async function getAppointmentById(id: string) {
  const [result] = await db
    .select({
      appointment: appointments,
      service: services,
    })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(eq(appointments.id, id))
    .limit(1);

  return result ?? null;
}

export async function getTodayAppointmentCount(start: Date, end: Date) {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(appointments)
    .where(
      and(
        gte(appointments.scheduledAt, start),
        lt(appointments.scheduledAt, end),
        sql`${appointments.status} NOT IN ('cancelled')`
      )
    );

  return result[0]?.count ?? 0;
}

export async function getAllAppointments(limit = 100) {
  return db
    .select({
      appointment: appointments,
      service: services,
    })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .orderBy(desc(appointments.scheduledAt))
    .limit(limit);
}
