import fs from "node:fs"
import path from "node:path"

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, "utf8")
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const idx = trimmed.indexOf("=")
    if (idx <= 0) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

loadDotEnv(path.resolve(process.cwd(), ".env.local"))

const REQUIRED = [
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
]

const RECOMMENDED = [
  "SOCIAL_TOKEN_ENCRYPTION_KEY",
  "RESEND_API_KEY",
  "CONTACT_FROM_EMAIL",
  "CONTACT_TO_EMAIL",
  "N8N_BOOKING_WEBHOOK_URL",
  "REPLICATE_API_TOKEN",
  "APIFY_API_TOKEN",
]

function missing(keys) {
  return keys.filter((key) => !String(process.env[key] || "").trim())
}

const missingRequired = missing(REQUIRED)
const missingRecommended = missing(RECOMMENDED)
const LOCAL_SKILL_KEYS = [
  "LOCAL_SKILLS_WORKSPACE_ROOT",
  "LOCAL_SKILLS_WEBSITE_ROOT",
  "LOCAL_SKILLS_PYTHON_BIN",
]
const missingLocalSkillKeys = process.env.ENABLE_LOCAL_SKILLS_BRIDGE === "1"
  ? missing(LOCAL_SKILL_KEYS)
  : []

if (missingRequired.length > 0) {
  console.error("Missing required env vars:")
  for (const key of missingRequired) console.error(`- ${key}`)
}

if (missingRecommended.length > 0) {
  console.warn("Missing recommended env vars:")
  for (const key of missingRecommended) console.warn(`- ${key}`)
}

if (missingLocalSkillKeys.length > 0) {
  console.warn("Local skills bridge is enabled but some bridge vars are missing:")
  for (const key of missingLocalSkillKeys) console.warn(`- ${key}`)
}

if (process.env.NODE_ENV === "production" && process.env.INSTAGRAM_GLOBAL_FALLBACK_ENABLED === "1") {
  console.warn("INSTAGRAM_GLOBAL_FALLBACK_ENABLED=1 is not recommended for production.")
}

if (missingRequired.length > 0) {
  process.exitCode = 1
} else {
  console.log("Required env vars are present.")
}
