import "server-only";

import { getAllStaff, getSalonSettings } from "@/lib/queries/settings";
import { SALON_CONTACT } from "@/lib/constants";

/** Owner / business number for operational SMS alerts. */
export async function getOwnerPhone(): Promise<string | null> {
  const envOwner =
    process.env.TWILIO_BUSINESS_OWNER_PHONE ??
    process.env.WHATSAPP_BUSINESS_OWNER_PHONE;
  if (envOwner) return envOwner;
  try {
    const settings = await getSalonSettings();
    if (settings.phone) return settings.phone;
  } catch {
    // fall through
  }
  return SALON_CONTACT.phone;
}

/** Owner (always) + active staff with a saved phone. */
export async function getBusinessRecipients(): Promise<string[]> {
  const recipients = new Set<string>();

  const owner = await getOwnerPhone();
  if (owner) recipients.add(owner);

  try {
    const staff = await getAllStaff();
    for (const member of staff) {
      if (member.isActive && member.phone) recipients.add(member.phone);
    }
  } catch {
    // best-effort
  }

  return [...recipients];
}

/** Owner inbox + active staff Clerk emails for business alerts. */
export async function getBusinessEmailRecipients(): Promise<string[]> {
  const recipients = new Set<string>();

  const owner = process.env.RESEND_BUSINESS_EMAIL;
  if (owner) recipients.add(owner);

  try {
    const staff = await getAllStaff();
    for (const member of staff) {
      if (member.isActive && member.email) recipients.add(member.email);
    }
  } catch {
    // best-effort
  }

  return [...recipients];
}
