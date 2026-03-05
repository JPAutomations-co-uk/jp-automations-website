import { NextRequest, NextResponse } from "next/server"

import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import { createClient } from "@/app/lib/supabase/server"
import { enqueueReelEditJob, failJobAndRefund } from "@/app/lib/reel-edit/worker"

export const runtime = "nodejs"

const LUXURY_TOKEN_COST = 25
const LUXURY_TEMPLATES = ["dark_luxury", "clean_minimal", "bold_editorial", "warm_natural", "urban_industrial", "bright_playful"]
const TRANSITION_STYLES = ["crossfade", "wipe", "slide", "zoom", "dissolve", "random"]

/**
 * POST /api/generate/luxury-reel
 *
 * Phase 2 of the luxury reel flow: create an async job to generate the luxury reel
 * from a pre-approved frame plan + uploaded photo asset keys.
 *
 * Body: { framePlan, photoAssetKeys, template?, audioAssetKey?, transition? }
 * Returns: { jobId, status, deducted, balance }
 *
 * Deducts 25 tokens. Poll job status at GET /api/generate/reel-edit/[jobId].
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const actorId = resolveRequestActorId({
      userId: user.id,
      forwardedFor: request.headers.get("x-forwarded-for"),
      fallback: "luxury-reel",
    })

    const rate = checkRateLimit(`generate-luxury-reel:${actorId}`, {
      max: 4,
      windowMs: 10 * 60_000,
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

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 })
    }

    // Validate frame plan
    const framePlan = body.framePlan
    if (!framePlan || typeof framePlan !== "object" || !Array.isArray(framePlan.frame_plan)) {
      return NextResponse.json({ error: "framePlan with frame_plan array is required." }, { status: 400 })
    }

    // Validate photo asset keys
    const photoAssetKeys = (Array.isArray(body.photoAssetKeys) ? body.photoAssetKeys : [])
      .map((k: unknown) => String(k || "").trim())
      .filter(Boolean)

    if (photoAssetKeys.length === 0) {
      return NextResponse.json({ error: "photoAssetKeys is required." }, { status: 400 })
    }

    const template = LUXURY_TEMPLATES.includes(String(body.template || "")) ? String(body.template) : null
    const audioAssetKey = body.audioAssetKey ? String(body.audioAssetKey).trim() || null : null
    const transition = TRANSITION_STYLES.includes(String(body.transition || ""))
      ? String(body.transition)
      : "crossfade"

    // Check token balance
    const { data: balanceRow } = await admin
      .from("token_balances")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    const currentBalance = (balanceRow as { balance?: number } | null)?.balance ?? 0

    if (currentBalance < LUXURY_TOKEN_COST) {
      return NextResponse.json(
        { error: "Insufficient tokens", balance_needed: LUXURY_TOKEN_COST, current_balance: currentBalance },
        { status: 402 }
      )
    }

    // Debit tokens
    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: LUXURY_TOKEN_COST,
      p_type: "feature_use",
      p_description: "Luxury reel job (Higgsfield image-to-video)",
    } as never)

    if (debitError) {
      const message = String(debitError.message || debitError)
      if (message.includes("Insufficient")) {
        return NextResponse.json({ error: "Insufficient tokens", balance_needed: LUXURY_TOKEN_COST }, { status: 402 })
      }
      throw debitError
    }

    // Insert job
    const now = new Date().toISOString()
    const { data: insertedJob, error: insertError } = await (admin as any)
      .from("reel_edit_jobs")
      .insert({
        user_id: user.id,
        mode: "luxury",
        runtime: "cloud",
        status: "queued",
        progress: 0,
        input_payload: { framePlan, photoAssetKeys, audioAssetKey },
        options_payload: { template, transition },
        deducted_tokens: LUXURY_TOKEN_COST,
        refunded: false,
        logs_excerpt: "Job queued.",
        created_at: now,
        updated_at: now,
      })
      .select("id, status")
      .single()

    if (insertError || !insertedJob?.id) {
      await admin.rpc("credit_tokens", {
        p_user_id: user.id,
        p_amount: LUXURY_TOKEN_COST,
        p_type: "refund",
        p_description: "Auto-refund: luxury reel job creation failed",
      } as never)

      return NextResponse.json(
        { error: String(insertError?.message || "Failed to create luxury reel job") },
        { status: 500 }
      )
    }

    const queued = await enqueueReelEditJob({ jobId: String(insertedJob.id) })

    if (!queued.queued) {
      await failJobAndRefund(String(insertedJob.id), queued.error || "Failed to queue worker")
      return NextResponse.json(
        { error: queued.error || "Failed to queue luxury reel worker" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      jobId: String(insertedJob.id),
      status: "queued",
      deducted: LUXURY_TOKEN_COST,
      balance: newBalance,
    })
  } catch (error) {
    console.error("Luxury reel route error:", error)
    const message = error instanceof Error ? error.message : "Failed to create luxury reel job"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
