"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { mobileGlassNavScoped } from "@/lib/design";
import { PearlLogo } from "@/components/layout/pearl-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/services", label: "Menu" },
  { href: "/book", label: "Book" },
  { href: "/queue", label: "Queue" },
  { href: "/#visit", label: "Visit" },
];

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 max-md:px-3 max-md:pt-3 md:border-b md:border-border/70 md:bg-background/80 md:backdrop-blur-xl">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2.5 sm:px-4",
          mobileGlassNavScoped,
          "md:h-16 md:px-6 md:py-0"
        )}
      >
        <PearlLogo size="sm" />

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative text-xs font-medium uppercase tracking-[0.18em] transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px bg-primary transition-all duration-300",
                    active ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/staff"
            className="px-1 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary md:text-xs md:px-2"
          >
            Staff
          </Link>
          <ThemeToggle />

          <Link
            href="/book"
            className="hidden rounded-full bg-primary px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow md:inline-flex"
          >
            Reserve
          </Link>
        </div>
      </div>
    </header>
  );
}
