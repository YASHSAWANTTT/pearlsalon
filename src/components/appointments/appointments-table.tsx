"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateAppointmentStatus } from "@/lib/actions/appointments";
import { formatSlot } from "@/lib/datetime";
import { formatPrice } from "@/lib/constants";
import { appointmentStatus } from "@/lib/status-badge";

type AppointmentRow = {
  id: string;
  customerName: string;
  customerPhone: string;
  scheduledAt: string;
  status: string;
  serviceName: string;
  price: string;
};

export function AppointmentsTable({ appointments }: { appointments: AppointmentRow[] }) {
  const [isPending, startTransition] = useTransition();

  function updateStatus(id: string, status: string) {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("status", status);
    startTransition(async () => {
      const result = await updateAppointmentStatus(formData);
      if (result.error) toast.error(result.error);
      else toast.success("Status updated");
    });
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">No appointments scheduled for today.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appt) => (
            <TableRow key={appt.id}>
              <TableCell className="font-medium">
                {formatSlot(appt.scheduledAt)}
              </TableCell>
              <TableCell>
                <div className="font-medium text-foreground">{appt.customerName}</div>
                <div className="text-xs text-muted-foreground">{appt.customerPhone}</div>
              </TableCell>
              <TableCell>
                <div className="text-foreground">{appt.serviceName}</div>
                <div className="text-xs text-muted-foreground">{formatPrice(appt.price)}</div>
              </TableCell>
              <TableCell>
                <Badge className={appointmentStatus(appt.status).className} variant="secondary">
                  {appointmentStatus(appt.status).label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 flex-wrap">
                  {appt.status === "pending" && (
                    <Button size="sm" variant="outline" disabled={isPending}
                      onClick={() => updateStatus(appt.id, "confirmed")}>
                      Confirm
                    </Button>
                  )}
                  {["pending", "confirmed"].includes(appt.status) && (
                    <Button size="sm" variant="outline" disabled={isPending}
                      onClick={() => updateStatus(appt.id, "checked_in")}>
                      Check In
                    </Button>
                  )}
                  {["checked_in", "confirmed"].includes(appt.status) && (
                    <Button size="sm" disabled={isPending}
                      onClick={() => updateStatus(appt.id, "completed")}>
                      Complete
                    </Button>
                  )}
                  {!["completed", "cancelled"].includes(appt.status) && (
                    <>
                      <Button size="sm" variant="ghost" disabled={isPending}
                        onClick={() => updateStatus(appt.id, "no_show")}>
                        No Show
                      </Button>
                      <Button size="sm" variant="ghost" disabled={isPending}
                        onClick={() => updateStatus(appt.id, "cancelled")}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
