import type { Metadata } from "next";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { requireStaff, getStaffProfile } from "@/lib/auth";
import { getSalonTimezone } from "@/lib/constants";
import {
  getUnreadAppointmentCount,
  getUnreadQueueCount,
} from "@/lib/queries/staff-attention";
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
  const profile = await getStaffProfile();

  const timezone = getSalonTimezone();
  const todayStr = format(toZonedTime(new Date(), timezone), "yyyy-MM-dd");

  const [unreadAppointments, unreadQueue] = profile
    ? await Promise.all([
        getUnreadAppointmentCount(profile.lastSeenAppointmentsAt),
        getUnreadQueueCount(todayStr, profile.lastSeenQueueAt),
      ])
    : [0, 0];

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <PortalSidebar
        variant="staff"
        isAdmin={role === "admin"}
        badges={{
          appointments: unreadAppointments,
          queue: unreadQueue,
        }}
      />
      <div className="flex flex-1 flex-col">
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
