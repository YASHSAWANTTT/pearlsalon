"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, Sparkles } from "lucide-react";
import { formatDuration, formatPrice } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Service } from "@/db/schema";

type Props = {
  services: Service[];
  value: string;
  onChange: (serviceId: string) => void;
};

function groupByCategory(services: Service[]) {
  const map = new Map<string, Service[]>();
  for (const service of services) {
    const list = map.get(service.category) ?? [];
    list.push(service);
    map.set(service.category, list);
  }
  return Array.from(map.entries());
}

export function ServicePicker({ services, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const selected = services.find((s) => s.id === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
    );
  }, [services, query]);

  const groups = useMemo(() => groupByCategory(filtered), [filtered]);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();

    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function select(id: string) {
    onChange(id);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "group flex w-full items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2.5 text-left transition-colors duration-150",
          "hover:border-primary/30",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          open ? "border-primary/40 ring-1 ring-primary/10" : "border-border"
        )}
      >
        <div className="min-w-0 flex-1">
          {selected ? (
            <>
              <p className="truncate text-sm font-medium text-foreground">{selected.name}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                <span className="font-medium tabular-nums text-primary">
                  {formatPrice(selected.price)}
                </span>
                <span className="mx-1 text-border">·</span>
                {formatDuration(selected.durationMinutes)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Choose a treatment</p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180 text-primary"
          )}
          strokeWidth={1.75}
        />
      </button>

      <div
        id={listId}
        role="listbox"
        aria-label="Services"
        className={cn(
          "absolute top-[calc(100%+6px)] z-50 w-full origin-top overflow-hidden rounded-xl border border-border bg-popover shadow-lg ring-1 ring-foreground/5",
          "transition-all duration-200 ease-out",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-[0.98] opacity-0"
        )}
      >
        <div className="border-b border-border/80 bg-muted/30 p-2.5">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search treatments…"
              className="h-9 w-full rounded-lg border border-border/80 bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto overscroll-contain p-1.5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <Sparkles className="size-5 text-muted-foreground/50" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">No treatments match your search.</p>
            </div>
          ) : (
            groups.map(([category, items]) => (
              <div key={category} className="mb-1 last:mb-0">
                <p className="sticky top-0 z-10 bg-popover/95 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm">
                  {category}
                </p>
                <ul className="space-y-0.5">
                  {items.map((service) => {
                    const isSelected = service.id === value;
                    return (
                      <li key={service.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => select(service.id)}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors duration-150",
                            isSelected
                              ? "bg-primary/8 text-foreground"
                              : "text-foreground hover:bg-muted/70"
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium leading-snug">
                              {service.name}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {formatDuration(service.durationMinutes)}
                            </p>
                          </div>
                          <span className="shrink-0 text-sm font-medium tabular-nums text-primary">
                            {formatPrice(service.price)}
                          </span>
                          <span
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-150",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background opacity-0 group-hover:opacity-40"
                            )}
                          >
                            {isSelected && <Check className="size-3" strokeWidth={2.5} />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
