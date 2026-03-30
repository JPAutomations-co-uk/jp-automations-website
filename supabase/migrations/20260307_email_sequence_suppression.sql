-- Email sequence suppression
-- Tracks one active nurture sequence per email to prevent stacking follow-ups.

CREATE TABLE IF NOT EXISTS email_sequences (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  sequence    TEXT NOT NULL,
  priority    INTEGER NOT NULL DEFAULT 0,
  started_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_email_sequences_email ON email_sequences (email);
CREATE INDEX idx_email_sequences_expires ON email_sequences (expires_at);

-- Atomic enroll function: checks existing row and conditionally inserts/updates in one transaction.
-- Returns true if enrolled (send follow-ups), false if suppressed.
CREATE OR REPLACE FUNCTION try_enroll_sequence(
  p_email TEXT,
  p_sequence TEXT,
  p_priority INTEGER,
  p_expires_at TIMESTAMP WITH TIME ZONE
) RETURNS BOOLEAN AS $$
DECLARE
  v_enrolled BOOLEAN;
BEGIN
  -- Attempt conditional upsert: only replace if existing row is expired or lower priority
  INSERT INTO email_sequences (email, sequence, priority, started_at, expires_at)
  VALUES (p_email, p_sequence, p_priority, now(), p_expires_at)
  ON CONFLICT (email) DO UPDATE SET
    sequence   = EXCLUDED.sequence,
    priority   = EXCLUDED.priority,
    started_at = now(),
    expires_at = EXCLUDED.expires_at
  WHERE
    email_sequences.expires_at < now()
    OR EXCLUDED.priority > email_sequences.priority;

  -- If a row was inserted or updated, we enrolled successfully
  IF FOUND THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;
