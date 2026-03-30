-- Add WITH CHECK to RLS policies to prevent users from inserting/updating
-- rows with a user_id that doesn't match their auth.uid().

-- content_plans
DROP POLICY IF EXISTS "Users can match their own content plans" ON content_plans;
CREATE POLICY "Users can match their own content plans" ON content_plans
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- posts
DROP POLICY IF EXISTS "Users can match their own posts" ON posts;
CREATE POLICY "Users can match their own posts" ON posts
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- generated_assets
DROP POLICY IF EXISTS "Users can match their own assets" ON generated_assets;
CREATE POLICY "Users can match their own assets" ON generated_assets
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
