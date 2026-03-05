# Key Setup Guide

## Supabase
1. Open Supabase project -> `Project Settings` -> `API`.
2. Copy:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` -> `SUPABASE_SERVICE_ROLE_KEY`

## Anthropic
1. Open Anthropic Console -> `API Keys`.
2. Create key.
3. Set `ANTHROPIC_API_KEY`.

## Stripe
1. Open Stripe Dashboard -> `Developers` -> `API keys`.
2. Copy secret key -> `STRIPE_SECRET_KEY`.
3. Create/verify products and prices:
   - Pro monthly -> `STRIPE_PRICE_PRO_MONTHLY`
   - Business monthly -> `STRIPE_PRICE_BUSINESS_MONTHLY`
   - Token pack 25 -> `STRIPE_PRICE_TOKENS_25`
   - Token pack 100 -> `STRIPE_PRICE_TOKENS_100`
   - Token pack 250 -> `STRIPE_PRICE_TOKENS_250`
4. Open `Developers` -> `Webhooks` -> endpoint for `/api/stripe/webhook`.
5. Reveal signing secret -> `STRIPE_WEBHOOK_SECRET`.

## Instagram (Per-user connection)
Use `POST /api/instagram/connection` with:
- `accessToken`
- `businessAccountId`
- optional `tokenExpiresAt`

Fallback env keys are dev-only:
- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`
- `INSTAGRAM_CONNECTION_JSON`

## Security keys
1. Generate token encryption key:
   - `openssl rand -base64 32`
2. Set `SOCIAL_TOKEN_ENCRYPTION_KEY`.

Recommended flags:
- `INSTAGRAM_GLOBAL_FALLBACK_ENABLED=0`
- `ALLOW_PLAINTEXT_SOCIAL_TOKENS=0`

## Optional integrations
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `N8N_BOOKING_WEBHOOK_URL`
- `REPLICATE_API_TOKEN`
- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `MASTER_INTAKE_SHEET_ID`
- `APIFY_API_TOKEN` (required for YouTube outlier scans)

## Local Skills Bridge (Reels + YouTube Engine)
Enable this only on local/dev machines where the skills workspace exists.

Set:
- `ENABLE_LOCAL_SKILLS_BRIDGE=1`
- `LOCAL_SKILLS_WORKSPACE_ROOT=/Users/jp/VS Code Workspace`
- `LOCAL_SKILLS_WEBSITE_ROOT=/Users/jp/jpautomations-website`
- `LOCAL_SKILLS_PYTHON_BIN=python3`

Optional:
- `LOCAL_SKILLS_ALLOWED_ROOTS` (comma-separated absolute paths)

The bridge runs local scripts:
- `execution/edit_reel.py`
- `.claude/skills/youtube-outliers/scripts/scrape_youtube_outliers.py`
- `.claude/skills/title-variants/scripts/generate_title_variants.py`

## Verification
1. Run:
   - `npm run env:check`
2. Admin runtime check:
   - `GET /api/admin/env-check`
