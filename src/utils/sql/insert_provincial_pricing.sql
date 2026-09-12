-- ============================================
-- INSERT PROVINCIAL PRICING MULTIPLIERS
-- ============================================
-- This script populates the provincial_price_multipliers table with all 9 SA provinces
-- Run this script in Supabase SQL Editor to fix the warning:
-- "⚠️ No provincial pricing factors found in database. Using fallback data."

-- First, ensure the table exists with correct schema
CREATE TABLE IF NOT EXISTS provincial_price_multipliers (
  province_code TEXT PRIMARY KEY,
  province_name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  multiplier DECIMAL(4, 2) NOT NULL DEFAULT 1.00,
  major_city TEXT NOT NULL,
  logistics_notes TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE provincial_price_multipliers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (this is reference data)
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS provincial_price_multipliers_select ON provincial_price_multipliers;
  DROP POLICY IF EXISTS provincial_price_multipliers_insert ON provincial_price_multipliers;
  DROP POLICY IF EXISTS provincial_price_multipliers_update ON provincial_price_multipliers;

  -- Create new policies
  CREATE POLICY provincial_price_multipliers_select 
    ON provincial_price_multipliers FOR SELECT 
    TO public 
    USING (true);

  CREATE POLICY provincial_price_multipliers_insert 
    ON provincial_price_multipliers FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

  CREATE POLICY provincial_price_multipliers_update 
    ON provincial_price_multipliers FOR UPDATE 
    TO authenticated 
    USING (true)
    WITH CHECK (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- INSERT ALL 9 SOUTH AFRICAN PROVINCES
-- ============================================
-- Using UPSERT (INSERT ... ON CONFLICT) to avoid duplicates

INSERT INTO provincial_price_multipliers (province_code, province_name, short_name, multiplier, major_city, logistics_notes)
VALUES
  ('gauteng', 'Gauteng', 'GP', 1.00, 'Johannesburg', 'Base pricing - manufacturing hub, central distribution'),
  ('western-cape', 'Western Cape', 'WC', 1.05, 'Cape Town', '+5% - Distance from GP, coastal logistics'),
  ('kwazulu-natal', 'KwaZulu-Natal', 'KZN', 1.03, 'Durban', '+3% - Coastal port access, good infrastructure'),
  ('eastern-cape', 'Eastern Cape', 'EC', 1.08, 'Port Elizabeth', '+8% - Distance + rural logistics challenges'),
  ('limpopo', 'Limpopo', 'LP', 1.06, 'Polokwane', '+6% - Rural delivery, lower volume'),
  ('mpumalanga', 'Mpumalanga', 'MP', 1.04, 'Nelspruit', '+4% - Proximity to Gauteng, moderate volume'),
  ('north-west', 'North West', 'NW', 1.07, 'Rustenburg', '+7% - Mining region, scattered demand'),
  ('free-state', 'Free State', 'FS', 1.05, 'Bloemfontein', '+5% - Central location but lower volume'),
  ('northern-cape', 'Northern Cape', 'NC', 1.12, 'Kimberley', '+12% - Most remote, very low volume')
ON CONFLICT (province_code) 
DO UPDATE SET
  province_name = EXCLUDED.province_name,
  short_name = EXCLUDED.short_name,
  multiplier = EXCLUDED.multiplier,
  major_city = EXCLUDED.major_city,
  logistics_notes = EXCLUDED.logistics_notes,
  last_updated = NOW();

-- ============================================
-- VERIFY THE DATA
-- ============================================
-- Run this query to confirm all 9 provinces are inserted:
SELECT 
  province_code,
  province_name,
  short_name,
  multiplier,
  major_city,
  logistics_notes
FROM provincial_price_multipliers
ORDER BY multiplier;

-- Expected output: 9 rows
-- GP (1.00), KZN (1.03), MP (1.04), WC (1.05), FS (1.05), LP (1.06), NW (1.07), EC (1.08), NC (1.12)

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully inserted/updated % provincial pricing factors', 
    (SELECT COUNT(*) FROM provincial_price_multipliers);
END $$;
