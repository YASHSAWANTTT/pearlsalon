import { z } from "zod";

const entryType = z.enum(["revenue", "expense", "note", "appointment", "queue"]);

export const logEntrySchema = z.object({
  logDate: z.string(),
  entryType,
  customerName: z.string().optional(),
  description: z.string().min(1),
  amount: z.coerce.number().optional(),
  referenceId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional().or(z.literal("")),
  photoUrl: z.string().optional(),
  source: z.enum(["manual", "ai"]).optional().default("manual"),
});

export const updateLogEntrySchema = logEntrySchema.extend({
  id: z.string().uuid(),
});

export const bulkLogEntrySchema = z.object({
  logDate: z.string(),
  photoUrl: z.string().optional(),
  items: z.array(
    z.object({
      logDate: z.string(),
      entryType: z.enum(["revenue", "expense"]),
      customerName: z.string().optional().nullable(),
      description: z.string().min(1),
      amount: z.coerce.number().positive(),
      serviceId: z.string().uuid().optional().nullable(),
    })
  ),
});

export type LogEntryInput = z.infer<typeof logEntrySchema>;
