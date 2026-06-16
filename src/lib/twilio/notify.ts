import "server-only";

import { getBusinessRecipients } from "@/lib/notifications/recipients";
import { isTwilioConfigured, sendSms } from "./client";
import {
  smsAppointmentCancelled,
  smsAppointmentConfirmed,
  smsAppointmentSubmitted,
  smsBusinessAppointmentNew,
  smsBusinessAppointmentUpdate,
  smsBusinessQueueNew,
  smsBusinessQueueUpdate,
  smsQueueCalled,
  smsQueueJoined,
  type AppointmentInfo,
  type QueueInfo,
} from "./messages";

async function fanOut(
  clientPhone: string,
  clientBody: string | null,
  businessBody: string | null
) {
  const sends: Promise<unknown>[] = [];

  if (clientBody && clientPhone) {
    sends.push(sendSms(clientPhone, clientBody));
  }

  if (businessBody) {
    const recipients = await getBusinessRecipients();
    for (const recipient of recipients) {
      sends.push(sendSms(recipient, businessBody));
    }
  }

  await Promise.allSettled(sends);
}

export async function notifyAppointmentCreated(info: AppointmentInfo) {
  if (!isTwilioConfigured()) return;
  try {
    await fanOut(
      info.customerPhone,
      smsAppointmentSubmitted(info),
      smsBusinessAppointmentNew(info)
    );
  } catch (err) {
    console.error("[twilio] notifyAppointmentCreated failed", err);
  }
}

export async function notifyAppointmentStatus(
  info: AppointmentInfo,
  status: string
) {
  if (!isTwilioConfigured()) return;
  if (status !== "confirmed" && status !== "cancelled") return;
  try {
    const clientBody =
      status === "confirmed"
        ? smsAppointmentConfirmed(info)
        : smsAppointmentCancelled(info);
    await fanOut(
      info.customerPhone,
      clientBody,
      smsBusinessAppointmentUpdate(info, status)
    );
  } catch (err) {
    console.error("[twilio] notifyAppointmentStatus failed", err);
  }
}

export async function notifyQueueJoined(info: QueueInfo) {
  if (!isTwilioConfigured()) return;
  try {
    await fanOut(
      info.customerPhone,
      smsQueueJoined(info),
      smsBusinessQueueNew(info)
    );
  } catch (err) {
    console.error("[twilio] notifyQueueJoined failed", err);
  }
}

export async function notifyQueueStatus(info: QueueInfo, status: string) {
  if (!isTwilioConfigured()) return;
  if (status !== "called" && status !== "left") return;
  try {
    const clientBody = status === "called" ? smsQueueCalled(info) : null;
    await fanOut(
      info.customerPhone,
      clientBody,
      smsBusinessQueueUpdate(info, status)
    );
  } catch (err) {
    console.error("[twilio] notifyQueueStatus failed", err);
  }
}
