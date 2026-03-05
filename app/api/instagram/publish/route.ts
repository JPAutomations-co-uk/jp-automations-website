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

interface GeneratedAsset {
  id: string
  url: string
  asset_type: "image" | "carousel" | "video" | string
  created_at?: string | null
}

function extractBusinessAccountId(raw: string | null): string {
  if (!raw) return ""
  try {
    const parsed = JSON.parse(raw) as { businessAccountId?: string }
    return parsed.businessAccountId || ""
  } catch {
    return ""
  }
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

  const tokenFromConnection = decryptSocialToken(connection?.access_token_encrypted)
  const accountIdFromConnection = String(connection?.account_id || "").trim()

  if (tokenFromConnection && accountIdFromConnection) {
    return {
      accessToken: tokenFromConnection,
      businessAccountId: accountIdFromConnection,
    }
  }

  if (!allowInstagramGlobalFallback()) return null

  const token = String(process.env.INSTAGRAM_ACCESS_TOKEN || "").trim()
  const businessAccountId = String(
    extractBusinessAccountId(process.env.INSTAGRAM_CONNECTION_JSON || null) ||
    process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ||
    ""
  ).trim()

  if (!token || !businessAccountId) return null

  return {
    accessToken: token,
    businessAccountId,
  }
}

function buildCaption(post: {
  caption_hook?: string | null
  caption_body?: string | null
  hashtags?: string[] | null
}): string {
  const tags = (post.hashtags || []).map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)).join(" ")
  return `${post.caption_hook || ""}\n\n${post.caption_body || ""}\n\n${tags}`.trim()
}

async function createImageContainer(params: {
  businessAccountId: string
  accessToken: string
  imageUrl: string
  caption: string
  isCarouselItem?: boolean
}): Promise<string> {
  const { businessAccountId, accessToken, imageUrl, caption, isCarouselItem } = params

  const containerUrl = new URL(`https://graph.facebook.com/v19.0/${businessAccountId}/media`)
  containerUrl.searchParams.set("image_url", imageUrl)
  if (isCarouselItem) {
    containerUrl.searchParams.set("is_carousel_item", "true")
  } else {
    containerUrl.searchParams.set("caption", caption)
  }
  containerUrl.searchParams.set("access_token", accessToken)

  const response = await fetch(containerUrl.toString(), { method: "POST" })
  const data = (await response.json()) as { id?: string; error?: { message?: string } }

  if (!response.ok || data.error || !data.id) {
    throw new Error(data.error?.message || "Failed to create Instagram media container")
  }

  return data.id
}

async function createCarouselContainer(params: {
  businessAccountId: string
  accessToken: string
  childIds: string[]
  caption: string
}): Promise<string> {
  const { businessAccountId, accessToken, childIds, caption } = params

  const url = new URL(`https://graph.facebook.com/v19.0/${businessAccountId}/media`)
  url.searchParams.set("media_type", "CAROUSEL")
  url.searchParams.set("children", childIds.join(","))
  url.searchParams.set("caption", caption)
  url.searchParams.set("access_token", accessToken)

  const response = await fetch(url.toString(), { method: "POST" })
  const data = (await response.json()) as { id?: string; error?: { message?: string } }

  if (!response.ok || data.error || !data.id) {
    throw new Error(data.error?.message || "Failed to create Instagram carousel container")
  }

  return data.id
}

async function publishContainer(params: {
  businessAccountId: string
  accessToken: string
  containerId: string
}): Promise<string> {
  const { businessAccountId, accessToken, containerId } = params

  const publishUrl = new URL(`https://graph.facebook.com/v19.0/${businessAccountId}/media_publish`)
  publishUrl.searchParams.set("creation_id", containerId)
  publishUrl.searchParams.set("access_token", accessToken)

  const response = await fetch(publishUrl.toString(), { method: "POST" })
  const data = (await response.json()) as { id?: string; error?: { message?: string } }

  if (!response.ok || data.error || !data.id) {
    throw new Error(data.error?.message || "Failed to publish Instagram media")
  }

  return data.id
}

async function fetchPermalink(mediaId: string, accessToken: string): Promise<string | null> {
  const permalinkUrl = new URL(`https://graph.facebook.com/v19.0/${mediaId}`)
  permalinkUrl.searchParams.set("fields", "permalink")
  permalinkUrl.searchParams.set("access_token", accessToken)

  const response = await fetch(permalinkUrl.toString())
  if (!response.ok) return null

  const data = (await response.json()) as { permalink?: string }
  return data.permalink || null
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
      fallback: "instagram-publish",
    })
    const rate = checkRateLimit(`instagram-publish:${actorId}`, {
      max: 10,
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

    const body = (await request.json()) as { postId?: string }
    const postId = body.postId

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const { data: postRaw, error: postError } = await supabase
      .from("posts")
      .select("*, generated_assets(*)")
      .eq("id", postId)
      .eq("user_id", user.id)
      .single()

    const post = postRaw as {
      id: string
      status: string
      caption_hook?: string | null
      caption_body?: string | null
      hashtags?: string[] | null
      generated_assets?: GeneratedAsset[]
    } | null

    if (postError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (post.status === "published") {
      return NextResponse.json(
        { error: "Post is already published" },
        { status: 400 }
      )
    }

    const credentials = await getInstagramCredentials(supabase, user.id)
    if (!credentials) {
      return NextResponse.json(
        { error: "Instagram credentials not found. Please connect your account." },
        { status: 400 }
      )
    }

    const caption = buildCaption(post)
    const assets = ((post.generated_assets || []) as GeneratedAsset[]).slice().sort((a, b) => {
      const aCreated = a.created_at ? new Date(a.created_at).getTime() : 0
      const bCreated = b.created_at ? new Date(b.created_at).getTime() : 0
      return aCreated - bCreated
    })

    if (assets.length === 0) {
      return NextResponse.json(
        { error: "No media assets found for this post" },
        { status: 400 }
      )
    }

    let containerId = ""

    if (assets.length === 1 && assets[0].asset_type === "image") {
      containerId = await createImageContainer({
        businessAccountId: credentials.businessAccountId,
        accessToken: credentials.accessToken,
        imageUrl: assets[0].url,
        caption,
      })
    } else {
      const imageAssets = assets.filter((asset: GeneratedAsset) => asset.url && (asset.asset_type === "image" || asset.asset_type === "carousel"))
      if (imageAssets.length < 2) {
        return NextResponse.json(
          { error: "Carousel publishing requires at least 2 image assets" },
          { status: 400 }
        )
      }

      const childIds: string[] = []
      for (const asset of imageAssets) {
        const childId = await createImageContainer({
          businessAccountId: credentials.businessAccountId,
          accessToken: credentials.accessToken,
          imageUrl: asset.url,
          caption,
          isCarouselItem: true,
        })
        childIds.push(childId)
      }

      containerId = await createCarouselContainer({
        businessAccountId: credentials.businessAccountId,
        accessToken: credentials.accessToken,
        childIds,
        caption,
      })
    }

    const mediaId = await publishContainer({
      businessAccountId: credentials.businessAccountId,
      accessToken: credentials.accessToken,
      containerId,
    })

    const permalink = await fetchPermalink(mediaId, credentials.accessToken)

    const { error: updateError } = await supabase
      .from("posts")
      .update({
        status: "published",
        instagram_media_id: mediaId,
        instagram_permalink: permalink,
        published_at: new Date().toISOString(),
      } as never)
      .eq("id", postId)
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Failed to update post status after publish:", updateError)
    }

    return NextResponse.json({
      success: true,
      mediaId,
      permalink,
    })
  } catch (error) {
    console.error("Instagram publish route error:", error)
    const message = error instanceof Error ? error.message : "Failed to publish to Instagram"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
