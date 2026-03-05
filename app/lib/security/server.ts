import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto"

const ENCRYPTED_PREFIX = "enc:v1:"

function readKeyMaterial(raw: string): Buffer | null {
  const input = raw.trim()
  if (!input) return null

  // Support 32-byte base64 keys and 64-char hex keys.
  if (/^[A-Fa-f0-9]{64}$/.test(input)) {
    return Buffer.from(input, "hex")
  }

  try {
    const decoded = Buffer.from(input, "base64")
    if (decoded.length === 32) return decoded
  } catch {
    // Fall through.
  }

  return null
}

function getSocialTokenKey(): Buffer | null {
  const raw = process.env.SOCIAL_TOKEN_ENCRYPTION_KEY || ""
  return readKeyMaterial(raw)
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production"
}

export function hasSocialTokenEncryptionKey(): boolean {
  return getSocialTokenKey() !== null
}

export function getAdminEmail(): string {
  return String(process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "")
    .trim()
    .toLowerCase()
}

export function isAdminUser(email: string | null | undefined): boolean {
  const configured = getAdminEmail()
  if (!configured || !email) return false
  return email.trim().toLowerCase() === configured
}

export function allowInstagramGlobalFallback(): boolean {
  if (process.env.INSTAGRAM_GLOBAL_FALLBACK_ENABLED === "1") return true
  return !isProduction()
}

export function encryptSocialToken(plainText: string): string {
  const key = getSocialTokenKey()
  if (!key) {
    throw new Error("SOCIAL_TOKEN_ENCRYPTION_KEY is required for token encryption")
  }

  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key, iv)
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  const payload = Buffer.concat([iv, tag, encrypted]).toString("base64")
  return `${ENCRYPTED_PREFIX}${payload}`
}

export function decryptSocialToken(value: string | null | undefined): string {
  const token = String(value || "").trim()
  if (!token) return ""

  // Backward compatibility for existing plaintext tokens in non-production.
  if (!token.startsWith(ENCRYPTED_PREFIX)) {
    if (process.env.ALLOW_PLAINTEXT_SOCIAL_TOKENS === "1" || !isProduction()) {
      return token
    }
    return ""
  }

  const key = getSocialTokenKey()
  if (!key) return ""

  try {
    const encoded = token.slice(ENCRYPTED_PREFIX.length)
    const data = Buffer.from(encoded, "base64")
    const iv = data.subarray(0, 12)
    const tag = data.subarray(12, 28)
    const encrypted = data.subarray(28)

    const decipher = createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(tag)
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return decrypted.toString("utf8")
  } catch {
    return ""
  }
}
