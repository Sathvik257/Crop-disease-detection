/*
  # Fix RLS Performance Issues

  ## Changes
  This migration optimizes all RLS policies by wrapping auth.uid() calls in SELECT statements
  to prevent re-evaluation for each row, significantly improving query performance at scale.

  ## Tables Updated
  - user_profiles: All 3 policies optimized
  - user_analyses: All 4 policies optimized  
  - treatment_logs: All 4 policies optimized
  - forum_posts: All 3 policies optimized
  - forum_replies: All 3 policies optimized

  ## Security Function Fix
  - update_updated_at_column: Set immutable search_path for security
*/

-- Drop existing policies for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Recreate optimized policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- Drop existing policies for user_analyses
DROP POLICY IF EXISTS "Users can view own analyses" ON user_analyses;
DROP POLICY IF EXISTS "Users can insert own analyses" ON user_analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON user_analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON user_analyses;

-- Recreate optimized policies for user_analyses
CREATE POLICY "Users can view own analyses"
  ON user_analyses FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own analyses"
  ON user_analyses FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own analyses"
  ON user_analyses FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own analyses"
  ON user_analyses FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Drop existing policies for treatment_logs
DROP POLICY IF EXISTS "Users can view own treatments" ON treatment_logs;
DROP POLICY IF EXISTS "Users can insert own treatments" ON treatment_logs;
DROP POLICY IF EXISTS "Users can update own treatments" ON treatment_logs;
DROP POLICY IF EXISTS "Users can delete own treatments" ON treatment_logs;

-- Recreate optimized policies for treatment_logs
CREATE POLICY "Users can view own treatments"
  ON treatment_logs FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own treatments"
  ON treatment_logs FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own treatments"
  ON treatment_logs FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own treatments"
  ON treatment_logs FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Drop existing policies for forum_posts
DROP POLICY IF EXISTS "Authenticated users can create posts" ON forum_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON forum_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON forum_posts;

-- Recreate optimized policies for forum_posts
CREATE POLICY "Authenticated users can create posts"
  ON forum_posts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own posts"
  ON forum_posts FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own posts"
  ON forum_posts FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Drop existing policies for forum_replies
DROP POLICY IF EXISTS "Authenticated users can create replies" ON forum_replies;
DROP POLICY IF EXISTS "Users can update own replies" ON forum_replies;
DROP POLICY IF EXISTS "Users can delete own replies" ON forum_replies;

-- Recreate optimized policies for forum_replies
CREATE POLICY "Authenticated users can create replies"
  ON forum_replies FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own replies"
  ON forum_replies FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own replies"
  ON forum_replies FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Fix function security issue by setting immutable search_path
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

-- Recreate triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
