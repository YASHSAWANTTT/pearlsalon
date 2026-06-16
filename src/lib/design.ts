import {
  Droplets,
  Flower2,
  Leaf,
  Scissors,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export const colors = {
  cream: "#F9F6F4",
  blush: "#F2E8E6",
  burgundy: "#7D3C43",
  ink: "#1A1A1A",
  muted: "#707070",
  border: "#E8E4E1",
} as const;

export const categoryIcons: Record<string, LucideIcon> = {
  Facials: Sparkles,
  "D-Tan": Sun,
  "Normal Waxing": Scissors,
  "Rica Waxing": Leaf,
  Bleach: Droplets,
  Threading: Scissors,
  "Head Massage": Flower2,
  Polishing: Sparkles,
};

export function getServiceIcon(category: string): LucideIcon {
  return categoryIcons[category] ?? Sparkles;
}

/** Floating liquid-glass shell for mobile nav bars (scoped to max-md). */
export const mobileGlassNavScoped = cn(
  "max-md:rounded-2xl max-md:border max-md:border-white/40 max-md:bg-white/35",
  "max-md:shadow-[0_8px_32px_rgba(0,0,0,0.06)] max-md:backdrop-blur-2xl max-md:backdrop-saturate-150",
  "max-md:ring-1 max-md:ring-inset max-md:ring-white/50",
  "max-md:dark:border-white/10 max-md:dark:bg-black/20 max-md:dark:shadow-black/25 max-md:dark:ring-white/10"
);

/** Floating liquid-glass shell for mobile nav bars. */
export const mobileGlassNav = cn(
  "rounded-2xl border border-white/40 bg-white/35",
  "shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-2xl backdrop-saturate-150",
  "ring-1 ring-inset ring-white/50",
  "dark:border-white/10 dark:bg-black/20 dark:shadow-black/25 dark:ring-white/10"
);

/** Liquid-glass panel for mobile nav sheets. */
export const mobileGlassSheet = cn(
  "rounded-2xl border border-white/40 bg-white/50",
  "shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-2xl backdrop-saturate-150",
  "ring-1 ring-inset ring-white/50",
  "dark:border-white/10 dark:bg-black/30 dark:ring-white/10"
);

/** Float the sheet off the screen edge with rounded glass corners. */
export const mobileGlassSheetLayout =
  "!top-3 !right-3 !bottom-auto !left-auto !h-auto max-h-[calc(100dvh-1.5rem)] w-[min(calc(100vw-1.5rem),20rem)] !border-l-0";

/** Inner padding for mobile glass nav sheets. */
export const mobileGlassSheetBody = "flex flex-col gap-0.5 px-4 pb-5 pt-11";
