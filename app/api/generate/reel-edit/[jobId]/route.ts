import { NextRequest, NextResponse } from "next/server"

import { createClient } from "@/app/lib/supabase/server"

export const runtime = "nodejs"

export async function GET(
  _request: NextRequest,
  context: { params: { jobId: string } | Promise<{ jobId: string }> }
) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobId } = await Promise.resolve(context.params)
    const normalizedJobId = String(jobId || "").trim()
    if (!normalizedJobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 })
    }

    const { data, error } = await (supabase as any)
      .from("reel_edit_jobs")
      .select(
        "id, mode, status, progress, runtime, logs_excerpt, error_message, output_url, output_asset_key, thumbnail_url, thumbnail_asset_key, deducted_tokens, refunded, created_at, updated_at, started_at, completed_at, failed_at"
      )
      .eq("id", normalizedJobId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({
      ok: true,
      jobId: data.id,
      mode: data.mode,
      status: data.status,
      progress: Number(data.progress || 0),
      runtime: data.runtime,
      logs: String(data.logs_excerpt || ""),
      error: data.error_message ? String(data.error_message) : null,
      outputUrl: data.output_url ? String(data.output_url) : null,
      outputAssetKey: data.output_asset_key ? String(data.output_asset_key) : null,
      thumbnailUrl: data.thumbnail_url ? String(data.thumbnail_url) : null,
      thumbnailAssetKey: data.thumbnail_asset_key ? String(data.thumbnail_asset_key) : null,
      deducted: Number(data.deducted_tokens || 0),
      refunded: Boolean(data.refunded),
      timestamps: {
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        startedAt: data.started_at,
        completedAt: data.completed_at,
        failedAt: data.failed_at,
      },
    })
  } catch (error) {
    console.error("Reel job status route error:", error)
    const message = error instanceof Error ? error.message : "Failed to get reel job status"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
