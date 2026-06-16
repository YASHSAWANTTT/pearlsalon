import {
  boolean,
  date,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "confirmed",
  "checked_in",
  "completed",
  "cancelled",
  "no_show",
]);

export const queueStatusEnum = pgEnum("queue_status", [
  "waiting",
  "called",
  "in_service",
  "completed",
  "left",
]);

export const logEntryTypeEnum = pgEnum("log_entry_type", [
  "revenue",
  "expense",
  "note",
  "appointment",
  "queue",
]);

export const logEntrySourceEnum = pgEnum("log_entry_source", ["manual", "ai"]);

export const staffRoleEnum = pgEnum("staff_role", ["admin", "staff"]);

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const staffProfiles = pgTable("staff_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  role: staffRoleEnum("role").notNull().default("staff"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id),
  staffId: uuid("staff_id").references(() => staffProfiles.id),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  status: appointmentStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const queueEntries = pgTable("queue_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id),
  position: integer("position").notNull(),
  status: queueStatusEnum("status").notNull().default("waiting"),
  lookupToken: varchar("lookup_token", { length: 10 }).notNull().unique(),
  queueDate: date("queue_date").notNull(),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  calledAt: timestamp("called_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const dailyLogEntries = pgTable("daily_log_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  logDate: date("log_date").notNull(),
  entryType: logEntryTypeEnum("entry_type").notNull(),
  customerName: text("customer_name"),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  staffId: uuid("staff_id").references(() => staffProfiles.id),
  serviceId: uuid("service_id").references(() => services.id),
  referenceId: uuid("reference_id"),
  photoUrl: text("photo_url"),
  source: logEntrySourceEnum("source").notNull().default("manual"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const businessHours = pgTable("business_hours", {
  dayOfWeek: integer("day_of_week").primaryKey(),
  openTime: time("open_time").notNull(),
  closeTime: time("close_time").notNull(),
  isClosed: boolean("is_closed").notNull().default(false),
});

export const salonSettings = pgTable("salon_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().default("Pearl"),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  timezone: varchar("timezone", { length: 100 }).notNull().default("America/New_York"),
});

export type Service = typeof services.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type QueueEntry = typeof queueEntries.$inferSelect;
export type DailyLogEntry = typeof dailyLogEntries.$inferSelect;
export type StaffProfile = typeof staffProfiles.$inferSelect;
export type BusinessHour = typeof businessHours.$inferSelect;
export type SalonSetting = typeof salonSettings.$inferSelect;
