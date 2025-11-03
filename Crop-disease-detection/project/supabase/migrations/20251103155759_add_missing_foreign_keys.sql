/*
  # Add Missing Foreign Key Constraints

  ## Overview
  This migration adds foreign key constraints for user_id columns that were missing
  proper referential integrity checks. These constraints ensure data consistency
  and enable proper cascading behaviors.

  ## Foreign Keys Added
  
  ### forum_posts table
  - forum_posts_user_id_fkey: References user_profiles(id)
  
  ### forum_replies table
  - forum_replies_user_id_fkey: References user_profiles(id)
  
  ### treatment_logs table
  - treatment_logs_user_id_fkey: References user_profiles(id)

  ## Notes
  - All foreign keys use ON DELETE CASCADE to remove dependent records
  - Indexes already exist on these columns for optimal performance
*/

-- Add foreign key constraint for forum_posts.user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'forum_posts_user_id_fkey' 
    AND table_name = 'forum_posts'
  ) THEN
    ALTER TABLE forum_posts
      ADD CONSTRAINT forum_posts_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES user_profiles(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key constraint for forum_replies.user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'forum_replies_user_id_fkey' 
    AND table_name = 'forum_replies'
  ) THEN
    ALTER TABLE forum_replies
      ADD CONSTRAINT forum_replies_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES user_profiles(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key constraint for treatment_logs.user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'treatment_logs_user_id_fkey' 
    AND table_name = 'treatment_logs'
  ) THEN
    ALTER TABLE treatment_logs
      ADD CONSTRAINT treatment_logs_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES user_profiles(id)
      ON DELETE CASCADE;
  END IF;
END $$;
