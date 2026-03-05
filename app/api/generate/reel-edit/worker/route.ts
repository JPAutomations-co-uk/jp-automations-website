import { NextRequest, NextResponse } from "next/server"

import { processReelEditJob } from "@/app/lib/reel-edit/worker"

export const runtime = "nodejs"

function normalize(value: string | null): string {
  return String(value || "").trim()
}

export async function POST(request: NextRequest) {
  try {
    const configuredSecret = normalize(process.env.REEL_EDIT_WORKER_SECRET || null)
    if (configuredSecret) {
      const headerSecret = normalize(request.headers.get("x-reel-worker-secret"))
      if (!headerSecret || headerSecret !== configuredSecret) {
        return NextResponse.json({ error: "Unauthorized worker request" }, { status: 401 })
      }
    }

    const body = (await request.json().catch(() => ({}))) as { jobId?: string }
    const jobId = normalize(body.jobId || null)

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 })
    }

    const result = await processReelEditJob(jobId)

    return NextResponse.json({
      ok: result.ok,
      jobId,
      status: result.status,
      error: result.error || null,
    })
  } catch (error) {
    console.error("Reel worker endpoint error:", error)
    const message = error instanceof Error ? error.message : "Reel worker execution failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
