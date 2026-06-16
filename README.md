# Pearl

A full-featured salon management system built with Next.js, Neon Postgres, Clerk, and Drizzle ORM.

## Features

- **Public landing page** with services preview, hours, and testimonials
- **Guest booking** — no account required (name + phone)
- **Walk-in queue** — same-day queue with live status tracking
- **Staff portal** — appointments, queue board, daily logbook
- **Admin portal** — services CRUD, staff management, settings, logbook export

## Tech Stack

- Next.js 16 (App Router)
- Neon Postgres + Drizzle ORM
- Clerk (staff/admin auth)
- Tailwind CSS + shadcn/ui

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
SALON_TIMEZONE=America/New_York
```

### 3. Database setup

```bash
npm run db:push
npm run db:seed
```

### 4. Clerk setup

See **[CLERK_SETUP.md](./CLERK_SETUP.md)** for production deployment on `trypearlbeauty.com`.

Quick dev setup:

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Add your keys to `.env.local`
3. Customize the session token in Clerk Dashboard → Sessions → Customize session token:

```json
{
  "metadata": {
    "role": "{{user.public_metadata.role}}"
  }
}
```

4. Set `publicMetadata.role` to `"admin"` or `"staff"` for each user
5. (Optional) Add webhook endpoint: `https://your-domain/api/webhooks/clerk` for staff sync

### 5. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/services` | Services menu |
| `/book` | Book appointment |
| `/queue` | Join walk-in queue |
| `/queue/status/[token]` | Queue status |
| `/sign-in` | Staff/admin login |
| `/staff` | Staff dashboard |
| `/admin` | Admin dashboard |

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run db:push` — Push schema to Neon
- `npm run db:seed` — Seed services and business hours
