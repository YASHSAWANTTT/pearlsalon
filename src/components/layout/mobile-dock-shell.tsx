"use client";

import { usePathname } from "next/navigation";
import { MobileDock, showMobileDock } from "@/components/layout/mobile-dock";
import { cn } from "@/lib/utils";

export function MobileDockShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dockVisible = showMobileDock(pathname);

  return (
    <>
      <div
        className={cn(
          dockVisible &&
            "max-md:pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]"
        )}
      >
        {children}
      </div>
      <MobileDock />
    </>
  );
}
