import "server-only";

import { formatSlotDate } from "@/lib/datetime";
import { SALON_CONTACT, SALON_NAME } from "@/lib/constants";
import type { AppointmentInfo, QueueInfo } from "@/lib/notifications/types";
import {
  plainFooter,
  renderBusinessEmail,
  renderClientEmail,
} from "./template";

function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "https://pearlsalon.vercel.app"
  );
}

function when(iso: string) {
  return formatSlotDate(iso);
}

function humanizeStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function appointmentDetails(a: AppointmentInfo, extra?: { label: string; value: string }) {
  const rows = [
    { label: "Service", value: a.serviceName },
    { label: "Date & time", value: when(a.scheduledAtIso) },
  ];
  if (extra) rows.push(extra);
  return rows;
}

export function emailAppointmentSubmitted(a: AppointmentInfo) {
  const whenStr = when(a.scheduledAtIso);
  return {
    subject: `We've received your booking — ${a.serviceName}`,
    html: renderClientEmail({
      title: "Your booking is in",
      greeting: `Hi ${a.customerName},`,
      message:
        "Thank you for choosing Pearl. We've received your appointment request and our team will confirm your slot shortly. We look forward to welcoming you.",
      details: appointmentDetails(a, {
        label: "Status",
        value: "Awaiting confirmation",
      }),
      cta: { href: `${appUrl()}/book`, label: "View our services" },
    }),
    text: `Hi ${a.customerName}! We've received your booking for ${a.serviceName} on ${whenStr}. We'll confirm it shortly.${plainFooter()}`,
  };
}

export function emailAppointmentConfirmed(a: AppointmentInfo) {
  const whenStr = when(a.scheduledAtIso);
  return {
    subject: `You're confirmed — ${a.serviceName}`,
    html: renderClientEmail({
      title: "You're all set",
      greeting: `Hi ${a.customerName},`,
      message:
        "Wonderful news — your appointment is confirmed. Take a moment to arrive a few minutes early so we can settle you in with a warm welcome.",
      details: appointmentDetails(a, {
        label: "Status",
        value: "Confirmed",
      }),
      cta: { href: SALON_CONTACT.mapsUrl, label: "Get directions" },
      signOff: "We can't wait to see you,<br>Pearl",
    }),
    text: `Hi ${a.customerName}! Your ${a.serviceName} on ${whenStr} is confirmed. We can't wait to see you!${plainFooter()}`,
  };
}

export function emailAppointmentCancelled(a: AppointmentInfo) {
  const whenStr = when(a.scheduledAtIso);
  return {
    subject: `Appointment cancelled — ${a.serviceName}`,
    html: renderClientEmail({
      title: "Appointment cancelled",
      greeting: `Hi ${a.customerName},`,
      message:
        "Your appointment has been cancelled as requested. Whenever you're ready to visit us again, we'd love to help you book a new time.",
      details: appointmentDetails(a),
      cta: { href: `${appUrl()}/book`, label: "Book again" },
      signOff: "Warm regards,<br>Pearl",
    }),
    text: `Hi ${a.customerName}, your ${a.serviceName} on ${whenStr} has been cancelled. Message us anytime to rebook.${plainFooter()}`,
  };
}

export function emailBusinessAppointmentNew(a: AppointmentInfo) {
  const whenStr = when(a.scheduledAtIso);
  return {
    subject: `New booking — ${a.customerName}`,
    html: renderBusinessEmail({
      title: "New appointment request",
      subtitle: "A guest has booked online and is awaiting confirmation.",
      details: [
        { label: "Guest", value: a.customerName },
        {
          label: "Contact",
          value: `${a.customerPhone}${a.customerEmail ? `<br><a href="mailto:${a.customerEmail}" style="color:#8E1B2E;text-decoration:none">${a.customerEmail}</a>` : ""}`,
        },
        { label: "Service", value: a.serviceName },
        { label: "When", value: whenStr },
        { label: "Status", value: "Pending confirmation" },
      ],
    }),
    text: `New booking: ${a.customerName} (${a.customerPhone}) — ${a.serviceName} on ${whenStr}.`,
  };
}

export function emailBusinessAppointmentUpdate(a: AppointmentInfo, status: string) {
  const whenStr = when(a.scheduledAtIso);
  const label = humanizeStatus(status);
  return {
    subject: `Appointment ${label} — ${a.customerName}`,
    html: renderBusinessEmail({
      title: `Appointment ${label.toLowerCase()}`,
      details: [
        { label: "Guest", value: a.customerName },
        { label: "Service", value: a.serviceName },
        { label: "When", value: whenStr },
        { label: "Status", value: label },
      ],
    }),
    text: `Appointment ${label}: ${a.customerName} — ${a.serviceName} on ${whenStr}.`,
  };
}

export function emailBusinessQueueNew(q: QueueInfo) {
  return {
    subject: `Walk-in — ${q.customerName}`,
    html: renderBusinessEmail({
      title: "New walk-in guest",
      subtitle: "Someone has joined the queue from the website.",
      details: [
        { label: "Guest", value: q.customerName },
        { label: "Phone", value: q.customerPhone },
        { label: "Service", value: q.serviceName },
        { label: "Queue", value: `#${q.position}` },
      ],
    }),
    text: `New walk-in: ${q.customerName} (${q.customerPhone}) — ${q.serviceName}. Queue #${q.position}.`,
  };
}

export function emailBusinessQueueUpdate(q: QueueInfo, status: string) {
  const label = humanizeStatus(status);
  return {
    subject: `Queue ${label} — ${q.customerName}`,
    html: renderBusinessEmail({
      title: `Queue update — ${label.toLowerCase()}`,
      details: [
        { label: "Guest", value: q.customerName },
        { label: "Service", value: q.serviceName },
        { label: "Status", value: label },
      ],
    }),
    text: `Queue ${label}: ${q.customerName} — ${q.serviceName}.`,
  };
}
