"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServicePicker } from "@/components/appointments/service-picker";
import { joinQueue } from "@/lib/actions/queue";
import { formatDuration, formatPrice } from "@/lib/constants";
import type { Service } from "@/db/schema";

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

export function JoinQueueForm({
  services,
  preselectedServiceId,
  salonOpen,
}: {
  services: Service[];
  preselectedServiceId?: string;
  salonOpen: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serviceId, setServiceId] = useState(preselectedServiceId ?? "");
  const selectedService = services.find((s) => s.id === serviceId);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("serviceId", serviceId);

    startTransition(async () => {
      const result = await joinQueue(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.entry) {
        router.push(`/queue/status/${result.entry.lookupToken}`);
      }
    });
  }

  if (!salonOpen) {
    return (
      <div className="rounded-lg border border-amber-200/70 bg-amber-50 p-6 text-center">
        <p className="font-medium text-amber-800">We&apos;re closed today</p>
        <p className="mt-2 text-sm text-amber-700">
          The walk-in queue is only available during business hours. Please book an appointment instead.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <FieldLabel htmlFor="customerName">Full Name *</FieldLabel>
        <Input id="customerName" name="customerName" required placeholder="Jane Doe" />
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

      <div className="space-y-1.5">
        <FieldLabel hint="Browse by category or search by name.">
          Treatment *
        </FieldLabel>
        <ServicePicker services={services} value={serviceId} onChange={setServiceId} />
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

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full"
        disabled={isPending || !serviceId}
      >
        {isPending ? "Joining…" : "Join Queue"}
      </Button>
    </form>
  );
}
