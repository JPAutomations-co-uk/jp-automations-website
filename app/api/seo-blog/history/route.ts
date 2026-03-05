import { NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: blogs, error } = await supabase
      .from("seo_blogs")
      .select("id, target_keyword, location, title, word_count, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      // Table may not exist yet — return empty list gracefully
      console.warn("seo_blogs query error (table may not exist):", error.message)
      return NextResponse.json({ blogs: [] })
    }

    return NextResponse.json({ blogs: blogs || [] })
  } catch (error) {
    console.error("SEO blog history error:", error)
    return NextResponse.json({ blogs: [] })
  }
}
