# WhatsApp Notifications (Meta Cloud API)

Pearl Beauty & Spa sends booking and queue alerts via the **WhatsApp Cloud API**
(Meta). This is the **active** notification channel.

## How sending works

The app uses a **smart two-step** approach:

1. **Free-form text** — normal friendly messages (no template approval needed)
   when the customer has an open **24-hour customer service window** (they messaged
   you on WhatsApp recently, or you opened the window with a template).

2. **Approved template fallback** — if free text fails (first contact / window
   closed), the app automatically sends the matching pre-approved template.

Message copy for free-form text lives in `src/lib/whatsapp/messages.ts`.
Template names and variables are in `src/lib/whatsapp/templates.ts`.

## 1. Environment variables

Add to `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `WHATSAPP_PHONE_NUMBER_ID` | Yes | Phone Number ID from WhatsApp > API Setup |
| `WHATSAPP_ACCESS_TOKEN` | Yes | System User permanent token (see below) |
| `WHATSAPP_API_VERSION` | No | Graph API version (e.g. `v23.0`), defaults to `v21.0` |
| `WHATSAPP_BUSINESS_OWNER_PHONE` | No | Owner number for business alerts (e.g. `+919987881614`) |
| `WHATSAPP_DEFAULT_COUNTRY_CODE` | No | Prepended to 10-digit numbers, default `91` |
| `WHATSAPP_TEMPLATE_LANG` | No | Template language, default `en_US` |

Restart the dev server after changing env vars.

## 2. Meta setup (quick start)

Follow [Meta's WhatsApp Cloud API Get Started guide](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started):

1. **Create a Meta app** with the “Connect with customers through WhatsApp” use case.
2. **API Setup** — connect a WhatsApp Business Account, note your **Phone Number ID**
   and **WhatsApp Business Account ID**.
3. **Send a test message** — use the dashboard to send `hello_world` to your phone.
   **Reply to it** — this opens the 24-hour window so free-form text works for testing.
4. **Create a System User** (Business Settings → System users):
   - Assign your app (Manage app) and WhatsApp account (Manage WhatsApp Business Accounts)
   - Generate a token with permissions:
     - `business_management`
     - `whatsapp_business_messaging`
     - `whatsapp_business_management`
   - Save as `WHATSAPP_ACCESS_TOKEN` (temporary tokens expire in ~24h)

5. **Add test recipients** — during development, add phone numbers in API Setup
   before your business number is fully verified.

6. **Production** — add your real business number (Step 5 in API Setup) and a
   payment method for volume beyond the free tier.

## 3. Create message templates (fallback)

Templates are required for **first contact** when the customer hasn't messaged you.
Create each in **WhatsApp Manager → Message Templates**. Category: **Utility**.
Type of variable: **Number** (`{{1}}`, `{{2}}`, …).

### Meta template rules

- **Never start or end** the message with a variable — static text required at both ends
- Keep **2–3 variables** per short message

### Client appointment templates

**`appointment_scheduling`** (booking submitted):
```
Hi {{1}}, we've received your booking for {{2}} on {{3}}. We'll confirm it shortly. Thank you! - Pearl Beauty & Spa
```
Samples: Priya | Gold Facial | Monday, June 16, 2026 at 11:00 AM

**`appointment_confirmed`:**
```
Hi {{1}}, your appointment for {{2}} on {{3}} is confirmed. We can't wait to see you! - Pearl Beauty & Spa
```

**`appointment_cancelled`:**
```
Hi {{1}}, your appointment for {{2}} on {{3}} has been cancelled. Message us anytime to rebook. - Pearl Beauty & Spa
```

### Queue + business templates

| Template | Body |
|----------|------|
| `queue_joined` | `Hi {{1}}! You're in the walk-in queue for {{2}}. Your number is {{3}}. We'll message you when it's your turn!` |
| `queue_called` | `Hi {{1}}, it's your turn! Please come to the front desk for your {{2}}. See you in a moment!` |
| `business_appointment_new` | `New booking. Customer: {{1}} ({{2}}). Service: {{3}}. When: {{4}}. Status: awaiting confirmation.` |
| `business_appointment_update` | `Appointment {{1}}. Customer: {{2}}. Service: {{3}}. When: {{4}}.` |
| `business_queue_new` | `New walk-in. Customer: {{1}} ({{2}}). Service: {{3}}. Position: {{4}}.` |
| `business_queue_update` | `Queue {{1}}. Customer: {{2}}. Service: {{3}}.` |

## 4. Who gets notified

| Event | Client | Business |
|-------|--------|----------|
| Appointment submitted | ✓ | ✓ |
| Appointment confirmed | ✓ | ✓ |
| Appointment cancelled | ✓ | ✓ |
| Walk-in joins queue | ✓ | ✓ |
| Walk-in called | ✓ | ✓ |
| Walk-in left | — | ✓ |

Business recipients = `WHATSAPP_BUSINESS_OWNER_PHONE` + active staff phones in **Admin → Staff**.

## 5. Testing tips

1. Message your business WhatsApp number from your personal phone first.
2. Book an appointment on the site — you should receive a **free-form** friendly text.
3. For a brand-new number that never messaged you, the app falls back to the **template**.
4. Check server logs for `[whatsapp] text failed` / `send failed` if nothing arrives.

## 6. Optional: Twilio SMS

Twilio code remains in `src/lib/twilio/` as an alternative. To switch back, change
`src/lib/notifications/notify.ts` to re-export from `@/lib/twilio/notify`.
