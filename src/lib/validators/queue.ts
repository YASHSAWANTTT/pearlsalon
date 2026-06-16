import { z } from "zod";

export const joinQueueSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  serviceId: z.string().uuid("Please select a service"),
});

export type JoinQueueInput = z.infer<typeof joinQueueSchema>;

export const updateQueueStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["waiting", "called", "in_service", "completed", "left"]),
});
