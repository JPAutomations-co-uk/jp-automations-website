import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import { decryptSocialToken } from "@/app/lib/security/server"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"

interface XCredentials {
  accessToken: string
  accountId: string
}

async function getXCredentials(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<XCredentials | null> {
  const { data: connectionRaw } = await supabase
    .from("social_connections")
    .select("access_token_encrypted, account_id")
    .eq("user_id", userId)
    .eq("platform", "x")
    .maybeSingle()

  const connection = (connectionRaw || null) as {
    access_token_encrypted?: string | null
    account_id?: string | null
  } | null

  const accessToken = decryptSocialToken(connection?.access_token_encrypted)
  const accountId = String(connection?.account_id || "").trim()

  if (!accessToken || !accountId) return null
  return { accessToken, accountId }
}

async function fetchXMetrics(accessToken: string, accountId: string) {
  // Fetch user profile with public metrics
  const userRes = await fetch(
    `https://api.twitter.com/2/users/${accountId}?user.fields=public_metrics`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  let followers = 0
  if (userRes.ok) {
    const userData = await userRes.json()
    followers = userData.data?.public_metrics?.followers_count || 0
  }

  // Fetch recent tweets with metrics
  const tweetsRes = await fetch(
    `https://api.twitter.com/2/users/${accountId}/tweets?max_results=50&tweet.fields=public_metrics,created_at`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  let totalImpressions = 0
  let totalEngagement = 0
  let postCount = 0

  if (tweetsRes.ok) {
    const tweetsData = await tweetsRes.json()
    const tweets = tweetsData.data || []
    postCount = tweets.length

    for (const tweet of tweets) {
      const pm = tweet.public_metrics || {}
      totalImpressions += pm.impression_count || 0
      totalEngagement += (pm.like_count || 0) + (pm.retweet_count || 0) + (pm.reply_count || 0) + (pm.quote_count || 0)
    }
  }

  const engagementRate = totalImpressions > 0
    ? Math.round((totalEngagement / totalImpressions) * 1000) / 10
    : 0

  return {
    followers,
    followersChange: 0,
    impressions: totalImpressions,
    impressionsChange: 0,
    engagement: engagementRate,
    engagementChange: 0,
    posts: postCount,
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const actorId = resolveRequestActorId(request, user.id)
    const rateCheck = checkRateLimit(actorId, "x_insights_sync", { maxRequests: 5, windowMs: 60_000 })
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: `Rate limited. Retry in ${Math.ceil(rateCheck.retryAfterMs / 1000)}s.` }, { status: 429 })
    }

    const creds = await getXCredentials(supabase, user.id)
    if (!creds) {
      return NextResponse.json({ error: "X not connected. Go to Settings to add your access token." }, { status: 400 })
    }

    const metrics = await fetchXMetrics(creds.accessToken, creds.accountId)

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error("X insights sync error:", error)
    return NextResponse.json({ error: "Failed to sync X insights" }, { status: 500 })
  }
}
