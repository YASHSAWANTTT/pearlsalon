import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { getAvailableSlots } from "@/lib/slots";
import { getActiveServices } from "@/lib/queries/services";
import { BookPageClient } from "@/components/appointments/book-page-client";
import { SALON_FULL_NAME } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book Appointment",
  description: `Book your appointment online at ${SALON_FULL_NAME}, Thane West. Choose a service and reserve your preferred time.`,
  alternates: {
    canonical: `${SITE_URL}/book`,
  },
};

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
