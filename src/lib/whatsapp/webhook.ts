import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

/** Meta WhatsApp webhook GET verification query params. */
export type WhatsAppVerifyQuery = {
  "hub.mode"?: string;
  "hub.verify_token"?: string;
  "hub.challenge"?: string;
};

export function parseVerifyQuery(
  searchParams: URLSearchParams
): WhatsAppVerifyQuery {
  return {
    "hub.mode": searchParams.get("hub.mode") ?? undefined,
    "hub.verify_token": searchParams.get("hub.verify_token") ?? undefined,
    "hub.challenge": searchParams.get("hub.challenge") ?? undefined,
  };
}

export function verifyWebhookSubscription(query: WhatsAppVerifyQuery): string | null {
  const mode = query["hub.mode"];
  const token = query["hub.verify_token"];
  const challenge = query["hub.challenge"];
  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (!expected) return null;
  if (mode !== "subscribe" || !token || !challenge) return null;
  if (token !== expected) return null;

  return challenge;
}

export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  if (!signatureHeader?.startsWith("sha256=")) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = signatureHeader.slice("sha256=".length);

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
  } catch {
    return false;
  }
}

/** Log inbound messages / status updates (extend later for 24h window tracking). */
export function handleWhatsAppWebhookPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") return;

  const body = payload as {
    object?: string;
    entry?: Array<{
      id?: string;
      changes?: Array<{
        field?: string;
        value?: {
          messaging_product?: string;
          metadata?: { phone_number_id?: string };
          contacts?: Array<{ wa_id?: string; profile?: { name?: string } }>;
          messages?: Array<{
            from?: string;
            id?: string;
            timestamp?: string;
            type?: string;
            text?: { body?: string };
          }>;
          statuses?: Array<{
            id?: string;
            status?: string;
            timestamp?: string;
            recipient_id?: string;
          }>;
        };
      }>;
    }>;
  };

  if (body.object !== "whatsapp_business_account") return;

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value) continue;

      for (const message of value.messages ?? []) {
        if (process.env.NODE_ENV !== "production") {
          console.info("[whatsapp webhook] inbound message", {
            from: message.from,
            type: message.type,
            id: message.id,
          });
        }
      }

      for (const status of value.statuses ?? []) {
        console.info("[whatsapp webhook] status update", {
          id: status.id,
          status: status.status,
          recipient: status.recipient_id,
        });
      }
    }
  }
}
