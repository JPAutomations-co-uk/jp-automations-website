import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import {
  encryptSocialToken,
  hasSocialTokenEncryptionKey,
} from "@/app/lib/security/server"

const VALID_PLATFORMS = ["instagram", "linkedin", "x", "youtube"] as const
type Platform = (typeof VALID_PLATFORMS)[number]

type ConnectionBody = {
  platform?: string
  accessToken?: string
  accountId?: string
  tokenExpiresAt?: string | null
}

function cleanText(value: unknown, maxLen: number): string {
  return String(value || "").trim().slice(0, maxLen)
}

function isValidPlatform(p: unknown): p is Platform {
  return typeof p === "string" && VALID_PLATFORMS.includes(p as Platform)
}

/**
 * GET /api/social-connections?platform=instagram
 * Returns connection status for a specific platform, or all platforms if no platform specified.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const platformParam = request.nextUrl.searchParams.get("platform")

    if (platformParam && !isValidPlatform(platformParam)) {
      return NextResponse.json({ error: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(", ")}` }, { status: 400 })
    }

    let query = supabase
      .from("social_connections")
      .select("platform, account_id, token_expires_at, connected_at, updated_at")
      .eq("user_id", user.id)

    if (platformParam) {
      query = query.eq("platform", platformParam)
    }

    const { data: rows, error } = await query

    if (error) throw error

    if (platformParam) {
      const row = rows?.[0] || null
      return NextResponse.json({
        connected: Boolean(row),
        connection: row
          ? {
              platform: row.platform,
              accountId: row.account_id || null,
              tokenExpiresAt: row.token_expires_at || null,
              connectedAt: row.connected_at || null,
              updatedAt: row.updated_at || null,
            }
          : null,
      })
    }

    // Return all connections
    const connections = VALID_PLATFORMS.map((p) => {
      const row = rows?.find((r: { platform: string }) => r.platform === p)
      return {
        platform: p,
        connected: Boolean(row),
        accountName: row?.account_id || undefined,
        lastSynced: row?.updated_at || undefined,
      }
    })

    return NextResponse.json({ connections })
  } catch (error) {
    console.error("Social connection fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 })
  }
}

/**
 * POST /api/social-connections
 * Save or update a platform connection.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = (await request.json()) as ConnectionBody
    const platform = cleanText(body.platform, 20)
    const accessToken = cleanText(body.accessToken, 3000)
    const accountId = cleanText(body.accountId, 120)
    const tokenExpiresAt = cleanText(body.tokenExpiresAt, 60)

    if (!isValidPlatform(platform)) {
      return NextResponse.json({ error: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(", ")}` }, { status: 400 })
    }

    if (!accessToken || !accountId) {
      return NextResponse.json({ error: "accessToken and accountId are required" }, { status: 400 })
    }

    if (process.env.NODE_ENV === "production" && !hasSocialTokenEncryptionKey()) {
      return NextResponse.json({ error: "SOCIAL_TOKEN_ENCRYPTION_KEY is required in production." }, { status: 500 })
    }

    let storedToken = accessToken
    if (hasSocialTokenEncryptionKey()) {
      storedToken = encryptSocialToken(accessToken)
    }

    const { error } = await supabase
      .from("social_connections")
      .upsert(
        {
          user_id: user.id,
          platform,
          account_id: accountId,
          access_token_encrypted: storedToken,
          token_expires_at: tokenExpiresAt || null,
          updated_at: new Date().toISOString(),
        } as never,
        { onConflict: "user_id,platform" } as never
      )

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Social connection save error:", error)
    return NextResponse.json({ error: "Failed to save connection" }, { status: 500 })
  }
}

/**
 * DELETE /api/social-connections?platform=instagram
 * Remove a platform connection.
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const platform = request.nextUrl.searchParams.get("platform")
    if (!isValidPlatform(platform)) {
      return NextResponse.json({ error: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(", ")}` }, { status: 400 })
    }

    const { error } = await supabase
      .from("social_connections")
      .delete()
      .eq("user_id", user.id)
      .eq("platform", platform)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Social connection delete error:", error)
    return NextResponse.json({ error: "Failed to delete connection" }, { status: 500 })
  }
}
