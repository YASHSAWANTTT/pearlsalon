import "server-only";

import { normalizePhoneE164 } from "@/lib/phone";

type SendSmsResult = { ok: boolean; error?: string };

function getConfig() {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_PHONE_NUMBER,
    countryCode: process.env.TWILIO_DEFAULT_COUNTRY_CODE || "91",
  };
}

export function isTwilioConfigured() {
  const { accountSid, authToken, from } = getConfig();
  return Boolean(accountSid && authToken && from);
}

let warnedMissingConfig = false;

export async function sendSms(to: string, body: string): Promise<SendSmsResult> {
  const { accountSid, authToken, from, countryCode } = getConfig();

  if (!accountSid || !authToken || !from) {
    if (!warnedMissingConfig) {
      console.warn(
        "[twilio] not configured (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_PHONE_NUMBER missing); skipping SMS."
      );
      warnedMissingConfig = true;
    }
    return { ok: false, error: "not_configured" };
  }

  const phone = normalizePhoneE164(to, countryCode);
  if (!phone) return { ok: false, error: "invalid_phone" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const payload = new URLSearchParams({
    From: from,
    To: phone,
    Body: body,
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[twilio] SMS failed (${res.status}) to ${phone}: ${text}`);
      return { ok: false, error: `http_${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[twilio] SMS error to ${phone}: ${msg}`);
    return { ok: false, error: msg };
  } finally {
    clearTimeout(timeout);
  }
}
