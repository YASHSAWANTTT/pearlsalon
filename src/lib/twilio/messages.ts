import "server-only";

import { formatSlotDate } from "@/lib/datetime";
import { SALON_NAME } from "@/lib/constants";

export type AppointmentInfo = {
  customerName: string;
  customerPhone: string;
  serviceName: string;
  scheduledAtIso: string;
};

export type QueueInfo = {
  customerName: string;
  customerPhone: string;
  serviceName: string;
  position: number;
};

function when(iso: string) {
  return formatSlotDate(iso);
}

function humanizeStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// --- Client (warm, friendly) ---

export function smsAppointmentSubmitted(a: AppointmentInfo) {
  return `Hi ${a.customerName}! We've received your booking for ${a.serviceName} on ${when(a.scheduledAtIso)}. We'll confirm it shortly. See you at ${SALON_NAME}!`;
}

export function smsAppointmentConfirmed(a: AppointmentInfo) {
  return `Hi ${a.customerName}! Your ${a.serviceName} on ${when(a.scheduledAtIso)} is confirmed. We can't wait to see you! - ${SALON_NAME}`;
}

export function smsAppointmentCancelled(a: AppointmentInfo) {
  return `Hi ${a.customerName}, your ${a.serviceName} on ${when(a.scheduledAtIso)} has been cancelled. Message us anytime to rebook. - ${SALON_NAME}`;
}

export function smsQueueJoined(q: QueueInfo) {
  return `Hi ${q.customerName}! You're #${q.position} in line for ${q.serviceName}. We'll text you when it's your turn! - ${SALON_NAME}`;
}

export function smsQueueCalled(q: QueueInfo) {
  return `Hi ${q.customerName}, it's your turn! Please come to the front desk for your ${q.serviceName}. - ${SALON_NAME}`;
}

// --- Business (short, operational) ---

export function smsBusinessAppointmentNew(a: AppointmentInfo) {
  return `New booking: ${a.customerName} (${a.customerPhone}) — ${a.serviceName} on ${when(a.scheduledAtIso)}. Awaiting confirmation.`;
}

export function smsBusinessAppointmentUpdate(a: AppointmentInfo, status: string) {
  return `Appointment ${humanizeStatus(status)}: ${a.customerName} — ${a.serviceName} on ${when(a.scheduledAtIso)}.`;
}

export function smsBusinessQueueNew(q: QueueInfo) {
  return `New walk-in: ${q.customerName} (${q.customerPhone}) — ${q.serviceName}. Queue #${q.position}.`;
}

export function smsBusinessQueueUpdate(q: QueueInfo, status: string) {
  return `Queue ${humanizeStatus(status)}: ${q.customerName} — ${q.serviceName}.`;
}
