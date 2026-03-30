import { NextRequest, NextResponse } from "next/server"

import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"
import { createClient } from "@/app/lib/supabase/server"

export const runtime = "nodejs"

function sanitizeFilename(raw: string): string {
  const base = String(raw || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")

  if (!base) return `upload-${Date.now()}.bin`
  return base
}

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
      fallback: "media-upload-url",
    })

    const rate = checkRateLimit(`media-upload-url:${actorId}`, {
      max: 120,
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

    const body = (await request.json().catch(() => ({}))) as {
      filename?: string
      mimeType?: string
      bucket?: string
    }

    const filename = sanitizeFilename(String(body.filename || ""))
    const mimeType = String(body.mimeType || "application/octet-stream").trim().toLowerCase()

    const ALLOWED_MIME_TYPES = [
      "image/jpeg", "image/png", "image/webp", "image/gif",
      "video/mp4", "video/quicktime", "video/webm",
      "audio/mpeg", "audio/wav", "audio/mp4",
      "application/octet-stream", "application/json",
    ]

    if (mimeType.length > 128 || !ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: "Unsupported file type.", allowed: ALLOWED_MIME_TYPES }, { status: 400 })
    }

    const bucket = String(body.bucket || process.env.REEL_EDIT_INPUT_BUCKET || process.env.REEL_MEDIA_BUCKET || "reel-media").trim()

    const datePrefix = new Date().toISOString().slice(0, 10)
    const assetKey = `reel-inputs/${user.id}/${datePrefix}/${Date.now()}-${filename}`

    let { data, error } = await admin.storage.from(bucket).createSignedUploadUrl(assetKey)
    if (error && String(error.message || "").includes("related resource does not exist")) {
      // Self-heal missing bucket in fresh environments.
      await admin.storage.createBucket(bucket).catch(() => null)
      const retry = await admin.storage.from(bucket).createSignedUploadUrl(assetKey)
      data = retry.data
      error = retry.error
    }
    if (error || !data) {
      const message = String(error?.message || error || "Failed to create signed upload URL")
      return NextResponse.json({ error: message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      bucket,
      assetKey: data.path || assetKey,
      signedUrl: data.signedUrl,
      token: data.token,
      mimeType,
      expiresInSec: 2 * 60 * 60,
    })
  } catch (error) {
    console.error("Upload URL route error:", error)
    const message = error instanceof Error ? error.message : "Failed to create upload URL"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
