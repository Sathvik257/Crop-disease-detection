/*
  # Remove Unused Indexes

  ## Overview
  This migration removes database indexes that are not being used by queries.
  Unused indexes consume disk space and slow down write operations (INSERT, UPDATE, DELETE)
  without providing any query performance benefits.

  ## Indexes Removed
  
  ### disease_info table
  - idx_disease_info_crop_type
  
  ### solutions table
  - idx_solutions_category
  
  ### user_analyses table
  - idx_user_analyses_disease
  - idx_user_analyses_date
  
  ### treatment_logs table
  - idx_treatment_logs_analysis_id
  - idx_treatment_logs_date
  
  ### disease_alerts table
  - idx_disease_alerts_dates
  - idx_disease_alerts_disease
  
  ### forum_posts table
  - idx_forum_posts_user_id
  - idx_forum_posts_disease
  - idx_forum_posts_date
  
  ### forum_replies table
  - idx_forum_replies_post_id
  - idx_forum_replies_user_id
  
  ### video_tutorials table
  - idx_video_tutorials_disease
  - idx_video_tutorials_category
  
  ### weather_data table
  - idx_weather_data_location
  - idx_weather_data_fetched

  ## Notes
  Indexes on foreign keys (user_id) and primary indexes are kept as they're essential
  for maintaining referential integrity and basic query performance.
*/

-- disease_info table
DROP INDEX IF EXISTS idx_disease_info_crop_type;

-- solutions table
DROP INDEX IF EXISTS idx_solutions_category;

-- user_analyses table
DROP INDEX IF EXISTS idx_user_analyses_disease;
DROP INDEX IF EXISTS idx_user_analyses_date;

-- treatment_logs table
DROP INDEX IF EXISTS idx_treatment_logs_analysis_id;
DROP INDEX IF EXISTS idx_treatment_logs_date;

-- disease_alerts table
DROP INDEX IF EXISTS idx_disease_alerts_dates;
DROP INDEX IF EXISTS idx_disease_alerts_disease;

-- forum_posts table
DROP INDEX IF EXISTS idx_forum_posts_user_id;
DROP INDEX IF EXISTS idx_forum_posts_disease;
DROP INDEX IF EXISTS idx_forum_posts_date;

-- forum_replies table
DROP INDEX IF EXISTS idx_forum_replies_post_id;
DROP INDEX IF EXISTS idx_forum_replies_user_id;

-- video_tutorials table
DROP INDEX IF EXISTS idx_video_tutorials_disease;
DROP INDEX IF EXISTS idx_video_tutorials_category;

-- weather_data table
DROP INDEX IF EXISTS idx_weather_data_location;
DROP INDEX IF EXISTS idx_weather_data_fetched;
