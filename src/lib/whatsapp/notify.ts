import "server-only";

import { getBusinessRecipients } from "@/lib/notifications/recipients";
import { isWhatsAppConfigured, sendTemplate, sendText } from "./client";
import {
  textAppointmentCancelled,
  textAppointmentConfirmed,
  textAppointmentSubmitted,
  textBusinessAppointmentNew,
  textBusinessAppointmentUpdate,
  textBusinessQueueNew,
  textBusinessQueueUpdate,
  textQueueCalled,
  textQueueJoined,
  type AppointmentInfo,
  type QueueInfo,
} from "./messages";
import {
  buildAppointmentCancelledClient,
  buildAppointmentConfirmedClient,
  buildAppointmentSubmittedClient,
  buildBusinessAppointmentNew,
  buildBusinessAppointmentUpdate,
  buildBusinessQueueNew,
  buildBusinessQueueUpdate,
  buildQueueCalledClient,
  buildQueueJoinedClient,
  type BuiltMessage,
} from "./templates";

/**
 * Try free-form WhatsApp text first (works in the 24h customer service window).
 * Fall back to an approved template for business-initiated / first contact.
 */
async function dispatch(to: string, text: string, template: BuiltMessage | null) {
  const textResult = await sendText(to, text);
  if (textResult.ok) return textResult;
  if (template) {
    return sendTemplate({
      to,
      template: template.template,
      params: template.params,
    });
  }
  return textResult;
}

async function fanOut(
  clientPhone: string,
  clientText: string | null,
  clientTemplate: BuiltMessage | null,
  businessText: string | null,
  businessTemplate: BuiltMessage | null
) {
  const sends: Promise<unknown>[] = [];

  if (clientText && clientPhone) {
    sends.push(dispatch(clientPhone, clientText, clientTemplate));
  }

  if (businessText) {
    const recipients = await getBusinessRecipients();
    for (const recipient of recipients) {
      sends.push(dispatch(recipient, businessText, businessTemplate));
    }
  }

  await Promise.allSettled(sends);
}

export async function notifyAppointmentCreated(info: AppointmentInfo) {
  if (!isWhatsAppConfigured()) return;
  try {
    await fanOut(
      info.customerPhone,
      textAppointmentSubmitted(info),
      buildAppointmentSubmittedClient(info),
      textBusinessAppointmentNew(info),
      buildBusinessAppointmentNew(info)
    );
  } catch (err) {
    console.error("[whatsapp] notifyAppointmentCreated failed", err);
  }
}

export async function notifyAppointmentStatus(
  info: AppointmentInfo,
  status: string
) {
  if (!isWhatsAppConfigured()) return;
  if (status !== "confirmed" && status !== "cancelled") return;
  try {
    const clientText =
      status === "confirmed"
        ? textAppointmentConfirmed(info)
        : textAppointmentCancelled(info);
    const clientTemplate =
      status === "confirmed"
        ? buildAppointmentConfirmedClient(info)
        : buildAppointmentCancelledClient(info);
    await fanOut(
      info.customerPhone,
      clientText,
      clientTemplate,
      textBusinessAppointmentUpdate(info, status),
      buildBusinessAppointmentUpdate(info, status)
    );
  } catch (err) {
    console.error("[whatsapp] notifyAppointmentStatus failed", err);
  }
}

export async function notifyQueueJoined(info: QueueInfo) {
  if (!isWhatsAppConfigured()) return;
  try {
    await fanOut(
      info.customerPhone,
      textQueueJoined(info),
      buildQueueJoinedClient(info),
      textBusinessQueueNew(info),
      buildBusinessQueueNew(info)
    );
  } catch (err) {
    console.error("[whatsapp] notifyQueueJoined failed", err);
  }
}

export async function notifyQueueStatus(info: QueueInfo, status: string) {
  if (!isWhatsAppConfigured()) return;
  if (status !== "called" && status !== "left") return;
  try {
    const clientText = status === "called" ? textQueueCalled(info) : null;
    const clientTemplate = status === "called" ? buildQueueCalledClient(info) : null;
    await fanOut(
      info.customerPhone,
      clientText,
      clientTemplate,
      textBusinessQueueUpdate(info, status),
      buildBusinessQueueUpdate(info, status)
    );
  } catch (err) {
    console.error("[whatsapp] notifyQueueStatus failed", err);
  }
}

export type { AppointmentInfo, QueueInfo };
