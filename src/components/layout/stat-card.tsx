import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  href?: string;
  hint?: string;
  className?: string;
};

export function StatCard({ label, value, icon: Icon, href, hint, className }: Props) {
  const body = (
    <div
      className={cn(
        "group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-lg border border-border bg-card p-6 transition-colors",
        href && "hover:border-primary/40",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </p>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
        )}
      </div>
      <div>
        <p className="font-serif text-3xl font-light tracking-tight text-foreground">
          {value}
        </p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {href && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {body}
      </Link>
    );
  }
  return body;
}
