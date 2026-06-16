import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { QueueBoard } from "@/components/queue/queue-board";
import { PageHeader } from "@/components/layout/page-header";
import { getSalonTimezone } from "@/lib/constants";
import { getQueueByDate } from "@/lib/queries/queue";

export const metadata = { title: "Queue Management" };

export default async function StaffQueuePage() {
  const timezone = getSalonTimezone();
  const now = toZonedTime(new Date(), timezone);
  const todayStr = format(now, "yyyy-MM-dd");

  const queue = await getQueueByDate(todayStr);

  const items = queue
    .filter(({ entry }) => entry.status !== "left")
    .map(({ entry, service }) => ({
      id: entry.id,
      customerName: entry.customerName,
      customerPhone: entry.customerPhone,
      position: entry.position,
      status: entry.status,
      serviceName: service.name,
      durationMinutes: service.durationMinutes,
      lookupToken: entry.lookupToken,
    }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={format(now, "EEEE, MMMM d, yyyy")}
        title="Queue Board"
        subtitle="Call guests in order and move them through service."
      />
      <QueueBoard items={items} queueDate={todayStr} />
    </div>
  );
}
