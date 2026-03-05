-- Reel edit async jobs (Basic + Pro)
CREATE TABLE IF NOT EXISTS reel_edit_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

    mode TEXT NOT NULL CHECK (mode IN ('basic', 'pro')),
    runtime TEXT NOT NULL DEFAULT 'cloud' CHECK (runtime IN ('cloud', 'local')),
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

    input_payload JSONB NOT NULL,
    options_payload JSONB NOT NULL,

    output_asset_key TEXT,
    output_url TEXT,
    thumbnail_asset_key TEXT,
    thumbnail_url TEXT,

    logs_excerpt TEXT,
    error_message TEXT,

    deducted_tokens INTEGER NOT NULL CHECK (deducted_tokens >= 0),
    refunded BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ
);

ALTER TABLE reel_edit_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can access their own reel edit jobs" ON reel_edit_jobs;
CREATE POLICY "Users can access their own reel edit jobs" ON reel_edit_jobs
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_reel_edit_jobs_user_created ON reel_edit_jobs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reel_edit_jobs_status_created ON reel_edit_jobs(status, created_at DESC);
