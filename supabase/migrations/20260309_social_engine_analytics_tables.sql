-- Social Engine Analytics Tables
-- LinkedIn, X (Twitter), and YouTube insight tables
-- Matches the existing instagram_media_insights_daily pattern

-- LinkedIn Post Insights
CREATE TABLE IF NOT EXISTS linkedin_post_insights_daily (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linkedin_post_urn TEXT NOT NULL,
  metric_date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  engagement_rate NUMERIC(8,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (linkedin_post_urn, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_linkedin_insights_user_date
  ON linkedin_post_insights_daily(user_id, metric_date);

ALTER TABLE linkedin_post_insights_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own linkedin insights"
  ON linkedin_post_insights_daily FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own linkedin insights"
  ON linkedin_post_insights_daily FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own linkedin insights"
  ON linkedin_post_insights_daily FOR UPDATE
  USING (auth.uid() = user_id);

-- X (Twitter) Tweet Insights
CREATE TABLE IF NOT EXISTS x_tweet_insights_daily (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tweet_id TEXT NOT NULL,
  metric_date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  retweets INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  quote_tweets INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  url_clicks INTEGER DEFAULT 0,
  profile_visits INTEGER DEFAULT 0,
  engagement_rate NUMERIC(8,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tweet_id, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_x_insights_user_date
  ON x_tweet_insights_daily(user_id, metric_date);

ALTER TABLE x_tweet_insights_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own x insights"
  ON x_tweet_insights_daily FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own x insights"
  ON x_tweet_insights_daily FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own x insights"
  ON x_tweet_insights_daily FOR UPDATE
  USING (auth.uid() = user_id);

-- YouTube Video Insights
CREATE TABLE IF NOT EXISTS youtube_video_insights_daily (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  youtube_video_id TEXT NOT NULL,
  metric_date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  watch_time_minutes NUMERIC(10,2) DEFAULT 0,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  subscribers_gained INTEGER DEFAULT 0,
  ctr NUMERIC(8,6) DEFAULT 0,
  avg_view_duration_seconds INTEGER DEFAULT 0,
  avg_percentage_viewed NUMERIC(5,2) DEFAULT 0,
  engagement_rate NUMERIC(8,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (youtube_video_id, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_youtube_insights_user_date
  ON youtube_video_insights_daily(user_id, metric_date);

ALTER TABLE youtube_video_insights_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own youtube insights"
  ON youtube_video_insights_daily FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own youtube insights"
  ON youtube_video_insights_daily FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own youtube insights"
  ON youtube_video_insights_daily FOR UPDATE
  USING (auth.uid() = user_id);

-- Add youtube_handle to profiles if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'youtube_handle'
  ) THEN
    ALTER TABLE profiles ADD COLUMN youtube_handle TEXT;
  END IF;
END $$;
