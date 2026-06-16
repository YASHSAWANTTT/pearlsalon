import { format, subDays } from "date-fns";
import { LogbookBrowser } from "@/components/logbook/logbook-browser";
import { PageHeader } from "@/components/layout/page-header";
import { getLogEntriesByRange } from "@/lib/queries/logbook";

export const metadata = { title: "Logbook" };

export default async function AdminLogbookPage() {
  const endDate = format(new Date(), "yyyy-MM-dd");
  const startDate = format(subDays(new Date(), 7), "yyyy-MM-dd");
  const entries = await getLogEntriesByRange(startDate, endDate);

  const rows = entries.map(({ entry, staff }) => ({
    id: entry.id,
    logDate: entry.logDate,
    entryType: entry.entryType,
    customerName: entry.customerName,
    description: entry.description,
    amount: entry.amount,
    staffName: staff?.displayName ?? null,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Records"
        title="Business Logbook"
        subtitle="Browse and export daily business records across any date range."
      />
      <LogbookBrowser initialEntries={rows} />
    </div>
  );
}
