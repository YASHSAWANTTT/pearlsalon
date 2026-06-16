"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { callNextInQueue, updateQueueStatus } from "@/lib/actions/queue";
import { formatDuration } from "@/lib/constants";

type QueueItem = {
  id: string;
  customerName: string;
  customerPhone: string;
  position: number;
  status: string;
  serviceName: string;
  durationMinutes: number;
  lookupToken: string;
};

const columns = [
  { key: "waiting", label: "Waiting", dot: "bg-amber-400" },
  { key: "called", label: "Called", dot: "bg-primary" },
  { key: "in_service", label: "In Service", dot: "bg-sky-400" },
  { key: "completed", label: "Done", dot: "bg-emerald-400" },
];

export function QueueBoard({
  items,
  queueDate,
}: {
  items: QueueItem[];
  queueDate: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleStatus(id: string, status: string) {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("status", status);
    startTransition(async () => {
      const result = await updateQueueStatus(formData);
      if (result.error) toast.error(result.error);
    });
  }

  function handleCallNext() {
    startTransition(async () => {
      const result = await callNextInQueue(queueDate);
      if (result.error) toast.error(result.error);
      else toast.success("Customer called!");
    });
  }

  const waiting = items.filter((i) => i.status === "waiting");
  const called = items.filter((i) => i.status === "called");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          {called.length > 0 && (
            <div className="flex items-center gap-4 rounded-lg border border-primary/25 bg-primary/5 px-6 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <PhoneCall className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                  Now Calling
                </p>
                <p className="font-serif text-2xl text-foreground">
                  {called.map((c) => c.customerName).join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
        <Button
          onClick={handleCallNext}
          disabled={isPending || waiting.length === 0}
          size="lg"
        >
          Call Next ({waiting.length} waiting)
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((col) => {
          const colItems = items.filter((i) => i.status === col.key);
          return (
            <div
              key={col.key}
              className="flex flex-col rounded-lg border border-border bg-secondary/40"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                  {col.label}
                </span>
                <Badge variant="secondary" className="bg-card">
                  {colItems.length}
                </Badge>
              </div>
              <div className="flex-1 space-y-2 p-3">
                {colItems.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">Empty</p>
                ) : (
                  colItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-md border border-border bg-card p-3 shadow-sm"
                    >
                      <p className="text-sm font-medium text-foreground">
                        <span className="text-primary">#{item.position}</span> {item.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.serviceName}</p>
                      <p className="text-xs text-muted-foreground/70">
                        {formatDuration(item.durationMinutes)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {col.key === "waiting" && (
                          <Button size="sm" variant="outline" className="h-7 text-xs"
                            disabled={isPending}
                            onClick={() => handleStatus(item.id, "called")}>
                            Call
                          </Button>
                        )}
                        {col.key === "called" && (
                          <Button size="sm" variant="outline" className="h-7 text-xs"
                            disabled={isPending}
                            onClick={() => handleStatus(item.id, "in_service")}>
                            Start
                          </Button>
                        )}
                        {col.key === "in_service" && (
                          <Button size="sm" className="h-7 text-xs"
                            disabled={isPending}
                            onClick={() => handleStatus(item.id, "completed")}>
                            Done
                          </Button>
                        )}
                        {!["completed", "left"].includes(col.key) && (
                          <Button size="sm" variant="ghost" className="h-7 text-xs"
                            disabled={isPending}
                            onClick={() => handleStatus(item.id, "left")}>
                            Left
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
