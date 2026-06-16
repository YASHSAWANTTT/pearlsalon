import type { AppointmentInfo, QueueInfo } from "./types";
import {
  notifyAppointmentCreated as notifyWhatsAppAppointmentCreated,
  notifyAppointmentStatus as notifyWhatsAppAppointmentStatus,
  notifyQueueJoined as notifyWhatsAppQueueJoined,
  notifyQueueStatus as notifyWhatsAppQueueStatus,
} from "@/lib/whatsapp/notify";
import {
  notifyAppointmentCreatedEmail,
  notifyAppointmentStatusEmail,
  notifyQueueJoinedEmail,
  notifyQueueStatusEmail,
} from "@/lib/email/notify";

export type { AppointmentInfo, QueueInfo };

/** WhatsApp + email in parallel; failures never block the booking action. */
export async function notifyAppointmentCreated(info: AppointmentInfo) {
  await Promise.allSettled([
    notifyWhatsAppAppointmentCreated(info),
    notifyAppointmentCreatedEmail(info),
  ]);
}

export async function notifyAppointmentStatus(info: AppointmentInfo, status: string) {
  await Promise.allSettled([
    notifyWhatsAppAppointmentStatus(info, status),
    notifyAppointmentStatusEmail(info, status),
  ]);
}

export async function notifyQueueJoined(info: QueueInfo) {
  await Promise.allSettled([
    notifyWhatsAppQueueJoined(info),
    notifyQueueJoinedEmail(info),
  ]);
}

export async function notifyQueueStatus(info: QueueInfo, status: string) {
  await Promise.allSettled([
    notifyWhatsAppQueueStatus(info, status),
    notifyQueueStatusEmail(info, status),
  ]);
}
