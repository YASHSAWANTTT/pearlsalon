import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().min(15).max(480),
  price: z.coerce.number().min(0),
  category: z.string().min(1),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
