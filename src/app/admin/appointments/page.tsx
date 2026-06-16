import { AppointmentsTable } from "@/components/appointments/appointments-table";
import { PageHeader } from "@/components/layout/page-header";
import { getAllAppointments } from "@/lib/queries/appointments";

export const metadata = { title: "All Appointments" };

export default async function AdminAppointmentsPage() {
  const appointments = await getAllAppointments(200);

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
        eyebrow="Bookings"
        title="All Appointments"
        subtitle={`Viewing the ${rows.length} most recent scheduled appointments.`}
      />
      <AppointmentsTable appointments={rows} />
    </div>
  );
}
