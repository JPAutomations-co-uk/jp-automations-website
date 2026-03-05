-- Extend profiles table for expanded onboarding
-- Adds: offers, usp, primary_cta, proof_points, x_handle, linkedin_handle, onboarding_complete

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS x_handle text,
  ADD COLUMN IF NOT EXISTS linkedin_handle text,
  ADD COLUMN IF NOT EXISTS offers text,
  ADD COLUMN IF NOT EXISTS usp text,
  ADD COLUMN IF NOT EXISTS primary_cta text,
  ADD COLUMN IF NOT EXISTS proof_points text,
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT false;

-- Existing paid users who completed the old onboarding should be marked as complete
-- (they have business_name populated from the old flow)
UPDATE profiles
SET onboarding_complete = true
WHERE business_name IS NOT NULL AND business_name != '';
