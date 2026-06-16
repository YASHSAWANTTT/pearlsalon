"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavHeader } from "@/components/ui/nav-header";
import { PearlLogo } from "@/components/layout/pearl-logo";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useScroll } from "motion/react";
import { SALON_TAGLINE } from "@/lib/constants";
import { mobileGlassNav } from "@/lib/design";
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
        <section className="relative flex min-h-svh min-h-[100dvh] flex-col">
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
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-24 pt-20 sm:px-6 sm:pb-8 sm:pt-24 lg:px-12 lg:pt-28">
            <div className="mx-auto w-full max-w-lg text-center lg:mx-0 lg:max-w-2xl lg:text-left">
              <h1 className="max-w-2xl text-balance font-serif text-[2.125rem] font-light leading-[1.12] text-foreground drop-shadow-sm sm:text-5xl md:text-6xl xl:text-7xl">
                A quiet place to feel like{" "}
                <span className="italic text-primary">yourself</span> again
              </h1>
              <p className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-foreground/80 drop-shadow-sm sm:mt-8 sm:text-lg">
                {SALON_TAGLINE}. Signature treatments performed by certified
                specialists using clean, professional-grade products.
              </p>

              <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-12 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="h-12 w-full rounded-full bg-primary pl-5 pr-3 text-base text-primary-foreground shadow-lg hover:bg-primary/90 sm:w-auto"
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
                  className="h-12 w-full rounded-full border-border bg-background/90 px-5 text-base text-foreground shadow-sm backdrop-blur-sm hover:bg-background sm:w-auto"
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
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const glassBar = cn(
    mobileGlassNav,
    "mx-auto max-w-7xl px-3 transition-all duration-300 sm:px-4 lg:rounded-full lg:px-8",
    scrolled && "border-white/50 bg-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.1)] dark:bg-black/30"
  );

  return (
    <header>
      <nav className="fixed z-30 w-full px-3 pt-3 sm:px-4">
        <div className={glassBar}>
          <div
            className={cn(
              "flex items-center justify-between gap-3 py-2.5 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:py-3",
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
              <div className="flex items-center gap-1 lg:hidden">
                <Link
                  href="/staff"
                  className="rounded-full px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/70 transition-colors hover:bg-white/25 hover:text-foreground dark:hover:bg-white/10"
                >
                  Staff
                </Link>
                <ThemeToggle />
              </div>

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
          </div>
        </div>
      </nav>
    </header>
  );
}
