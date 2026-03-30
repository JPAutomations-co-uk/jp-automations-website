-- Platform-specific profiles: per-user, per-platform customisation
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS platform_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'instagram', 'x', 'youtube')),
  tone TEXT,
  voice_sample TEXT,
  copy_examples TEXT[] DEFAULT '{}',
  example_image_urls TEXT[] DEFAULT '{}',
  style_description TEXT,
  goals TEXT,
  primary_cta TEXT,
  content_pillars TEXT[] DEFAULT '{}',
  posting_frequency INTEGER CHECK (posting_frequency BETWEEN 1 AND 7),
  handle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- RLS policies
ALTER TABLE platform_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own platform profiles"
  ON platform_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own platform profiles"
  ON platform_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own platform profiles"
  ON platform_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_platform_profiles_user_platform ON platform_profiles(user_id, platform);

-- Storage bucket for example screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('platform-examples', 'platform-examples', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: users can upload/read their own files
CREATE POLICY "Users can upload platform examples"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'platform-examples' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can read own platform examples"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'platform-examples' AND (storage.foldername(name))[1] = auth.uid()::text);
