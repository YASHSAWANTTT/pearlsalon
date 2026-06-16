/**
 * Active notification channel: WhatsApp (Meta Cloud API).
 * Tries free-form text first, falls back to approved templates.
 * Twilio SMS remains in src/lib/twilio/ as an optional alternative.
 */
export {
  notifyAppointmentCreated,
  notifyAppointmentStatus,
  notifyQueueJoined,
  notifyQueueStatus,
} from "@/lib/whatsapp/notify";

export type {
  AppointmentInfo,
  QueueInfo,
} from "@/lib/whatsapp/messages";
