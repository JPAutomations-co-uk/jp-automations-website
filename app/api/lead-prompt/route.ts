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

    addToLoops({ email, firstName, source: 'whiteboard-prompt' })

    logToSheet('Lead Magnets', {
      Timestamp: new Date().toISOString(),
      Name: name,
      Email: email,
    })

    // ── Delivery email (instant) ────────────────────────────────────────────
    const { error: resendError } = await resend.emails.send({
      from: 'JP <contact@jpautomations.co.uk>',
      to: email,
      subject: 'Your Whiteboard Image Prompt',
      text: `The whiteboard image prompt is ready. Paste it as a system prompt in Grok, Nano Banana, or any image model — then describe your content in the user message.

Get it here: jpautomations.co.uk/prompt

JP

P.S. Works best when you're specific about the whiteboard content. Instead of "marketing tips," try "3-step framework for pricing a roofing job." The more concrete, the better the output.`,
    })

    if (resendError) {
      console.error('Resend error:', resendError)
      return NextResponse.json({ error: resendError.message }, { status: 500 })
    }

    const shouldNurture = await tryEnrollSequence(email, 'prompt')

    if (shouldNurture) {
    // ── Nurture Email 1: Day 2 ──────────────────────────────────────────────
    resend.emails.send({
      from: 'JP <contact@jpautomations.co.uk>',
      to: email,
      subject: 'one thing to try from it',
      scheduledAt: daysFromNow(2),
      text: `If you haven't tried it yet — generate one image today and post it.

The people who get results from these don't overthink it. They pick one topic they know well, run the prompt, and post. The iteration happens after.

If you want to go deeper on getting AI to do exactly what you want — not just images, but writing, research, automation — I put together a full prompting guide.

JP

P.S. The Prompt Engineering Guide covers the four-layer structure that makes every AI tool work better. It's the foundation behind the whiteboard prompt and everything else I build. jpautomations.co.uk/free-prompt-guide`,
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

P.S. And if you'd rather keep building it yourself, the automation blueprint is the best starting point — it's the full framework for deciding what to automate first. jpautomations.co.uk/free-blueprint`,
    }).catch((err) => console.error('Nurture email 3 error:', err))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead prompt email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
