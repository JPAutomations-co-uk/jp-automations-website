// app/api/submit-booking/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { logToSheet } from '@/app/lib/log-to-sheet';
import { addToLoops } from '@/app/lib/loops';
import { tryEnrollSequence } from '@/app/lib/email-suppression';

const BOOKING_URL = process.env.BOOKING_URL || 'https://calendar.app.google/hDU4A5Z4ZMKSiVAS7';

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function btn(label: string): string {
  return `<p style="text-align: center; margin: 32px 0;">
    <a href="${BOOKING_URL}" style="background: #0d9488; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">${label}</a>
  </p>`;
}

const footer = `
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />
  <p style="color: #9ca3af; font-size: 12px; margin: 0;">JP Automations · <a href="https://jpautomations.co.uk" style="color: #9ca3af;">jpautomations.co.uk</a></p>
`;

// Day 4 email — subject line tailored to their bottleneck
function bottleneckSubject(bottleneck: string, firstName: string, businessName: string): string {
  switch (bottleneck) {
    case 'Too many enquiries, no structure':
      return `The enquiries problem, ${firstName}`;
    case 'Admin and follow-ups take too much time':
      return `Re: the admin, ${firstName}`;
    case 'Marketing is inconsistent':
      return `Staying consistent, ${firstName}`;
    case 'Everything depends on me':
      return `${businessName} without you, ${firstName}`;
    default:
      return `Still here, ${firstName}`;
  }
}

// Day 4 email — body tailored to their bottleneck
function bottleneckBody(bottleneck: string, firstName: string, businessName: string): string {
  switch (bottleneck) {
    case 'Too many enquiries, no structure':
      return `
        <p>Getting more enquiries than the system can keep up with is a good problem — losing a chunk of them because the follow-up isn't fast enough is the bit worth fixing.</p>
        <p>Most of the time it's not a sales issue. The leads are fine. It's just that the structure isn't there yet — so things fall through the gaps.</p>
        <p>That's what I'd map out with you on the call. 30 minutes, no prep.</p>
      `;
    case 'Admin and follow-ups take too much time':
      return `
        <p>Quick one — how much of your week is actually doing the work, vs everything around it? Invoicing, chasing, booking, replying...</p>
        <p>For most people at your stage it's more than it should be. And it doesn't get better on its own — it gets worse the busier you get.</p>
        <p>That's what I'd look at with you on the call. Where the time's actually going at ${businessName}, and what it looks like to get it back.</p>
      `;
    case 'Marketing is inconsistent':
      return `
        <p>Staying consistent with marketing while you're running a service business is genuinely hard. It's always the first thing to drop when things get busy — which is usually exactly when you need the pipeline filling up most.</p>
        <p>There's a way to get consistent output without it depending on you being on it every day. That's what I'd walk you through on the call.</p>
      `;
    case 'Everything depends on me':
      return `
        <p>If ${businessName} can't function when you're not in it, it's not quite a business yet — it's a job where you're also the manager.</p>
        <p>Most people at your stage are there. The question is just where to start pulling yourself out of it.</p>
        <p>That's what I'd map out on the call.</p>
      `;
    default:
      return `
        <p>Whatever's pulling your focus at ${businessName} right now — that's what the call is for.</p>
        <p>30 minutes, no prep. I'll map out what to fix first and what it looks like to get there.</p>
      `;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { name, email, businessName, businessType, phone, revenue, bottleneck, teamSize } = formData;

    if (!name || !email || !businessName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'contact@jpautomations.co.uk';
    const jpEmail = process.env.CONTACT_TO_EMAIL || 'jp@jpautomations.co.uk';
    const firstName = name.split(' ')[0];

    // Add to Loops
    addToLoops({
      email,
      firstName,
      source: 'apply-form',
      properties: {
        businessName: businessName || '',
        bottleneck: bottleneck || '',
      },
    });

    // ── Log to Google Sheet (non-blocking) ───────────────────────────────────
    logToSheet('Discovery Calls', {
      Timestamp: new Date().toISOString(),
      Name: name,
      Email: email,
      Phone: phone || '',
      'Business Name': businessName,
      'Business Type': businessType || '',
      Revenue: revenue || '',
      'Team Size': teamSize || '',
      'Main Challenge': bottleneck || '',
    });

    // Register apply sequence (highest priority — always sends, suppresses others)
    tryEnrollSequence(email, 'apply').catch((err) =>
      console.error('Suppression enroll error:', err)
    );

    // ── Email 0: JP notification (instant) ──────────────────────────────────
    await resend.emails.send({
      from: fromEmail,
      to: jpEmail,
      subject: `New lead — ${firstName}, ${businessName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h2 style="color: #0d9488; margin-bottom: 4px;">New Discovery Call Application</h2>
          <p style="color: #6b7280; font-size: 13px; margin-top: 0;">Booking link sent. 3 follow-ups scheduled at day 2, 4, and 7.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; line-height: 2;">
            <tr><td style="font-weight: bold; width: 130px; color: #374151;">Name</td><td>${name}</td></tr>
            <tr><td style="font-weight: bold; color: #374151;">Email</td><td><a href="mailto:${email}" style="color: #0d9488;">${email}</a></td></tr>
            <tr><td style="font-weight: bold; color: #374151;">Phone</td><td>${phone || '—'}</td></tr>
            <tr><td style="font-weight: bold; color: #374151;">Business</td><td>${businessName}</td></tr>
            <tr><td style="font-weight: bold; color: #374151;">Type</td><td>${businessType || '—'}</td></tr>
            <tr><td style="font-weight: bold; color: #374151;">Revenue</td><td>${revenue || '—'}</td></tr>
            <tr><td style="font-weight: bold; color: #374151;">Team</td><td>${teamSize || '—'}</td></tr>
            <tr><td style="font-weight: bold; color: #374151; vertical-align: top;">Challenge</td><td>${bottleneck || '—'}</td></tr>
          </table>
        </div>
      `,
    });

    // ── Email 1: Booking link to lead (instant) ──────────────────────────────
    const openingContext = [
      businessType,
      revenue ? `${revenue}/month` : null,
      teamSize,
    ].filter(Boolean).join(', ');

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Your slot, ${firstName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.7;">
          <p>Hi ${firstName},</p>
          <p>Had a look at your details${openingContext ? ` — ${openingContext}` : ''}. ${bottleneck ? `${bottleneck} is one of the most common things I work on.` : 'Happy to help.'}</p>
          <p>Here's your link to pick a slot — takes about 30 seconds:</p>
          ${btn('Book Your Call →')}
          <p style="color: #6b7280; font-size: 14px;">No prep needed. Just show up.</p>
          <p>— JP</p>
          ${footer}
        </div>
      `,
    });

    // ── Email 2: Follow-up 1 — Day 2 ────────────────────────────────────────
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Still available, ${firstName}`,
      scheduledAt: daysFromNow(2),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.7;">
          <p>Hi ${firstName},</p>
          <p>Did you get a chance to book?</p>
          <p>Slot's still there if you need it:</p>
          ${btn('Book Your Call →')}
          <p>— JP</p>
          ${footer}
        </div>
      `,
    });

    // ── Email 3: Follow-up 2 — Day 4 (bottleneck-personalised) ──────────────
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: bottleneckSubject(bottleneck, firstName, businessName),
      scheduledAt: daysFromNow(4),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.7;">
          <p>Hi ${firstName},</p>
          ${bottleneckBody(bottleneck, firstName, businessName)}
          ${btn('Claim Your Free Call →')}
          <p>— JP</p>
          ${footer}
        </div>
      `,
    });

    // ── Email 4: Follow-up 3 — Day 7 (final) ────────────────────────────────
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Last one, ${firstName}`,
      scheduledAt: daysFromNow(7),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111; line-height: 1.7;">
          <p>Hi ${firstName},</p>
          <p>Last one from me, I promise.</p>
          <p>If sorting ${businessName} is still on your radar, the slot's still open:</p>
          ${btn('Book Your Call →')}
          <p style="color: #6b7280; font-size: 14px;">If the timing's just not right at the moment, no worries at all — you can always reach me at <a href="mailto:jp@jpautomations.co.uk" style="color: #0d9488;">jp@jpautomations.co.uk</a> when it is.</p>
          <p>— JP</p>
          ${footer}
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Application received. Booking link sent.',
    });

  } catch (error) {
    console.error('Error processing booking submission:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
