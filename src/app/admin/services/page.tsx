import { ServicesManager } from "@/components/services/services-manager";
import { PageHeader } from "@/components/layout/page-header";
import { getAllServices } from "@/lib/queries/services";

export const metadata = { title: "Manage Services" };

export default async function AdminServicesPage() {
  const services = await getAllServices();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalog"
        title="Services"
        subtitle="Manage your salon service menu — pricing, durations, and availability."
      />
      <ServicesManager services={services} />
    </div>
  );
}
