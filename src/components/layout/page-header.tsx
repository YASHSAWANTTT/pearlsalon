import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  actions?: React.ReactNode;
  size?: "md" | "lg";
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  actions,
  size = "md",
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn(align === "center" && "mx-auto text-center")}>
        {eyebrow && (
          <p
            className={cn(
              "eyebrow",
              align === "center" && "flex items-center justify-center"
            )}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            "mt-3 font-serif font-light leading-[1.05] tracking-tight text-foreground text-balance",
            size === "lg" ? "text-4xl sm:text-5xl xl:text-6xl" : "text-3xl sm:text-4xl"
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base",
              align === "center" && "mx-auto"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  );
}
