import "server-only";

import { formatSlotDate } from "@/lib/datetime";
import type { AppointmentInfo, QueueInfo } from "./messages";

export type { AppointmentInfo, QueueInfo };

/**
 * Template names must match approved templates in Meta WhatsApp Manager.
 * Uses Number variables ({{1}}, {{2}}, ...). See WHATSAPP_SETUP.md.
 */
export const WHATSAPP_TEMPLATES = {
  appointmentScheduling: "appointment_scheduling",
  appointmentConfirmed: "appointment_confirmed",
  appointmentCancelled: "appointment_cancelled",
  queueJoined: "queue_joined",
  queueCalled: "queue_called",
  businessAppointmentNew: "business_appointment_new",
  businessAppointmentUpdate: "business_appointment_update",
  businessQueueNew: "business_queue_new",
  businessQueueUpdate: "business_queue_update",
} as const;

export type BuiltMessage = { template: string; params: string[] };

function humanizeStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** {{1}} name, {{2}} service, {{3}} date & time */
function appointmentClientParams(a: AppointmentInfo): string[] {
  return [a.customerName, a.serviceName, formatSlotDate(a.scheduledAtIso)];
}

// --- Client-facing templates ---

export function buildAppointmentSubmittedClient(a: AppointmentInfo): BuiltMessage {
  return {
    template: WHATSAPP_TEMPLATES.appointmentScheduling,
    params: appointmentClientParams(a),
  };
}

export function buildAppointmentConfirmedClient(a: AppointmentInfo): BuiltMessage {
  return {
    template: WHATSAPP_TEMPLATES.appointmentConfirmed,
    params: appointmentClientParams(a),
  };
}

export function buildAppointmentCancelledClient(a: AppointmentInfo): BuiltMessage {
  return {
    template: WHATSAPP_TEMPLATES.appointmentCancelled,
    params: appointmentClientParams(a),
  };
}

export function buildQueueJoinedClient(q: QueueInfo): BuiltMessage {
  return {
    template: WHATSAPP_TEMPLATES.queueJoined,
    params: [q.customerName, q.serviceName, String(q.position)],
  };
}

export function buildQueueCalledClient(q: QueueInfo): BuiltMessage {
  return {
    template: WHATSAPP_TEMPLATES.queueCalled,
    params: [q.customerName, q.serviceName],
  };
}

// --- Business-facing (concise, operational) ---

export function buildBusinessAppointmentNew(a: AppointmentInfo): BuiltMessage {
  return {
    template: WHATSAPP_TEMPLATES.businessAppointmentNew,
    params: [
      a.customerName,
      a.customerPhone,
      a.serviceName,
      formatSlotDate(a.scheduledAtIso),
    ],
  };
}

export function buildBusinessAppointmentUpdate(
  a: AppointmentInfo,
  status: string
): BuiltMessage {
  return {
    template: WHATSAPP_TEMPLATES.businessAppointmentUpdate,
    params: [
      humanizeStatus(status),
      a.customerName,
      a.serviceName,
      formatSlotDate(a.scheduledAtIso),
    ],
  };
}

export function buildBusinessQueueNew(q: QueueInfo): BuiltMessage {
  return {
    template: WHATSAPP_TEMPLATES.businessQueueNew,
    params: [q.customerName, q.customerPhone, q.serviceName, String(q.position)],
  };
}

export function buildBusinessQueueUpdate(
  q: QueueInfo,
  status: string
): BuiltMessage {
  return {
    template: WHATSAPP_TEMPLATES.businessQueueUpdate,
    params: [humanizeStatus(status), q.customerName, q.serviceName],
  };
}
