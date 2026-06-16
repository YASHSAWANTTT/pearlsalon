import "server-only";

import { formatSlotDate } from "@/lib/datetime";
import { SALON_CONTACT, SALON_NAME } from "@/lib/constants";
import type { AppointmentInfo, QueueInfo } from "@/lib/notifications/types";

function when(iso: string) {
  return formatSlotDate(iso);
}

function humanizeStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function wrap(title: string, body: string) {
  return `<div style="font-family:Georgia,serif;max-width:520px;color:#17120F;line-height:1.6">
  <p style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#8E1B2E;margin:0 0 8px">${SALON_NAME}</p>
  <h1 style="font-size:22px;font-weight:400;margin:0 0 16px">${title}</h1>
  <p style="margin:0 0 16px">${body}</p>
  <p style="margin:24px 0 0;font-size:13px;color:#6E6662">${SALON_CONTACT.address}<br>${SALON_CONTACT.phoneDisplay}</p>
</div>`;
}

export function emailAppointmentSubmitted(a: AppointmentInfo) {
  const whenStr = when(a.scheduledAtIso);
  return {
    subject: `Booking received — ${a.serviceName}`,
    html: wrap(
      "We've received your booking",
      `Hi ${a.customerName},<br><br>We've received your booking for <strong>${a.serviceName}</strong> on ${whenStr}. We'll confirm it shortly.<br><br>See you soon!`
    ),
    text: `Hi ${a.customerName}! We've received your booking for ${a.serviceName} on ${whenStr}. We'll confirm it shortly. - ${SALON_NAME}`,
  };
}

export function emailAppointmentConfirmed(a: AppointmentInfo) {
  const whenStr = when(a.scheduledAtIso);
  return {
    subject: `Confirmed — ${a.serviceName}`,
    html: wrap(
      "Your appointment is confirmed",
      `Hi ${a.customerName},<br><br>Your <strong>${a.serviceName}</strong> on ${whenStr} is confirmed. We can't wait to see you!`
    ),
    text: `Hi ${a.customerName}! Your ${a.serviceName} on ${whenStr} is confirmed. - ${SALON_NAME}`,
  };
}

export function emailAppointmentCancelled(a: AppointmentInfo) {
  const whenStr = when(a.scheduledAtIso);
  return {
    subject: `Cancelled — ${a.serviceName}`,
    html: wrap(
      "Appointment cancelled",
      `Hi ${a.customerName},<br><br>Your <strong>${a.serviceName}</strong> on ${whenStr} has been cancelled. Message us anytime to rebook.`
    ),
    text: `Hi ${a.customerName}, your ${a.serviceName} on ${whenStr} has been cancelled. - ${SALON_NAME}`,
  };
}

export function emailBusinessAppointmentNew(a: AppointmentInfo) {
  const whenStr = when(a.scheduledAtIso);
  return {
    subject: `New booking — ${a.customerName}`,
    html: wrap(
      "New booking",
      `<strong>${a.customerName}</strong> (${a.customerPhone}${a.customerEmail ? ` · ${a.customerEmail}` : ""})<br>Service: ${a.serviceName}<br>When: ${whenStr}<br>Status: awaiting confirmation`
    ),
    text: `New booking: ${a.customerName} (${a.customerPhone}) — ${a.serviceName} on ${whenStr}.`,
  };
}

export function emailBusinessAppointmentUpdate(a: AppointmentInfo, status: string) {
  const whenStr = when(a.scheduledAtIso);
  const label = humanizeStatus(status);
  return {
    subject: `Appointment ${label} — ${a.customerName}`,
    html: wrap(
      `Appointment ${label}`,
      `<strong>${a.customerName}</strong> — ${a.serviceName}<br>When: ${whenStr}`
    ),
    text: `Appointment ${label}: ${a.customerName} — ${a.serviceName} on ${whenStr}.`,
  };
}

export function emailBusinessQueueNew(q: QueueInfo) {
  return {
    subject: `Walk-in — ${q.customerName}`,
    html: wrap(
      "New walk-in",
      `<strong>${q.customerName}</strong> (${q.customerPhone})<br>Service: ${q.serviceName}<br>Queue #${q.position}`
    ),
    text: `New walk-in: ${q.customerName} (${q.customerPhone}) — ${q.serviceName}. Queue #${q.position}.`,
  };
}

export function emailBusinessQueueUpdate(q: QueueInfo, status: string) {
  const label = humanizeStatus(status);
  return {
    subject: `Queue ${label} — ${q.customerName}`,
    html: wrap(
      `Queue ${label}`,
      `<strong>${q.customerName}</strong> — ${q.serviceName}`
    ),
    text: `Queue ${label}: ${q.customerName} — ${q.serviceName}.`,
  };
}
