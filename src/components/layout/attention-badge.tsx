import { cn } from "@/lib/utils";
import { formatAttentionCount } from "@/lib/attention-badge";

type Props = {
  count: number;
  className?: string;
};

export function AttentionBadge({ count, className }: Props) {
  const label = formatAttentionCount(count);
  if (!label) return null;

  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold leading-none text-white",
        className
      )}
      aria-label={`${count} need attention`}
    >
      {label}
    </span>
  );
}
