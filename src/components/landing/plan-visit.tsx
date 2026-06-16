import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { SALON_CONTACT, SALON_NAME } from "@/lib/constants";
import type { BusinessHour, SalonSetting } from "@/db/schema";

function formatTime12h(time: string) {
  const [hours, minutes] = time.slice(0, 5).split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatHoursBlock(hours: BusinessHour[]) {
  const openDays = hours.filter((h) => !h.isClosed);
  if (openDays.length === 0) {
    return [{ label: "Hours", value: "Closed", closed: true }];
  }

  const first = openDays[0];
  const allSame = openDays.every(
    (h) => h.openTime === first.openTime && h.closeTime === first.closeTime
  );

  if (allSame && openDays.length >= 6) {
    return [
      {
        label: "Every day",
        value: `${formatTime12h(first.openTime)} – ${formatTime12h(first.closeTime)}`,
        closed: false,
      },
    ];
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return openDays.map((h) => ({
    label: dayNames[h.dayOfWeek],
    value: `${formatTime12h(h.openTime)} – ${formatTime12h(h.closeTime)}`,
    closed: false,
  }));
}

type Props = {
  settings: SalonSetting | {
    name: string;
    address: string | null;
    phone: string | null;
    timezone: string;
  };
  hours: BusinessHour[];
};

export function PlanVisit({ settings, hours }: Props) {
  const hourRows = formatHoursBlock(hours);
  const address = settings.address || SALON_CONTACT.address;
  const phone = settings.phone || SALON_CONTACT.phone;
  const phoneDisplay = phone.startsWith("+91")
    ? `+91 ${phone.slice(3, 8)} ${phone.slice(8)}`
    : phone;

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="eyebrow">Come see us</p>
          <h2 className="mt-4 font-serif text-3xl font-light text-foreground sm:text-4xl md:text-5xl">
            Plan your <span className="italic text-primary">visit</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Visit us at Vardhaman Vatika, Dhokali — a quiet place to feel like yourself again.
          </p>
        </div>

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 space-y-8 sm:space-y-10 lg:order-1">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Address
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{address}</p>
                <a
                  href={SALON_CONTACT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-primary hover:underline"
                >
                  Get directions →
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Phone
                </p>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="mt-2 block text-sm text-foreground hover:text-primary"
                >
                  {phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
              <div className="flex-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Opening hours
                </p>
                <ul className="mt-3 space-y-2">
                  {hourRows.map((row) => (
                    <li
                      key={row.label}
                      className="flex justify-between gap-4 text-sm text-foreground"
                    >
                      <span>{row.label}</span>
                      <span className={row.closed ? "text-primary" : "tabular-nums"}>
                        {row.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/book"
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Reserve a Time
              </Link>
              <a
                href={SALON_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-[#25D366]/50 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                WhatsApp us
              </a>
            </div>
          </div>

          <div className="relative order-1 min-h-[260px] overflow-hidden rounded-2xl border border-border bg-secondary/50 sm:min-h-[320px] lg:order-2 lg:min-h-[360px]">
            <iframe
              src={SALON_CONTACT.mapsEmbedUrl}
              title={`${SALON_NAME} on Google Maps`}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={SALON_CONTACT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
