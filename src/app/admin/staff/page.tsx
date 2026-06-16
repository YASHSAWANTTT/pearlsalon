import { StaffManager } from "@/components/staff/staff-manager";
import { PageHeader } from "@/components/layout/page-header";
import { getAllStaff } from "@/lib/queries/settings";

export const metadata = { title: "Manage Staff" };

export default async function AdminStaffPage() {
  const staff = await getAllStaff();

  const rows = staff.map((s) => ({
    id: s.id,
    displayName: s.displayName,
    email: s.email,
    phone: s.phone,
    role: s.role,
    isActive: s.isActive,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Team"
        title="Staff Management"
        subtitle={
          <>
            Manage staff roles. Invite new members through the Clerk dashboard and set{" "}
            <code className="rounded bg-secondary px-1 text-xs text-primary">publicMetadata.role</code> to{" "}
            <code className="rounded bg-secondary px-1 text-xs text-primary">admin</code> or{" "}
            <code className="rounded bg-secondary px-1 text-xs text-primary">staff</code>.
          </>
        }
      />
      <StaffManager staff={rows} />
    </div>
  );
}
