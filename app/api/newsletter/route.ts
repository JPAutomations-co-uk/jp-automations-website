import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { logToSheet } from '@/app/lib/log-to-sheet'

const resend = new Resend(process.env.RESEND_API_KEY)
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || ''

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // Log to Google Sheet (non-blocking)
    logToSheet('Newsletter', {
      Timestamp: new Date().toISOString(),
      Email: email,
    })

    // Add to Resend audience (non-blocking)
    if (AUDIENCE_ID) {
      resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email,
        unsubscribed: false,
      }).catch((err) => console.error('Failed to add newsletter contact to audience:', err))
    }

    // Send welcome email
    const { error: resendError } = await resend.emails.send({
      from: 'JP Automations <contact@jpautomations.co.uk>',
      to: email,
      subject: "You're in — welcome to The AI Edge",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #111;">

          <p style="font-size: 13px; letter-spacing: 0.1em; color: #14b8a6; text-transform: uppercase; font-weight: 600; margin-bottom: 32px;">
            JP Automations
          </p>

          <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.2; margin-bottom: 16px;">
            You're in.
          </h1>

          <p style="font-size: 15px; color: #64748b; line-height: 1.7; margin-bottom: 32px;">
            Every week, you'll get one email with practical AI automation tips, tools, and insights for service business owners. No fluff — just things you can actually use.
          </p>

          <a href="https://www.jpautomations.co.uk/blog"
             style="display: inline-block; background: #14b8a6; color: white; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; text-decoration: none; margin-bottom: 40px;">
            Read the Blog →
          </a>

          <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; margin-top: 8px;">
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin: 0;">
              If you want your business automated end to end, book a call at
              <a href="https://www.jpautomations.co.uk/book-call" style="color: #14b8a6; text-decoration: none;">jpautomations.co.uk</a>.
            </p>
          </div>

        </div>
      `,
    })

    if (resendError) {
      console.error('Newsletter email error:', resendError)
      return NextResponse.json({ error: resendError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
