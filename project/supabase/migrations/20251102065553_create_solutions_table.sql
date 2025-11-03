/*
  # Create Solutions Table for Disease Treatment Recommendations

  1. New Tables
    - `solutions`
      - `id` (uuid, primary key)
      - `disease_name` (text) - Name of the disease
      - `category` (text) - Solution category (immediate, treatment, fertilizer, soil, etc.)
      - `title` (text) - Solution title
      - `description` (text) - Brief description
      - `items` (jsonb) - Array of solution items/steps
      - `priority` (text) - Priority level (high, medium, low)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `solutions` table
    - Add policy for public read access (no auth required for viewing solutions)
*/

CREATE TABLE IF NOT EXISTS solutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  disease_name text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  priority text NOT NULL DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read solutions"
  ON solutions
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_solutions_disease ON solutions(disease_name);
CREATE INDEX IF NOT EXISTS idx_solutions_category ON solutions(category);
