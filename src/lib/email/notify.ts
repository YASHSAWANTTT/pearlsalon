import "server-only";

import { getBusinessEmailRecipients } from "@/lib/notifications/recipients";
import type { AppointmentInfo, QueueInfo } from "@/lib/notifications/types";
import { isEmailConfigured, sendEmail } from "./client";
import {
  emailAppointmentCancelled,
  emailAppointmentConfirmed,
  emailAppointmentSubmitted,
  emailBusinessAppointmentNew,
  emailBusinessAppointmentUpdate,
  emailBusinessQueueNew,
  emailBusinessQueueUpdate,
} from "./messages";

async function toBusiness(msg: { subject: string; html: string; text: string }) {
  const recipients = await getBusinessEmailRecipients();
  if (recipients.length === 0) return;
  await sendEmail({ to: recipients, ...msg });
}

async function toCustomer(email: string | null | undefined, msg: ReturnType<typeof emailAppointmentSubmitted>) {
  if (!email?.trim()) return;
  await sendEmail({ to: email.trim(), ...msg });
}

export async function notifyAppointmentCreatedEmail(info: AppointmentInfo) {
  if (!isEmailConfigured()) return;
  try {
    await Promise.allSettled([
      toCustomer(info.customerEmail, emailAppointmentSubmitted(info)),
      toBusiness(emailBusinessAppointmentNew(info)),
    ]);
  } catch (err) {
    console.error("[email] notifyAppointmentCreated failed", err);
  }
}

export async function notifyAppointmentStatusEmail(info: AppointmentInfo, status: string) {
  if (!isEmailConfigured()) return;
  if (status !== "confirmed" && status !== "cancelled") return;
  try {
    const clientMsg =
      status === "confirmed"
        ? emailAppointmentConfirmed(info)
        : emailAppointmentCancelled(info);
    await Promise.allSettled([
      toCustomer(info.customerEmail, clientMsg),
      toBusiness(emailBusinessAppointmentUpdate(info, status)),
    ]);
  } catch (err) {
    console.error("[email] notifyAppointmentStatus failed", err);
  }
}

export async function notifyQueueJoinedEmail(info: QueueInfo) {
  if (!isEmailConfigured()) return;
  try {
    await toBusiness(emailBusinessQueueNew(info));
  } catch (err) {
    console.error("[email] notifyQueueJoined failed", err);
  }
}

export async function notifyQueueStatusEmail(info: QueueInfo, status: string) {
  if (!isEmailConfigured()) return;
  if (status !== "called" && status !== "left") return;
  try {
    await toBusiness(emailBusinessQueueUpdate(info, status));
  } catch (err) {
    console.error("[email] notifyQueueStatus failed", err);
  }
}
