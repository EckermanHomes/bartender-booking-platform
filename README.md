# Bartender Booking Platform (Option C MVP)

Managed marketplace MVP built with Next.js App Router, Supabase Postgres, and Stripe Checkout.

## What it includes
- Marketing homepage with Packages / FAQ / Service Area sections.
- Host request flow (`/request` -> `/request/received?rid=...`).
- Password-protected admin area (`/admin`) to review requests, add bartenders, assign bookings.
- Deposit checkout creation + Stripe webhook confirmation.
- Tip page with generated QR code and Stripe tip checkout flow.

## Environment variables
Copy `.env.example` to `.env.local` and fill values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_BASE_URL` (e.g. `http://localhost:3000`)
- `ADMIN_PASSWORD`
- `DEPOSIT_MODE` (`flat` or `percent`)
- `DEPOSIT_AMOUNT` (used when `flat`)
- `DEPOSIT_PERCENT` (used when `percent`)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run SQL migration in Supabase SQL editor:
   - `db/migrations/001_init.sql`
3. Start app:
   ```bash
   npm run dev
   ```

## Stripe test mode
1. Create test API keys in Stripe dashboard.
2. Start webhook forwarding locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
3. Put the printed webhook secret in `STRIPE_WEBHOOK_SECRET`.
4. In admin booking page, create deposit checkout and pay with test card `4242 4242 4242 4242`.
5. For tips, open `/tip/{bookingId}` and use QR or button to open checkout.

## Seed data (minimal)
- Login to `/admin` with `ADMIN_PASSWORD`.
- Add one verified bartender from `/admin/bartenders`.
- Submit a host request from `/request`.
- Assign bartender from request detail page.

## Security / RLS approach
- Public users can only insert booking requests (policy in migration).
- Reads/writes for admin workflows use server-side routes with Supabase service role key.
- This keeps MVP auth lightweight while preventing public record reads.

## Known limitations / next steps
- Admin auth is password-only cookie gate, no per-user accounts.
- Tip checkout currently uses fixed starter amount ($20); add adjustable amount UX.
- No automated host email notifications yet.
- No bartender availability/conflict management.
