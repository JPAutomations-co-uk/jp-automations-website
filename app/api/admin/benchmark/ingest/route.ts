import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { isAdminUser } from "@/app/lib/security/server"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"

interface BenchmarkItem {
  id?: string
  industry: string
  format?: string
  funnel_stage?: "TOFU" | "MOFU" | "BOFU"
  pillar?: string
  hook_pattern?: string
  cta_pattern?: string
  posting_window?: string
  source_handle?: string
  source_reference?: string
  sample_size?: number
  metric_window_days?: number
  reach_rate?: number
  share_rate?: number
  save_rate?: number
  comment_rate?: number
  profile_action_rate?: number
  intent_comment_rate?: number
  non_follower_ratio?: number
  observed_lift?: number
  tags?: string[]
  collected_at?: string
  expires_at?: string
}

function cleanText(value: unknown, maxLen: number): string {
  return String(value ?? "").trim().slice(0, maxLen)
}

function toOptionalNumber(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !isAdminUser(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const actorId = resolveRequestActorId({
      userId: user.id,
      forwardedFor: request.headers.get("x-forwarded-for"),
      fallback: "benchmark-ingest",
    })
    const rate = checkRateLimit(`benchmark-ingest:${actorId}`, {
      max: 20,
      windowMs: 60_000,
    })
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please retry shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rate.retryAfterSeconds),
            "X-RateLimit-Remaining": String(rate.remaining),
          },
        }
      )
    }

    const body = (await request.json()) as { items?: BenchmarkItem[] }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "items[] is required" }, { status: 400 })
    }

    const rows = body.items
      .map((item) => ({
        id: item.id,
        industry: cleanText(item.industry, 120),
        format: cleanText(item.format, 80) || null,
        funnel_stage: item.funnel_stage || null,
        pillar: cleanText(item.pillar, 120) || null,
        hook_pattern: cleanText(item.hook_pattern, 300) || null,
        cta_pattern: cleanText(item.cta_pattern, 300) || null,
        posting_window: cleanText(item.posting_window, 120) || null,
        source_handle: cleanText(item.source_handle, 120) || null,
        source_reference: cleanText(item.source_reference, 240) || null,
        sample_size: toOptionalNumber(item.sample_size),
        metric_window_days: toOptionalNumber(item.metric_window_days),
        reach_rate: toOptionalNumber(item.reach_rate),
        share_rate: toOptionalNumber(item.share_rate),
        save_rate: toOptionalNumber(item.save_rate),
        comment_rate: toOptionalNumber(item.comment_rate),
        profile_action_rate: toOptionalNumber(item.profile_action_rate),
        intent_comment_rate: toOptionalNumber(item.intent_comment_rate),
        non_follower_ratio: toOptionalNumber(item.non_follower_ratio),
        observed_lift: toOptionalNumber(item.observed_lift),
        tags: Array.isArray(item.tags) ? item.tags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 20) : [],
        collected_at: item.collected_at || null,
        expires_at: item.expires_at || null,
      }))
      .filter((item) => item.industry)

    if (rows.length === 0) {
      return NextResponse.json({ error: "No valid benchmark rows to ingest" }, { status: 400 })
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from("benchmark_content_patterns")
      .upsert(rows as never, { onConflict: "id" })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, ingested: rows.length })
  } catch (error) {
    console.error("Benchmark ingest error:", error)
    return NextResponse.json(
      { error: "Failed to ingest benchmark patterns" },
      { status: 500 }
    )
  }
}
