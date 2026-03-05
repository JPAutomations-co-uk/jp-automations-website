import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import {
  allowInstagramGlobalFallback,
  decryptSocialToken,
} from "@/app/lib/security/server"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"

interface InstagramCredentials {
  accessToken: string
  businessAccountId: string
}

async function getInstagramCredentials(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<InstagramCredentials | null> {
  const { data: connectionRaw } = await supabase
    .from("social_connections")
    .select("access_token_encrypted, account_id")
    .eq("user_id", userId)
    .eq("platform", "instagram")
    .maybeSingle()

  const connection = (connectionRaw || null) as {
    access_token_encrypted?: string | null
    account_id?: string | null
  } | null

  const accessTokenFromConnection = decryptSocialToken(connection?.access_token_encrypted)
  const businessAccountIdFromConnection = String(connection?.account_id || "").trim()

  if (accessTokenFromConnection && businessAccountIdFromConnection) {
    return {
      accessToken: accessTokenFromConnection,
      businessAccountId: businessAccountIdFromConnection,
    }
  }

  if (!allowInstagramGlobalFallback()) return null

  const fallbackToken = String(process.env.INSTAGRAM_ACCESS_TOKEN || "").trim()
  const fallbackBusinessAccountId = String(process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || "").trim()
  if (!fallbackToken || !fallbackBusinessAccountId) return null

  return {
    accessToken: fallbackToken,
    businessAccountId: fallbackBusinessAccountId,
  }
}

async function fetchMediaInsights(mediaId: string, accessToken: string): Promise<{
  impressions: number
  reach: number
  likes: number
  comments: number
  saves: number
  shares: number
  profile_visits: number
  follows: number
}> {
  const defaultMetrics = {
    impressions: 0,
    reach: 0,
    likes: 0,
    comments: 0,
    saves: 0,
    shares: 0,
    profile_visits: 0,
    follows: 0,
  }

  const insightsUrl = new URL(`https://graph.facebook.com/v19.0/${mediaId}/insights`)
  insightsUrl.searchParams.set("metric", "impressions,reach,saved,shares,profile_visits,follows")
  insightsUrl.searchParams.set("period", "lifetime")
  insightsUrl.searchParams.set("access_token", accessToken)

  const mediaUrl = new URL(`https://graph.facebook.com/v19.0/${mediaId}`)
  mediaUrl.searchParams.set("fields", "like_count,comments_count")
  mediaUrl.searchParams.set("access_token", accessToken)

  const [insightsRes, mediaRes] = await Promise.all([
    fetch(insightsUrl.toString()),
    fetch(mediaUrl.toString()),
  ])

  const insightsJson = (await insightsRes.json()) as {
    data?: Array<{ name?: string; values?: Array<{ value?: number }> }>
  }
  const mediaJson = (await mediaRes.json()) as { like_count?: number; comments_count?: number }

  const valueByName = new Map<string, number>()
  for (const row of insightsJson.data || []) {
    if (!row.name) continue
    valueByName.set(row.name, Number(row.values?.[0]?.value || 0))
  }

  return {
    ...defaultMetrics,
    impressions: valueByName.get("impressions") || 0,
    reach: valueByName.get("reach") || 0,
    likes: Number(mediaJson.like_count || 0),
    comments: Number(mediaJson.comments_count || 0),
    saves: valueByName.get("saved") || 0,
    shares: valueByName.get("shares") || 0,
    profile_visits: valueByName.get("profile_visits") || 0,
    follows: valueByName.get("follows") || 0,
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const actorId = resolveRequestActorId({
      userId: user.id,
      forwardedFor: request.headers.get("x-forwarded-for"),
      fallback: "instagram-insights-sync",
    })
    const rate = checkRateLimit(`instagram-insights-sync:${actorId}`, {
      max: 5,
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

    const body = (await request.json().catch(() => ({}))) as { since?: string }
    const since = body.since && /^\d{4}-\d{2}-\d{2}$/.test(body.since)
      ? body.since
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

    const credentials = await getInstagramCredentials(supabase, user.id)
    if (!credentials) {
      return NextResponse.json(
        { error: "Instagram credentials not found. Please connect your account." },
        { status: 400 }
      )
    }

    const { data: postsRaw, error: postsError } = await supabase
      .from("posts")
      .select("id, instagram_media_id, published_at")
      .eq("user_id", user.id)
      .eq("status", "published")
      .not("instagram_media_id", "is", null)
      .gte("published_at", `${since}T00:00:00.000Z`)

    if (postsError) {
      throw postsError
    }

    const posts = (postsRaw || []) as Array<{
      id: string
      instagram_media_id: string | null
      published_at: string | null
    }>

    const metricDate = new Date().toISOString().slice(0, 10)
    let synced = 0

    for (const post of posts || []) {
      if (!post.instagram_media_id) continue

      const metrics = await fetchMediaInsights(post.instagram_media_id, credentials.accessToken)
      const reach = Math.max(metrics.reach, 1)
      const engagementRate = (metrics.likes + metrics.comments + metrics.saves + metrics.shares) / reach

      const { error: upsertError } = await supabase
        .from("instagram_media_insights_daily")
        .upsert(
          {
            user_id: user.id,
            post_id: post.id,
            instagram_media_id: post.instagram_media_id,
            metric_date: metricDate,
            impressions: metrics.impressions,
            reach: metrics.reach,
            likes: metrics.likes,
            comments: metrics.comments,
            saves: metrics.saves,
            shares: metrics.shares,
            profile_visits: metrics.profile_visits,
            follows: metrics.follows,
            engagement_rate: engagementRate,
          } as never,
          {
            onConflict: "instagram_media_id,metric_date",
          } as never,
        )

      if (upsertError) {
        console.error("Failed to upsert media insight", upsertError)
        continue
      }

      synced += 1
    }

    return NextResponse.json({
      success: true,
      syncedCount: synced,
      metricDate,
    })
  } catch (error) {
    console.error("Instagram insights sync error:", error)
    return NextResponse.json(
      { error: "Failed to sync Instagram insights" },
      { status: 500 }
    )
  }
}
