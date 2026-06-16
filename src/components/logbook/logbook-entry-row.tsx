"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { deleteLogEntry, updateLogEntry } from "@/lib/actions/logbook";
import { formatPrice } from "@/lib/constants";
import type { Service } from "@/db/schema";

export type LogbookEntryRow = {
  id: string;
  entryType: string;
  customerName: string | null;
  description: string;
  amount: string | null;
  staffName: string | null;
  serviceId: string | null;
  serviceName: string | null;
  photoUrl: string | null;
  source: string;
  createdAt: string;
};

type Props = {
  entry: LogbookEntryRow;
  logDate: string;
  services: Service[];
};

export function LogbookEntryRow({ entry, logDate, services }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [entryType, setEntryType] = useState(entry.entryType);
  const [serviceId, setServiceId] = useState(entry.serviceId ?? "");

  function handleDelete() {
    if (!confirm("Delete this logbook entry?")) return;

    startTransition(async () => {
      const result = await deleteLogEntry(entry.id);
      if (result.error) toast.error(result.error);
      else toast.success("Entry deleted");
    });
  }

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("id", entry.id);
    formData.set("logDate", logDate);
    formData.set("entryType", entryType);
    formData.set("serviceId", serviceId);

    startTransition(async () => {
      const result = await updateLogEntry(formData);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Entry updated");
        setOpen(false);
      }
    });
  }

  return (
    <>
      <li className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary">
                {entry.entryType}
              </span>
              {entry.source === "ai" && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                  AI scan
                </span>
              )}
            </div>
            {entry.customerName && (
              <p className="mt-1 font-serif text-base text-foreground">{entry.customerName}</p>
            )}
            <p className="mt-1 text-sm text-foreground">{entry.description}</p>
            {entry.serviceName && entry.serviceName !== entry.description && (
              <p className="mt-1 text-xs text-muted-foreground">Service: {entry.serviceName}</p>
            )}
            {entry.staffName && (
              <p className="mt-1 text-xs text-muted-foreground/70">by {entry.staffName}</p>
            )}
          </div>

          <div className="flex items-start gap-2">
            {entry.amount && (
              <span className="font-medium tabular-nums text-foreground">
                {formatPrice(entry.amount)}
              </span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              aria-label="Edit entry"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isPending}
              aria-label="Delete entry"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </li>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
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
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="queue">Queue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Service (optional)</Label>
              <Select value={serviceId || "none"} onValueChange={(v) => setServiceId(!v || v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Link to menu service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`name-${entry.id}`}>Customer name</Label>
              <Input
                id={`name-${entry.id}`}
                name="customerName"
                defaultValue={entry.customerName ?? ""}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`desc-${entry.id}`}>Description</Label>
              <Textarea
                id={`desc-${entry.id}`}
                name="description"
                defaultValue={entry.description}
                required
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`amount-${entry.id}`}>Amount</Label>
              <Input
                id={`amount-${entry.id}`}
                name="amount"
                type="number"
                step="1"
                min="0"
                defaultValue={entry.amount ?? ""}
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
