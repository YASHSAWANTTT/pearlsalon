# Clerk production setup (trypearlbeauty.com)

Staff and admin sign-in uses Clerk. Production is a **separate Clerk instance** from development — you must swap API keys and complete DNS in the Dashboard.

## 1. Create production instance

1. Open [Clerk Dashboard](https://dashboard.clerk.com).
2. Top bar: **Development** → **Create production instance**.
3. Clone dev settings (recommended) or start fresh.
4. Complete the homepage checklist until **Deploy certificates** appears.

> SSO connections, integrations, and paths **do not** copy from dev — reconfigure those.

## 2. Domain & DNS (Cloudflare)

1. Clerk Dashboard → **Domains** → set root domain to `trypearlbeauty.com`.
2. Add the DNS records Clerk shows (typically CNAMEs for Frontend API and accounts).
3. On Cloudflare: set Clerk CNAME records to **DNS only** (grey cloud), not proxied — otherwise Clerk’s DNS check fails.
4. Propagation can take up to 48 hours; then click **Deploy certificates**.

Allowed origins for sign-in (also add in Clerk if prompted):

- `https://www.trypearlbeauty.com`
- `https://trypearlbeauty.com`

## 3. Vercel environment variables

Replace **test** keys with **live** keys on Vercel (Production environment):

| Variable | Production value |
|----------|------------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` |
| `CLERK_SECRET_KEY` | `sk_live_...` |
| `CLERK_WEBHOOK_SECRET` | New secret from production webhook (step 4) |
| `NEXT_PUBLIC_APP_URL` | `https://www.trypearlbeauty.com` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-in` |

Redeploy after changing env vars.

**Pull keys locally (optional):**

```bash
npx clerk@latest env pull --instance prod
```

## 4. Production webhook

1. Clerk Dashboard (production) → **Webhooks** → Add endpoint.
2. URL: `https://www.trypearlbeauty.com/api/webhooks/clerk`
3. Events: `user.created`, `user.updated`, `user.deleted`
4. Copy signing secret → `CLERK_WEBHOOK_SECRET` on Vercel.

## 5. Session token (optional, for faster proxy checks)

Clerk Dashboard → **Sessions** → **Customize session token** (optional):

```json
{
  "metadata": {
    "role": "{{user.public_metadata.role}}"
  }
}
```

Role checks use `publicMetadata.role` in app layouts — this token customization is optional.

Set each staff user’s **public metadata** → `role`: `"admin"` or `"staff"` (lowercase key and value).

## 6. Social sign-in (if used)

Dev uses Clerk’s shared OAuth credentials. In production you must add your own for each provider (Google, etc.) under **User & authentication** → **Social connections**.

## 7. Code already configured

- `src/proxy.ts` — `authorizedParties` allowlist for `trypearlbeauty.com` (+ localhost in dev).
- `src/app/api/webhooks/clerk/route.ts` — syncs staff profiles on user events.
- Sign-up is disabled; staff use `/sign-in` only.

## 8. Verify

1. Visit `https://www.trypearlbeauty.com/sign-in` and sign in as admin.
2. Open `/admin` and `/staff` — should load without redirect loops.
3. Clerk Dashboard → **Webhooks** — recent deliveries should be `200`.
4. Create or update a user — `staff_profiles` row should sync.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| DNS check fails on Cloudflare | Set Clerk CNAMEs to **DNS only** |
| Certificate stuck | Run `dig trypearlbeauty.com +short CAA` — remove CAA records blocking LetsEncrypt / Google Trust |
| `unauthorized` after sign-in | User missing `publicMetadata.role` |
| Webhook 400/500 | Wrong `CLERK_WEBHOOK_SECRET` (prod vs dev) |
| Still using test keys | Keys must start with `pk_live_` / `sk_live_` on Vercel |
