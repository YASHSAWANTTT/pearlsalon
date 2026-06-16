import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "header";
};

/**
 * Wrap a group of elements to stagger their load-in.
 * Direct children animate in sequence via the CSS `.reveal` utility.
 */
export function Reveal({ children, className, as = "div" }: RevealProps) {
  const Comp = as;
  return <Comp className={cn("reveal", className)}>{children}</Comp>;
}

type RevealItemProps = {
  children: React.ReactNode;
  index?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * A single revealed element with an explicit order index.
 * Use when items are not direct children of a `.reveal` container.
 */
export function RevealItem({ children, index = 0, className, style }: RevealItemProps) {
  return (
    <div
      className={cn("reveal-item", className)}
      style={{ ["--reveal-index" as string]: index, ...style }}
    >
      {children}
    </div>
  );
}
