import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { logToSheet } from '@/app/lib/log-to-sheet'
import { addToLoops } from '@/app/lib/loops'
import { tryEnrollSequence } from '@/app/lib/email-suppression'

const resend = new Resend(process.env.RESEND_API_KEY)
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || ''

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, source } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const firstName = name ? name.split(' ')[0] : email.split('@')[0]
    const optinSource = source === 'x' ? 'newsletter-x' : 'newsletter-popup'

    // Log to Google Sheet
    logToSheet('Newsletter', {
      Timestamp: new Date().toISOString(),
      Name: name,
      Email: email,
      Source: optinSource,
    })

    // Add to Resend audience
    if (AUDIENCE_ID) {
      resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email,
        firstName,
        unsubscribed: false,
      }).catch((err) => console.error('Failed to add contact to audience:', err))
    }

    // Add to Loops (triggers newsletter welcome sequence)
    addToLoops({ email, firstName, source: optinSource })

    // ── Welcome Email 1: Immediate ──────────────────────────────────────────
    await resend.emails.send({
      from: 'JP <contact@jpautomations.co.uk>',
      to: email,
      subject: 'the most expensive process in your business',
      text: `Every service business has one process that's silently costing more than everything else combined. It's almost never the one you think.

Here's how to find it in 10 minutes:

Open your bank statement from last month. Find every payment that went out late, every refund you issued, every job that overran. Now trace each one back to the point where a human had to remember to do something.

That's your bottleneck. Not the work itself — the dependency on someone remembering to trigger it.

One of my clients had £2,995 sitting unpaid at any given time. Not because clients wouldn't pay. Because nobody was chasing them. We removed the human dependency and the cash showed up within the week.

Do the 10-minute trace. You'll find yours.

JP

P.S. I wrote the full framework for finding and fixing these into a guide — The Automation Blueprint. Worth 30 minutes if you want the structured version. jpautomations.co.uk/free-blueprint`,
    })

    const shouldNurture = await tryEnrollSequence(email, 'newsletter')

    if (shouldNurture) {
    // ── Welcome Email 2: Day 3 ──────────────────────────────────────────────
    await resend.emails.send({
      from: 'JP <contact@jpautomations.co.uk>',
      to: email,
      subject: 'the onboarding test',
      scheduledAt: daysFromNow(3),
      text: `Time yourself onboarding your next client. From the moment they say yes to the moment they're fully set up — every email, every form, every document, every chase.

If it takes more than 10 minutes of your time, you're doing work a system should be doing.

Here's what a 10-minute onboarding actually looks like:

1. Client fills in one intake form (you send the link once, automatically, when they pay)
2. Their answers generate your proposal, contract, and invoice — pre-filled, formatted, ready to send
3. A welcome email goes out with next steps, no manual follow-up needed
4. Their details land in your CRM or Notion, structured and searchable

That's it. You don't touch it until there's a decision only you can make.

The difference between a business that scales and one that doesn't is almost always this: how much of the repeatable work still depends on you.

JP

P.S. I packaged the exact intake form questions, email prompts, and Notion template into a system — takes about 2 hours to set up once, then every client after that is under 10 minutes. jpautomations.co.uk/free-onboarding`,
    })

    // ── Welcome Email 3: Day 6 ──────────────────────────────────────────────
    await resend.emails.send({
      from: 'JP <contact@jpautomations.co.uk>',
      to: email,
      subject: 'the proposal shortcut',
      scheduledAt: daysFromNow(6),
      text: `Most service business owners spend 30-60 minutes writing each proposal. Formatting it. Adjusting the scope. Making sure the pricing looks right.

Here's a faster way:

Write one client brief — 8 fields. Name, business, problem, scope, timeline, budget, terms, notes. Fill it in once per client. Then use that single brief to generate your proposal, invoice, contract, and CRM entry in under 5 minutes.

The brief forces clarity. The AI does the formatting. You review, adjust if needed, and send.

The 8 fields that matter:
1. Client name & business
2. What they do (one sentence)
3. The problem they're hiring you to solve
4. Scope of work (bullet points)
5. Timeline
6. Price & payment terms
7. Agreed terms or conditions
8. Notes (anything non-standard)

That's your entire client admin compressed into one input. Everything else is generated.

JP

P.S. I built this into a ready-to-use system with the brief template, AI prompts for each document, and the folder structure to keep it organised. jpautomations.co.uk/free-client-folder`,
    })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
