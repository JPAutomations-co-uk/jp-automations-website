import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import { decryptSocialToken } from "@/app/lib/security/server"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"

interface YouTubeCredentials {
  accessToken: string
  channelId: string
}

async function getYouTubeCredentials(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<YouTubeCredentials | null> {
  const { data: connectionRaw } = await supabase
    .from("social_connections")
    .select("access_token_encrypted, account_id")
    .eq("user_id", userId)
    .eq("platform", "youtube")
    .maybeSingle()

  const connection = (connectionRaw || null) as {
    access_token_encrypted?: string | null
    account_id?: string | null
  } | null

  const accessToken = decryptSocialToken(connection?.access_token_encrypted)
  const channelId = String(connection?.account_id || "").trim()

  if (!accessToken || !channelId) return null
  return { accessToken, channelId }
}

async function fetchYouTubeMetrics(accessToken: string, channelId: string) {
  // Fetch channel statistics
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${process.env.GOOGLE_API_KEY || ""}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  let subscribers = 0
  let totalViews = 0
  let totalVideos = 0

  if (channelRes.ok) {
    const channelData = await channelRes.json()
    const stats = channelData.items?.[0]?.statistics || {}
    subscribers = parseInt(stats.subscriberCount || "0", 10)
    totalViews = parseInt(stats.viewCount || "0", 10)
    totalVideos = parseInt(stats.videoCount || "0", 10)
  }

  // Fetch recent videos for engagement data
  const videosRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&order=date&type=video&maxResults=25`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  let totalLikes = 0
  let totalComments = 0
  let recentViews = 0
  let videoCount = 0

  if (videosRes.ok) {
    const videosData = await videosRes.json()
    const videoIds = (videosData.items || []).map((v: { id: { videoId: string } }) => v.id.videoId).filter(Boolean)

    if (videoIds.length > 0) {
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(",")}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        for (const item of statsData.items || []) {
          const s = item.statistics || {}
          totalLikes += parseInt(s.likeCount || "0", 10)
          totalComments += parseInt(s.commentCount || "0", 10)
          recentViews += parseInt(s.viewCount || "0", 10)
          videoCount++
        }
      }
    }
  }

  const engagementRate = recentViews > 0
    ? Math.round(((totalLikes + totalComments) / recentViews) * 1000) / 10
    : 0

  return {
    followers: subscribers,
    followersChange: 0,
    impressions: recentViews,
    impressionsChange: 0,
    engagement: engagementRate,
    engagementChange: 0,
    posts: videoCount,
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const actorId = resolveRequestActorId(request, user.id)
    const rateCheck = checkRateLimit(actorId, "youtube_insights_sync", { maxRequests: 5, windowMs: 60_000 })
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: `Rate limited. Retry in ${Math.ceil(rateCheck.retryAfterMs / 1000)}s.` }, { status: 429 })
    }

    const creds = await getYouTubeCredentials(supabase, user.id)
    if (!creds) {
      return NextResponse.json({ error: "YouTube not connected. Go to Settings to add your access token." }, { status: 400 })
    }

    const metrics = await fetchYouTubeMetrics(creds.accessToken, creds.channelId)

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error("YouTube insights sync error:", error)
    return NextResponse.json({ error: "Failed to sync YouTube insights" }, { status: 500 })
  }
}
