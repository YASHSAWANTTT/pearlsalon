import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { dailyLogEntries, services, staffProfiles } from "@/db/schema";

export async function getLogEntriesByDate(logDate: string) {
  return db
    .select({
      entry: dailyLogEntries,
      staff: staffProfiles,
      service: services,
    })
    .from(dailyLogEntries)
    .leftJoin(staffProfiles, eq(dailyLogEntries.staffId, staffProfiles.id))
    .leftJoin(services, eq(dailyLogEntries.serviceId, services.id))
    .where(eq(dailyLogEntries.logDate, logDate))
    .orderBy(desc(dailyLogEntries.createdAt));
}

export async function getLogEntriesByRange(startDate: string, endDate: string) {
  return db
    .select({
      entry: dailyLogEntries,
      staff: staffProfiles,
      service: services,
    })
    .from(dailyLogEntries)
    .leftJoin(staffProfiles, eq(dailyLogEntries.staffId, staffProfiles.id))
    .leftJoin(services, eq(dailyLogEntries.serviceId, services.id))
    .where(
      and(
        gte(dailyLogEntries.logDate, startDate),
        lte(dailyLogEntries.logDate, endDate)
      )
    )
    .orderBy(desc(dailyLogEntries.logDate), desc(dailyLogEntries.createdAt));
}

export async function getTodayRevenue(logDate: string) {
  const totals = await getDailyTotals(logDate);
  return totals.revenue;
}

export async function getDailyTotals(logDate: string) {
  const result = await db
    .select({
      revenue: sql<string>`COALESCE(SUM(CASE WHEN ${dailyLogEntries.entryType} = 'revenue' THEN ${dailyLogEntries.amount} ELSE 0 END), 0)`,
      expense: sql<string>`COALESCE(SUM(CASE WHEN ${dailyLogEntries.entryType} = 'expense' THEN ${dailyLogEntries.amount} ELSE 0 END), 0)`,
      count: sql<string>`COUNT(*)`,
    })
    .from(dailyLogEntries)
    .where(eq(dailyLogEntries.logDate, logDate));

  const revenue = parseFloat(result[0]?.revenue ?? "0");
  const expense = parseFloat(result[0]?.expense ?? "0");

  return {
    revenue: revenue.toFixed(2),
    expense: expense.toFixed(2),
    net: (revenue - expense).toFixed(2),
    count: Number(result[0]?.count ?? 0),
  };
}

export async function getBusinessInsights(opts: {
  today: string;
  monthStart: string;
  last7Start: string;
  last30Start: string;
  seriesStart: string;
}) {
  const { today, monthStart, last7Start, last30Start, seriesStart } = opts;

  const revenueSum = sql<string>`COALESCE(SUM(CASE WHEN ${dailyLogEntries.entryType} = 'revenue' THEN ${dailyLogEntries.amount} ELSE 0 END), 0)`;
  const expenseSum = sql<string>`COALESCE(SUM(CASE WHEN ${dailyLogEntries.entryType} = 'expense' THEN ${dailyLogEntries.amount} ELSE 0 END), 0)`;

  const [allTime] = await db
    .select({
      revenue: revenueSum,
      expense: expenseSum,
      revenueEntries: sql<string>`COUNT(*) FILTER (WHERE ${dailyLogEntries.entryType} = 'revenue')`,
      activeDays: sql<string>`COUNT(DISTINCT ${dailyLogEntries.logDate})`,
    })
    .from(dailyLogEntries);

  async function periodRevenue(start: string) {
    const [row] = await db
      .select({ revenue: sql<string>`COALESCE(SUM(${dailyLogEntries.amount}), 0)` })
      .from(dailyLogEntries)
      .where(
        and(
          eq(dailyLogEntries.entryType, "revenue"),
          gte(dailyLogEntries.logDate, start),
          lte(dailyLogEntries.logDate, today)
        )
      );
    return parseFloat(row?.revenue ?? "0");
  }

  const [thisMonth, last7, last30] = await Promise.all([
    periodRevenue(monthStart),
    periodRevenue(last7Start),
    periodRevenue(last30Start),
  ]);

  const [bestDay] = await db
    .select({
      logDate: dailyLogEntries.logDate,
      revenue: sql<string>`SUM(${dailyLogEntries.amount})`,
    })
    .from(dailyLogEntries)
    .where(eq(dailyLogEntries.entryType, "revenue"))
    .groupBy(dailyLogEntries.logDate)
    .orderBy(desc(sql`SUM(${dailyLogEntries.amount})`))
    .limit(1);

  const topServices = await db
    .select({
      name: dailyLogEntries.description,
      revenue: sql<string>`SUM(${dailyLogEntries.amount})`,
      count: sql<string>`COUNT(*)`,
    })
    .from(dailyLogEntries)
    .where(eq(dailyLogEntries.entryType, "revenue"))
    .groupBy(dailyLogEntries.description)
    .orderBy(desc(sql`SUM(${dailyLogEntries.amount})`))
    .limit(5);

  const series = await db
    .select({
      logDate: dailyLogEntries.logDate,
      revenue: revenueSum,
    })
    .from(dailyLogEntries)
    .where(
      and(gte(dailyLogEntries.logDate, seriesStart), lte(dailyLogEntries.logDate, today))
    )
    .groupBy(dailyLogEntries.logDate)
    .orderBy(dailyLogEntries.logDate);

  const totalRevenue = parseFloat(allTime?.revenue ?? "0");
  const totalExpense = parseFloat(allTime?.expense ?? "0");
  const activeDays = Number(allTime?.activeDays ?? 0);
  const revenueEntries = Number(allTime?.revenueEntries ?? 0);

  return {
    totalRevenue,
    totalExpense,
    netProfit: totalRevenue - totalExpense,
    activeDays,
    revenueEntries,
    dailyAverage: activeDays > 0 ? totalRevenue / activeDays : 0,
    avgTicket: revenueEntries > 0 ? totalRevenue / revenueEntries : 0,
    thisMonth,
    last7,
    last30,
    bestDay: bestDay
      ? { logDate: bestDay.logDate, revenue: parseFloat(bestDay.revenue) }
      : null,
    topServices: topServices.map((s) => ({
      name: s.name,
      revenue: parseFloat(s.revenue),
      count: Number(s.count),
    })),
    series: series.map((s) => ({ logDate: s.logDate, revenue: parseFloat(s.revenue) })),
  };
}

export async function getRecentLogEntries(limit = 10) {
  return db
    .select({
      entry: dailyLogEntries,
      staff: staffProfiles,
      service: services,
    })
    .from(dailyLogEntries)
    .leftJoin(staffProfiles, eq(dailyLogEntries.staffId, staffProfiles.id))
    .leftJoin(services, eq(dailyLogEntries.serviceId, services.id))
    .orderBy(desc(dailyLogEntries.createdAt))
    .limit(limit);
}
