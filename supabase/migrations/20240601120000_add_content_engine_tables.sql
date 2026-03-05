-- Create content_plans table
CREATE TABLE IF NOT EXISTS content_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    month TEXT NOT NULL, -- YYYY-MM
    industry TEXT,
    target_audience TEXT,
    goals TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES content_plans(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    day_of_week TEXT,
    format TEXT NOT NULL,
    funnel_stage TEXT,
    pillar TEXT,
    topic TEXT,
    caption_hook TEXT,
    caption_body TEXT,
    hashtags TEXT[],
    posting_time TIME,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    instagram_media_id TEXT,
    meta JSONB, -- stores why_it_works, engagement_tip, description, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create generated_assets table
CREATE TABLE IF NOT EXISTS generated_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'carousel', 'video')),
    url TEXT NOT NULL,
    storage_path TEXT,
    prompt TEXT,
    meta JSONB, -- stores carousel slide info or other metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_assets ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can match their own content plans" ON content_plans;
CREATE POLICY "Users can match their own content plans" ON content_plans
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can match their own posts" ON posts;
CREATE POLICY "Users can match their own posts" ON posts
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can match their own assets" ON generated_assets;
CREATE POLICY "Users can match their own assets" ON generated_assets
    FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_plans_user_month ON content_plans(user_id, month);
CREATE INDEX IF NOT EXISTS idx_posts_user_date ON posts(user_id, date);
CREATE INDEX IF NOT EXISTS idx_posts_plan_id ON posts(plan_id);
