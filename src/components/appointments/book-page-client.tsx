"use client";

import { useEffect, useState } from "react";
import { CalendarClock, ShieldCheck, Sparkles } from "lucide-react";
import { BookAppointmentForm } from "@/components/appointments/book-form";
import type { Service } from "@/db/schema";

type Props = {
  services: Service[];
  preselectedServiceId?: string;
  getSlots: (date: string, serviceId: string) => Promise<string[]>;
};

export function BookPageClient({ services, preselectedServiceId, getSlots }: Props) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [serviceId, setServiceId] = useState(preselectedServiceId ?? "");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!serviceId || !selectedDate) return;
    setLoading(true);
    getSlots(selectedDate, serviceId)
      .then(setSlots)
      .finally(() => setLoading(false));
  }, [selectedDate, serviceId, getSlots]);

  const highlights = [
    { icon: CalendarClock, text: "Pick a day and we'll show the open times instantly." },
    { icon: Sparkles, text: "Performed by certified specialists with clean, pro-grade products." },
    { icon: ShieldCheck, text: "No account needed — just your name and a phone number." },
  ];

  return (
    <main className="grain bg-background py-16 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-14 xl:max-w-6xl xl:grid-cols-[minmax(0,1fr)_28rem] xl:gap-16">
        {/* Brand / summary panel */}
        <aside className="reveal lg:sticky lg:top-24 lg:pt-2">
          <p className="eyebrow">Reservations</p>
          <h1 className="mt-4 font-serif text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            Reserve a <span className="italic text-primary">time</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Schedule your visit in a few easy steps. Your seat is held the moment you confirm.
          </p>

          <div className="rule-crimson mt-8" />

          <ul className="mt-8 space-y-5">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-primary">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <p className="pt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </aside>

        {/* Form panel */}
        <div
          className="reveal-item w-full rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
          style={{ ["--reveal-index" as string]: 1 }}
        >
          <h2 className="font-serif text-lg font-normal text-foreground">Your details</h2>
          <div className="mt-1 h-px w-full bg-border" />
          <div className="mt-5">
            <BookAppointmentForm
              services={services}
              preselectedServiceId={preselectedServiceId}
              slots={slots}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onServiceChange={setServiceId}
              loadingSlots={loading && !!serviceId}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
