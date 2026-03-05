import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { logToSheet } from '@/app/lib/log-to-sheet'
import { addToLoops } from '@/app/lib/loops'

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'contact@jpautomations.co.uk'
    const toEmail = process.env.CONTACT_TO_EMAIL || 'jp@jpautomations.co.uk'

    if (!apiKey) {
      return NextResponse.json({ error: 'Contact email is not configured' }, { status: 500 })
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resend = new Resend(apiKey)
    const firstName = name.split(' ')[0]

    // Log to Google Sheet
    logToSheet('Contact Form', {
      Timestamp: new Date().toISOString(),
      Name: name,
      Email: email,
      Message: message,
    })

    // Add to Loops
    addToLoops({ email, firstName, source: 'contact-form' })

    // Notify JP immediately
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Contact Form Submission — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0d9488;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message:</td><td style="padding: 8px 0;">${message.replace(/\n/g, '<br>')}</td></tr>
          </table>
        </div>
      `,
    })

    // ── Auto-reply to the person (instant) ──────────────────────────────────
    resend.emails.send({
      from: `JP <${fromEmail}>`,
      to: email,
      subject: 'got your message',
      text: `Thanks for reaching out. I read everything personally and I'll get back to you within 24 hours — usually faster.

JP

P.S. While you wait, the blog has case studies and frameworks that might be relevant to whatever you're working through. jpautomations.co.uk/blog`,
    }).catch((err) => console.error('Contact auto-reply error:', err))

    // ── Follow-up if no reply: Day 3 ────────────────────────────────────────
    resend.emails.send({
      from: `JP <${fromEmail}>`,
      to: email,
      subject: 'following up',
      scheduledAt: daysFromNow(3),
      text: `Making sure my reply didn't get buried. Hit reply if you've still got a question.

JP

P.S. If you were exploring whether we could help with your business specifically, the fastest way to find out is a 30-minute call — no pitch, just a diagnostic. jpautomations.co.uk/book-call`,
    }).catch((err) => console.error('Contact follow-up error:', err))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
