import { spawn } from "node:child_process"
import { promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"

import { createAdminClient } from "@/app/lib/supabase/admin"
import { isAdminUser } from "@/app/lib/security/server"
import {
  LOCAL_SKILLS_ENABLED,
  LOCAL_SKILLS_WORKSPACE_ROOT,
  runPythonScript,
  sanitizeOutputFilename,
} from "@/app/lib/skills/local-skill-runner"

export const REEL_TRANSITION_STYLES = [
  "crossfade",
  "wipe",
  "slide",
  "zoom",
  "dissolve",
  "random",
] as const

export const REEL_MOTION_PACKS = ["full", "balanced", "minimal"] as const
export const REEL_CAPTION_MODES = ["auto", "srt", "none"] as const
export const REEL_STYLE_PRESETS = ["clean", "minimal", "bold", "dark"] as const

export type ReelEditMode = "basic" | "pro"
export type ReelTransitionStyle = (typeof REEL_TRANSITION_STYLES)[number]
export type ReelMotionPack = (typeof REEL_MOTION_PACKS)[number]
export type ReelCaptionMode = (typeof REEL_CAPTION_MODES)[number]
export type ReelStylePreset = (typeof REEL_STYLE_PRESETS)[number]
export type ReelJobStatus = "queued" | "processing" | "completed" | "failed"

export type ReelEditInput = {
  clipAssetKeys: string[]
  singleVideoAssetKey: string | null
  audioAssetKey: string | null
}

export type ReelEditOptions = {
  durationSec: number
  speed: number
  vad: boolean
  beatSync: boolean
  transitionStyle: ReelTransitionStyle
  motionPack: ReelMotionPack
  captionMode: ReelCaptionMode
  captionAssetKey: string | null
  stylePreset: ReelStylePreset
  ctaText: string | null
}

export const REEL_TOKEN_COST: Record<ReelEditMode, number> = {
  basic: 2,
  pro: 8,
}

export const LUXURY_REEL_TOKEN_COST = 25

const DEFAULT_INPUT_BUCKET = String(process.env.REEL_EDIT_INPUT_BUCKET || process.env.REEL_MEDIA_BUCKET || "reel-media").trim()
const DEFAULT_OUTPUT_BUCKET = String(process.env.REEL_EDIT_OUTPUT_BUCKET || process.env.REEL_MEDIA_BUCKET || "reel-media").trim()
const WORKER_TIMEOUT_MS = Number(process.env.REEL_EDIT_WORKER_TIMEOUT_MS || 40 * 60_000)
const CLOUD_RUNTIME_DEFAULT = String(process.env.REEL_EDIT_RUNTIME_DEFAULT || "cloud").trim().toLowerCase() === "local"
  ? "local"
  : "cloud"

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function normalizeString(value: unknown): string {
  return String(value || "").trim()
}

function normalizeNullableString(value: unknown): string | null {
  const out = normalizeString(value)
  return out ? out : null
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((v) => normalizeString(v)).filter(Boolean)
}

function normalizeBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value
  if (typeof value === "string") {
    const v = value.trim().toLowerCase()
    if (["1", "true", "yes", "on"].includes(v)) return true
    if (["0", "false", "no", "off"].includes(v)) return false
  }
  if (typeof value === "number") return value !== 0
  return fallback
}

function normalizeNumber(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function asSetMember<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number]
): T[number] {
  const normalized = normalizeString(value)
  if (!normalized) return fallback
  return (allowed as readonly string[]).includes(normalized) ? (normalized as T[number]) : fallback
}

export function excerptLogs(logs: string, maxChars = 9000): string {
  if (!logs) return ""
  if (logs.length <= maxChars) return logs
  return logs.slice(logs.length - maxChars)
}

export function isProModeAllowed(userEmail: string | null | undefined): { allowed: boolean; reason?: string } {
  const proEnabled = process.env.REEL_EDIT_PRO_ENABLED === "1"
  if (!proEnabled) {
    return { allowed: false, reason: "Pro Reel Edit is not enabled yet." }
  }

  const adminOnly = process.env.REEL_EDIT_PRO_ADMIN_ONLY !== "0"
  if (adminOnly && !isAdminUser(userEmail)) {
    return { allowed: false, reason: "Pro Reel Edit is currently in admin beta." }
  }

  return { allowed: true }
}

export function parseReelEditRequest(body: unknown):
  | { ok: true; mode: ReelEditMode; input: ReelEditInput; options: ReelEditOptions }
  | { ok: false; error: string } {
  if (!isRecord(body)) {
    return { ok: false, error: "Invalid payload." }
  }

  const modeRaw = normalizeString(body.mode || "basic")
  if (modeRaw !== "basic" && modeRaw !== "pro") {
    return { ok: false, error: "mode must be either 'basic' or 'pro'." }
  }
  const mode = modeRaw as ReelEditMode

  const inputRaw = isRecord(body.input) ? body.input : {}
  const clipAssetKeys = normalizeStringArray(inputRaw.clipAssetKeys)
  const singleVideoAssetKey = normalizeNullableString(inputRaw.singleVideoAssetKey)
  const audioAssetKey = normalizeNullableString(inputRaw.audioAssetKey)

  if (!clipAssetKeys.length && !singleVideoAssetKey) {
    return {
      ok: false,
      error: "Provide at least one clipAssetKeys item or a singleVideoAssetKey.",
    }
  }

  if (clipAssetKeys.length > 0 && singleVideoAssetKey) {
    return {
      ok: false,
      error: "Provide either clipAssetKeys or singleVideoAssetKey, not both.",
    }
  }

  const optionsRaw = isRecord(body.options) ? body.options : {}
  const durationSec = clamp(normalizeNumber(optionsRaw.durationSec, 30), 5, 300)
  const speed = clamp(normalizeNumber(optionsRaw.speed, 1.1), 0.5, 3)
  const vad = normalizeBoolean(optionsRaw.vad, true)
  const beatSyncRequested = normalizeBoolean(optionsRaw.beatSync, true)
  const beatSync = audioAssetKey ? beatSyncRequested : false

  const transitionStyle = asSetMember(optionsRaw.transitionStyle, REEL_TRANSITION_STYLES, "random")
  const motionPack = asSetMember(optionsRaw.motionPack, REEL_MOTION_PACKS, "full")
  const captionMode = asSetMember(optionsRaw.captionMode, REEL_CAPTION_MODES, "auto")
  const stylePreset = asSetMember(optionsRaw.stylePreset, REEL_STYLE_PRESETS, "clean")
  const captionAssetKey = normalizeNullableString(optionsRaw.captionAssetKey)
  const ctaText = normalizeNullableString(optionsRaw.ctaText)

  if (captionMode === "srt" && !captionAssetKey) {
    return {
      ok: false,
      error: "captionMode 'srt' requires options.captionAssetKey.",
    }
  }

  return {
    ok: true,
    mode,
    input: {
      clipAssetKeys,
      singleVideoAssetKey,
      audioAssetKey,
    },
    options: {
      durationSec,
      speed,
      vad,
      beatSync,
      transitionStyle,
      motionPack,
      captionMode,
      captionAssetKey,
      stylePreset,
      ctaText,
    },
  }
}

type ReelJobRow = {
  id: string
  user_id: string
  mode: ReelEditMode
  status: ReelJobStatus
  runtime: "cloud" | "local"
  input_payload: unknown
  options_payload: unknown
  deducted_tokens: number
  refunded: boolean
  output_asset_key?: string | null
  output_url?: string | null
  thumbnail_asset_key?: string | null
  thumbnail_url?: string | null
  logs_excerpt?: string | null
  error_message?: string | null
}

function nowIso(): string {
  return new Date().toISOString()
}

async function updateJob(jobId: string, patch: Record<string, unknown>): Promise<void> {
  const admin = createAdminClient()
  await (admin as any)
    .from("reel_edit_jobs")
    .update({
      ...patch,
      updated_at: nowIso(),
    })
    .eq("id", jobId)
}

async function getJob(jobId: string): Promise<ReelJobRow | null> {
  const admin = createAdminClient()
  const { data } = await (admin as any)
    .from("reel_edit_jobs")
    .select("*")
    .eq("id", jobId)
    .maybeSingle()

  return (data as ReelJobRow | null) || null
}

export async function refundReelJobIfNeeded(jobId: string, reason: string): Promise<void> {
  const admin = createAdminClient()

  // Claim refund responsibility once; if no row claimed then another process already refunded.
  const { data: claimRows } = await (admin as any)
    .from("reel_edit_jobs")
    .update({ refunded: true, updated_at: nowIso() })
    .eq("id", jobId)
    .eq("refunded", false)
    .select("id, user_id, deducted_tokens")

  const claimed = Array.isArray(claimRows) ? claimRows[0] : null
  if (!claimed) return

  const amount = Number(claimed.deducted_tokens || 0)
  if (amount <= 0) return

  const { error } = await admin.rpc("credit_tokens", {
    p_user_id: String(claimed.user_id || ""),
    p_amount: amount,
    p_type: "refund",
    p_description: `Auto-refund for failed reel edit job ${String(claimed.id || jobId)}: ${reason}`,
  } as never)

  if (error) {
    // Unlock refund flag for another retry path if credit failed.
    await (admin as any)
      .from("reel_edit_jobs")
      .update({ refunded: false, updated_at: nowIso() })
      .eq("id", jobId)
    throw error
  }
}

export async function failJobAndRefund(jobId: string, errorMessage: string, logs = ""): Promise<void> {
  await updateJob(jobId, {
    status: "failed",
    progress: 100,
    failed_at: nowIso(),
    error_message: errorMessage,
    logs_excerpt: excerptLogs(logs),
  })
  await refundReelJobIfNeeded(jobId, errorMessage)
}

function extensionFromAssetKey(assetKey: string, fallback = ".bin"): string {
  if (assetKey.endsWith(".chunks.json") || assetKey.endsWith(".parts.json")) {
    return fallback
  }
  const ext = path.extname(assetKey || "").trim()
  if (!ext || ext.length > 10) return fallback
  return ext
}

type ChunkManifest = {
  type: "chunked-asset-v1"
  originalName?: string
  originalMimeType?: string
  originalSizeBytes?: number
  chunkSizeBytes?: number
  partAssetKeys: string[]
}

function parseChunkManifest(buffer: Buffer, assetKey: string): ChunkManifest | null {
  if (!assetKey.endsWith(".chunks.json") && !assetKey.endsWith(".parts.json")) {
    return null
  }
  if (!buffer.length || buffer.length > 2_000_000) {
    return null
  }

  try {
    const parsed = JSON.parse(buffer.toString("utf8")) as ChunkManifest
    if (parsed?.type !== "chunked-asset-v1") return null
    if (!Array.isArray(parsed.partAssetKeys) || parsed.partAssetKeys.length === 0) return null
    if (!parsed.partAssetKeys.every((key) => typeof key === "string" && key.trim().length > 0)) return null
    return parsed
  } catch {
    return null
  }
}

async function downloadStorageAssetToFile(params: {
  bucket: string
  assetKey: string
  targetPath: string
}): Promise<void> {
  const admin = createAdminClient()
  const { bucket, assetKey, targetPath } = params

  const { data, error } = await admin.storage.from(bucket).download(assetKey)
  if (error || !data) {
    throw new Error(`Failed to download ${assetKey}: ${String(error?.message || error || "unknown error")}`)
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  const bytes = Buffer.from(await data.arrayBuffer())

  const manifest = parseChunkManifest(bytes, assetKey)
  if (!manifest) {
    await fs.writeFile(targetPath, bytes)
    return
  }

  const handle = await fs.open(targetPath, "w")
  let position = 0

  try {
    for (const partAssetKeyRaw of manifest.partAssetKeys) {
      const partAssetKey = String(partAssetKeyRaw || "").trim()
      if (!partAssetKey) continue

      const { data: partData, error: partError } = await admin.storage.from(bucket).download(partAssetKey)
      if (partError || !partData) {
        throw new Error(
          `Failed to download chunk ${partAssetKey}: ${String(partError?.message || partError || "unknown error")}`
        )
      }

      const partBytes = Buffer.from(await partData.arrayBuffer())
      await handle.write(partBytes, 0, partBytes.length, position)
      position += partBytes.length
    }
  } finally {
    await handle.close()
  }
}

async function uploadFileToStorage(params: {
  bucket: string
  assetKey: string
  localPath: string
  contentType: string
}): Promise<string | null> {
  const admin = createAdminClient()
  const { bucket, assetKey, localPath, contentType } = params

  const payload = await fs.readFile(localPath)
  const { error } = await admin.storage.from(bucket).upload(assetKey, payload, {
    contentType,
    upsert: true,
  })

  if (error) {
    throw new Error(`Failed to upload ${assetKey}: ${String(error.message || error)}`)
  }

  const ttlSec = Number(process.env.REEL_EDIT_SIGNED_URL_TTL_SEC || 7 * 24 * 60 * 60)
  const { data: signedData, error: signedError } = await admin.storage
    .from(bucket)
    .createSignedUrl(assetKey, ttlSec)

  if (!signedError && signedData?.signedUrl) {
    return signedData.signedUrl
  }

  const { data: publicData } = admin.storage.from(bucket).getPublicUrl(assetKey)
  return publicData?.publicUrl || null
}

function runCommand(command: string, args: string[], timeoutMs: number): Promise<{ code: number; stdout: string; stderr: string; timedOut: boolean }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
    })

    let stdout = ""
    let stderr = ""
    let timedOut = false

    const timer = setTimeout(() => {
      timedOut = true
      child.kill("SIGTERM")
      setTimeout(() => child.kill("SIGKILL"), 4_000)
    }, timeoutMs)

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8")
      if (stdout.length > 80_000) stdout = stdout.slice(stdout.length - 80_000)
    })

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8")
      if (stderr.length > 80_000) stderr = stderr.slice(stderr.length - 80_000)
    })

    child.on("error", (err) => {
      clearTimeout(timer)
      reject(err)
    })

    child.on("close", (code) => {
      clearTimeout(timer)
      resolve({ code: code ?? -1, stdout, stderr, timedOut })
    })
  })
}

async function generateThumbnail(videoPath: string, thumbPath: string): Promise<boolean> {
  try {
    const result = await runCommand(
      "ffmpeg",
      [
        "-y",
        "-ss",
        "1",
        "-i",
        videoPath,
        "-frames:v",
        "1",
        "-vf",
        "scale=540:-1",
        thumbPath,
      ],
      120_000
    )

    if (result.timedOut || result.code !== 0) return false
    await fs.stat(thumbPath)
    return true
  } catch {
    return false
  }
}

function joinLogs(parts: Array<string | null | undefined>): string {
  return excerptLogs(
    parts
      .map((v) => String(v || "").trim())
      .filter(Boolean)
      .join("\n\n")
  )
}

function parseStoredPayloads(job: ReelJobRow): {
  mode: ReelEditMode
  input: ReelEditInput
  options: ReelEditOptions
} {
  const validated = parseReelEditRequest({
    mode: job.mode,
    input: isRecord(job.input_payload) ? job.input_payload : {},
    options: isRecord(job.options_payload) ? job.options_payload : {},
  })

  if (!validated.ok) {
    throw new Error(`Stored job payload is invalid: ${validated.error}`)
  }

  return {
    mode: validated.mode,
    input: validated.input,
    options: validated.options,
  }
}

export async function processReelEditJob(jobId: string): Promise<{ ok: boolean; status: ReelJobStatus; error?: string }> {
  const admin = createAdminClient()

  // Processing lock: only queued jobs can be claimed.
  const { data: claimedRows, error: claimError } = await (admin as any)
    .from("reel_edit_jobs")
    .update({
      status: "processing",
      progress: 8,
      started_at: nowIso(),
      error_message: null,
      updated_at: nowIso(),
    })
    .eq("id", jobId)
    .eq("status", "queued")
    .select("id")

  if (claimError) {
    return { ok: false, status: "failed", error: String(claimError.message || claimError) }
  }

  if (!claimedRows || claimedRows.length === 0) {
    const existing = await getJob(jobId)
    if (!existing) {
      return { ok: false, status: "failed", error: "Job not found." }
    }
    return {
      ok: existing.status === "completed",
      status: existing.status,
      error: existing.error_message || undefined,
    }
  }

  const job = await getJob(jobId)
  if (!job) {
    return { ok: false, status: "failed", error: "Job not found after claim." }
  }

  let tmpRoot = ""
  let aggregateLogs = ""

  try {
    // Luxury reel jobs use a different pipeline (Higgsfield image-to-video)
    if (String(job.mode) === "luxury") {
      if (!LOCAL_SKILLS_ENABLED) {
        throw new Error("Local reel worker is disabled in this runtime (ENABLE_LOCAL_SKILLS_BRIDGE must be 1).")
      }

      await updateJob(jobId, { progress: 15, logs_excerpt: "Ingesting photo assets..." })

      tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "luxury-reel-job-"))
      const photosDir = path.join(tmpRoot, "photos")
      const planPath = path.join(tmpRoot, "frame_plan.json")
      const audioDir = path.join(tmpRoot, "audio")
      const outputDir = path.join(tmpRoot, "out")

      await Promise.all([
        fs.mkdir(photosDir, { recursive: true }),
        fs.mkdir(audioDir, { recursive: true }),
        fs.mkdir(outputDir, { recursive: true }),
      ])

      const inputPayload = isRecord(job.input_payload) ? job.input_payload : {}
      const optionsPayload = isRecord(job.options_payload) ? job.options_payload : {}

      const framePlan = inputPayload.framePlan as Record<string, unknown>
      const photoAssetKeys = normalizeStringArray(inputPayload.photoAssetKeys)
      const audioAssetKey = normalizeNullableString(inputPayload.audioAssetKey)
      const template = normalizeNullableString(optionsPayload.template)
      const transition = normalizeString(optionsPayload.transition) || "crossfade"

      if (!framePlan || !Array.isArray(framePlan.frame_plan)) {
        throw new Error("Stored luxury job has invalid framePlan.")
      }

      // Download client photos
      let photoIndex = 0
      for (const assetKey of photoAssetKeys) {
        photoIndex += 1
        const ext = extensionFromAssetKey(assetKey, ".jpg")
        const localPath = path.join(photosDir, `photo_${String(photoIndex).padStart(3, "0")}${ext}`)
        await downloadStorageAssetToFile({ bucket: DEFAULT_INPUT_BUCKET, assetKey, targetPath: localPath })
      }

      // Write frame plan JSON for the Python script
      await fs.writeFile(planPath, JSON.stringify(framePlan), "utf8")

      // Download audio if provided
      let audioPath: string | null = null
      if (audioAssetKey) {
        const ext = extensionFromAssetKey(audioAssetKey, ".mp3")
        audioPath = path.join(audioDir, `audio${ext}`)
        await downloadStorageAssetToFile({ bucket: DEFAULT_INPUT_BUCKET, assetKey: audioAssetKey, targetPath: audioPath })
      }

      await updateJob(jobId, { progress: 35, logs_excerpt: "Assets ready. Generating Higgsfield clips..." })

      const outputFileName = sanitizeOutputFilename(`luxury-reel-${jobId}.mp4`, `luxury-reel-${jobId}`, ".mp4")
      const outputPath = path.join(outputDir, outputFileName)

      const scriptPath = path.join(LOCAL_SKILLS_WORKSPACE_ROOT, "execution", "generate_luxury_reel.py")
      await fs.stat(scriptPath)

      const args: string[] = [
        "--images", photosDir,
        "--frame-plan", planPath,
        "--output", outputPath,
        "--no-confirm",
      ]
      if (template) args.push("--template", template)
      if (audioPath) args.push("--audio", audioPath)
      if (transition) args.push("--transition", transition)

      const runResult = await runPythonScript({
        scriptPath,
        args,
        cwd: LOCAL_SKILLS_WORKSPACE_ROOT,
        timeoutMs: WORKER_TIMEOUT_MS,
      })

      aggregateLogs = joinLogs([runResult.stdout, runResult.stderr])

      if (runResult.timedOut || runResult.exitCode !== 0) {
        throw new Error(runResult.timedOut ? "Luxury render timed out." : "Luxury renderer returned a non-zero exit code.")
      }

      await fs.stat(outputPath)

      await updateJob(jobId, {
        progress: 78,
        logs_excerpt: joinLogs(["Render completed. Uploading output...", aggregateLogs]),
      })

      const outputAssetKey = `luxury-reels/${job.user_id}/${jobId}/${outputFileName}`
      const outputUrl = await uploadFileToStorage({
        bucket: DEFAULT_OUTPUT_BUCKET,
        assetKey: outputAssetKey,
        localPath: outputPath,
        contentType: "video/mp4",
      })

      const thumbPath = path.join(outputDir, `${path.parse(outputFileName).name}.jpg`)
      let thumbnailAssetKey: string | null = null
      let thumbnailUrl: string | null = null

      const thumbReady = await generateThumbnail(outputPath, thumbPath)
      if (thumbReady) {
        thumbnailAssetKey = `luxury-reels/${job.user_id}/${jobId}/${path.parse(outputFileName).name}.jpg`
        thumbnailUrl = await uploadFileToStorage({
          bucket: DEFAULT_OUTPUT_BUCKET,
          assetKey: thumbnailAssetKey,
          localPath: thumbPath,
          contentType: "image/jpeg",
        })
      }

      await updateJob(jobId, {
        status: "completed",
        progress: 100,
        completed_at: nowIso(),
        output_asset_key: outputAssetKey,
        output_url: outputUrl,
        thumbnail_asset_key: thumbnailAssetKey,
        thumbnail_url: thumbnailUrl,
        logs_excerpt: aggregateLogs,
        error_message: null,
      })

      return { ok: true, status: "completed" }
    }

    const { mode, input, options } = parseStoredPayloads(job)

    if (!LOCAL_SKILLS_ENABLED) {
      throw new Error(
        "Local reel worker is disabled in this runtime (ENABLE_LOCAL_SKILLS_BRIDGE must be 1)."
      )
    }

    await updateJob(jobId, { progress: 15, logs_excerpt: "Ingesting assets..." })

    tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "reel-edit-job-"))
    const clipsDir = path.join(tmpRoot, "clips")
    const singleVideoDir = path.join(tmpRoot, "single")
    const audioDir = path.join(tmpRoot, "audio")
    const captionsDir = path.join(tmpRoot, "captions")
    const outputDir = path.join(tmpRoot, "out")

    await Promise.all([
      fs.mkdir(clipsDir, { recursive: true }),
      fs.mkdir(singleVideoDir, { recursive: true }),
      fs.mkdir(audioDir, { recursive: true }),
      fs.mkdir(captionsDir, { recursive: true }),
      fs.mkdir(outputDir, { recursive: true }),
    ])

    const clipLocalPaths: string[] = []

    if (input.clipAssetKeys.length > 0) {
      let index = 0
      for (const key of input.clipAssetKeys) {
        index += 1
        const ext = extensionFromAssetKey(key, ".mp4")
        const localPath = path.join(clipsDir, `clip_${String(index).padStart(3, "0")}${ext}`)
        await downloadStorageAssetToFile({
          bucket: DEFAULT_INPUT_BUCKET,
          assetKey: key,
          targetPath: localPath,
        })
        clipLocalPaths.push(localPath)
      }
    }

    let singleVideoPath: string | null = null
    if (!clipLocalPaths.length && input.singleVideoAssetKey) {
      const ext = extensionFromAssetKey(input.singleVideoAssetKey, ".mp4")
      singleVideoPath = path.join(singleVideoDir, `single${ext}`)
      await downloadStorageAssetToFile({
        bucket: DEFAULT_INPUT_BUCKET,
        assetKey: input.singleVideoAssetKey,
        targetPath: singleVideoPath,
      })
    }

    let audioPath: string | null = null
    if (input.audioAssetKey) {
      const ext = extensionFromAssetKey(input.audioAssetKey, ".mp3")
      audioPath = path.join(audioDir, `audio${ext}`)
      await downloadStorageAssetToFile({
        bucket: DEFAULT_INPUT_BUCKET,
        assetKey: input.audioAssetKey,
        targetPath: audioPath,
      })
    }

    let captionsPath: string | null = null
    if (mode === "pro" && options.captionMode === "srt" && options.captionAssetKey) {
      const ext = extensionFromAssetKey(options.captionAssetKey, ".srt")
      captionsPath = path.join(captionsDir, `captions${ext}`)
      await downloadStorageAssetToFile({
        bucket: DEFAULT_INPUT_BUCKET,
        assetKey: options.captionAssetKey,
        targetPath: captionsPath,
      })
    }

    await updateJob(jobId, {
      progress: 35,
      logs_excerpt: "Assets ready. Starting render...",
    })

    const outputFileName = sanitizeOutputFilename(`reel-${jobId}.mp4`, `reel-${jobId}`, ".mp4")
    const outputPath = path.join(outputDir, outputFileName)

    const scriptPath = path.join(LOCAL_SKILLS_WORKSPACE_ROOT, "execution", "edit_reel.py")
    await fs.stat(scriptPath)

    const args: string[] = ["--mode", mode, "--output", outputPath]
    if (clipLocalPaths.length > 0) {
      args.push("--clips", clipsDir)
    } else if (singleVideoPath) {
      args.push("--video", singleVideoPath)
    } else {
      throw new Error("No prepared input assets were available.")
    }

    if (options.vad) args.push("--vad")
    args.push("--duration", String(options.durationSec))
    args.push("--speed", String(options.speed))
    args.push("--transition-style", options.transitionStyle)

    if (audioPath) {
      args.push("--audio", audioPath)
    }
    if (options.beatSync && audioPath) {
      args.push("--beat-sync")
    }

    if (mode === "pro") {
      args.push("--motion-pack", options.motionPack)
      args.push("--caption-mode", options.captionMode)
      args.push("--style-preset", options.stylePreset)
      if (options.captionMode === "srt" && captionsPath) {
        args.push("--captions-srt", captionsPath)
      }
      if (options.ctaText) {
        args.push("--cta-text", options.ctaText)
      }
    }

    const runResult = await runPythonScript({
      scriptPath,
      args,
      cwd: LOCAL_SKILLS_WORKSPACE_ROOT,
      timeoutMs: WORKER_TIMEOUT_MS,
    })

    aggregateLogs = joinLogs([runResult.stdout, runResult.stderr])

    if (runResult.timedOut || runResult.exitCode !== 0) {
      throw new Error(runResult.timedOut ? "Render timed out." : "Renderer returned a non-zero exit code.")
    }

    await fs.stat(outputPath)

    await updateJob(jobId, {
      progress: 78,
      logs_excerpt: joinLogs(["Render completed. Uploading output...", aggregateLogs]),
    })

    const outputAssetKey = `reel-edits/${job.user_id}/${jobId}/${outputFileName}`
    const outputUrl = await uploadFileToStorage({
      bucket: DEFAULT_OUTPUT_BUCKET,
      assetKey: outputAssetKey,
      localPath: outputPath,
      contentType: "video/mp4",
    })

    const thumbPath = path.join(outputDir, `${path.parse(outputFileName).name}.jpg`)
    let thumbnailAssetKey: string | null = null
    let thumbnailUrl: string | null = null

    const thumbExistsFromRenderer = await fs
      .stat(thumbPath)
      .then(() => true)
      .catch(() => false)

    const thumbReady = thumbExistsFromRenderer ? true : await generateThumbnail(outputPath, thumbPath)

    if (thumbReady) {
      thumbnailAssetKey = `reel-edits/${job.user_id}/${jobId}/${path.parse(outputFileName).name}.jpg`
      thumbnailUrl = await uploadFileToStorage({
        bucket: DEFAULT_OUTPUT_BUCKET,
        assetKey: thumbnailAssetKey,
        localPath: thumbPath,
        contentType: "image/jpeg",
      })
    }

    await updateJob(jobId, {
      status: "completed",
      progress: 100,
      completed_at: nowIso(),
      output_asset_key: outputAssetKey,
      output_url: outputUrl,
      thumbnail_asset_key: thumbnailAssetKey,
      thumbnail_url: thumbnailUrl,
      logs_excerpt: aggregateLogs,
      error_message: null,
    })

    return { ok: true, status: "completed" }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reel edit worker failed"
    await failJobAndRefund(jobId, message, aggregateLogs)
    return { ok: false, status: "failed", error: message }
  } finally {
    if (tmpRoot) {
      await fs.rm(tmpRoot, { recursive: true, force: true }).catch(() => null)
    }
  }
}

export async function enqueueReelEditJob(params: {
  jobId: string
}): Promise<{ queued: boolean; runtime: "cloud" | "local"; error?: string }> {
  const { jobId } = params

  if (CLOUD_RUNTIME_DEFAULT === "cloud") {
    const cloudUrl = normalizeString(process.env.REEL_EDIT_CLOUD_WORKER_URL)
    if (cloudUrl) {
      try {
        const secret = normalizeString(process.env.REEL_EDIT_CLOUD_WORKER_SECRET)
        const supabaseUrl = normalizeString(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
        const supabaseServiceRoleKey = normalizeString(process.env.SUPABASE_SERVICE_ROLE_KEY)
        const queueConfig: Record<string, unknown> = {
          inputBucket: DEFAULT_INPUT_BUCKET,
          outputBucket: DEFAULT_OUTPUT_BUCKET,
          signedUrlTtlSec: Number(process.env.REEL_EDIT_SIGNED_URL_TTL_SEC || 7 * 24 * 60 * 60),
          workerTimeoutMs: WORKER_TIMEOUT_MS,
        }
        if (supabaseUrl) {
          queueConfig.supabaseUrl = supabaseUrl
        }
        if (supabaseServiceRoleKey) {
          queueConfig.supabaseServiceRoleKey = supabaseServiceRoleKey
        }

        const response = await fetch(cloudUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(secret ? { "x-reel-worker-secret": secret } : {}),
          },
          body: JSON.stringify({ jobId, config: queueConfig }),
        })

        if (response.ok) {
          await updateJob(jobId, { runtime: "cloud" })
          return { queued: true, runtime: "cloud" }
        }
      } catch {
        // Fall through to local fallback.
      }
    }
  }

  if (!LOCAL_SKILLS_ENABLED) {
    // External poller workers can still pick up queued cloud jobs from Supabase.
    await updateJob(jobId, {
      runtime: "cloud",
      logs_excerpt: "Job queued. Awaiting cloud worker pickup...",
    })
    return { queued: true, runtime: "cloud" }
  }

  await updateJob(jobId, { runtime: "local" })

  // Fire-and-forget local processing for dev fallback.
  void processReelEditJob(jobId).catch(async (error) => {
    const message = error instanceof Error ? error.message : "Unhandled local worker error"
    await failJobAndRefund(jobId, message)
  })

  return { queued: true, runtime: "local" }
}
