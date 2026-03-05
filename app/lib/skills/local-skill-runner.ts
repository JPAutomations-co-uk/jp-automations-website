import { spawn } from "node:child_process"
import path from "node:path"

export const LOCAL_SKILLS_ENABLED = process.env.ENABLE_LOCAL_SKILLS_BRIDGE === "1"
export const LOCAL_SKILLS_WORKSPACE_ROOT = (
  process.env.LOCAL_SKILLS_WORKSPACE_ROOT || "/Users/jp/VS Code Workspace"
).trim()
export const LOCAL_SKILLS_WEBSITE_ROOT = (
  process.env.LOCAL_SKILLS_WEBSITE_ROOT || "/Users/jp/jpautomations-website"
).trim()
export const LOCAL_SKILLS_PYTHON_BIN = (
  process.env.LOCAL_SKILLS_PYTHON_BIN || "python3"
).trim()

export type PythonRunResult = {
  exitCode: number
  stdout: string
  stderr: string
  durationMs: number
  timedOut: boolean
  command: string
}

type RunPythonArgs = {
  scriptPath: string
  args: string[]
  cwd?: string
  timeoutMs?: number
  env?: Record<string, string>
}

const MAX_STREAM_CHARS = 240_000

function appendLimited(current: string, nextChunk: string): string {
  const combined = current + nextChunk
  if (combined.length <= MAX_STREAM_CHARS) return combined
  return combined.slice(combined.length - MAX_STREAM_CHARS)
}

export function sanitizeOutputFilename(raw: string | null | undefined, fallbackPrefix: string, extension = ".mp4"): string {
  const cleaned = String(raw || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")

  if (!cleaned) {
    return `${fallbackPrefix}-${Date.now()}${extension}`
  }

  const withExt = cleaned.toLowerCase().endsWith(extension) ? cleaned : `${cleaned}${extension}`
  return withExt
}

export function toAbsolutePath(p: string): string {
  if (!p) return ""
  return path.isAbsolute(p) ? path.normalize(p) : path.resolve(p)
}

export function isPathWithinRoots(candidatePath: string, roots: string[]): boolean {
  const candidate = toAbsolutePath(candidatePath)
  return roots.some((root) => {
    const normalizedRoot = toAbsolutePath(root)
    return candidate === normalizedRoot || candidate.startsWith(`${normalizedRoot}${path.sep}`)
  })
}

export function getDefaultLocalSkillRoots(): string[] {
  const defaults = [
    path.join(LOCAL_SKILLS_WORKSPACE_ROOT, ".tmp"),
    path.join(LOCAL_SKILLS_WEBSITE_ROOT, ".tmp"),
    path.join(LOCAL_SKILLS_WEBSITE_ROOT, "public", "uploads"),
    path.join(LOCAL_SKILLS_WEBSITE_ROOT, "public", "generated"),
  ]

  const extraFromEnv = String(process.env.LOCAL_SKILLS_ALLOWED_ROOTS || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)

  return Array.from(new Set([...defaults, ...extraFromEnv].map((v) => toAbsolutePath(v))))
}

export async function runPythonScript(params: RunPythonArgs): Promise<PythonRunResult> {
  const {
    scriptPath,
    args,
    cwd = LOCAL_SKILLS_WORKSPACE_ROOT,
    timeoutMs = 10 * 60_000,
    env = {},
  } = params

  return await new Promise<PythonRunResult>((resolve, reject) => {
    const start = Date.now()
    const fullArgs = [scriptPath, ...args]
    const command = `${LOCAL_SKILLS_PYTHON_BIN} ${fullArgs.map((v) => JSON.stringify(v)).join(" ")}`

    const child = spawn(LOCAL_SKILLS_PYTHON_BIN, fullArgs, {
      cwd,
      env: {
        ...process.env,
        ...env,
      },
      stdio: ["ignore", "pipe", "pipe"],
    })

    let stdout = ""
    let stderr = ""
    let timedOut = false

    child.stdout.on("data", (chunk: Buffer) => {
      stdout = appendLimited(stdout, chunk.toString("utf8"))
    })
    child.stderr.on("data", (chunk: Buffer) => {
      stderr = appendLimited(stderr, chunk.toString("utf8"))
    })

    const timeout = setTimeout(() => {
      timedOut = true
      child.kill("SIGTERM")
      setTimeout(() => child.kill("SIGKILL"), 4_000)
    }, timeoutMs)

    child.on("error", (error) => {
      clearTimeout(timeout)
      reject(error)
    })

    child.on("close", (code) => {
      clearTimeout(timeout)
      resolve({
        exitCode: code ?? -1,
        stdout,
        stderr,
        durationMs: Date.now() - start,
        timedOut,
        command,
      })
    })
  })
}
