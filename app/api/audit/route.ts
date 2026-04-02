import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { logToSheet } from '@/app/lib/log-to-sheet'
import { addToLoops } from '@/app/lib/loops'
import { tryEnrollSequence } from '@/app/lib/email-suppression'

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

export async function POST(request: NextRequest) {
  try {
    const { name, business, trade, revenue, timeEater, phone, email } = await request.json()
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'contact@jpautomations.co.uk'
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

    // Notify JP — structured email
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `🔔 New Audit Request — ${business} (${trade})`,
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

    // Auto-reply to applicant
    resend.emails.send({
      from: `JP <${fromEmail}>`,
      to: email,
      subject: `got your audit request, ${firstName}`,
      text: `Thanks for filling that in ${firstName}. I've got everything I need to have a proper look at ${business}.

I'll come back to you within 24 hours with 2-3 things I've spotted — no fluff, no pitch deck, just what I'd actually fix if it were my business.

Speak soon,
JP`,
    }).catch((err) => console.error('Audit auto-reply error:', err))

    const shouldNurture = await tryEnrollSequence(email, 'audit')

    if (shouldNurture) {
      // Follow-up if no reply: Day 3
      resend.emails.send({
        from: `JP <${fromEmail}>`,
        to: email,
        subject: `your audit results for ${business}`,
        scheduledAt: daysFromNow(3),
        text: `${firstName} — just making sure my audit notes got through. I sent over a few things I spotted in how ${business} runs.

If you want to talk through any of it, grab a slot here: jpautomations.co.uk/book-call

No pressure either way.

JP`,
      }).catch((err) => console.error('Audit follow-up error:', err))
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Audit form error:', err)
    return NextResponse.json({ error: 'Failed to submit audit request' }, { status: 500 })
  }
}
