import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

const FEATURE_COSTS: Record<string, number> = {
  content_plan: 25,
  ai_reel: 15,
  carousel: 10,
  single_image: 5,
  seo_caption: 5,
  highlight_cover: 3,
  editing: 2,
  reel_regen: 3,
  image_regen: 2,
  caption_regen: 1,
  ad_carousel: 15,
  ad_single: 8,
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { feature } = await request.json()
  const cost = FEATURE_COSTS[feature]

  if (!cost) {
    return NextResponse.json(
      { error: "Invalid feature", valid_features: Object.keys(FEATURE_COSTS) },
      { status: 400 }
    )
  }

  const admin = createAdminClient()

  try {
    const { data: newBalance, error } = await admin.rpc("debit_tokens", {
      p_user_id: user.id,
      p_amount: cost,
      p_type: "feature_use",
      p_description: `Used ${feature.replace(/_/g, " ")}`,
    })

    if (error) throw error

    return NextResponse.json({ balance: newBalance, deducted: cost })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes("Insufficient")) {
      return NextResponse.json(
        { error: "Insufficient tokens", balance_needed: cost },
        { status: 402 }
      )
    }
    console.error("Token deduction error:", err)
    return NextResponse.json({ error: "Failed to deduct tokens" }, { status: 500 })
  }
}
