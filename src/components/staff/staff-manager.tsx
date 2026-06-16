"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  updateStaffRole,
  toggleStaffActive,
  updateStaffPhone,
} from "@/lib/actions/settings";

type StaffRow = {
  id: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  role: string;
  isActive: boolean;
};

function PhoneCell({ id, phone }: { id: string; phone: string | null }) {
  const [value, setValue] = useState(phone ?? "");
  const [isPending, startTransition] = useTransition();
  const dirty = value.trim() !== (phone ?? "").trim();

  function save() {
    startTransition(async () => {
      try {
        await updateStaffPhone(id, value);
        toast.success("WhatsApp number saved");
      } catch {
        toast.error("Could not save number");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="+91 ..."
        className="h-8 w-36"
        inputMode="tel"
      />
      {dirty && (
        <Button size="sm" variant="outline" disabled={isPending} onClick={save}>
          Save
        </Button>
      )}
    </div>
  );
}

export function StaffManager({ staff }: { staff: StaffRow[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>WhatsApp</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
              No staff members yet. Invite users via Clerk and set their role in public metadata.
            </TableCell>
          </TableRow>
        ) : (
          staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.displayName}</TableCell>
              <TableCell className="text-muted-foreground">{member.email}</TableCell>
              <TableCell>
                <PhoneCell id={member.id} phone={member.phone} />
              </TableCell>
              <TableCell>
                <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={member.isActive ? "default" : "secondary"}>
                  {member.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {member.role !== "admin" && (
                    <Button size="sm" variant="outline" disabled={isPending}
                      onClick={() => startTransition(async () => {
                        await updateStaffRole(member.id, "admin");
                        toast.success("Promoted to admin");
                      })}>
                      Make Admin
                    </Button>
                  )}
                  {member.role === "admin" && (
                    <Button size="sm" variant="outline" disabled={isPending}
                      onClick={() => startTransition(async () => {
                        await updateStaffRole(member.id, "staff");
                        toast.success("Changed to staff");
                      })}>
                      Make Staff
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" disabled={isPending}
                    onClick={() => startTransition(async () => {
                      await toggleStaffActive(member.id, !member.isActive);
                      toast.success("Updated");
                    })}>
                    {member.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
    </div>
  );
}
