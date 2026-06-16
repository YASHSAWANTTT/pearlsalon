import {
  Droplets,
  Flower2,
  Leaf,
  Scissors,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";

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
