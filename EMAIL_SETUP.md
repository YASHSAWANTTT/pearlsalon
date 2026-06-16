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

## No domain yet? (testing with API key only)

Resend lets you send **without verifying a domain** using their sandbox sender `onboarding@resend.dev`. The catch: emails can **only go to the address you used to sign up for Resend** — not arbitrary customer inboxes.

Add to `.env.local` (and Vercel when you deploy):

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Pearl <onboarding@resend.dev>
RESEND_BUSINESS_EMAIL=you@gmail.com
```

Replace `you@gmail.com` with the **exact email on your Resend account**.

**How to test:**

1. Book an appointment using **that same email** in the form’s email field.
2. You should get the customer confirmation email and the business alert.
3. Confirm or cancel the appointment in admin — those emails land in the same inbox.

If you book with a different email, Resend returns a 403 and you’ll see `[email] send failed (403)` in the logs. That’s expected until you verify a domain.

The app defaults `RESEND_FROM_EMAIL` to `onboarding@resend.dev` when unset, so you only **need** `RESEND_API_KEY` and `RESEND_BUSINESS_EMAIL` for sandbox testing.

## Production setup (custom domain)

When you have a domain (e.g. `pearlsalon.in`):

1. Add it under [resend.com/domains](https://resend.com/domains) and add the DNS records Resend gives you.
2. After verification, switch env vars:

```bash
RESEND_FROM_EMAIL=Pearl <hello@yourdomain.com>
RESEND_BUSINESS_EMAIL=owner@yourdomain.com
```

Then customer emails work for **any** address they enter on the booking form.

## Setup

1. Create a free account at [resend.com](https://resend.com).
2. Create an API key under **API Keys**.
3. **With a domain:** add and verify it under **Domains** (see [Production setup](#production-setup-custom-domain) above).
4. Add env vars locally and on Vercel:

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Pearl <hello@yourdomain.com>
RESEND_BUSINESS_EMAIL=owner@yourdomain.com
```

- `RESEND_FROM_EMAIL` must use a verified domain (or use `onboarding@resend.dev` for testing to your own inbox only).
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
