/*
  # Add Foreign Key Indexes

  ## Overview
  This migration adds indexes for foreign key columns that are missing covering indexes.
  Foreign key columns should be indexed to improve JOIN performance and referential
  integrity check performance.

  ## Indexes Added
  
  ### forum_posts table
  - idx_forum_posts_user_id: Index on user_id foreign key
  
  ### forum_replies table
  - idx_forum_replies_post_id: Index on post_id foreign key
  - idx_forum_replies_user_id: Index on user_id foreign key
  
  ### treatment_logs table
  - idx_treatment_logs_analysis_id: Index on analysis_id foreign key

  ## Performance Impact
  - Improves JOIN query performance
  - Speeds up foreign key constraint validation
  - Enhances DELETE cascade operations
  - Minimal impact on write operations
*/

-- Add index for forum_posts.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id 
  ON forum_posts(user_id);

-- Add index for forum_replies.post_id foreign key
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id 
  ON forum_replies(post_id);

-- Add index for forum_replies.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_forum_replies_user_id 
  ON forum_replies(user_id);

-- Add index for treatment_logs.analysis_id foreign key
CREATE INDEX IF NOT EXISTS idx_treatment_logs_analysis_id 
  ON treatment_logs(analysis_id);
