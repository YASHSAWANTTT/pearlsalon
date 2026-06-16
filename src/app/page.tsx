import { PublicFooter } from "@/components/layout/public-footer";
import { HeroSection } from "@/components/ui/hero-section-5";
import { SectionHeading } from "@/components/landing/section-heading";
import { ServiceGrid } from "@/components/landing/service-grid";
import { SpecialOffers } from "@/components/landing/special-offers";
import { PlanVisit } from "@/components/landing/plan-visit";
import { getActiveServices } from "@/lib/queries/services";
import { getBusinessHours, getSalonSettings } from "@/lib/queries/settings";
import Link from "next/link";

export default async function HomePage() {
  const [services, hours, settings] = await Promise.all([
    getActiveServices(),
    getBusinessHours(),
    getSalonSettings(),
  ]);

  const menuServices = services.slice(0, 9);

  return (
    <>
      <HeroSection />
      <div className="bg-background">
        {/* Services menu */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              label="Our menu"
              title={
                <>
                  Treatments &amp; <span className="italic text-primary">rituals</span>
                </>
              }
              subtitle="Signature services, each performed by certified specialists using clean, professional-grade products."
            />
            <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <ServiceGrid services={menuServices} />
            </div>
            {services.length > 9 && (
              <div className="mt-10 text-center">
                <Link
                  href="/services"
                  className="text-sm font-medium uppercase tracking-wider text-primary hover:underline"
                >
                  View full menu →
                </Link>
              </div>
            )}
          </div>
        </section>

        <SpecialOffers />
        <div id="visit">
          <PlanVisit settings={settings} hours={hours} />
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
