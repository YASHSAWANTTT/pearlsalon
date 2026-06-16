import {
  handleWhatsAppWebhookPayload,
  parseVerifyQuery,
  verifyWebhookSignature,
  verifyWebhookSubscription,
} from "@/lib/whatsapp/webhook";

export const runtime = "nodejs";

/**
 * Meta WhatsApp webhook — configure in Meta App Dashboard:
 * Callback URL: https://pearlsalon.vercel.app/api/webhooks/whatsapp
 * Verify token: must match WHATSAPP_WEBHOOK_VERIFY_TOKEN
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const challenge = verifyWebhookSubscription(parseVerifyQuery(searchParams));

  if (!challenge) {
    return new Response("Forbidden", { status: 403 });
  }

  return new Response(challenge, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return new Response("Invalid signature", { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody) as unknown;
    handleWhatsAppWebhookPayload(payload);
  } catch (err) {
    console.error("[whatsapp webhook] failed to parse payload", err);
  }

  // Meta requires a fast 200 even if processing fails later.
  return new Response("OK", { status: 200 });
}
