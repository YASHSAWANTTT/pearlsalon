import Link from "next/link";
import { formatDuration, formatPrice } from "@/lib/constants";
import { getServiceIcon } from "@/lib/design";
import type { Service } from "@/db/schema";

type Props = {
  services: Service[];
  showActions?: boolean;
};

export function ServiceGrid({ services, showActions = true }: Props) {
  return (
    <div className="grid grid-cols-1 border border-border bg-border/60 [gap:1px] sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const Icon = getServiceIcon(service.category);

        return (
          <article
            key={service.id}
            className="group relative flex min-h-0 flex-col bg-card p-6 transition-colors hover:bg-secondary/50 sm:min-h-[200px] sm:p-8"
          >
            <span className="pointer-events-none absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />

            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary transition-colors group-hover:border-primary/40">
              <Icon className="h-4 w-4" strokeWidth={1.5} />
            </div>

            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <h3 className="font-serif text-xl leading-tight text-foreground sm:text-2xl">{service.name}</h3>
              <p className="shrink-0 font-serif text-lg text-primary">
                {formatPrice(service.price)}
              </p>
            </div>

            {service.description ? (
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            ) : (
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{service.category}</p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                {formatDuration(service.durationMinutes)}
              </p>
              {showActions && (
                <div className="flex gap-4 opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100">
                  <Link
                    href={`/book?service=${service.id}`}
                    className="rounded-md py-1 text-xs font-medium uppercase tracking-wider text-primary hover:underline"
                  >
                    Book
                  </Link>
                  <Link
                    href={`/queue?service=${service.id}`}
                    className="rounded-md py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Walk in
                  </Link>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
