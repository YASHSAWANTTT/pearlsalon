# Twilio SMS Notifications

Pearl Beauty & Spa sends booking and queue alerts via **Twilio SMS** — normal
free-form text, no Meta template approval needed.

WhatsApp (Meta Cloud API) code remains in `src/lib/whatsapp/` for later but is
**not used** while Twilio is configured.

## 1. Environment variables

Add to `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Yes | From [Twilio Console](https://console.twilio.com) |
| `TWILIO_AUTH_TOKEN` | Yes | From Twilio Console |
| `TWILIO_PHONE_NUMBER` | Yes | Your Twilio **From** number in E.164 (e.g. `+14155551234`) |
| `TWILIO_BUSINESS_OWNER_PHONE` | No | Owner SMS for staff alerts (default: salon phone `+919987881614`) |
| `TWILIO_DEFAULT_COUNTRY_CODE` | No | Prepended to 10-digit numbers, default `91` |

Restart the dev server after changing env vars.

## 2. Twilio setup

1. Sign up at [twilio.com](https://www.twilio.com).
2. Buy or use a trial phone number with **SMS** capability.
3. Copy **Account SID**, **Auth Token**, and your **Twilio phone number** into `.env.local`.

### Trial account

On a trial account, you can only SMS **verified** recipient numbers. Add your
phone and staff numbers under Twilio Console → Phone Numbers → Verified Caller IDs.

### Sending to India

For production SMS to Indian mobile numbers you may need:

- An SMS-capable number or sender approved for India
- **DLT registration** (India telecom rules) for transactional SMS at scale

Check Twilio’s [India SMS guidelines](https://www.twilio.com/docs/glossary/what-is-dlt-registration-india)
before going live. Trial/testing to verified numbers usually works without DLT.

## 3. Who gets notified

| Event | Client SMS | Business SMS |
|-------|------------|--------------|
| Appointment submitted | Warm confirmation | New booking alert |
| Appointment confirmed | Confirmed message | Status update |
| Appointment cancelled | Cancellation + rebook | Status update |
| Walk-in joins queue | Queue position | New walk-in alert |
| Walk-in called | “Your turn!” | Queue update |
| Walk-in left | — | Queue update |

Business recipients = `TWILIO_BUSINESS_OWNER_PHONE` + any **active staff** with
a phone saved in **Admin → Staff**.

## 4. Example messages

**Client (booking submitted):**
> Hi Priya! We've received your booking for Gold Facial on Monday, June 16, 2026 at 11:00 AM. We'll confirm it shortly. See you at Pearl Beauty & Spa Salon!

**Business:**
> New booking: Priya (+919876543210) — Gold Facial on Monday, June 16, 2026 at 11:00 AM. Awaiting confirmation.

Message copy lives in `src/lib/twilio/messages.ts` — edit freely, no approval step.

## 5. Switching back to WhatsApp later

1. Complete Meta template setup (`WHATSAPP_SETUP.md`).
2. Change imports in `src/lib/notifications/notify.ts` to re-export from
   `@/lib/whatsapp/notify` instead of `@/lib/twilio/notify`.

Both channels can coexist; only one is wired as the active export at a time.
