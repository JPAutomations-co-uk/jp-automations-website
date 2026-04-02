import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { logToSheet } from '@/app/lib/log-to-sheet'
import { addToLoops } from '@/app/lib/loops'
import { tryEnrollSequence } from '@/app/lib/email-suppression'

const BOOKING_URL = process.env.BOOKING_URL || 'https://calendar.app.google/hDU4A5Z4ZMKSiVAS7'

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

export async function POST(request: NextRequest) {
  try {
    const { name, business, trade, revenue, timeEater, phone, email } = await request.json()
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = 'jp@jpautomations.co.uk'
    const toEmail = process.env.CONTACT_TO_EMAIL || 'jp@jpautomations.co.uk'

    if (!apiKey) {
      return NextResponse.json({ error: 'Email is not configured' }, { status: 500 })
    }

    if (!name || !business || !trade || !revenue || !timeEater || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resend = new Resend(apiKey)
    const firstName = name.split(' ')[0]

    // Log to Google Sheet
    logToSheet('Audit Submissions', {
      Timestamp: new Date().toISOString(),
      Name: name,
      Business: business,
      Trade: trade,
      Revenue: revenue,
      'Time Eater': timeEater,
      Phone: phone,
      Email: email,
    })

    // Add to Loops
    addToLoops({ email, firstName, source: 'audit-form' })

    // ── Notify JP — structured email ──────────────────────────────────────────
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Audit Request — ${business} (${trade})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="color: #0d9488; margin-bottom: 4px;">New Free Audit Request</h2>
          <p style="color: #666; margin-top: 0;">Submitted ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #e5e5e5;">
              <td style="padding: 10px 0; font-weight: 600; width: 140px; color: #333;">Name</td>
              <td style="padding: 10px 0;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e5e5;">
              <td style="padding: 10px 0; font-weight: 600; color: #333;">Business</td>
              <td style="padding: 10px 0;">${business}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e5e5;">
              <td style="padding: 10px 0; font-weight: 600; color: #333;">Trade</td>
              <td style="padding: 10px 0;">${trade}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e5e5;">
              <td style="padding: 10px 0; font-weight: 600; color: #333;">Revenue</td>
              <td style="padding: 10px 0;">${revenue}/month</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e5e5;">
              <td style="padding: 10px 0; font-weight: 600; color: #333; vertical-align: top;">Time Eater</td>
              <td style="padding: 10px 0;">${timeEater.replace(/\n/g, '<br>')}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e5e5;">
              <td style="padding: 10px 0; font-weight: 600; color: #333;">Phone</td>
              <td style="padding: 10px 0;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #333;">Email</td>
              <td style="padding: 10px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>

          <div style="background: #f8f8f8; border-left: 3px solid #0d9488; padding: 12px 16px; margin-top: 16px;">
            <strong style="color: #333;">Quick actions:</strong><br>
            <a href="mailto:${email}" style="color: #0d9488;">Reply to ${firstName}</a> ·
            <a href="tel:${phone}" style="color: #0d9488;">Call ${firstName}</a>
          </div>
        </div>
      `,
    })

    // ── Email 1: Auto-reply (instant) ─────────────────────────────────────────
    resend.emails.send({
      from: `JP <${fromEmail}>`,
      to: email,
      subject: `got your audit request, ${firstName}`,
      text: `Hey ${firstName}, thanks for filling that in — I've got everything I need to have a proper look at how ${business} runs.

I'll go through your online presence, how you're handling enquiries, and where the obvious time and money leaks are. You'll hear back from me within 24 hours with what I've found — no PDF deck, no generic advice, just the specific things I'd change if I were running ${business} myself.

Once I've sent that over, if you want to talk through it and figure out what to prioritise, you can grab a slot here: ${BOOKING_URL}

No pressure on that at all — the audit's yours either way.

Thanks,
JP`,
    }).catch((err) => console.error('Audit auto-reply error:', err))

    const shouldNurture = await tryEnrollSequence(email, 'audit')

    if (shouldNurture) {
      // ── Email 2: Follow-up 1 — Day 2 ─────────────────────────────────────────
      resend.emails.send({
        from: `JP <${fromEmail}>`,
        to: email,
        subject: `had a look at ${business}`,
        scheduledAt: daysFromNow(2),
        text: `Hey ${firstName}, just following up on the audit I sent through — wanted to make sure it landed and didn't end up buried in your inbox.

I found a couple of things that are worth talking through properly, because they're the kind of stuff that's hard to explain in an email without it turning into an essay. Much easier to walk you through it in 15 minutes and answer any questions on the spot.

If you want to do that, grab a time here: ${BOOKING_URL}

If you're still mulling it over, no rush at all. The notes aren't going anywhere.

JP`,
      }).catch((err) => console.error('Audit follow-up 1 error:', err))

      // ── Email 3: Follow-up 2 — Day 5 (final) ─────────────────────────────────
      resend.emails.send({
        from: `JP <${fromEmail}>`,
        to: email,
        subject: `last one from me, ${firstName}`,
        scheduledAt: daysFromNow(5),
        text: `Hey ${firstName}, last email from me on this — I don't want to be that person who keeps following up when you've clearly got things to get on with.

If the timing's off right now, completely get it. But if you did read through the audit and thought "yeah, I should probably sort that" — the call's still there whenever you're ready: ${BOOKING_URL}

Either way, if you ever want to pick my brain about anything at ${business}, just reply to this email. I read everything.

Thanks,
JP`,
      }).catch((err) => console.error('Audit follow-up 2 error:', err))
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Audit form error:', err)
    return NextResponse.json({ error: 'Failed to submit audit request' }, { status: 500 })
  }
}
