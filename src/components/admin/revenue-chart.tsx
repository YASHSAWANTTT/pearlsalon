import { formatPrice } from "@/lib/constants";

type Point = { label: string; value: number; isToday?: boolean };

export function RevenueChart({ data }: { data: Point[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-44 items-end gap-1.5">
      {data.map((point, i) => {
        const heightPct = point.value > 0 ? Math.max((point.value / max) * 100, 4) : 1.5;
        return (
          <div key={i} className="group flex flex-1 flex-col items-center justify-end gap-2">
            <div className="relative flex w-full flex-1 items-end">
              <div
                className={
                  "w-full rounded-t-sm transition-colors " +
                  (point.isToday
                    ? "bg-primary"
                    : "bg-primary/25 group-hover:bg-primary/50")
                }
                style={{ height: `${heightPct}%` }}
              />
              <div className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[11px] text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                {formatPrice(point.value)}
              </div>
            </div>
            <span className="text-[10px] tabular-nums text-muted-foreground">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
