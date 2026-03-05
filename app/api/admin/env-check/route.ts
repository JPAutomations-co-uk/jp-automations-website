import { NextResponse } from "next/server"
import { createClient } from "@/app/lib/supabase/server"
import { allowInstagramGlobalFallback, isAdminUser } from "@/app/lib/security/server"

const REQUIRED_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ANTHROPIC_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_PRO_MONTHLY",
  "STRIPE_PRICE_BUSINESS_MONTHLY",
  "STRIPE_PRICE_TOKENS_25",
  "STRIPE_PRICE_TOKENS_100",
  "STRIPE_PRICE_TOKENS_250",
  "NEXT_PUBLIC_SITE_URL",
  "PLANNER_QUALITY_V2",
  "ADMIN_EMAIL",
] as const

const RECOMMENDED_KEYS = [
  "SOCIAL_TOKEN_ENCRYPTION_KEY",
  "RESEND_API_KEY",
  "CONTACT_FROM_EMAIL",
  "CONTACT_TO_EMAIL",
  "N8N_BOOKING_WEBHOOK_URL",
  "REPLICATE_API_TOKEN",
] as const

function hasValue(key: string): boolean {
  return String(process.env[key] || "").trim().length > 0
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !isAdminUser(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const missingRequired = REQUIRED_KEYS.filter((key) => !hasValue(key))
    const missingRecommended = RECOMMENDED_KEYS.filter((key) => !hasValue(key))
    const warnings: string[] = []

    if (!hasValue("ADMIN_EMAIL") && hasValue("NEXT_PUBLIC_ADMIN_EMAIL")) {
      warnings.push("ADMIN_EMAIL is not set; server auth is falling back to NEXT_PUBLIC_ADMIN_EMAIL.")
    }

    if (process.env.NODE_ENV === "production" && allowInstagramGlobalFallback()) {
      warnings.push("Global Instagram fallback is enabled in production. Disable it for multi-tenant security.")
    }

    if (process.env.NODE_ENV === "production" && !hasValue("SOCIAL_TOKEN_ENCRYPTION_KEY")) {
      warnings.push("SOCIAL_TOKEN_ENCRYPTION_KEY is missing in production.")
    }

    return NextResponse.json({
      ready: missingRequired.length === 0,
      missingRequired,
      missingRecommended,
      warnings,
    })
  } catch (error) {
    console.error("Env check error:", error)
    return NextResponse.json({ error: "Failed to run env check" }, { status: 500 })
  }
}

