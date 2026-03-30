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
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const firstName = name.split(' ')[0]

    if (AUDIENCE_ID) {
      resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email,
        firstName,
        unsubscribed: false,
      }).catch((err) => console.error('Failed to add contact to audience:', err))
    }

    addToLoops({ email, firstName, source: 'prompt-guide' })

    logToSheet('Lead Magnets', {
      Timestamp: new Date().toISOString(),
      Name: name,
      Email: email,
    })

    // ── Delivery email (instant) ────────────────────────────────────────────
    const { error: resendError } = await resend.emails.send({
      from: 'JP <contact@jpautomations.co.uk>',
      to: email,
      subject: 'Your Prompt Engineering Guide',
      text: `The Prompt Engineering Guide is ready — the four-layer structure, chain of thought, few-shot examples, common mistakes, and copy-paste templates for coding, writing, research, and automation.

Read it here: jpautomations.co.uk/prompt-guide

JP

P.S. Start with the "four layers" section. Once you understand role, context, constraints, and output format, everything else in the guide clicks immediately.`,
    })

    if (resendError) {
      console.error('Resend error:', resendError)
      return NextResponse.json({ error: resendError.message }, { status: 500 })
    }

    const shouldNurture = await tryEnrollSequence(email, 'prompt-guide')

    if (shouldNurture) {
    // ── Nurture Email 1: Day 2 ──────────────────────────────────────────────
    resend.emails.send({
      from: 'JP <contact@jpautomations.co.uk>',
      to: email,
      subject: 'one thing to try from it',
      scheduledAt: daysFromNow(2),
      text: `If you haven't opened it yet — pick one section and implement just that.

The people who get results from these don't read the whole thing and plan a project. They pick the smallest action, do it that day, and build from there.

If you're not sure which section, reply and tell me what's eating the most time in your business right now. I'll point you to the right bit.

JP

P.S. If the problem is actually client admin — proposals, invoices, contracts eating your time — this is probably more useful right now: jpautomations.co.uk/free-client-folder. One brief per client, everything generated in 5 minutes using the prompting principles from the guide.`,
    }).catch((err) => console.error('Nurture email 1 error:', err))

    // ── Nurture Email 2: Day 5 ──────────────────────────────────────────────
    resend.emails.send({
      from: 'JP <contact@jpautomations.co.uk>',
      to: email,
      subject: 'where most businesses actually leak money',
      scheduledAt: daysFromNow(5),
      text: `It's rarely the big things. It's the 20-minute tasks that happen 5 times a week and nobody's tracking.

Sending an invoice manually: 15 minutes. Chasing a late payment: 10 minutes. Formatting a proposal: 30 minutes. Following up with a lead who enquired 3 days ago: 20 minutes. Onboarding a new client: 45 minutes.

Add those up across a month. It's usually 20-30 hours of work that never needed a human in the first place.

The fix isn't "be more productive." It's removing yourself from the process entirely so it runs whether you're on a job, on holiday, or in the pub on a Friday.

Pick the one that costs you the most time this week. That's your first build.

JP

P.S. If follow-up is where yours breaks — leads going cold because you're too busy doing actual work to respond fast enough — I wrote a full breakdown on fixing it without a CRM. jpautomations.co.uk/blog/automate-client-follow-up-uk-service-businesses`,
    }).catch((err) => console.error('Nurture email 2 error:', err))

    // ── Nurture Email 3: Day 9 ──────────────────────────────────────────────
    resend.emails.send({
      from: 'JP <contact@jpautomations.co.uk>',
      to: email,
      subject: 'the gap',
      scheduledAt: daysFromNow(9),
      text: `There's a gap between knowing what to fix and actually fixing it. Most businesses live in that gap for years.

Not because they're lazy. Because the urgent always beats the important. There's always another job to finish, another client to respond to, another fire to put out. The system stuff gets pushed to "next month" every month.

If that's where you are — you know what needs fixing but haven't carved out the time to do it — that's exactly what the diagnostic call is for. 30 minutes, I'll map out what to build and in what order. No pitch.

jpautomations.co.uk/book-call

JP

P.S. And if you'd rather keep building it yourself, the automation blueprint covers the full decision framework for what to automate first. jpautomations.co.uk/free-blueprint`,
    }).catch((err) => console.error('Nurture email 3 error:', err))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead prompt guide email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
