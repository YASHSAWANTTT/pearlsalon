import "server-only";

const GRAPH_BASE = "https://graph.facebook.com";

type SendResult = { ok: boolean; error?: string };

type SendTemplateArgs = {
  to: string;
  template: string;
  languageCode?: string;
  /** Ordered body parameters that fill {{1}}, {{2}}, ... in the template. */
  params?: string[];
};

function getConfig() {
  return {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    version: process.env.WHATSAPP_API_VERSION || "v21.0",
    defaultLang: process.env.WHATSAPP_TEMPLATE_LANG || "en_US",
    defaultCountryCode: process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "91",
  };
}

export function isWhatsAppConfigured() {
  const { phoneNumberId, accessToken } = getConfig();
  return Boolean(phoneNumberId && accessToken);
}

/**
 * Normalize a raw phone string to digits-only E.164 (no leading +), as Meta expects.
 * 10-digit local numbers get the default country code prepended.
 */
export function normalizePhone(raw: string, countryCode?: string): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  digits = digits.replace(/^0+/, "");
  const cc = countryCode || getConfig().defaultCountryCode;
  if (digits.length === 10) {
    digits = `${cc}${digits}`;
  }
  return digits || null;
}

let warnedMissingConfig = false;

export async function sendTemplate({
  to,
  template,
  languageCode,
  params = [],
}: SendTemplateArgs): Promise<SendResult> {
  const { phoneNumberId, accessToken, version, defaultLang } = getConfig();

  if (!phoneNumberId || !accessToken) {
    if (!warnedMissingConfig) {
      console.warn(
        "[whatsapp] not configured (WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN missing); skipping sends."
      );
      warnedMissingConfig = true;
    }
    return { ok: false, error: "not_configured" };
  }

  const phone = normalizePhone(to);
  if (!phone) return { ok: false, error: "invalid_phone" };

  const body = {
    messaging_product: "whatsapp",
    to: phone,
    type: "template",
    template: {
      name: template,
      language: { code: languageCode || defaultLang },
      ...(params.length
        ? {
            components: [
              {
                type: "body",
                parameters: params.map((text) => ({ type: "text", text })),
              },
            ],
          }
        : {}),
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${GRAPH_BASE}/${version}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(
        `[whatsapp] send failed (${res.status}) to ${phone} template "${template}": ${text}`
      );
      return { ok: false, error: `http_${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(
      `[whatsapp] send error to ${phone} template "${template}": ${msg}`
    );
    return { ok: false, error: msg };
  } finally {
    clearTimeout(timeout);
  }
}

/** Free-form text — only works within the 24-hour customer service window. */
export async function sendText(to: string, body: string): Promise<SendResult> {
  const { phoneNumberId, accessToken, version } = getConfig();

  if (!phoneNumberId || !accessToken) {
    if (!warnedMissingConfig) {
      console.warn(
        "[whatsapp] not configured (WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN missing); skipping sends."
      );
      warnedMissingConfig = true;
    }
    return { ok: false, error: "not_configured" };
  }

  const phone = normalizePhone(to);
  if (!phone) return { ok: false, error: "invalid_phone" };

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phone,
    type: "text",
    text: { body },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${GRAPH_BASE}/${version}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[whatsapp] text failed (${res.status}) to ${phone}: ${text}`);
      return { ok: false, error: `http_${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[whatsapp] text error to ${phone}: ${msg}`);
    return { ok: false, error: msg };
  } finally {
    clearTimeout(timeout);
  }
}
