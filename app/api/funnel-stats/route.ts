import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { isAdminUser } from '@/app/lib/security/server'

/* ── Subject → email ID + segment mapping ──────────────────── */

const EXACT_SUBJECTS: Record<string, { id: string; seg: string }> = {
  'the most expensive process in your business': { id: 'nw-1', seg: 'newsletter' },
  'the onboarding test': { id: 'nw-2', seg: 'newsletter' },
  'the proposal shortcut': { id: 'nw-3', seg: 'newsletter' },
  'one thing to try from it': { id: 'lm-1', seg: 'lead-magnet' },
  'where most businesses actually leak money': { id: 'lm-2', seg: 'lead-magnet' },
  'the gap': { id: 'lm-3', seg: 'lead-magnet' },
  'got your message': { id: 'ct-1', seg: 'contact' },
  'following up': { id: 'ct-2', seg: 'contact' },
}

const DELIVERY_SUBJECTS = [
  'Your Automation Blueprint',
  'Your Client Admin Folder',
  'Your Onboarding System',
  'Your Prompt Engineering Guide',
  'your whiteboard prompt',
  'Your OpenClaw Guide',
  'The OpenClaw Security Guide',
]

const APPLY_PREFIXES: [string, string][] = [
  ['Your slot,', 'ap-1'],
  ['Still available,', 'ap-2'],
  ['Last one,', 'ap-4'],
]

const BOTTLENECK_PREFIXES = [
  'The enquiries problem,',
  'Re: the admin,',
  'Staying consistent,',
  'Still here,',
]

function matchSubject(subject: string): { id: string; seg: string } | null {
  const lower = subject.toLowerCase()
  if (EXACT_SUBJECTS[lower]) return EXACT_SUBJECTS[lower]

  for (const ds of DELIVERY_SUBJECTS) {
    if (subject.startsWith(ds)) return { id: 'lm-0', seg: 'lead-magnet' }
  }
  for (const [prefix, id] of APPLY_PREFIXES) {
    if (subject.startsWith(prefix)) return { id, seg: 'apply' }
  }
  for (const bp of BOTTLENECK_PREFIXES) {
    if (subject.startsWith(bp)) return { id: 'ap-3', seg: 'apply' }
  }
  if (subject.includes('without you,')) return { id: 'ap-3', seg: 'apply' }

  return null
}

/* ── Resend REST helpers ───────────────────────────────────── */

async function resendGet(path: string, key: string) {
  const res = await fetch(`https://api.resend.com${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  })
  if (!res.ok) return null
  return res.json()
}

/* ── Main handler ──────────────────────────────────────────── */

export async function GET() {
  // Admin-only endpoint
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminUser(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const emailStats: Record<string, { sent: number; delivered: number; opened: number; clicked: number; bounced: number }> = {}
  const subscriberCounts: Record<string, number> = { newsletter: 0, 'lead-magnet': 0, apply: 0, contact: 0 }
  let totalContacts = 0

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json(
      { emailStats, subscriberCounts, totalContacts, fetchedAt: new Date().toISOString() },
      { headers: corsHeaders() }
    )
  }

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

  // ── 1. Resend emails FIRST (most valuable, avoids 429) ──
  try {
    const emailsRes = await fetch('https://api.resend.com/emails', {
      headers: { Authorization: `Bearer ${resendKey}` },
    })
    const json = emailsRes.ok ? await emailsRes.json() : null
    const emails = json?.data || []

    const segRecipients: Record<string, Set<string>> = {
      newsletter: new Set(),
      'lead-magnet': new Set(),
      apply: new Set(),
      contact: new Set(),
    }

    for (const email of emails) {
      const match = matchSubject(email.subject || '')
      if (!match) continue

      const { id, seg } = match
      const recipient = Array.isArray(email.to) ? email.to[0] : email.to
      if (recipient) segRecipients[seg]?.add(recipient)

      if (!emailStats[id]) {
        emailStats[id] = { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0 }
      }

      emailStats[id].sent++

      const event = email.last_event
      if (['delivered', 'opened', 'clicked'].includes(event)) emailStats[id].delivered++
      if (['opened', 'clicked'].includes(event)) emailStats[id].opened++
      if (event === 'clicked') emailStats[id].clicked++
      if (event === 'bounced') emailStats[id].bounced++
      if (event === 'scheduled') emailStats[id].delivered++
    }

    for (const [seg, recipients] of Object.entries(segRecipients)) {
      subscriberCounts[seg] = recipients.size
    }
  } catch {}

  // ── 2. Resend audiences (with delay to avoid rate limit) ─
  try {
    await delay(1000)
    const audiences = await resendGet('/audiences', resendKey)
    if (audiences?.data) {
      for (const aud of audiences.data) {
        await delay(500)
        const contacts = await resendGet(`/audiences/${aud.id}/contacts`, resendKey)
        if (contacts?.data) {
          totalContacts += contacts.data.length
        }
      }
    }
  } catch {}

  return NextResponse.json(
    { emailStats, subscriberCounts, totalContacts, fetchedAt: new Date().toISOString() },
    { headers: corsHeaders() }
  )
}

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://jpautomations.co.uk'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
