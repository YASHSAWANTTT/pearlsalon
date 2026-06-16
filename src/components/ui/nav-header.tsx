"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export type NavHeaderItem = {
  label: string;
  href: string;
};

type NavHeaderProps = {
  items: NavHeaderItem[];
  className?: string;
};

export function NavHeader({ items, className }: NavHeaderProps) {
  return (
    <ul className={cn("flex items-center gap-1 sm:gap-2", className)}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="block rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-foreground/70 transition-colors hover:text-primary md:px-4 md:py-2 md:text-sm"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
