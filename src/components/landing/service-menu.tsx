import { ServiceGrid } from "@/components/landing/service-grid";
import { SERVICE_CATEGORY_ORDER } from "@/lib/salon-services";
import type { Service } from "@/db/schema";

type Props = {
  servicesByCategory: Record<string, Service[]>;
};

export function ServiceMenu({ servicesByCategory }: Props) {
  const categories = SERVICE_CATEGORY_ORDER.filter(
    (category) => (servicesByCategory[category]?.length ?? 0) > 0
  );

  return (
    <div className="space-y-20">
      {categories.map((category, i) => (
        <section key={category}>
          <div className="mb-6 flex items-baseline gap-4">
            <span className="font-serif text-sm text-primary/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="font-serif text-3xl font-light tracking-tight text-foreground">
              {category}
            </h2>
            <span className="h-px flex-1 translate-y-[-2px] bg-border" />
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {servicesByCategory[category].length} treatments
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-border shadow-sm">
            <ServiceGrid services={servicesByCategory[category]} />
          </div>
        </section>
      ))}
    </div>
  );
}
