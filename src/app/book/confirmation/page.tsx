import Link from "next/link";
import { Check } from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { getAppointmentById } from "@/lib/queries/appointments";
import { formatSlotDate } from "@/lib/datetime";
import { formatPrice } from "@/lib/constants";
import { notFound } from "next/navigation";

export const metadata = { title: "Booking Confirmed" };

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  if (!params.id) notFound();

  const result = await getAppointmentById(params.id);
  if (!result) notFound();

  const { appointment, service } = result;

  return (
    <>
      <PublicHeader />
      <main className="grain bg-background py-20 sm:py-28">
        <div className="reveal mx-auto max-w-lg px-4 text-center sm:px-6">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Check className="h-7 w-7" strokeWidth={2.25} />
          </div>
          <p className="eyebrow">Confirmed</p>
          <h1 className="mt-3 font-serif text-4xl font-light tracking-tight text-foreground">
            You&apos;re booked
          </h1>
          <p className="mt-3 text-muted-foreground">We look forward to seeing you.</p>

          <dl className="mt-10 overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm">
            {[
              { label: "Service", value: service.name },
              {
                label: "Date & time",
                value: formatSlotDate(appointment.scheduledAt.toISOString()),
              },
              { label: "Price", value: formatPrice(service.price) },
              { label: "Name", value: appointment.customerName },
            ].map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between gap-4 px-6 py-4 ${
                  i !== 0 ? "border-t border-border" : ""
                }`}
              >
                <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="text-right font-serif text-lg text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/services">Browse More Services</Link>
            </Button>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
