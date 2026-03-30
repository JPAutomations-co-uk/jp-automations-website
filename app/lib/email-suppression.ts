import { createAdminClient } from '@/app/lib/supabase/admin'

export type SequenceId =
  | 'apply'
  | 'blueprint'
  | 'openclaw'
  | 'prompt'
  | 'prompt-guide'
  | 'onboarding'
  | 'client-folder'
  | 'newsletter'
  | 'contact'

interface SequenceConfig {
  priority: number
  durationDays: number
}

const SEQUENCE_CONFIG: Record<SequenceId, SequenceConfig> = {
  apply:           { priority: 100, durationDays: 7 },
  blueprint:       { priority: 10,  durationDays: 9 },
  openclaw:        { priority: 10,  durationDays: 9 },
  prompt:          { priority: 10,  durationDays: 9 },
  'prompt-guide':  { priority: 10,  durationDays: 9 },
  onboarding:      { priority: 10,  durationDays: 9 },
  'client-folder': { priority: 10,  durationDays: 9 },
  newsletter:      { priority: 5,   durationDays: 6 },
  contact:         { priority: 3,   durationDays: 3 },
}

/**
 * Try to enroll an email in a nurture sequence.
 * Returns true if follow-up emails should be sent (enrolled successfully).
 * Returns false if suppressed (higher-or-equal priority sequence already active).
 *
 * Uses an atomic Postgres function to avoid race conditions on concurrent submissions.
 * The delivery email (instant asset) should always be sent regardless.
 */
export async function tryEnrollSequence(
  email: string,
  sequence: SequenceId,
): Promise<boolean> {
  const config = SEQUENCE_CONFIG[sequence]
  const supabase = createAdminClient()
  const expiresAt = new Date(Date.now() + config.durationDays * 24 * 60 * 60 * 1000)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('try_enroll_sequence', {
    p_email: email.toLowerCase(),
    p_sequence: sequence,
    p_priority: config.priority,
    p_expires_at: expiresAt.toISOString(),
  })

  if (error) {
    console.error('Email suppression enroll error:', error)
    return true // fail-open
  }

  return data === true
}
