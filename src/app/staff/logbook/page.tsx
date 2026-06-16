import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { LogbookPanel } from "@/components/logbook/logbook-panel";
import { PageHeader } from "@/components/layout/page-header";
import { getSalonTimezone } from "@/lib/constants";
import { getDailyTotals, getLogEntriesByDate } from "@/lib/queries/logbook";
import { getActiveServices } from "@/lib/queries/services";

export const metadata = { title: "Daily Logbook" };

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function StaffLogbookPage({ searchParams }: Props) {
  const params = await searchParams;
  const timezone = getSalonTimezone();
  const now = toZonedTime(new Date(), timezone);
  const todayStr = format(now, "yyyy-MM-dd");
  const logDate = params.date ?? todayStr;

  const [entries, totals, services] = await Promise.all([
    getLogEntriesByDate(logDate),
    getDailyTotals(logDate),
    getActiveServices(),
  ]);

  const rows = entries.map(({ entry, staff, service }) => ({
    id: entry.id,
    entryType: entry.entryType,
    customerName: entry.customerName,
    description: entry.description,
    amount: entry.amount,
    staffName: staff?.displayName ?? null,
    serviceId: entry.serviceId,
    serviceName: service?.name ?? null,
    photoUrl: entry.photoUrl,
    source: entry.source,
    createdAt: entry.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Daily record"
        title="Daily Logbook"
        subtitle="Record services manually or scan your written book with AI."
      />
      <LogbookPanel
        logDate={logDate}
        displayDate={format(parseISO(logDate), "EEEE, MMMM d, yyyy")}
        entries={rows}
        totals={totals}
        services={services}
      />
    </div>
  );
}
