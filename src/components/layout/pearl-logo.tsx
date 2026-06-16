import Image from "next/image";
import Link from "next/link";
import { SALON_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/pearl-logo.png";
export const FOOTER_LOGO_SRC = "/pearl-logo-footer.png";

const sizeClasses = {
  sm: "h-8",
  md: "h-11",
  lg: "h-20",
  xl: "h-28",
} as const;

type PearlLogoProps = {
  className?: string;
  imageClassName?: string;
  href?: string | null;
  size?: keyof typeof sizeClasses;
  priority?: boolean;
  src?: string;
  width?: number;
  height?: number;
};

export function PearlLogo({
  className,
  imageClassName,
  href = "/",
  size = "md",
  priority = false,
  src = LOGO_SRC,
  width = 280,
  height = 120,
}: PearlLogoProps) {
  const image = (
    <Image
      src={src}
      alt={SALON_NAME}
      width={width}
      height={height}
      priority={priority}
      className={cn(
        "w-auto object-contain object-left",
        sizeClasses[size],
        "dark:mix-blend-screen dark:brightness-110",
        imageClassName
      )}
    />
  );

  if (href) {
    return (
      <Link href={href} className={cn("inline-flex shrink-0 items-center", className)}>
        {image}
      </Link>
    );
  }

  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>{image}</span>
  );
}
