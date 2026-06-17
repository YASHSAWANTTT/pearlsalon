import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { PortalSidebar } from "@/components/layout/portal-sidebar";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <PortalSidebar variant="admin" />
      <div className="flex flex-1 flex-col">
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
