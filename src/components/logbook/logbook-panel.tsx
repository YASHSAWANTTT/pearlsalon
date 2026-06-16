"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, parseISO, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createLogEntry } from "@/lib/actions/logbook";
import { formatPrice } from "@/lib/constants";
import { LogbookEntryRow, type LogbookEntryRow as LogRow } from "@/components/logbook/logbook-entry-row";
import { LogbookPhotoScanner } from "@/components/logbook/logbook-photo-scanner";
import type { Service } from "@/db/schema";

type Totals = {
  revenue: string;
  expense: string;
  net: string;
  count: number;
};

type Props = {
  logDate: string;
  displayDate: string;
  entries: LogRow[];
  totals: Totals;
  services: Service[];
};

export function LogbookPanel({
  logDate,
  displayDate,
  entries,
  totals,
  services,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serviceId, setServiceId] = useState("");
  const [entryType, setEntryType] = useState("revenue");

  function navigateDate(nextDate: string) {
    router.push(`/staff/logbook?date=${nextDate}`);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("logDate", logDate);
    formData.set("entryType", entryType);
    if (serviceId) {
      formData.set("serviceId", serviceId);
      const service = services.find((s) => s.id === serviceId);
      if (service && !formData.get("description")) {
        formData.set("description", service.name);
      }
    }

    startTransition(async () => {
      const result = await createLogEntry(formData);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Entry added");
        (e.target as HTMLFormElement).reset();
        setServiceId("");
        router.refresh();
      }
    });
  }

  const prevDate = format(subDays(parseISO(logDate), 1), "yyyy-MM-dd");
  const nextDate = format(addDays(parseISO(logDate), 1), "yyyy-MM-dd");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={() => navigateDate(prevDate)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <p className="font-serif text-xl text-foreground">{displayDate}</p>
            <p className="text-xs text-muted-foreground">{logDate}</p>
          </div>
          <Button type="button" variant="outline" size="icon" onClick={() => navigateDate(nextDate)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center sm:gap-4">
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Revenue</p>
            <p className="mt-1 font-serif text-lg text-foreground">{formatPrice(totals.revenue)}</p>
          </div>
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Expenses</p>
            <p className="mt-1 font-serif text-lg text-foreground">{formatPrice(totals.expense)}</p>
          </div>
          <div className="rounded-lg border border-primary/25 bg-primary/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.15em] text-primary">Day total</p>
            <p className="mt-1 font-serif text-lg text-primary">{formatPrice(totals.net)}</p>
          </div>
        </div>
      </div>

      <LogbookPhotoScanner logDate={logDate} onSaved={() => router.refresh()} />

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h2 className="font-serif text-lg text-foreground">Add entry manually</h2>

          <div className="space-y-2">
            <Label>Service (optional)</Label>
            <Select
              value={serviceId || "none"}
              onValueChange={(value) => {
                const id = !value || value === "none" ? "" : value;
                setServiceId(id);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pick from menu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Custom description</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} — {formatPrice(service.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={entryType} onValueChange={(v) => v && setEntryType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="note">Note</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerName">Customer name (optional)</Label>
            <Input id="customerName" name="customerName" placeholder="e.g. Zainab" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={2}
              placeholder={
                serviceId
                  ? services.find((s) => s.id === serviceId)?.name
                  : "e.g. Gold Facial, threading, supplies..."
              }
              defaultValue={
                serviceId ? services.find((s) => s.id === serviceId)?.name : undefined
              }
              key={serviceId}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="1"
              min="0"
              placeholder="0"
              defaultValue={
                serviceId
                  ? parseFloat(services.find((s) => s.id === serviceId)?.price ?? "0")
                  : undefined
              }
              key={`amount-${serviceId}`}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Add entry"}
          </Button>
        </form>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg text-foreground">
              Entries ({totals.count})
            </h2>
          </div>

          {entries.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
              No entries for this day yet. Add manually or scan a photo of your written logbook.
            </p>
          ) : (
            <ul className="space-y-3">
              {entries.map((entry) => (
                <LogbookEntryRow
                  key={entry.id}
                  entry={entry}
                  logDate={logDate}
                  services={services}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

