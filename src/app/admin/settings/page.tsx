import { SettingsForm } from "@/components/settings/settings-form";
import { PageHeader } from "@/components/layout/page-header";
import { getBusinessHours, getSalonSettings } from "@/lib/queries/settings";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const [settings, hours] = await Promise.all([
    getSalonSettings(),
    getBusinessHours(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        subtitle="Configure salon information and weekly business hours."
      />
      <SettingsForm
        settings={{
          name: settings.name,
          address: settings.address,
          phone: settings.phone,
          timezone: settings.timezone,
        }}
        hours={hours}
      />
    </div>
  );
}
