import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import { decryptSocialToken } from "@/app/lib/security/server"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"

interface LinkedInCredentials {
  accessToken: string
  accountId: string
}

async function getLinkedInCredentials(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<LinkedInCredentials | null> {
  const { data: connectionRaw } = await supabase
    .from("social_connections")
    .select("access_token_encrypted, account_id")
    .eq("user_id", userId)
    .eq("platform", "linkedin")
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

async function fetchLinkedInMetrics(accessToken: string, accountId: string) {
  // Fetch profile statistics
  const profileRes = await fetch(
    `https://api.linkedin.com/v2/networkSizes/${accountId}?edgeType=CompanyFollowedByMember`,
    { headers: { Authorization: `Bearer ${accessToken}`, "X-Restli-Protocol-Version": "2.0.0" } }
  )
  const followers = profileRes.ok ? (await profileRes.json()).firstDegreeSize || 0 : 0

  // Fetch recent post activity
  const postsRes = await fetch(
    `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${encodeURIComponent(accountId)})&count=25`,
    { headers: { Authorization: `Bearer ${accessToken}`, "X-Restli-Protocol-Version": "2.0.0" } }
  )

  let totalImpressions = 0
  let totalEngagement = 0
  let postCount = 0

  if (postsRes.ok) {
    const postsData = await postsRes.json()
    const posts = postsData.elements || []
    postCount = posts.length

    for (const post of posts) {
      const urn = post.id || post["activity~"]?.urn
      if (!urn) continue
      try {
        const statsRes = await fetch(
          `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(urn)}`,
          { headers: { Authorization: `Bearer ${accessToken}`, "X-Restli-Protocol-Version": "2.0.0" } }
        )
        if (statsRes.ok) {
          const stats = await statsRes.json()
          totalEngagement += (stats.likesSummary?.totalLikes || 0) +
            (stats.commentsSummary?.totalFirstLevelComments || 0)
        }
      } catch {
        // skip individual post errors
      }
    }
  }

  return {
    followers,
    followersChange: 0,
    impressions: totalImpressions,
    impressionsChange: 0,
    engagement: postCount > 0 ? Math.round((totalEngagement / Math.max(postCount, 1)) * 10) / 10 : 0,
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
    const rateCheck = checkRateLimit(actorId, "linkedin_insights_sync", { maxRequests: 5, windowMs: 60_000 })
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: `Rate limited. Retry in ${Math.ceil(rateCheck.retryAfterMs / 1000)}s.` }, { status: 429 })
    }

    const creds = await getLinkedInCredentials(supabase, user.id)
    if (!creds) {
      return NextResponse.json({ error: "LinkedIn not connected. Go to Settings to add your access token." }, { status: 400 })
    }

    const metrics = await fetchLinkedInMetrics(creds.accessToken, creds.accountId)

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error("LinkedIn insights sync error:", error)
    return NextResponse.json({ error: "Failed to sync LinkedIn insights" }, { status: 500 })
  }
}
