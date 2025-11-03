/*
  # Optimize RLS Policies with Security Definer Functions

  ## Overview
  This migration creates stable security definer functions that cache auth.uid()
  and replaces all RLS policy checks to use these functions instead of direct
  auth.uid() calls, eliminating per-row re-evaluation.

  ## Changes
  1. Create auth_uid() helper function with STABLE and SECURITY DEFINER
  2. Update all RLS policies on:
     - user_profiles (3 policies)
     - user_analyses (4 policies)
     - treatment_logs (4 policies)
     - forum_posts (3 policies)
     - forum_replies (3 policies)
  3. Fix update_updated_at_column function security

  ## Performance Impact
  - Reduces auth.uid() calls from N (number of rows) to 1 per query
  - Significantly improves query performance on large datasets
*/

-- Create a stable security definer function for auth.uid()
CREATE OR REPLACE FUNCTION auth_uid()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
  SELECT auth.uid();
$$;

-- user_profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth_uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth_uid() = id)
  WITH CHECK (auth_uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth_uid() = id);

-- user_analyses policies
DROP POLICY IF EXISTS "Users can view own analyses" ON user_analyses;
DROP POLICY IF EXISTS "Users can insert own analyses" ON user_analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON user_analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON user_analyses;

CREATE POLICY "Users can view own analyses"
  ON user_analyses FOR SELECT
  TO authenticated
  USING (auth_uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON user_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth_uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON user_analyses FOR UPDATE
  TO authenticated
  USING (auth_uid() = user_id)
  WITH CHECK (auth_uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON user_analyses FOR DELETE
  TO authenticated
  USING (auth_uid() = user_id);

-- treatment_logs policies
DROP POLICY IF EXISTS "Users can view own treatments" ON treatment_logs;
DROP POLICY IF EXISTS "Users can insert own treatments" ON treatment_logs;
DROP POLICY IF EXISTS "Users can update own treatments" ON treatment_logs;
DROP POLICY IF EXISTS "Users can delete own treatments" ON treatment_logs;

CREATE POLICY "Users can view own treatments"
  ON treatment_logs FOR SELECT
  TO authenticated
  USING (auth_uid() = user_id);

CREATE POLICY "Users can insert own treatments"
  ON treatment_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth_uid() = user_id);

CREATE POLICY "Users can update own treatments"
  ON treatment_logs FOR UPDATE
  TO authenticated
  USING (auth_uid() = user_id)
  WITH CHECK (auth_uid() = user_id);

CREATE POLICY "Users can delete own treatments"
  ON treatment_logs FOR DELETE
  TO authenticated
  USING (auth_uid() = user_id);

-- forum_posts policies
DROP POLICY IF EXISTS "Authenticated users can create posts" ON forum_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON forum_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON forum_posts;

CREATE POLICY "Authenticated users can create posts"
  ON forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth_uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON forum_posts FOR UPDATE
  TO authenticated
  USING (auth_uid() = user_id)
  WITH CHECK (auth_uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON forum_posts FOR DELETE
  TO authenticated
  USING (auth_uid() = user_id);

-- forum_replies policies
DROP POLICY IF EXISTS "Authenticated users can create replies" ON forum_replies;
DROP POLICY IF EXISTS "Users can update own replies" ON forum_replies;
DROP POLICY IF EXISTS "Users can delete own replies" ON forum_replies;

CREATE POLICY "Authenticated users can create replies"
  ON forum_replies FOR INSERT
  TO authenticated
  WITH CHECK (auth_uid() = user_id);

CREATE POLICY "Users can update own replies"
  ON forum_replies FOR UPDATE
  TO authenticated
  USING (auth_uid() = user_id)
  WITH CHECK (auth_uid() = user_id);

CREATE POLICY "Users can delete own replies"
  ON forum_replies FOR DELETE
  TO authenticated
  USING (auth_uid() = user_id);

-- Fix update_updated_at_column function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
