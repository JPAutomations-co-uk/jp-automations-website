# Email Sequences — Setup Guide

## Architecture

Every opt-in on the site now does three things:
1. **Resend** — sends the delivery email + scheduled nurture emails via `scheduledAt`
2. **Loops** — creates a contact with a `source` tag for segmentation
3. **Google Sheet** — logs the lead with source for tracking

The nurture emails are baked into each API route using Resend's `scheduledAt`. They fire automatically on schedule once someone opts in. No manual work.

Loops is the segmentation layer — it gives you a single place to see all contacts grouped by source, and lets you add behavior-based sequences later (e.g., stop emailing if they book a call).

---

## Segments (Loops contact sources)

| Source Tag | Opt-in Point | Sequence |
|---|---|---|
| `newsletter-popup` | Website popup | 3-email welcome (day 0, 3, 6) |
| `newsletter-x` | Pinned X post | Same 3-email welcome |
| `blueprint` | /free-blueprint | Delivery + 3 nurture (day 0, 2, 5, 9) |
| `client-folder` | /free-client-folder | Delivery + 3 nurture |
| `onboarding-system` | /free-onboarding | Delivery + 3 nurture |
| `prompt-guide` | /free-prompt-guide | Delivery + 3 nurture |
| `whiteboard-prompt` | /free-prompt | Delivery + 3 nurture |
| `openclaw-guide` | /free-openclaw | Delivery + 3 nurture |
| `contact-form` | Contact form | Auto-reply + follow-up (day 0, 3) |
| `apply-form` | /apply form | Existing 4-email booking sequence |

---

## Loops Setup Steps

### 1. Create account
Go to loops.so and sign up (free up to 1,000 contacts).

### 2. Get API key
Settings → API → Create key. Add it to your `.env`:
```
LOOPS_API_KEY=your_key_here
```

### 3. Create contact properties
In Loops dashboard → Contacts → Properties, create:
- `source` (string) — already sent by the code
- `businessName` (string) — sent by apply form
- `bottleneck` (string) — sent by apply form

### 4. Optional: Create sequences in Loops
The nurture emails currently run via Resend `scheduledAt` (already working). If you want to move them to Loops for more control (e.g., stop sequence when someone books a call), create sequences in Loops triggered by `source` property and remove the `scheduledAt` emails from the API routes.

---

## API Routes Modified

| Route | Source | What Changed |
|---|---|---|
| `/api/subscribe` (NEW) | Newsletter popup + X | Created — 3-email welcome sequence |
| `/api/lead-magnet` | Blueprint | Added Loops + 3 nurture emails + plain text |
| `/api/lead-client-folder` | Client Folder | Added Loops + 3 nurture emails + plain text |
| `/api/lead-onboarding` | Onboarding System | Added Loops + 3 nurture emails + plain text |
| `/api/lead-prompt-guide` | Prompt Guide | Added Loops + 3 nurture emails + plain text |
| `/api/lead-prompt` | Whiteboard Prompt | Added Loops + 3 nurture emails + plain text |
| `/api/lead-openclaw` | OpenClaw Guide | Added Loops + 3 nurture emails + plain text |
| `/api/contact` | Contact form | Added Loops + auto-reply + follow-up |
| `/api/submit-booking` | Apply form | Added Loops (existing sequence untouched) |

---

## Frontend Integration — Newsletter Popup

The new `/api/subscribe` route expects:
```json
{
  "name": "First name",
  "email": "email@example.com",
  "source": "popup" | "x"
}
```

Wire your popup form and X landing page to POST to `/api/subscribe`. Pass `source: "x"` from the X landing page and `source: "popup"` (or omit) from the website popup.

---

## Deliverability Notes

All nurture/welcome emails are:
- **Plain text** (`text` field, not `html`) — looks like a real person sent it
- **Under 150 words** — short emails get read
- **One link max** — always in the P.S.
- **Lowercase subjects** — "the onboarding test" not "The Onboarding Test"
- **Sent from "JP"** not "JP Automations" — personal sender name

Delivery emails (the lead magnet itself) are also plain text now for consistency.

---

## Email Copy Reference

### Newsletter Welcome Sequence

**Email 1 (Day 0)** — Subject: `the most expensive process in your business`
- Opens with: how to find your most expensive bottleneck in 10 minutes
- Actionable: trace bank statement → find human dependencies
- P.S.: links to /free-blueprint

**Email 2 (Day 3)** — Subject: `the onboarding test`
- Opens with: time yourself onboarding a client
- Actionable: 4-step 10-minute onboarding system
- P.S.: links to /free-onboarding

**Email 3 (Day 6)** — Subject: `the proposal shortcut`
- Opens with: 30-60 min on proposals → 5 min with one brief
- Actionable: the 8 fields that matter
- P.S.: links to /free-client-folder

### Lead Magnet Nurture Sequence (shared across all 6 magnets)

**Email 1 (Day 2)** — Subject: `one thing to try from it`
- Opens with: pick one section, implement today
- Invites reply (best deliverability signal)
- P.S.: cross-sells a related lead magnet (varies per source)

**Email 2 (Day 5)** — Subject: `where most businesses actually leak money`
- Opens with: the 20-minute tasks nobody's tracking
- Actionable: math breakdown of hidden time costs
- P.S.: links to follow-up automation blog post

**Email 3 (Day 9)** — Subject: `the gap`
- Opens with: gap between knowing and doing
- Soft CTA: diagnostic call
- P.S.: cross-sells another lead magnet

### Contact Form Sequence

**Email 1 (Day 0)** — Subject: `got your message`
- 20-word auto-reply
- P.S.: links to /blog

**Email 2 (Day 3)** — Subject: `following up`
- Check if reply got buried
- P.S.: links to /book-call

### Apply Form Sequence (unchanged)
Already had 4 emails with bottleneck-personalised copy. Only added Loops contact creation.
