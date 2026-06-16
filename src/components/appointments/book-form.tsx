"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateSlotPicker } from "@/components/appointments/date-slot-picker";
import { ServicePicker } from "@/components/appointments/service-picker";
import { createAppointment } from "@/lib/actions/appointments";
import { formatDuration, formatPrice } from "@/lib/constants";
import type { Service } from "@/db/schema";

type Props = {
  services: Service[];
  preselectedServiceId?: string;
  slots: string[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onServiceChange: (serviceId: string) => void;
  loadingSlots?: boolean;
};

function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-0.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium tracking-tight">
        {children}
      </Label>
      {hint && (
        <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

export function BookAppointmentForm({
  services,
  preselectedServiceId,
  slots,
  selectedDate,
  onDateChange,
  onServiceChange,
  loadingSlots = false,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serviceId, setServiceId] = useState(preselectedServiceId ?? "");
  const [selectedSlot, setSelectedSlot] = useState("");
  const selectedService = services.find((s) => s.id === serviceId);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createAppointment(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.appointment) {
        router.push(`/book/confirmation?id=${result.appointment.id}`);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="customerName">Full Name *</FieldLabel>
            <Input
              id="customerName"
              name="customerName"
              required
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel htmlFor="customerPhone">Phone *</FieldLabel>
            <Input
              id="customerPhone"
              name="customerPhone"
              required
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="customerEmail" hint="Optional — for confirmation details.">
            Email
          </FieldLabel>
          <Input
            id="customerEmail"
            name="customerEmail"
            type="email"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="space-y-1.5">
        <FieldLabel hint="Browse by category or search by name.">
          Treatment *
        </FieldLabel>
        <ServicePicker
          services={services}
          value={serviceId}
          onChange={(id) => {
            setServiceId(id);
            onServiceChange(id);
            setSelectedSlot("");
          }}
        />
        <input type="hidden" name="serviceId" value={serviceId} />
      </div>

      {selectedService && (
        <div className="rounded-lg border border-primary/15 bg-primary/[0.03] px-3.5 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug text-foreground">
                {selectedService.name}
              </p>
              {selectedService.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {selectedService.description}
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-medium tabular-nums text-primary">
                {formatPrice(selectedService.price)}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                {formatDuration(selectedService.durationMinutes)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <FieldLabel>Date &amp; time *</FieldLabel>
        <input type="hidden" name="scheduledAt" value={selectedSlot} />
        <DateSlotPicker
          selectedDate={selectedDate}
          onDateChange={(date) => {
            onDateChange(date);
            setSelectedSlot("");
          }}
          slots={slots}
          selectedSlot={selectedSlot}
          onSlotChange={setSelectedSlot}
          loading={loadingSlots}
          disabled={!serviceId}
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel htmlFor="notes" hint="Allergies, preferences, or special requests.">
          Notes
        </FieldLabel>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Any special requests…"
          rows={2}
          className="min-h-[72px] resize-none"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full"
        disabled={isPending || slots.length === 0 || !serviceId || !selectedSlot}
      >
        {isPending ? "Booking…" : "Confirm Appointment"}
      </Button>
    </form>
  );
}
