import { z } from "zod";

export const bookAppointmentSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  serviceId: z.string().uuid("Please select a service"),
  scheduledAt: z.string().min(1, "Please select a time slot"),
  notes: z.string().optional(),
});

export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;

export const updateAppointmentStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "pending",
    "confirmed",
    "checked_in",
    "completed",
    "cancelled",
    "no_show",
  ]),
});
