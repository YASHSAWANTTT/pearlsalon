import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import Link from "next/link";
import { Calendar, ClipboardList, ListOrdered, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Reveal } from "@/components/layout/reveal";
import { AttentionBadge } from "@/components/layout/attention-badge";
import { getStaffProfile } from "@/lib/auth";
import { getSalonTimezone, formatPrice } from "@/lib/constants";
import { getTodayAppointmentCount } from "@/lib/queries/appointments";
import { getActiveQueueCount } from "@/lib/queries/queue";
import {
  getUnreadAppointmentCount,
  getUnreadQueueCount,
} from "@/lib/queries/staff-attention";
import { getDailyTotals, getRecentLogEntries } from "@/lib/queries/logbook";

export const metadata = { title: "Staff Dashboard" };

export default async function StaffDashboard() {
  const timezone = getSalonTimezone();
  const now = toZonedTime(new Date(), timezone);
  const todayStr = format(now, "yyyy-MM-dd");
  const dayStart = new Date(todayStr + "T00:00:00");
  const dayEnd = new Date(todayStr + "T23:59:59");

  const profile = await getStaffProfile();

  const [appointmentCount, queueCount, totals, recentLogs, unreadAppointments, unreadQueue] =
    await Promise.all([
      getTodayAppointmentCount(dayStart, dayEnd),
      getActiveQueueCount(todayStr),
      getDailyTotals(todayStr),
      getRecentLogEntries(5),
      profile
        ? getUnreadAppointmentCount(profile.lastSeenAppointmentsAt)
        : Promise.resolve(0),
      profile
        ? getUnreadQueueCount(todayStr, profile.lastSeenQueueAt)
        : Promise.resolve(0),
    ]);

  const stats = [
    {
      label: "Today's Appointments",
      value: appointmentCount,
      icon: Calendar,
      href: "/staff/appointments",
      badgeCount: unreadAppointments,
    },
    {
      label: "In Queue",
      value: queueCount,
      icon: ListOrdered,
      href: "/staff/queue",
      badgeCount: unreadQueue,
    },
    {
      label: "Day Total",
      value: formatPrice(totals.net),
      icon: Wallet,
      href: "/staff/logbook",
      badgeCount: 0,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={format(now, "EEEE, MMMM d, yyyy")}
        title="Staff Dashboard"
        subtitle="Today at a glance — appointments, the live queue, and the day's running total."
      />

      <Reveal className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            href={stat.href}
            badgeCount={stat.badgeCount}
          />
        ))}
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg font-normal">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild className="relative">
              <Link href="/staff/queue">
                Manage Queue
                {unreadQueue > 0 && (
                  <AttentionBadge count={unreadQueue} className="ml-2" />
                )}
              </Link>
            </Button>
            <Button asChild variant="outline" className="relative">
              <Link href="/staff/appointments">
                View Appointments
                {unreadAppointments > 0 && (
                  <AttentionBadge count={unreadAppointments} className="ml-2" />
                )}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/staff/logbook">
                <ClipboardList className="mr-2 h-4 w-4" />
                Add Log Entry
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg font-normal">Recent Log Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No log entries yet today.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentLogs.map(({ entry }) => (
                  <li key={entry.id} className="flex items-center justify-between gap-4 py-2.5 text-sm first:pt-0 last:pb-0">
                    <span className="text-muted-foreground">{entry.description}</span>
                    {entry.amount && (
                      <span className="font-medium tabular-nums text-foreground">
                        {formatPrice(entry.amount)}
                      </span>
                    )}
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
