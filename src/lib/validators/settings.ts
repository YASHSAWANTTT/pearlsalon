import { z } from "zod";

export const salonSettingsSchema = z.object({
  name: z.string().min(1).max(120),
  address: z.string().min(1).max(500),
  phone: z.string().min(5).max(30),
  timezone: z.string().min(1).max(64),
});

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const businessHoursDaySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  openTime: z.string().regex(timeRegex, "Invalid open time"),
  closeTime: z.string().regex(timeRegex, "Invalid close time"),
  isClosed: z.boolean(),
});

export const staffRoleSchema = z.enum(["admin", "staff"]);

export const staffIdSchema = z.string().uuid();

export const staffPhoneSchema = z
  .string()
  .max(20)
  .refine((v) => v === "" || /^\+?[0-9\s-]+$/.test(v), "Invalid phone format");
