"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, List, ListOrdered, MapPin, type LucideIcon } from "lucide-react";
import { mobileGlassNav } from "@/lib/design";
import { cn } from "@/lib/utils";

type DockItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
  primary?: boolean;
};

const dockItems: DockItem[] = [
  { href: "/", label: "Home", icon: Home, match: (path) => path === "/" },
  { href: "/services", label: "Menu", icon: List, match: (path) => path.startsWith("/services") },
  { href: "/book", label: "Book", icon: Calendar, match: (path) => path.startsWith("/book"), primary: true },
  { href: "/queue", label: "Queue", icon: ListOrdered, match: (path) => path.startsWith("/queue") },
  { href: "/#visit", label: "Visit", icon: MapPin, match: () => false },
];

export function showMobileDock(pathname: string) {
  if (pathname.startsWith("/staff") || pathname.startsWith("/admin") || pathname.startsWith("/sign-in")) {
    return false;
  }
  if (pathname.startsWith("/queue/status")) {
    return false;
  }
  return true;
}

export function MobileDock() {
  const pathname = usePathname();

  if (!showMobileDock(pathname)) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <div
        className={cn(
          mobileGlassNav,
          "pointer-events-auto mx-auto flex max-w-md items-end justify-between gap-1 px-2 py-2"
        )}
      >
        {dockItems.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-1 flex-col items-center gap-1"
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={cn(
                    "flex h-12 w-12 -translate-y-2 items-center justify-center rounded-full shadow-lg ring-2 ring-white/60 transition-transform active:scale-95",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/90 text-primary-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium uppercase tracking-[0.12em]",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors active:bg-white/30 dark:active:bg-white/10"
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
                strokeWidth={1.75}
              />
              <span
                className={cn(
                  "text-[10px] font-medium uppercase tracking-[0.12em]",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
