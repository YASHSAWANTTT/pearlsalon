"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  ListOrdered,
  Menu,
  Scissors,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };

const STAFF_NAV: NavItem[] = [
  { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff/appointments", label: "Appointments", icon: Calendar },
  { href: "/staff/queue", label: "Queue", icon: ListOrdered },
  { href: "/staff/logbook", label: "Logbook", icon: ClipboardList },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Scissors },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/logbook", label: "Logbook", icon: ClipboardList },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

type Variant = "staff" | "admin";

type Props = {
  variant: Variant;
  /** Whether the current staff user also has admin access (staff variant only). */
  isAdmin?: boolean;
};

function Brand({ variant }: { variant: Variant }) {
  const home = variant === "admin" ? "/admin" : "/staff";
  return (
    <Link href={home} className="flex items-center gap-2.5">
      <span className="font-serif text-xl tracking-tight text-foreground">Pearl</span>
      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
        {variant === "admin" ? "Admin" : "Staff"}
      </span>
    </Link>
  );
}

function NavLinks({
  items,
  pathname,
  onNavigate,
  footer,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
  footer?: React.ReactNode;
}) {
  return (
    <nav className="flex-1 space-y-1 p-3">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/staff" || item.href === "/admin"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-secondary font-medium text-primary"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            )}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
            )}
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
      {footer}
    </nav>
  );
}

export function PortalSidebar({ variant, isAdmin }: Props) {
  const pathname = usePathname();
  const items = variant === "admin" ? ADMIN_NAV : STAFF_NAV;

  const crossLink =
    variant === "admin" ? (
      <Link
        href="/staff"
        className="mt-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
      >
        <ArrowLeftRight className="h-4 w-4" strokeWidth={1.75} />
        Staff View
      </Link>
    ) : isAdmin ? (
      <Link
        href="/admin"
        className="mt-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-primary transition-colors hover:bg-secondary"
      >
        <ArrowLeftRight className="h-4 w-4" strokeWidth={1.75} />
        Admin Panel
      </Link>
    ) : null;

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Brand variant={variant} />
        </div>
        <NavLinks items={items} pathname={pathname} footer={crossLink} />
        <div className="flex items-center gap-3 border-t border-border p-4">
          <UserButton />
          <span className="text-xs text-muted-foreground">Manage account</span>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-sidebar px-4 md:hidden">
        <Sheet>
          <SheetTrigger
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar p-0">
            <div className="flex h-16 items-center border-b border-border px-6">
              <Brand variant={variant} />
            </div>
            <NavLinks items={items} pathname={pathname} footer={crossLink} />
          </SheetContent>
        </Sheet>
        <Brand variant={variant} />
        <UserButton />
      </div>
    </>
  );
}
