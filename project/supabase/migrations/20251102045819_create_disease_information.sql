/*
  # Create Disease Information Table

  1. New Tables
    - `disease_info`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Full disease name
      - `crop_type` (text) - Type of crop affected
      - `symptoms` (text) - Disease symptoms
      - `causes` (text) - Causes of the disease
      - `prevention` (text) - Prevention methods
      - `treatment` (text) - Treatment recommendations
      - `severity` (text) - Disease severity level
      - `affected_parts` (text[]) - Plant parts affected
      - `optimal_conditions` (text) - Conditions favorable for disease
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `disease_info` table
    - Add policy for public read access
    - Add policy for public insert access (for demo)

  3. Indexes
    - Index on crop_type for faster filtering
    - Index on name for search functionality
*/

CREATE TABLE IF NOT EXISTS disease_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  crop_type text NOT NULL,
  symptoms text NOT NULL,
  causes text NOT NULL,
  prevention text NOT NULL,
  treatment text NOT NULL,
  severity text NOT NULL DEFAULT 'Medium',
  affected_parts text[] DEFAULT ARRAY[]::text[],
  optimal_conditions text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE disease_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to disease info"
  ON disease_info
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to disease info"
  ON disease_info
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_disease_info_crop_type 
  ON disease_info(crop_type);

CREATE INDEX IF NOT EXISTS idx_disease_info_name 
  ON disease_info(name);

INSERT INTO disease_info (name, crop_type, symptoms, causes, prevention, treatment, severity, affected_parts, optimal_conditions)
VALUES 
  ('Apple - Apple scab', 'Apple', 'Olive-green to brown spots on leaves, fruit and young twigs. Leaves may curl and fall prematurely.', 'Fungus Venturia inaequalis, spreads through water splash and wind.', 'Remove fallen leaves, prune to improve air circulation, use resistant varieties, apply fungicides preventively.', 'Apply fungicides (captan, myclobutanil) at bud break, remove infected parts, maintain tree hygiene.', 'High', ARRAY['Leaves', 'Fruit', 'Twigs'], 'Cool, wet spring weather (60-70°F) with frequent rain'),
  
  ('Apple - Black rot', 'Apple', 'Purple spots on leaves, brown circular lesions with target-like rings on fruit. Cankers on branches.', 'Fungus Botryosphaeria obtusa, enters through wounds and spreads in warm, wet conditions.', 'Prune out cankers and dead wood, remove mummified fruit, improve drainage, maintain tree vigor.', 'Apply fungicides (captan, thiophanate-methyl), remove infected material, sanitize pruning tools.', 'Medium', ARRAY['Leaves', 'Fruit', 'Branches'], 'Warm temperatures (70-85°F) with high humidity'),
  
  ('Tomato - Early blight', 'Tomato', 'Dark brown spots with concentric rings on lower leaves, yellowing and leaf drop. Stem lesions may appear.', 'Fungus Alternaria solani, overwinters in soil debris.', 'Rotate crops, mulch around plants, water at base, remove lower leaves, use resistant varieties.', 'Apply fungicides (chlorothalonil, copper compounds), prune affected leaves, ensure proper spacing.', 'Medium', ARRAY['Leaves', 'Stems', 'Fruit'], 'Warm days (75-85°F), cool nights, high humidity'),
  
  ('Tomato - Late blight', 'Tomato', 'Water-soaked spots on leaves that turn brown, white mold on undersides. Fruit develops brown lesions.', 'Fungus-like oomycete Phytophthora infestans, spreads rapidly in cool, wet weather.', 'Avoid overhead watering, provide good air circulation, destroy infected plants immediately, use resistant varieties.', 'Apply fungicides (chlorothalonil, copper) at first sign, remove infected plants entirely, monitor closely.', 'Very High', ARRAY['Leaves', 'Stems', 'Fruit'], 'Cool, wet weather (60-70°F) with high humidity'),
  
  ('Corn - Common rust', 'Corn', 'Small, circular to elongated orange-brown pustules on both leaf surfaces.', 'Fungus Puccinia sorghi, spreads by wind-borne spores.', 'Plant resistant hybrids, ensure proper spacing, monitor fields regularly.', 'Apply fungicides (azoxystrobin, propiconazole) if severe, usually not economically necessary.', 'Low', ARRAY['Leaves'], 'Cool to moderate temps (60-75°F), high humidity, heavy dew'),
  
  ('Corn - Northern Leaf Blight', 'Corn', 'Long, cigar-shaped grayish-green to tan lesions on leaves, may span entire leaf.', 'Fungus Exserohilum turcicum, survives on crop residue.', 'Use resistant hybrids, rotate crops, till under residue, plant at recommended density.', 'Apply fungicides (azoxystrobin, pyraclostrobin) at first symptoms if conditions favor disease.', 'Medium', ARRAY['Leaves'], 'Moderate temps (65-80°F), extended leaf wetness, high humidity'),
  
  ('Grape - Black rot', 'Grape', 'Small brown spots on leaves with dark borders. Fruit shows brown lesions and mummifies.', 'Fungus Guignardia bidwellii, overwinters in mummified berries and canes.', 'Remove mummified fruit, prune out diseased canes, ensure good air circulation, fungicide applications.', 'Apply fungicides (mancozeb, myclobutanil) from bud break through fruit set, sanitation is critical.', 'High', ARRAY['Leaves', 'Fruit', 'Shoots'], 'Warm, wet springs (70-80°F), frequent rain during bloom and fruit development'),
  
  ('Potato - Early blight', 'Potato', 'Dark brown spots with concentric rings on older leaves, stem lesions with similar pattern.', 'Fungus Alternaria solani, favored by warm conditions and plant stress.', 'Rotate crops, use certified seed, maintain plant vigor, avoid overhead irrigation, destroy crop residue.', 'Apply fungicides (chlorothalonil, azoxystrobin), remove infected foliage, ensure adequate nutrition.', 'Medium', ARRAY['Leaves', 'Stems', 'Tubers'], 'Warm temps (75-85°F), alternating wet and dry periods'),
  
  ('Potato - Late blight', 'Potato', 'Water-soaked lesions on leaves turning brown-black, white mold on undersides. Tubers show brown rot.', 'Oomycete Phytophthora infestans, same organism as tomato late blight.', 'Use certified seed, plant resistant varieties, destroy cull piles, monitor weather conditions, apply preventive fungicides.', 'Apply fungicides (chlorothalonil, mancozeb, cymoxanil) preventively, destroy infected plants, harvest before disease spreads.', 'Very High', ARRAY['Leaves', 'Stems', 'Tubers'], 'Cool, wet conditions (60-70°F), high humidity, prolonged leaf wetness'),
  
  ('Pepper - Bacterial spot', 'Pepper', 'Small water-soaked spots on leaves becoming dark with yellow halos. Fruit shows raised, corky spots.', 'Bacteria Xanthomonas species, spreads by water splash and contaminated tools.', 'Use disease-free seed and transplants, avoid overhead watering, sanitize equipment, crop rotation.', 'Apply copper-based bactericides, remove infected plants, no cure once established, focus on prevention.', 'Medium', ARRAY['Leaves', 'Fruit'], 'Warm, humid conditions (75-85°F), frequent rain or overhead irrigation')
ON CONFLICT (name) DO NOTHING;