-- X Content App: profiles, voice examples, content drafts, research cache
-- Migration: 20260309_x_content_app

-- ─── x_profiles ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS x_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  niche TEXT,
  audience_description TEXT,
  tone TEXT,
  writing_style TEXT,
  hook_style TEXT,
  post_length_preference TEXT,
  hashtag_preference BOOLEAN DEFAULT false,
  banned_words TEXT[] DEFAULT '{}',
  cta_preference TEXT,
  current_followers INTEGER DEFAULT 0,
  growth_goal TEXT,
  growth_timeframe TEXT,
  secondary_metric TEXT,
  thread_structure_preference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE x_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own x_profile"
  ON x_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own x_profile"
  ON x_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own x_profile"
  ON x_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── voice_examples ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS voice_examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_text TEXT NOT NULL,
  performance_label TEXT,
  likes INTEGER DEFAULT 0,
  reposts INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'x_archive', 'apify')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE voice_examples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own voice_examples"
  ON voice_examples FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own voice_examples"
  ON voice_examples FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own voice_examples"
  ON voice_examples FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own voice_examples"
  ON voice_examples FOR DELETE
  USING (auth.uid() = user_id);

-- ─── content_drafts ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('post', 'thread')),
  topic TEXT,
  angle TEXT,
  format TEXT,
  output_json JSONB,
  selected_variation INTEGER,
  session_inputs JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE content_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own content_drafts"
  ON content_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content_drafts"
  ON content_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content_drafts"
  ON content_drafts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own content_drafts"
  ON content_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- ─── research_cache ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS research_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  research_type TEXT NOT NULL CHECK (research_type IN ('own_posts', 'niche_top', 'competitor')),
  account_handle TEXT,
  raw_data JSONB,
  processed_insights JSONB,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE research_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own research_cache"
  ON research_cache FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own research_cache"
  ON research_cache FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own research_cache"
  ON research_cache FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own research_cache"
  ON research_cache FOR DELETE
  USING (auth.uid() = user_id);

-- ─── updated_at trigger for x_profiles ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_x_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER x_profiles_updated_at
  BEFORE UPDATE ON x_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_x_profiles_updated_at();
