# Security & production checklist

Pearl Salon security controls and manual steps for production deployment.

## Application security (implemented in code)

| Control | Location |
|---------|----------|
| Clerk auth on `/staff`, `/admin` | [`src/proxy.ts`](src/proxy.ts), layouts |
| Role from `publicMetadata.role` (lowercase) | [`src/lib/auth.ts`](src/lib/auth.ts) |
| Deactivated staff blocked (`isActive`) | [`src/lib/auth.ts`](src/lib/auth.ts) |
| Staff role/active toggles sync to Clerk | [`src/lib/actions/settings.ts`](src/lib/actions/settings.ts) |
| WhatsApp webhook HMAC (fail-closed in prod) | [`src/lib/whatsapp/webhook.ts`](src/lib/whatsapp/webhook.ts) |
| Clerk webhook Svix verification (raw body) | [`src/app/api/webhooks/clerk/route.ts`](src/app/api/webhooks/clerk/route.ts) |
| Security headers + CSP | [`next.config.ts`](next.config.ts) |
| Server-side booking slot validation | [`src/lib/actions/appointments.ts`](src/lib/actions/appointments.ts) |
| Rate limits (with Upstash Redis) | [`src/lib/rate-limit.ts`](src/lib/rate-limit.ts) |
| Cryptographic queue tokens | [`src/lib/actions/queue.ts`](src/lib/actions/queue.ts) |
| Upload validation (magic bytes, 10 MB cap) | [`src/lib/uploads/logbook.ts`](src/lib/uploads/logbook.ts) |
| Parameterized DB queries (Drizzle) | [`src/db/`](src/db/) |

## Required environment variables (Vercel Production)

```bash
# Database
DATABASE_URL=postgresql://...?sslmode=require

# Clerk (live keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://www.trypearlbeauty.com

# WhatsApp (required for webhooks)
WHATSAPP_APP_SECRET=...
WHATSAPP_WEBHOOK_VERIFY_TOKEN=...

# Rate limiting (recommended — Upstash free tier)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Email, OpenAI, etc.
RESEND_API_KEY=...
OPENAI_API_KEY=...
```

Without `UPSTASH_REDIS_*`, rate limits are **disabled** (a warning is logged in production). Without `WHATSAPP_APP_SECRET`, WhatsApp POST webhooks are **rejected** in production.

## Manual dashboard steps

### Clerk
- [ ] Production instance with `pk_live_` / `sk_live_` keys
- [ ] DNS verified (`clerk`, `accounts`, DKIM, `clkmail` CNAMEs)
- [ ] **Disable public sign-up** — invitations only
- [ ] Paths: sign-in on application domain `/sign-in`
- [ ] Session token includes `metadata.role` from `publicMetadata.role`
- [ ] Each staff user: `publicMetadata.role` = `"admin"` or `"staff"` (lowercase)
- [ ] Webhook: `https://www.trypearlbeauty.com/api/webhooks/clerk`

### Cloudflare / DNS
- [ ] DMARC TXT on `_dmarc.trypearlbeauty.com`: `v=DMARC1; p=none; rua=mailto:you@example.com`
- [ ] Clerk CNAME records: **DNS only** (grey cloud)

### Neon
- [ ] Connection string uses `sslmode=require`
- [ ] Rotate credentials if ever exposed

### Vercel
- [ ] All production env vars set
- [ ] Optional: Upstash Redis for rate limits

## Rate limit defaults

| Endpoint | Limit |
|----------|-------|
| Booking (`createAppointment`) | 5 per 15 min / IP |
| Queue join | 5 per 15 min / IP |
| Queue status API | 30 per min / IP |
| Logbook AI scan | 10 per hour / staff user |

## Incident response

1. **Rotate** exposed secrets immediately (Clerk, WhatsApp, Resend, Neon, Blob, Upstash).
2. **Revoke** compromised staff sessions in Clerk Dashboard → Users → Revoke sessions.
3. **Review** Vercel logs and Clerk webhook delivery logs.
4. **Disable** staff via Admin → Staff (sets Clerk role to null + `isActive=false`).

## Reporting issues

Security concerns for this deployment should be reported to the salon owner directly.
