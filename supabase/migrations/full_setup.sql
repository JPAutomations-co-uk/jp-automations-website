-- ═══════════════════════════════════════════════════════════════════════════
-- FULL SETUP: Missing profile columns + platform_profiles table
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Add missing columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goals TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS desired_outcomes TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS content_pillars TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_description TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS x_handle TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_handle TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS offers TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS usp TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS primary_cta TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS proof_points TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false;

-- 2. Backfill onboarding_complete from onboarding_completed for existing users
UPDATE profiles SET onboarding_complete = onboarding_completed WHERE onboarding_completed = true AND (onboarding_complete IS NULL OR onboarding_complete = false);

-- 3. Create platform_profiles table
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

-- 4. RLS policies for platform_profiles
ALTER TABLE platform_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can read own platform profiles"
  ON platform_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own platform profiles"
  ON platform_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own platform profiles"
  ON platform_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Service role full access to platform_profiles"
  ON platform_profiles FOR ALL
  USING (auth.role() = 'service_role');

-- 5. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_platform_profiles_user_platform
  ON platform_profiles(user_id, platform);

-- 6. Storage bucket for platform example screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('platform-examples', 'platform-examples', false)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage policies
CREATE POLICY IF NOT EXISTS "Users can upload platform examples"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'platform-examples' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Users can read own platform examples"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'platform-examples' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Service role full access to platform examples"
  ON storage.objects FOR ALL
  USING (bucket_id = 'platform-examples' AND auth.role() = 'service_role');

-- 8. Populate JP's extended profile fields
UPDATE profiles SET
  goals = 'Lead Generation',
  desired_outcomes = 'Book 10+ qualified discovery calls per month from LinkedIn content. Position as the go-to AI automation agency for UK service businesses. Build authority through thought leadership.',
  business_description = 'AI automation agency building bespoke infrastructure for UK service businesses doing £15k+/month. We audit operations, then build custom systems across lead gen, follow-up, admin, content, and client delivery.',
  x_handle = 'jpautomations',
  linkedin_handle = 'jpautomations',
  offers = 'We build bespoke AI automation infrastructure for service businesses doing £15k+/month. Full audit of operations, then custom-built systems across lead gen, follow-up, admin, content, and client delivery. Not software subscriptions — engineered infrastructure that runs without the owner. Typical engagement: audit → consultation → live systems within 14 days.',
  usp = 'We don''t sell software or templates. We architect connected systems across the entire business — lead gen, follow-up, admin, content, delivery — all engineered to run without the owner. Average client reclaims 25+ hours/week and recovers their investment within 90 days. One client recovered £10,000+ in month one.',
  primary_cta = 'Book a free systems audit call',
  proof_points = '45+ hours reclaimed per week across clients. £10,000+ recovered in month one. From no pipeline to paid deal in 24 hours (Prince Ogbe). 5x sales revenue increase (Will Young). Systems live within 14 days. 100% client success rate. Clients: JSC Air Conditioning, JSA Architects, ACE Flat Roofing, Birmingham Gutter Services.',
  onboarding_complete = true,
  content_pillars = ARRAY['AI automation insights', 'Client results & case studies', 'Service business operations', 'Systems vs hustle mindset', 'Behind the scenes builds']
WHERE id = '74ff8654-586d-4e0d-80a6-a454ad434cbf';

-- 9. Insert platform profiles for JP
INSERT INTO platform_profiles (user_id, platform, tone, copy_examples, goals, primary_cta, posting_frequency, content_pillars)
VALUES
  (
    '74ff8654-586d-4e0d-80a6-a454ad434cbf',
    'linkedin',
    'Bold',
    ARRAY[
      E'Your business has thousands of moving parts. Right now, you''re the one holding them all together.\n\nWe build the structure that does it instead.\n\nA real asset doesn''t need a hand to hold it together. It''s built to stay in formation with or without you.\n\nMost service businesses don''t have a growth problem. They have a systems problem disguised as a growth problem.\n\nBook a free systems audit. Link in bio.',
      E'Everyone''s talking about AI. Almost nobody''s using it properly.\n\nHere''s the difference:\n\n→ Most people: \"Write me a blog post\"\n→ What actually works: Engineered prompts, layered context, model selection based on task type\n\nThe gap between AI as a toy and AI as infrastructure is massive.\n\nWe build the infrastructure side. For service businesses doing £15k+/month.\n\nDM me \"audit\" and I''ll show you exactly where your business is leaking time and money.',
      E'One of our clients went from zero pipeline to a paid deal in 24 hours.\n\nNot because they got lucky.\n\nBecause we built the system that made it inevitable:\n\n1. Automated lead capture from 3 channels\n2. Instant qualification + scoring\n3. Personalised follow-up within 60 seconds\n4. Booking flow with zero friction\n\nThe owner didn''t touch any of it.\n\nThat''s what infrastructure looks like vs. hustle.\n\nBook a free call → link in bio.'
    ],
    'Lead Generation',
    'Book a free systems audit — link in bio',
    5,
    ARRAY['AI automation insights', 'Client results & case studies', 'Service business operations', 'Systems vs hustle mindset', 'Behind the scenes builds']
  ),
  (
    '74ff8654-586d-4e0d-80a6-a454ad434cbf',
    'instagram',
    'Direct',
    ARRAY[
      E'Still doing everything yourself?\n\nThat''s not a business. That''s a job with extra steps.\n\nWe build the systems that let you step back.\n\n→ 25+ hours reclaimed per week\n→ £10K recovered in month one\n→ Live systems in under 14 days\n\nLink in bio to book your free audit.'
    ],
    'Brand Awareness',
    'Link in bio → free systems audit',
    4,
    ARRAY['Before/after transformations', 'Quick automation wins', 'Client results', 'Day in the life']
  ),
  (
    '74ff8654-586d-4e0d-80a6-a454ad434cbf',
    'x',
    'Witty',
    ARRAY[
      E'Service businesses don''t have a growth problem.\n\nThey have a \"the owner is the system\" problem.\n\nFix that and growth is inevitable.'
    ],
    'Thought Leadership',
    'DM me "audit"',
    7,
    ARRAY['Hot takes on AI', 'Service business truth bombs', 'Quick wins', 'Thread breakdowns']
  )
ON CONFLICT (user_id, platform) DO UPDATE SET
  tone = EXCLUDED.tone,
  copy_examples = EXCLUDED.copy_examples,
  goals = EXCLUDED.goals,
  primary_cta = EXCLUDED.primary_cta,
  posting_frequency = EXCLUDED.posting_frequency,
  content_pillars = EXCLUDED.content_pillars,
  updated_at = NOW();
