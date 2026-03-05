# Public Launch Runbook

## 1) Local/Production env setup
1. Copy `.env.example` to your environment manager and fill values.
2. Run local validation:
   - `npm run env:check`
3. Required keys must pass before deploy.

## 2) Required external actions
1. Set `STRIPE_WEBHOOK_SECRET` from Stripe Dashboard:
   - Stripe -> Developers -> Webhooks -> your endpoint -> Reveal signing secret.
2. Apply database migration in Supabase SQL Editor:
   - `supabase/migrations/2026022501_planner_quality_v2.sql`
3. Add production env vars in hosting provider (Vercel/Render/etc).

## 3) Security defaults now enforced
1. Admin server checks use `ADMIN_EMAIL` (fallback to `NEXT_PUBLIC_ADMIN_EMAIL`).
2. Instagram global fallback tokens are disabled in production unless:
   - `INSTAGRAM_GLOBAL_FALLBACK_ENABLED=1`
3. Plaintext social tokens are disabled in production unless:
   - `ALLOW_PLAINTEXT_SOCIAL_TOKENS=1`
4. Per-user social tokens can be stored encrypted with:
   - `SOCIAL_TOKEN_ENCRYPTION_KEY` (32-byte base64 or 64-char hex)

## 4) Connect Instagram per user (manual API)
1. Auth as the user in the app.
2. Call:
   - `POST /api/instagram/connection`
   - Body:
     - `accessToken`
     - `businessAccountId`
     - optional `tokenExpiresAt`
3. Check status:
   - `GET /api/instagram/connection`

## 5) Benchmark data ingest
1. Auth as admin user.
2. Call:
   - `POST /api/admin/benchmark/ingest`
   - Body with `items[]`.

## 6) Planner smoke test
1. Generate a plan in `/dashboard/instagram/planner` with `pro` mode.
2. Confirm redirect includes `month` and `planId`.
3. Confirm calendar quality banner appears.

## 7) Runtime safety checks
1. Admin env check endpoint:
   - `GET /api/admin/env-check`
2. Expect:
   - `ready: true`
   - empty `missingRequired`

