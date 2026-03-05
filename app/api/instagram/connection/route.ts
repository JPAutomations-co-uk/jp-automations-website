import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import {
  encryptSocialToken,
  hasSocialTokenEncryptionKey,
} from "@/app/lib/security/server"

type ConnectionBody = {
  accessToken?: string
  businessAccountId?: string
  tokenExpiresAt?: string | null
}

function cleanText(value: unknown, maxLen: number): string {
  return String(value || "").trim().slice(0, maxLen)
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: rowRaw, error } = await supabase
      .from("social_connections")
      .select("account_id, token_expires_at, connected_at, updated_at")
      .eq("user_id", user.id)
      .eq("platform", "instagram")
      .maybeSingle()

    if (error) throw error

    const row = (rowRaw || null) as {
      account_id?: string | null
      token_expires_at?: string | null
      connected_at?: string | null
      updated_at?: string | null
    } | null

    return NextResponse.json({
      connected: Boolean(row),
      connection: row
        ? {
            businessAccountId: row.account_id || null,
            tokenExpiresAt: row.token_expires_at || null,
            connectedAt: row.connected_at || null,
            updatedAt: row.updated_at || null,
          }
        : null,
    })
  } catch (error) {
    console.error("Instagram connection fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch connection" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = (await request.json()) as ConnectionBody
    const accessToken = cleanText(body.accessToken, 3000)
    const businessAccountId = cleanText(body.businessAccountId, 120)
    const tokenExpiresAt = cleanText(body.tokenExpiresAt, 60)

    if (!accessToken || !businessAccountId) {
      return NextResponse.json(
        { error: "accessToken and businessAccountId are required" },
        { status: 400 }
      )
    }

    if (process.env.NODE_ENV === "production" && !hasSocialTokenEncryptionKey()) {
      return NextResponse.json(
        { error: "SOCIAL_TOKEN_ENCRYPTION_KEY is required in production." },
        { status: 500 }
      )
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
          platform: "instagram",
          account_id: businessAccountId,
          access_token_encrypted: storedToken,
          token_expires_at: tokenExpiresAt || null,
          updated_at: new Date().toISOString(),
        } as never,
        { onConflict: "user_id,platform" } as never
      )

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Instagram connection save error:", error)
    return NextResponse.json({ error: "Failed to save connection" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { error } = await supabase
      .from("social_connections")
      .delete()
      .eq("user_id", user.id)
      .eq("platform", "instagram")

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Instagram connection delete error:", error)
    return NextResponse.json({ error: "Failed to delete connection" }, { status: 500 })
  }
}

