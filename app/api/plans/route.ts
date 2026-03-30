import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

// GET — Fetch the user's most recent LinkedIn content plan
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data: plan, error } = await admin
      .from("content_plans")
      .select("id, month, industry, target_audience, goals, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !plan) {
      return NextResponse.json({ plan: null })
    }

    // Fetch posts for this plan
    const { data: posts } = await admin
      .from("posts")
      .select("id, date, day_of_week, format, funnel_stage, pillar, topic, caption_hook, caption_body, hashtags, posting_time, status, meta")
      .eq("plan_id", plan.id)
      .order("date", { ascending: true })

    return NextResponse.json({
      plan: {
        ...plan,
        posts: (posts || []).map((p) => ({
          id: p.id,
          date: p.date,
          dayOfWeek: p.day_of_week || "",
          title: p.topic || "",
          description: (p.meta as Record<string, unknown>)?.description || "",
          format: p.format,
          funnel_stage: p.funnel_stage || "TOFU",
          pillar: p.pillar || "",
          caption_hook: p.caption_hook || "",
          caption_body: p.caption_body || "",
          posting_time: p.posting_time || "",
          hashtags: p.hashtags || [],
          why_it_works: (p.meta as Record<string, unknown>)?.why_it_works || "",
          engagement_tip: (p.meta as Record<string, unknown>)?.engagement_tip || "",
          status: p.status,
          hasFullPost: !!p.caption_body,
        })),
      },
    })
  } catch (error) {
    console.error("Plans GET error:", error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}

// POST — Save a new content plan with posts
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan } = await request.json()
    if (!plan || !plan.posts) {
      return NextResponse.json({ error: "Plan data is required" }, { status: 400 })
    }

    const admin = createAdminClient()

    // Insert the plan
    const { data: planRow, error: planError } = await admin
      .from("content_plans")
      .insert({
        user_id: user.id,
        month: plan.month || new Date().toISOString().slice(0, 7),
        goals: plan.monthTheme || null,
      } as never)
      .select("id")
      .single()

    if (planError || !planRow) {
      console.error("Plan insert error:", planError)
      return NextResponse.json({ error: "Failed to save plan" }, { status: 500 })
    }

    // Insert posts
    const postRows = (plan.posts as Array<Record<string, unknown>>).map((post) => ({
      user_id: user.id,
      plan_id: planRow.id,
      date: post.date || new Date().toISOString().slice(0, 10),
      day_of_week: post.dayOfWeek || null,
      format: post.format || "Text Post",
      funnel_stage: post.funnel_stage || "TOFU",
      pillar: post.pillar || null,
      topic: post.title || null,
      caption_hook: post.caption_hook || null,
      posting_time: post.posting_time || null,
      hashtags: post.hashtags || [],
      status: "draft" as const,
      meta: {
        description: post.description || "",
        why_it_works: post.why_it_works || "",
        engagement_tip: post.engagement_tip || "",
      },
    }))

    const { error: postsError } = await admin
      .from("posts")
      .insert(postRows as never[])

    if (postsError) {
      console.error("Posts insert error:", postsError)
      // Plan was created but posts failed — non-critical
    }

    return NextResponse.json({ planId: planRow.id, postsInserted: postRows.length })
  } catch (error) {
    console.error("Plans POST error:", error)
    return NextResponse.json({ error: "Failed to save plan" }, { status: 500 })
  }
}
