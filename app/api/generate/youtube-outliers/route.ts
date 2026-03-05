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

const TOKEN_COST = 10

function excerptLogs(logs: string, maxChars = 5000): string {
  if (!logs) return ""
  if (logs.length <= maxChars) return logs
  return logs.slice(logs.length - maxChars)
}

function parseLastJsonLine(stdout: string): Record<string, unknown> | null {
  const lines = stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i]
    if (!line.startsWith("{") || !line.endsWith("}")) continue
    try {
      const parsed = JSON.parse(line) as Record<string, unknown>
      return parsed
    } catch {
      continue
    }
  }
  return null
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
            "Local skills bridge is disabled. Set ENABLE_LOCAL_SKILLS_BRIDGE=1 to run YouTube outlier scans.",
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
      fallback: "youtube-outliers",
    })
    const rate = checkRateLimit(`generate-youtube-outliers:${actorId}`, {
      max: 4,
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

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
    const keywordsInput = body.keywords
    const keywords = Array.isArray(keywordsInput)
      ? keywordsInput.map((v) => String(v).trim()).filter(Boolean)
      : String(keywordsInput || "")
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)

    const days = Number(body.days ?? 7)
    const limit = Number(body.limit ?? 30)
    const minScore = Number(body.minScore ?? 1)
    const top = Number(body.top ?? 10)

    if (!Number.isFinite(days) || days < 1 || days > 120) {
      return NextResponse.json({ error: "days must be between 1 and 120." }, { status: 400 })
    }
    if (!Number.isFinite(limit) || limit < 1 || limit > 200) {
      return NextResponse.json({ error: "limit must be between 1 and 200." }, { status: 400 })
    }
    if (!Number.isFinite(minScore) || minScore < 0 || minScore > 100) {
      return NextResponse.json({ error: "minScore must be between 0 and 100." }, { status: 400 })
    }
    if (!Number.isFinite(top) || top < 1 || top > 100) {
      return NextResponse.json({ error: "top must be between 1 and 100." }, { status: 400 })
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
      "youtube-outliers",
      "scripts",
      "scrape_youtube_outliers.py"
    )
    await fs.stat(scriptPath)

    const scriptArgs = [
      "--days",
      String(Math.round(days)),
      "--limit",
      String(Math.round(limit)),
      "--min-score",
      String(minScore),
      "--top",
      String(Math.round(top)),
      "--json",
    ]

    if (keywords.length > 0) {
      scriptArgs.push("--keywords", keywords.join(","))
    }

    const result = await runPythonScript({
      scriptPath,
      args: scriptArgs,
      cwd: LOCAL_SKILLS_WORKSPACE_ROOT,
      timeoutMs: 30 * 60_000,
    })

    if (result.timedOut || result.exitCode !== 0) {
      return NextResponse.json(
        {
          error: result.timedOut ? "YouTube outlier scan timed out." : "YouTube outlier scan failed.",
          stdout: excerptLogs(result.stdout),
          stderr: excerptLogs(result.stderr),
          command: result.command,
        },
        { status: 500 }
      )
    }

    const parsedPayload = parseLastJsonLine(result.stdout)
    const rawLogs = `${result.stdout}\n${result.stderr}`
    const sheetUrlFromPayload = typeof parsedPayload?.sheet_url === "string" ? parsedPayload.sheet_url : null
    const sheetUrl = sheetUrlFromPayload || extractSheetUrl(rawLogs)

    if (!sheetUrl) {
      return NextResponse.json(
        {
          error: "Outlier scan completed but no Google Sheet URL was detected.",
          stdout: excerptLogs(result.stdout),
          stderr: excerptLogs(result.stderr),
        },
        { status: 500 }
      )
    }

    const { data: newBalance, error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: TOKEN_COST,
      p_type: "feature_use",
      p_description: `YouTube outlier scan (${keywords.length || "default"} keywords)`,
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
      sheetUrl,
      stats: parsedPayload || null,
      durationMs: result.durationMs,
      balance: newBalance,
      deducted: TOKEN_COST,
      stdout: excerptLogs(result.stdout),
      stderr: excerptLogs(result.stderr),
    })
  } catch (error) {
    console.error("YouTube outliers route error:", error)
    const message = error instanceof Error ? error.message : "Failed to run YouTube outlier scan"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
