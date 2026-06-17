import type { Metadata } from "next";
import { requireStaff } from "@/lib/auth";
import { PortalSidebar } from "@/components/layout/portal-sidebar";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = await requireStaff();

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <PortalSidebar variant="staff" isAdmin={role === "admin"} />
      <div className="flex flex-1 flex-col">
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
