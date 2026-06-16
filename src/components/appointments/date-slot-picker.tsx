"use client";

import { useEffect, useMemo } from "react";
import {
  addDays,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfDay,
} from "date-fns";
import { Loader2 } from "lucide-react";
import { formatSlot, getSalonHour } from "@/lib/datetime";
import { cn } from "@/lib/utils";

type Props = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  slots: string[];
  selectedSlot: string;
  onSlotChange: (slot: string) => void;
  loading?: boolean;
  disabled?: boolean;
  daysAhead?: number;
};

type SlotGroup = {
  label: string;
  slots: string[];
};

function toDateString(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function groupSlots(slots: string[]): SlotGroup[] {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  for (const slot of slots) {
    const hour = getSalonHour(slot);
    if (hour < 12) morning.push(slot);
    else if (hour < 17) afternoon.push(slot);
    else evening.push(slot);
  }

  return [
    { label: "Morning", slots: morning },
    { label: "Afternoon", slots: afternoon },
    { label: "Evening", slots: evening },
  ].filter((g) => g.slots.length > 0);
}

export function DateSlotPicker({
  selectedDate,
  onDateChange,
  slots,
  selectedSlot,
  onSlotChange,
  loading = false,
  disabled = false,
  daysAhead = 14,
}: Props) {
  const today = startOfDay(new Date());

  const days = useMemo(
    () => Array.from({ length: daysAhead }, (_, i) => addDays(today, i)),
    [today, daysAhead]
  );

  const selectedDay = useMemo(
    () => (selectedDate ? parseISO(selectedDate) : today),
    [selectedDate, today]
  );

  const slotGroups = useMemo(() => groupSlots(slots), [slots]);

  useEffect(() => {
    if (selectedSlot && !slots.includes(selectedSlot)) {
      onSlotChange("");
    }
  }, [slots, selectedSlot, onSlotChange]);

  return (
    <div className="space-y-4">
      <div>
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
          {days.map((day) => {
            const dateStr = toDateString(day);
            const active = isSameDay(day, selectedDay);
            const todayMark = isToday(day);

            return (
              <button
                key={dateStr}
                type="button"
                disabled={disabled}
                onClick={() => onDateChange(dateStr)}
                className={cn(
                  "relative flex aspect-[5/6] min-w-0 flex-col items-center justify-center rounded-lg border px-1 py-1.5 transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  disabled && "cursor-not-allowed opacity-50",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/35 hover:bg-muted/50"
                )}
              >
                <span
                  className={cn(
                    "text-[9px] font-medium uppercase tracking-wide sm:text-[10px]",
                    active ? "text-primary-foreground/75" : "text-muted-foreground"
                  )}
                >
                  {format(day, "EEE")}
                </span>
                <span className="font-serif text-base leading-none tabular-nums sm:text-lg">
                  {format(day, "d")}
                </span>
                <span
                  className={cn(
                    "mt-0.5 text-[8px] uppercase tracking-wide sm:text-[9px]",
                    active ? "text-primary-foreground/65" : "text-muted-foreground"
                  )}
                >
                  {format(day, "MMM")}
                </span>
                {todayMark && !active && (
                  <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {format(selectedDay, "EEEE, MMMM d")}
          {isToday(selectedDay) && (
            <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
              · Today
            </span>
          )}
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Available times
          </p>
          {loading && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Updating
            </span>
          )}
        </div>

        {disabled ? (
          <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-4 text-center text-xs text-muted-foreground">
            Select a treatment to see open times.
          </p>
        ) : loading && slots.length === 0 ? (
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-md bg-muted/60"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-4 text-center text-xs text-muted-foreground">
            No open slots this day — try another date.
          </p>
        ) : (
          <div className="space-y-3">
            {slotGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground/75">
                  {group.label}
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {group.slots.map((slot) => {
                    const active = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => onSlotChange(slot)}
                        className={cn(
                          "rounded-md border px-1.5 py-2 text-xs tabular-nums transition-colors duration-150 sm:text-sm",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50"
                        )}
                      >
                        {formatSlot(slot)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
