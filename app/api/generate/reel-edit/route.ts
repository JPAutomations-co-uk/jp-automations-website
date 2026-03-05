import { NextRequest, NextResponse } from "next/server"

import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import { createClient } from "@/app/lib/supabase/server"
import {
  enqueueReelEditJob,
  failJobAndRefund,
  isProModeAllowed,
  parseReelEditRequest,
  REEL_TOKEN_COST,
} from "@/app/lib/reel-edit/worker"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const actorId = resolveRequestActorId({
      userId: user.id,
      forwardedFor: request.headers.get("x-forwarded-for"),
      fallback: "reel-edit",
    })

    const rate = checkRateLimit(`generate-reel-edit-v2:${actorId}`, {
      max: 8,
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

    const payload = await request.json().catch(() => null)
    const parsed = parseReelEditRequest(payload)
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    if (parsed.mode === "pro") {
      const availability = isProModeAllowed(user.email)
      if (!availability.allowed) {
        return NextResponse.json({ error: availability.reason || "Pro mode unavailable." }, { status: 403 })
      }
    }

    const tokenCost = REEL_TOKEN_COST[parsed.mode]

    const { data: balanceRow } = await admin
      .from("token_balances")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    const currentBalance = (balanceRow as { balance?: number } | null)?.balance ?? 0

    if (currentBalance < tokenCost) {
      return NextResponse.json(
        {
          error: "Insufficient tokens",
          balance_needed: tokenCost,
          current_balance: currentBalance,
        },
        { status: 402 }
      )
    }

    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: tokenCost,
      p_type: "feature_use",
      p_description: `Reel edit job (${parsed.mode})`,
    } as never)

    if (debitError) {
      const message = String(debitError.message || debitError)
      if (message.includes("Insufficient")) {
        return NextResponse.json(
          {
            error: "Insufficient tokens",
            balance_needed: tokenCost,
          },
          { status: 402 }
        )
      }
      throw debitError
    }

    const now = new Date().toISOString()
    const { data: insertedJob, error: insertError } = await (admin as any)
      .from("reel_edit_jobs")
      .insert({
        user_id: user.id,
        mode: parsed.mode,
        runtime: "cloud",
        status: "queued",
        progress: 0,
        input_payload: parsed.input,
        options_payload: parsed.options,
        deducted_tokens: tokenCost,
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
        p_amount: tokenCost,
        p_type: "refund",
        p_description: "Auto-refund: reel edit job creation failed",
      } as never)

      const message = String(insertError?.message || "Failed to create reel edit job")
      if (message.includes("public.reel_edit_jobs")) {
        return NextResponse.json(
          {
            error:
              "Reel edit database migration is not applied yet. Apply migration 2026022602_reel_edit_jobs.sql and retry.",
          },
          { status: 503 }
        )
      }
      return NextResponse.json({ error: message }, { status: 500 })
    }

    const queued = await enqueueReelEditJob({
      jobId: String(insertedJob.id),
    })

    if (!queued.queued) {
      await failJobAndRefund(String(insertedJob.id), queued.error || "Failed to queue worker")
      return NextResponse.json(
        {
          error: queued.error || "Failed to queue reel edit worker",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      jobId: String(insertedJob.id),
      status: "queued",
      deducted: tokenCost,
      balance: newBalance,
    })
  } catch (error) {
    console.error("Reel edit route error:", error)
    const message = error instanceof Error ? error.message : "Failed to create reel edit job"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
