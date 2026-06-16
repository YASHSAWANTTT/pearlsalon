import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { AppointmentsTable } from "@/components/appointments/appointments-table";
import { PageHeader } from "@/components/layout/page-header";
import { getSalonTimezone } from "@/lib/constants";
import { getAppointmentsByDate } from "@/lib/queries/appointments";

export const metadata = { title: "Appointments" };

export default async function StaffAppointmentsPage() {
  const timezone = getSalonTimezone();
  const now = toZonedTime(new Date(), timezone);
  const todayStr = format(now, "yyyy-MM-dd");
  const dayStart = new Date(todayStr + "T00:00:00");
  const dayEnd = new Date(todayStr + "T23:59:59");

  const appointments = await getAppointmentsByDate(dayStart, dayEnd);

  const rows = appointments.map(({ appointment, service }) => ({
    id: appointment.id,
    customerName: appointment.customerName,
    customerPhone: appointment.customerPhone,
    scheduledAt: appointment.scheduledAt.toISOString(),
    status: appointment.status,
    serviceName: service.name,
    price: service.price,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={format(now, "EEEE, MMMM d, yyyy")}
        title="Today's Appointments"
        subtitle={`${rows.length} appointment${rows.length !== 1 ? "s" : ""} on the books.`}
      />
      <AppointmentsTable appointments={rows} />
    </div>
  );
}
