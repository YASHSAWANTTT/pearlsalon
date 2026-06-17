import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { SectionHeading } from "@/components/landing/section-heading";
import { ServiceMenu } from "@/components/landing/service-menu";
import { SALON_FULL_NAME } from "@/lib/constants";
import { getServicesByCategory } from "@/lib/queries/services";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services Menu",
  description: `Browse facials, waxing, threading, bleaching, and spa treatments at ${SALON_FULL_NAME} in Thane West.`,
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
};

export default async function ServicesPage() {
  const servicesByCategory = await getServicesByCategory();

  return (
    <>
      <PublicHeader />
      <main className="grain bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="reveal">
            <SectionHeading
              align="left"
              label="Our menu"
              title={
                <>
                  Treatments &amp; <span className="italic text-primary">rituals</span>
                </>
              }
              subtitle="Browse our full menu and book your perfect treatment, or join today's walk-in queue."
            />

            <div className="mt-16">
              <ServiceMenu servicesByCategory={servicesByCategory} />
            </div>

            <div className="mt-16 flex flex-col items-start gap-4 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm font-serif text-2xl font-light leading-snug text-foreground">
                Ready when you are.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="rounded-full bg-primary px-8 py-3.5 text-sm font-medium tracking-wide text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  Reserve a Time
                </Link>
                <Link
                  href="/queue"
                  className="rounded-full border border-border bg-card px-8 py-3.5 text-sm font-medium tracking-wide text-foreground transition-colors hover:border-primary/40"
                >
                  Join Walk-in Queue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
