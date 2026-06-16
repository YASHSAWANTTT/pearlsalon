"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavHeader } from "@/components/ui/nav-header";
import { PearlLogo } from "@/components/layout/pearl-logo";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronRight } from "lucide-react";
import { useScroll, motion } from "motion/react";
import { SALON_TAGLINE } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";

const HERO_VIDEO =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL ??
  "/0_Makeup_Lipstick_3840x2160.mp4";

const menuItems = [
  { name: "Menu", href: "/services" },
  { name: "Book", href: "/book" },
  { name: "Queue", href: "/queue" },
  { name: "Visit", href: "/#visit" },
];

export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden bg-background">
        <section className="relative flex min-h-svh flex-col">
          {/* Full-bleed video */}
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="size-full object-cover"
              src={HERO_VIDEO}
            />
            <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/60 to-white/20 dark:from-background/95 dark:via-background/70 dark:to-background/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/45 dark:from-background/90 dark:to-background/50" />
          </div>

          {/* Hero copy */}
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-8 pt-24 lg:px-12 lg:pt-28">
            <div className="mx-auto max-w-lg text-center lg:mx-0 lg:max-w-2xl lg:text-left">
              <h1 className="max-w-2xl text-balance font-serif text-5xl font-light text-foreground drop-shadow-sm md:text-6xl xl:text-7xl">
                A quiet place to feel like{" "}
                <span className="italic text-primary">yourself</span> again
              </h1>
              <p className="mt-8 max-w-2xl text-balance text-lg text-foreground/80 drop-shadow-sm">
                {SALON_TAGLINE}. Signature treatments performed by certified
                specialists using clean, professional-grade products.
              </p>

              <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-primary pl-5 pr-3 text-base text-primary-foreground shadow-lg hover:bg-primary/90"
                >
                  <Link href="/book">
                    <span className="text-nowrap">Reserve a Time</span>
                    <ChevronRight className="ml-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-border bg-background/90 px-5 text-base text-foreground shadow-sm backdrop-blur-sm hover:bg-background"
                >
                  <Link href="/services">
                    <span className="text-nowrap">View our menu</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function HeroHeader() {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const glassBar = cn(
    "mx-auto max-w-7xl rounded-full border px-4 transition-all duration-300 sm:px-6 lg:px-8",
    "border-white/40 bg-white/35 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-2xl backdrop-saturate-150",
    "ring-1 ring-inset ring-white/50",
    "dark:border-white/10 dark:bg-black/20 dark:shadow-black/25 dark:ring-white/10",
    scrolled && "border-white/50 bg-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.1)] dark:bg-black/30"
  );

  return (
    <header>
      <nav data-state={menuState && "active"} className="group fixed z-30 w-full px-3 pt-3 sm:px-4">
        <div className={glassBar}>
          <motion.div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-4 py-2.5 duration-200 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:py-3",
              scrolled && "lg:py-2.5"
            )}
          >
            <PearlLogo size="sm" priority className="relative z-20 shrink-0" />

            <div className="hidden lg:flex lg:justify-center">
              <NavHeader
                items={menuItems.map((item) => ({
                  label: item.name,
                  href: item.href,
                }))}
              />
            </div>

            <div className="flex items-center gap-1 lg:justify-end">
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-1 rounded-full p-2 text-foreground transition-colors hover:bg-white/25 lg:hidden dark:hover:bg-white/10"
              >
                <Menu className="m-auto size-6 duration-200 group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100" />
              </button>

              <div className="hidden items-center gap-1 lg:flex">
                <ThemeToggle />
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-foreground/80 hover:bg-white/25 hover:text-foreground dark:hover:bg-white/10"
                >
                  <Link href="/staff">Staff</Link>
                </Button>
              </div>
            </div>

            <div className="hidden w-full border-t border-white/30 pt-4 group-data-[state=active]:block dark:border-white/10 lg:col-span-3 lg:mb-0">
              <div className="lg:hidden">
                <ul className="space-y-4 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block text-foreground/70 duration-150 hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex items-center gap-2 lg:hidden">
                <ThemeToggle />
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-foreground/80 hover:bg-white/25 dark:hover:bg-white/10"
                >
                  <Link href="/staff">Staff</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}
