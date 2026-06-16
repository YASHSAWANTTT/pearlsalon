"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { PearlLogo } from "@/components/layout/pearl-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/services", label: "Menu" },
  { href: "/book", label: "Book" },
  { href: "/queue", label: "Queue" },
];

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
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
          <ThemeToggle />

          <Link
            href="/staff"
            className="hidden text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary sm:inline-flex sm:px-2"
          >
            Staff
          </Link>

          <Link
            href="/book"
            className="hidden rounded-full bg-primary px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow sm:inline-flex"
          >
            Reserve
          </Link>

          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "md:hidden"
              )}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-border bg-background">
              <div className="mt-8 flex flex-col gap-1 px-2">
                <p className="eyebrow mb-4 px-3">Pearl Beauty &amp; Spa</p>
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-md px-3 py-3 text-sm font-medium uppercase tracking-[0.12em] transition-colors",
                        active
                          ? "bg-secondary text-primary"
                          : "text-foreground hover:bg-secondary/60"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <Link
                  href="/book"
                  className="mt-4 rounded-full bg-primary px-6 py-3 text-center text-sm font-medium uppercase tracking-[0.12em] text-primary-foreground"
                >
                  Reserve a Time
                </Link>
                <Link
                  href="/staff"
                  className="mt-2 px-3 py-2 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary"
                >
                  Staff login
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
