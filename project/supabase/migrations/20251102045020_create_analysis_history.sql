/*
  # Create Analysis History Table

  1. New Tables
    - `analysis_history`
      - `id` (uuid, primary key) - Unique identifier for each analysis
      - `disease_detected` (text) - Name of the disease detected
      - `confidence` (numeric) - Confidence score of the prediction
      - `analyzed_at` (timestamptz) - Timestamp of when analysis was performed
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `analysis_history` table
    - Add policy for public read access (for demo purposes)
    - Add policy for public insert access (for demo purposes)

  3. Notes
    - This is a simplified schema for demonstration purposes
    - In production, you would add user authentication and restrict access
*/

CREATE TABLE IF NOT EXISTS analysis_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  disease_detected text NOT NULL,
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  analyzed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON analysis_history
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access"
  ON analysis_history
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_analysis_history_analyzed_at 
  ON analysis_history(analyzed_at DESC);