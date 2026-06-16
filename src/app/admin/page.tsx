import { eachDayOfInterval, format, parseISO, startOfMonth, subDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import Link from "next/link";
import {
  Calendar,
  CalendarRange,
  ListOrdered,
  Receipt,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Reveal } from "@/components/layout/reveal";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { getSalonTimezone, formatPrice } from "@/lib/constants";
import { getTodayAppointmentCount } from "@/lib/queries/appointments";
import { getActiveQueueCount } from "@/lib/queries/queue";
import {
  getTodayRevenue,
  getRecentLogEntries,
  getBusinessInsights,
} from "@/lib/queries/logbook";
import { getAllStaff } from "@/lib/queries/settings";

export const metadata = { title: "Admin Dashboard" };

const SERIES_DAYS = 14;

export default async function AdminDashboard() {
  const timezone = getSalonTimezone();
  const now = toZonedTime(new Date(), timezone);
  const todayStr = format(now, "yyyy-MM-dd");
  const dayStart = new Date(todayStr + "T00:00:00");
  const dayEnd = new Date(todayStr + "T23:59:59");

  const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
  const last7Start = format(subDays(now, 6), "yyyy-MM-dd");
  const last30Start = format(subDays(now, 29), "yyyy-MM-dd");
  const seriesStart = format(subDays(now, SERIES_DAYS - 1), "yyyy-MM-dd");

  const [appointmentCount, queueCount, revenue, recentLogs, staff, insights] =
    await Promise.all([
      getTodayAppointmentCount(dayStart, dayEnd),
      getActiveQueueCount(todayStr),
      getTodayRevenue(todayStr),
      getRecentLogEntries(8),
      getAllStaff(),
      getBusinessInsights({
        today: todayStr,
        monthStart,
        last7Start,
        last30Start,
        seriesStart,
      }),
    ]);

  const todayStats = [
    { label: "Appointments Today", value: appointmentCount, icon: Calendar },
    { label: "Active Queue", value: queueCount, icon: ListOrdered },
    { label: "Revenue Today", value: formatPrice(revenue), icon: Wallet },
    { label: "Staff Members", value: staff.filter((s) => s.isActive).length, icon: Users },
  ];

  // Fill the series so every day in the window shows, even with no entries.
  const revenueByDate = new Map(insights.series.map((s) => [s.logDate, s.revenue]));
  const chartData = eachDayOfInterval({
    start: parseISO(seriesStart),
    end: parseISO(todayStr),
  }).map((d) => {
    const key = format(d, "yyyy-MM-dd");
    return {
      label: format(d, "d"),
      value: revenueByDate.get(key) ?? 0,
      isToday: key === todayStr,
    };
  });

  const insightStats = [
    {
      label: "Total Revenue",
      value: formatPrice(insights.totalRevenue),
      icon: TrendingUp,
      hint: `Across ${insights.activeDays} active ${insights.activeDays === 1 ? "day" : "days"}`,
    },
    {
      label: "Daily Average",
      value: formatPrice(insights.dailyAverage),
      icon: CalendarRange,
      hint: "Revenue per active day",
    },
    {
      label: "Avg. Ticket",
      value: formatPrice(insights.avgTicket),
      icon: Receipt,
      hint: `${insights.revenueEntries} services logged`,
    },
    {
      label: "Net Profit",
      value: formatPrice(insights.netProfit),
      icon: Wallet,
      hint: `${formatPrice(insights.totalExpense)} expenses`,
    },
  ];

  const topMax = Math.max(...insights.topServices.map((s) => s.revenue), 1);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow={format(now, "EEEE, MMMM d, yyyy")}
        title="Admin Dashboard"
        subtitle="A bird's-eye view of the salon — today's bookings, queue, revenue, and team."
      />

      <section className="space-y-4">
        <p className="eyebrow">Today</p>
        <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {todayStats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
          ))}
        </Reveal>
      </section>

      <section className="space-y-4">
        <p className="eyebrow">Business insights</p>
        <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {insightStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              hint={stat.hint}
            />
          ))}
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card px-5 py-4">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">This month</p>
            <p className="mt-1 font-serif text-2xl font-light text-foreground">
              {formatPrice(insights.thisMonth)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card px-5 py-4">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Last 7 days</p>
            <p className="mt-1 font-serif text-2xl font-light text-foreground">
              {formatPrice(insights.last7)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card px-5 py-4">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Last 30 days</p>
            <p className="mt-1 font-serif text-2xl font-light text-foreground">
              {formatPrice(insights.last30)}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg font-normal">
              Revenue · last {SERIES_DAYS} days
            </CardTitle>
            {insights.bestDay && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Trophy className="h-3.5 w-3.5 text-primary" />
                Best: {format(parseISO(insights.bestDay.logDate), "MMM d")} ·{" "}
                {formatPrice(insights.bestDay.revenue)}
              </span>
            )}
          </CardHeader>
          <CardContent>
            <RevenueChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif text-lg font-normal">Top services</CardTitle>
          </CardHeader>
          <CardContent>
            {insights.topServices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No revenue logged yet.</p>
            ) : (
              <ul className="space-y-3">
                {insights.topServices.map((service) => (
                  <li key={service.name} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="truncate text-foreground">{service.name}</span>
                      <span className="shrink-0 tabular-nums text-muted-foreground">
                        {formatPrice(service.revenue)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary/60"
                        style={{ width: `${Math.max((service.revenue / topMax) * 100, 4)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg font-normal">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/admin/services">Manage Services</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/admin/staff">Manage Staff</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/admin/logbook">Logbook</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/admin/settings">Settings</Link></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg font-normal">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentLogs.map(({ entry }) => (
                  <li key={entry.id} className="flex justify-between gap-4 py-2.5 text-sm first:pt-0 last:pb-0">
                    <span className="truncate text-muted-foreground">
                      {entry.customerName ? `${entry.customerName} · ` : ""}
                      {entry.description}
                    </span>
                    <span className="shrink-0 tabular-nums text-foreground">
                      {entry.amount ? formatPrice(entry.amount) : entry.entryType}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
