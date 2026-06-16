import "server-only";

import { SALON_EMAIL_FROM } from "@/lib/constants";

type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

type SendResult = { ok: boolean; error?: string };

function getConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM_EMAIL ?? SALON_EMAIL_FROM,
  };
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

let warnedMissingConfig = false;

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailArgs): Promise<SendResult> {
  const { apiKey, from } = getConfig();

  if (!apiKey) {
    if (!warnedMissingConfig) {
      console.warn("[email] not configured (RESEND_API_KEY missing); skipping sends.");
      warnedMissingConfig = true;
    }
    return { ok: false, error: "not_configured" };
  }

  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (recipients.length === 0) return { ok: false, error: "no_recipients" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject,
        html,
        ...(text ? { text } : {}),
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[email] send failed (${res.status}): ${body}`);
      return { ok: false, error: `http_${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[email] send error: ${msg}`);
    return { ok: false, error: msg };
  } finally {
    clearTimeout(timeout);
  }
}
