import { NextRequest, NextResponse } from "next/server"
import path from "node:path"
import { promises as fs } from "node:fs"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import {
  LOCAL_SKILLS_ENABLED,
  LOCAL_SKILLS_WORKSPACE_ROOT,
  runPythonScript,
} from "@/app/lib/skills/local-skill-runner"

export const runtime = "nodejs"

const TOKEN_COST = 3

function excerptLogs(logs: string, maxChars = 5000): string {
  if (!logs) return ""
  if (logs.length <= maxChars) return logs
  return logs.slice(logs.length - maxChars)
}

function extractSheetUrl(logs: string): string | null {
  const match = logs.match(/https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+[^\s)"]*/i)
  return match ? match[0] : null
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()

  try {
    if (!LOCAL_SKILLS_ENABLED) {
      return NextResponse.json(
        {
          error:
            "Local skills bridge is disabled. Set ENABLE_LOCAL_SKILLS_BRIDGE=1 to run title variant generation.",
        },
        { status: 503 }
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const actorId = resolveRequestActorId({
      userId: user.id,
      forwardedFor: request.headers.get("x-forwarded-for"),
      fallback: "youtube-title-variants",
    })
    const rate = checkRateLimit(`generate-youtube-title-variants:${actorId}`, {
      max: 8,
      windowMs: 60 * 60_000,
    })
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please retry later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rate.retryAfterSeconds),
            "X-RateLimit-Remaining": String(rate.remaining),
          },
        }
      )
    }

    const body = (await request.json()) as Record<string, unknown>
    const sheetUrl = String(body.sheetUrl || "").trim()
    const limit = Number(body.limit ?? 20)
    const variants = Number(body.variants ?? 3)

    if (!sheetUrl) {
      return NextResponse.json({ error: "sheetUrl is required." }, { status: 400 })
    }
    if (!Number.isFinite(limit) || limit < 1 || limit > 200) {
      return NextResponse.json({ error: "limit must be between 1 and 200." }, { status: 400 })
    }
    if (!Number.isFinite(variants) || variants < 1 || variants > 10) {
      return NextResponse.json({ error: "variants must be between 1 and 10." }, { status: 400 })
    }

    const { data: balanceRow } = await admin
      .from("token_balances")
      .select("balance")
      .eq("user_id", user.id)
      .single()
    const balance = (balanceRow as { balance?: number } | null)?.balance ?? 0

    if (balance < TOKEN_COST) {
      return NextResponse.json(
        { error: "Insufficient tokens", balance_needed: TOKEN_COST, current_balance: balance },
        { status: 402 }
      )
    }

    const scriptPath = path.join(
      LOCAL_SKILLS_WORKSPACE_ROOT,
      ".claude",
      "skills",
      "title-variants",
      "scripts",
      "generate_title_variants.py"
    )
    await fs.stat(scriptPath)

    const result = await runPythonScript({
      scriptPath,
      args: [
        "--sheet_url",
        sheetUrl,
        "--limit",
        String(Math.round(limit)),
        "--variants",
        String(Math.round(variants)),
      ],
      cwd: LOCAL_SKILLS_WORKSPACE_ROOT,
      timeoutMs: 30 * 60_000,
    })

    if (result.timedOut || result.exitCode !== 0) {
      return NextResponse.json(
        {
          error: result.timedOut
            ? "Title variant generation timed out."
            : "Title variant generation failed.",
          stdout: excerptLogs(result.stdout),
          stderr: excerptLogs(result.stderr),
          command: result.command,
        },
        { status: 500 }
      )
    }

    const detectedSheetUrl = extractSheetUrl(`${result.stdout}\n${result.stderr}`) || sheetUrl

    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: TOKEN_COST,
      p_type: "feature_use",
      p_description: `YouTube title variants (${Math.round(limit)} rows)`,
    } as never)

    if (debitError) {
      const message = String(debitError.message || debitError)
      if (message.includes("Insufficient")) {
        return NextResponse.json(
          { error: "Insufficient tokens", balance_needed: TOKEN_COST },
          { status: 402 }
        )
      }
      throw debitError
    }

    return NextResponse.json({
      ok: true,
      sheetUrl: detectedSheetUrl,
      durationMs: result.durationMs,
      balance: newBalance,
      deducted: TOKEN_COST,
      stdout: excerptLogs(result.stdout),
      stderr: excerptLogs(result.stderr),
    })
  } catch (error) {
    console.error("YouTube title variants route error:", error)
    const message = error instanceof Error ? error.message : "Failed to generate title variants"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
