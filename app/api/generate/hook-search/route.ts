import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { checkRateLimit, resolveRequestActorId } from "@/app/lib/security/rate-limit"

const TOKEN_COST = 3
const MAX_HASHTAGS = 3
const RESULTS_PER_HASHTAG = 20
const MAX_REELS_RETURNED = 15

function getAnthropic(): Anthropic {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

function cleanCaption(raw: unknown): string {
  if (typeof raw !== "string") return ""
  return raw.replace(/\s+/g, " ").trim().slice(0, 1000)
}

// Call Apify instagram-hashtag-scraper and return raw items
async function fetchApifyReels(hashtags: string[]): Promise<unknown[]> {
  const token = process.env.APIFY_API_TOKEN
  if (!token) throw new Error("APIFY_API_TOKEN not configured")

  const url = `https://api.apify.com/v2/acts/apify~instagram-hashtag-scraper/run-sync-get-dataset-items?token=${token}&timeout=60&memory=512`

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      hashtags,
      resultsLimit: RESULTS_PER_HASHTAG,
    }),
    signal: AbortSignal.timeout(90_000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Apify error ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  return Array.isArray(data) ? data : []
}

// Extract hooks from captions using claude-haiku in one batched call
async function extractHooks(captions: string[]): Promise<string[]> {
  if (captions.length === 0) return []

  const captionList = captions.map((c, i) => `${i + 1}. ${c}`).join("\n\n")

  const message = await getAnthropic().messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Extract the hook from each Instagram post caption below.
The hook = the first 1-2 sentences that appear BEFORE any hashtags, bullet separators, or large emoji breaks.
It should be the scroll-stopping opener — usually 8-30 words.
If no clear hook exists, take the first meaningful sentence.
Remove any leading emojis that are purely decorative (keep emojis that are part of the sentence).

Return a JSON array of strings in the same order as the input. Nothing else — no markdown fences.
Example: ["hook one here", "hook two here"]

CAPTIONS:
${captionList}`,
      },
    ],
  })

  const text = message.content[0]?.type === "text" ? message.content[0].text.trim() : "[]"

  try {
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) {
      return parsed.map((h) => (typeof h === "string" ? h.trim().slice(0, 220) : ""))
    }
  } catch {
    // Fall through — return captions truncated as fallback hooks
  }

  // Fallback: take first sentence of each caption
  return captions.map((c) => c.split(/[.!?]/)[0]?.trim().slice(0, 220) ?? "")
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const admin = createAdminClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const actorId = resolveRequestActorId({
      userId: user.id,
      forwardedFor: request.headers.get("x-forwarded-for"),
      fallback: "hook-search",
    })

    const rate = checkRateLimit(`hook-search:${actorId}`, { max: 5, windowMs: 60_000 })
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

    const body = (await request.json()) as Record<string, unknown>

    const rawHashtags = Array.isArray(body.hashtags) ? body.hashtags : []
    const hashtags = rawHashtags
      .map((h) => String(h).replace(/^#/, "").trim().toLowerCase())
      .filter(Boolean)
      .slice(0, MAX_HASHTAGS)

    if (hashtags.length === 0) {
      return NextResponse.json({ error: "At least one hashtag is required" }, { status: 400 })
    }

    // Scrape Apify
    let rawItems: unknown[]
    try {
      rawItems = await fetchApifyReels(hashtags)
    } catch (err) {
      console.error("Apify fetch error:", err)
      return NextResponse.json(
        { error: "Failed to fetch Instagram data. Please try again." },
        { status: 502 }
      )
    }

    // Normalise items
    const normalised = rawItems
      .map((item) => {
        const i = item as Record<string, unknown>
        return {
          caption: cleanCaption(i.caption ?? i.text ?? i.ownerFullName),
          viewCount: Number(i.videoViewCount ?? i.videoPlayCount ?? i.likesCount ?? 0),
          likesCount: Number(i.likesCount ?? 0),
          username: String(i.ownerUsername ?? i.username ?? ""),
          url: String(i.url ?? i.shortCode ? `https://www.instagram.com/p/${i.shortCode}/` : ""),
        }
      })
      .filter((i) => i.caption.length > 20)

    // Sort by view count desc, take top N
    normalised.sort((a, b) => b.viewCount - a.viewCount)
    const top = normalised.slice(0, MAX_REELS_RETURNED)

    if (top.length === 0) {
      return NextResponse.json(
        { error: "No posts found for these hashtags. Try different ones." },
        { status: 404 }
      )
    }

    // Extract hooks via haiku
    const captions = top.map((i) => i.caption)
    const hooks = await extractHooks(captions)

    // Deduct tokens
    const { error: debitError } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: TOKEN_COST,
      p_type: "feature_use",
      p_description: `Hook search: ${hashtags.map((h) => `#${h}`).join(", ")}`,
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

    const reels = top.map((item, i) => ({
      hook: hooks[i] || item.caption.split(/[.!?]/)[0]?.trim() || item.caption.slice(0, 100),
      viewCount: item.viewCount,
      likesCount: item.likesCount,
      username: item.username,
      url: item.url,
      caption: item.caption.slice(0, 300),
    }))

    return NextResponse.json({ reels })
  } catch (error) {
    console.error("Hook search error:", error)
    return NextResponse.json({ error: "Failed to search for hooks" }, { status: 500 })
  }
}
