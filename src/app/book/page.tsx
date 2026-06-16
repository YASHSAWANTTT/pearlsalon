import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { getAvailableSlots } from "@/lib/slots";
import { getActiveServices } from "@/lib/queries/services";
import { BookPageClient } from "@/components/appointments/book-page-client";

export const metadata = { title: "Book Appointment" };

async function fetchSlots(date: string, serviceId: string) {
  "use server";
  const services = await getActiveServices();
  const service = services.find((s) => s.id === serviceId);
  if (!service) return [];
  return getAvailableSlots(date, service.durationMinutes);
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const services = await getActiveServices();

  return (
    <>
      <PublicHeader />
      <BookPageClient
        services={services}
        preselectedServiceId={params.service}
        getSlots={fetchSlots}
      />
      <PublicFooter />
    </>
  );
}
