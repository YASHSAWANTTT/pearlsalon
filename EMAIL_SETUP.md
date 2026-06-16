# Email notifications (Resend)

Pearl sends email alongside WhatsApp for the same booking and queue events. Email uses Resend’s HTTP API (no extra npm package).

## What gets emailed

| Event | Customer | Business |
|-------|----------|----------|
| New appointment | If they entered an email on the booking form | Owner + active staff |
| Appointment confirmed / cancelled | If email on file | Owner + active staff |
| Walk-in joins queue | — | Owner + active staff |
| Queue called / left | — | Owner + active staff |

Customer emails are skipped when no email was provided. Business emails are skipped when no recipients are configured.

## Production (trypearlbeauty.com — verified)

`trypearlbeauty.com` is verified in Resend. Set these on **Vercel** (and in `.env.local` for local dev):

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Pearl <hello@trypearlbeauty.com>
RESEND_BUSINESS_EMAIL=your-inbox@example.com
```

- `RESEND_FROM_EMAIL` can be any address `@trypearlbeauty.com` (you don’t need a real mailbox for the sender).
- `RESEND_BUSINESS_EMAIL` is where owner alerts go — use whatever inbox you actually check (personal email is fine).
- Customer emails work for **any** address entered on the booking form.

If `RESEND_FROM_EMAIL` is unset, the app defaults to `Pearl <hello@trypearlbeauty.com>`.

## Sandbox only (no verified domain)

Resend’s `onboarding@resend.dev` sender only delivers to the email on your Resend account. Use that for early testing, not production.

## Setup

1. Create a free account at [resend.com](https://resend.com).
2. Create an API key under **API Keys**.
3. **With a domain:** add and verify it under **Domains** (see [Production setup](#production-setup-custom-domain) above).
4. Add env vars locally and on Vercel:

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Pearl <hello@trypearlbeauty.com>
RESEND_BUSINESS_EMAIL=your-inbox@example.com
```

- `RESEND_FROM_EMAIL` must use a verified domain (`trypearlbeauty.com`).
- `RESEND_BUSINESS_EMAIL` is the salon owner inbox; active staff Clerk emails are included automatically.

## Testing locally

1. Set `RESEND_API_KEY` in `.env.local`.
2. Book an appointment with your email on the form.
3. Check Resend dashboard → **Emails** for delivery logs.

If `RESEND_API_KEY` is missing, email sends are skipped with a one-time console warning — bookings still succeed.

## Notes

- Email does not require Meta template approval (unlike WhatsApp first-contact).
- Queue walk-ins have no email field today, so only business alerts fire for queue events.
- WhatsApp and email run in parallel; either channel failing does not block the other or the booking action.
