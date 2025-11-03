/*
  # Enhanced User Management and Tracking System

  ## Overview
  This migration adds comprehensive user authentication, analysis tracking, treatment monitoring, and community features to the crop disease detection system.

  ## New Tables

  ### 1. `user_profiles`
  User profile information linked to auth.users
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text) - User's full name
  - `farm_name` (text) - Name of their farm
  - `location` (text) - Farm location
  - `phone` (text) - Contact number
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. `user_analyses`
  Detailed analysis history for authenticated users
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users) - User who performed analysis
  - `disease_detected` (text) - Name of detected disease
  - `confidence` (numeric) - AI confidence score (0-100)
  - `image_url` (text) - URL to uploaded image
  - `location` (text) - GPS coordinates or location name
  - `field_size` (numeric) - Size of affected field in acres
  - `notes` (text) - User notes about the analysis
  - `analyzed_at` (timestamptz) - When analysis was performed

  ### 3. `treatment_logs`
  Track treatments applied and their effectiveness
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `analysis_id` (uuid, references user_analyses) - Related analysis
  - `treatment_type` (text) - Type of treatment (chemical, organic, cultural)
  - `products_used` (jsonb) - Array of products/methods used
  - `application_date` (date) - When treatment was applied
  - `cost` (numeric) - Treatment cost
  - `field_size_treated` (numeric) - Area treated in acres
  - `effectiveness_rating` (integer) - User rating 1-5
  - `before_image_url` (text) - Image before treatment
  - `after_image_url` (text) - Image after treatment
  - `notes` (text) - Treatment notes
  - `created_at` (timestamptz)

  ### 4. `disease_alerts`
  Seasonal and regional disease alerts
  - `id` (uuid, primary key)
  - `disease_name` (text) - Disease name
  - `region` (text) - Affected region
  - `season` (text) - Season when alert is active
  - `severity_level` (text) - Alert severity (low, medium, high)
  - `alert_message` (text) - Alert message
  - `prevention_tips` (text) - Quick prevention tips
  - `active_from` (date) - Alert start date
  - `active_until` (date) - Alert end date
  - `created_at` (timestamptz)

  ### 5. `forum_posts`
  Community forum for farmers to share experiences
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `disease_name` (text) - Related disease
  - `title` (text) - Post title
  - `content` (text) - Post content
  - `images` (jsonb) - Array of image URLs
  - `likes_count` (integer) - Number of likes
  - `replies_count` (integer) - Number of replies
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. `forum_replies`
  Replies to forum posts
  - `id` (uuid, primary key)
  - `post_id` (uuid, references forum_posts)
  - `user_id` (uuid, references auth.users)
  - `content` (text) - Reply content
  - `likes_count` (integer) - Number of likes
  - `created_at` (timestamptz)

  ### 7. `video_tutorials`
  Educational video content library
  - `id` (uuid, primary key)
  - `disease_name` (text) - Related disease
  - `title` (text) - Video title
  - `description` (text) - Video description
  - `video_url` (text) - URL to video
  - `thumbnail_url` (text) - Video thumbnail
  - `duration_seconds` (integer) - Video length
  - `category` (text) - Tutorial category (identification, treatment, prevention)
  - `views_count` (integer) - View count
  - `created_at` (timestamptz)

  ### 8. `weather_data`
  Cache for weather API data
  - `id` (uuid, primary key)
  - `location` (text) - Location identifier
  - `temperature` (numeric) - Temperature in Celsius
  - `humidity` (numeric) - Humidity percentage
  - `rainfall` (numeric) - Rainfall in mm
  - `conditions` (text) - Weather conditions
  - `risk_factors` (jsonb) - Disease risk factors based on weather
  - `fetched_at` (timestamptz) - When data was fetched

  ## Security
  - Enable RLS on all new tables
  - Users can only view/edit their own profiles, analyses, and treatments
  - Forum posts and replies are publicly readable but only editable by owners
  - Disease alerts, tutorials, and weather data are publicly readable
  - Admins have full access (can be managed via app_metadata)

  ## Indexes
  - Add indexes on foreign keys for better query performance
  - Add indexes on commonly queried fields (disease_name, user_id, dates)
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  farm_name text DEFAULT '',
  location text DEFAULT '',
  phone text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User Analyses Table
CREATE TABLE IF NOT EXISTS user_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  disease_detected text NOT NULL,
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  image_url text,
  location text DEFAULT '',
  field_size numeric DEFAULT 0,
  notes text DEFAULT '',
  analyzed_at timestamptz DEFAULT now()
);

ALTER TABLE user_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON user_analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON user_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON user_analyses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON user_analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_analyses_user_id ON user_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analyses_disease ON user_analyses(disease_detected);
CREATE INDEX IF NOT EXISTS idx_user_analyses_date ON user_analyses(analyzed_at DESC);

-- Treatment Logs Table
CREATE TABLE IF NOT EXISTS treatment_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id uuid REFERENCES user_analyses(id) ON DELETE SET NULL,
  treatment_type text NOT NULL DEFAULT 'chemical',
  products_used jsonb DEFAULT '[]'::jsonb,
  application_date date NOT NULL DEFAULT CURRENT_DATE,
  cost numeric DEFAULT 0,
  field_size_treated numeric DEFAULT 0,
  effectiveness_rating integer CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  before_image_url text,
  after_image_url text,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE treatment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own treatments"
  ON treatment_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own treatments"
  ON treatment_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own treatments"
  ON treatment_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own treatments"
  ON treatment_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_treatment_logs_user_id ON treatment_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_treatment_logs_analysis_id ON treatment_logs(analysis_id);
CREATE INDEX IF NOT EXISTS idx_treatment_logs_date ON treatment_logs(application_date DESC);

-- Disease Alerts Table
CREATE TABLE IF NOT EXISTS disease_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  disease_name text NOT NULL,
  region text NOT NULL DEFAULT 'Global',
  season text NOT NULL,
  severity_level text NOT NULL DEFAULT 'medium',
  alert_message text NOT NULL,
  prevention_tips text DEFAULT '',
  active_from date NOT NULL DEFAULT CURRENT_DATE,
  active_until date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE disease_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active alerts"
  ON disease_alerts FOR SELECT
  TO authenticated, anon
  USING (CURRENT_DATE BETWEEN active_from AND active_until);

CREATE INDEX IF NOT EXISTS idx_disease_alerts_dates ON disease_alerts(active_from, active_until);
CREATE INDEX IF NOT EXISTS idx_disease_alerts_disease ON disease_alerts(disease_name);

-- Forum Posts Table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  disease_name text DEFAULT '',
  title text NOT NULL,
  content text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  likes_count integer DEFAULT 0,
  replies_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum posts"
  ON forum_posts FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON forum_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON forum_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_disease ON forum_posts(disease_name);
CREATE INDEX IF NOT EXISTS idx_forum_posts_date ON forum_posts(created_at DESC);

-- Forum Replies Table
CREATE TABLE IF NOT EXISTS forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view replies"
  ON forum_replies FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON forum_replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own replies"
  ON forum_replies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own replies"
  ON forum_replies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_user_id ON forum_replies(user_id);

-- Video Tutorials Table
CREATE TABLE IF NOT EXISTS video_tutorials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  disease_name text DEFAULT '',
  title text NOT NULL,
  description text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text DEFAULT '',
  duration_seconds integer DEFAULT 0,
  category text NOT NULL DEFAULT 'general',
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE video_tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tutorials"
  ON video_tutorials FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_video_tutorials_disease ON video_tutorials(disease_name);
CREATE INDEX IF NOT EXISTS idx_video_tutorials_category ON video_tutorials(category);

-- Weather Data Cache Table
CREATE TABLE IF NOT EXISTS weather_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  temperature numeric,
  humidity numeric,
  rainfall numeric,
  conditions text DEFAULT '',
  risk_factors jsonb DEFAULT '{}'::jsonb,
  fetched_at timestamptz DEFAULT now()
);

ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view weather data"
  ON weather_data FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_weather_data_location ON weather_data(location);
CREATE INDEX IF NOT EXISTS idx_weather_data_fetched ON weather_data(fetched_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at') THEN
    CREATE TRIGGER update_user_profiles_updated_at
      BEFORE UPDATE ON user_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_forum_posts_updated_at') THEN
    CREATE TRIGGER update_forum_posts_updated_at
      BEFORE UPDATE ON forum_posts
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;