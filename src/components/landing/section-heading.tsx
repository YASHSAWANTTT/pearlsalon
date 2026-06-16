import { cn } from "@/lib/utils";

type Props = {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: "center" | "left";
};

export function SectionHeading({
  label,
  title,
  subtitle,
  className,
  align = "center",
}: Props) {
  return (
    <div
      className={cn(
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
        {label}
      </p>
      <h2 className="mt-4 font-serif text-3xl font-light leading-tight text-foreground text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
