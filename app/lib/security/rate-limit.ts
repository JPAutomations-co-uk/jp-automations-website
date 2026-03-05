type RateLimitRule = {
  max: number
  windowMs: number
}

type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds: number
  remaining: number
}

declare global {
  var __jpRateLimitStore: Map<string, number[]> | undefined
}

const store = global.__jpRateLimitStore || new Map<string, number[]>()
global.__jpRateLimitStore = store

export function resolveRequestActorId(params: {
  userId?: string | null
  forwardedFor?: string | null
  fallback?: string
}): string {
  if (params.userId) return `user:${params.userId}`

  const forwarded = String(params.forwardedFor || "")
    .split(",")[0]
    ?.trim()
  if (forwarded) return `ip:${forwarded}`

  return params.fallback || "unknown"
}

export function checkRateLimit(key: string, rule: RateLimitRule): RateLimitResult {
  const now = Date.now()
  const windowStart = now - rule.windowMs
  const entries = (store.get(key) || []).filter((ts) => ts > windowStart)

  if (entries.length >= rule.max) {
    const oldest = entries[0] || now
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + rule.windowMs - now) / 1000))
    store.set(key, entries)
    return { allowed: false, retryAfterSeconds, remaining: 0 }
  }

  entries.push(now)
  store.set(key, entries)
  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, rule.max - entries.length),
  }
}
