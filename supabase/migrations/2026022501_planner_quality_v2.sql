-- Planner V2: Funnel + Research-Driven Quality Engine

-- -----------------------------------------------------
-- Column extensions
-- -----------------------------------------------------
ALTER TABLE IF EXISTS profiles
  ADD COLUMN IF NOT EXISTS voice_sample TEXT;

ALTER TABLE IF EXISTS content_plans
  ADD COLUMN IF NOT EXISTS quality_mode TEXT DEFAULT 'pro',
  ADD COLUMN IF NOT EXISTS quality_report JSONB,
  ADD COLUMN IF NOT EXISTS research_summary JSONB,
  ADD COLUMN IF NOT EXISTS brief_snapshot JSONB,
  ADD COLUMN IF NOT EXISTS generation_version TEXT DEFAULT 'planner_v2';

ALTER TABLE IF EXISTS posts
  ADD COLUMN IF NOT EXISTS instagram_permalink TEXT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS quality_score NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS evidence_refs JSONB,
  ADD COLUMN IF NOT EXISTS primary_kpi TEXT;

-- -----------------------------------------------------
-- Social account connections
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS social_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram')),
  account_id TEXT,
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, platform)
);

ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own social connections" ON social_connections;
CREATE POLICY "Users can manage their own social connections" ON social_connections
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_social_connections_user_platform ON social_connections(user_id, platform);

-- -----------------------------------------------------
-- Insights tables
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS instagram_media_insights_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  instagram_media_id TEXT NOT NULL,
  metric_date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  profile_visits INTEGER DEFAULT 0,
  follows INTEGER DEFAULT 0,
  engagement_rate NUMERIC(8,4),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(instagram_media_id, metric_date)
);

ALTER TABLE instagram_media_insights_daily ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own instagram insights" ON instagram_media_insights_daily;
CREATE POLICY "Users can manage their own instagram insights" ON instagram_media_insights_daily
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_instagram_insights_user_date ON instagram_media_insights_daily(user_id, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_instagram_insights_post_id ON instagram_media_insights_daily(post_id);

-- -----------------------------------------------------
-- Curated benchmark dataset
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS benchmark_content_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  format TEXT,
  funnel_stage TEXT CHECK (funnel_stage IN ('TOFU', 'MOFU', 'BOFU')),
  pillar TEXT,
  hook_pattern TEXT,
  cta_pattern TEXT,
  posting_window TEXT,
  source_handle TEXT,
  source_reference TEXT,
  sample_size INTEGER,
  metric_window_days INTEGER DEFAULT 30,
  reach_rate NUMERIC(10,6),
  share_rate NUMERIC(10,6),
  save_rate NUMERIC(10,6),
  comment_rate NUMERIC(10,6),
  profile_action_rate NUMERIC(10,6),
  intent_comment_rate NUMERIC(10,6),
  non_follower_ratio NUMERIC(10,6),
  observed_lift NUMERIC(10,6),
  tags TEXT[] DEFAULT '{}',
  collected_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE benchmark_content_patterns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read benchmark patterns" ON benchmark_content_patterns;
CREATE POLICY "Authenticated users can read benchmark patterns" ON benchmark_content_patterns
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_benchmark_patterns_industry ON benchmark_content_patterns(industry);
CREATE INDEX IF NOT EXISTS idx_benchmark_patterns_funnel ON benchmark_content_patterns(funnel_stage);
CREATE INDEX IF NOT EXISTS idx_benchmark_patterns_expiry ON benchmark_content_patterns(expires_at);

-- -----------------------------------------------------
-- Planner generation observability
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS planner_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month TEXT NOT NULL,
  idempotency_key TEXT,
  quality_mode TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  overall_score NUMERIC(5,2),
  dimension_scores JSONB,
  latency_ms INTEGER,
  used_account_signals BOOLEAN DEFAULT false,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE planner_generation_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own planner logs" ON planner_generation_logs;
CREATE POLICY "Users can read their own planner logs" ON planner_generation_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_planner_logs_user_created ON planner_generation_logs(user_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_planner_logs_user_idempotency ON planner_generation_logs(user_id, idempotency_key) WHERE idempotency_key IS NOT NULL;

-- -----------------------------------------------------
-- Token compensation function (compatible with webhook callers)
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION credit_tokens(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT,
  p_stripe_session_id TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than 0';
  END IF;

  -- Upsert balance row first to avoid null updates.
  INSERT INTO token_balances (user_id, balance, updated_at)
  VALUES (p_user_id, 0, timezone('utc'::text, now()))
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE token_balances
  SET balance = balance + p_amount,
      updated_at = timezone('utc'::text, now())
  WHERE user_id = p_user_id
  RETURNING balance INTO v_balance;

  INSERT INTO token_transactions (
    user_id,
    amount,
    type,
    description,
    stripe_session_id,
    created_at
  ) VALUES (
    p_user_id,
    p_amount,
    p_type,
    p_description,
    p_stripe_session_id,
    timezone('utc'::text, now())
  );

  RETURN v_balance;
END;
$$;

GRANT EXECUTE ON FUNCTION credit_tokens(UUID, INTEGER, TEXT, TEXT, TEXT) TO service_role;

-- -----------------------------------------------------
-- Transactional plan + post writer
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION create_content_plan_with_posts(
  p_user_id UUID,
  p_plan_json JSONB,
  p_posts_json JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan_id UUID;
BEGIN
  INSERT INTO content_plans (
    user_id,
    month,
    industry,
    target_audience,
    goals,
    quality_mode,
    quality_report,
    research_summary,
    brief_snapshot,
    generation_version,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    COALESCE(p_plan_json->>'month', to_char(timezone('utc'::text, now()), 'YYYY-MM')),
    NULLIF(p_plan_json->>'industry', ''),
    NULLIF(p_plan_json->>'target_audience', ''),
    NULLIF(p_plan_json->>'goals', ''),
    COALESCE(NULLIF(p_plan_json->>'quality_mode', ''), 'pro'),
    p_plan_json->'quality_report',
    p_plan_json->'research_summary',
    p_plan_json->'brief_snapshot',
    COALESCE(NULLIF(p_plan_json->>'generation_version', ''), 'planner_v2'),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  RETURNING id INTO v_plan_id;

  IF jsonb_typeof(p_posts_json) = 'array' AND jsonb_array_length(p_posts_json) > 0 THEN
    INSERT INTO posts (
      user_id,
      plan_id,
      date,
      day_of_week,
      format,
      funnel_stage,
      pillar,
      topic,
      caption_hook,
      caption_body,
      hashtags,
      posting_time,
      status,
      meta,
      quality_score,
      evidence_refs,
      primary_kpi,
      created_at,
      updated_at
    )
    SELECT
      p_user_id,
      v_plan_id,
      (item->>'date')::date,
      NULLIF(item->>'day_of_week', ''),
      COALESCE(NULLIF(item->>'format', ''), 'Single Image'),
      NULLIF(item->>'funnel_stage', ''),
      NULLIF(item->>'pillar', ''),
      NULLIF(item->>'topic', ''),
      NULLIF(item->>'caption_hook', ''),
      NULLIF(item->>'caption_body', ''),
      CASE
        WHEN jsonb_typeof(item->'hashtags') = 'array' THEN ARRAY(
          SELECT jsonb_array_elements_text(item->'hashtags')
        )
        ELSE NULL
      END,
      CASE
        WHEN NULLIF(item->>'posting_time', '') IS NULL THEN NULL
        ELSE (item->>'posting_time')::time
      END,
      COALESCE(NULLIF(item->>'status', ''), 'draft'),
      item->'meta',
      CASE
        WHEN NULLIF(item->>'quality_score', '') IS NULL THEN NULL
        ELSE (item->>'quality_score')::numeric(5,2)
      END,
      item->'evidence_refs',
      NULLIF(item->>'primary_kpi', ''),
      timezone('utc'::text, now()),
      timezone('utc'::text, now())
    FROM jsonb_array_elements(p_posts_json) AS item;
  END IF;

  RETURN v_plan_id;
END;
$$;

GRANT EXECUTE ON FUNCTION create_content_plan_with_posts(UUID, JSONB, JSONB) TO service_role;
