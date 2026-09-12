-- ⚡ QUICK FIX: Provincial Pricing Data
-- Copy this entire script and paste into Supabase SQL Editor
-- Then click "Run" to populate the provincial_price_multipliers table

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS provincial_price_multipliers (
  province_code TEXT PRIMARY KEY,
  province_name TEXT NOT NULL,
  short_name TEXT NOT NULL UNIQUE,
  multiplier NUMERIC(4, 3) NOT NULL DEFAULT 1.000,
  major_city TEXT NOT NULL,
  logistics_notes TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Clear and populate with South African provincial pricing data
TRUNCATE TABLE provincial_price_multipliers;

INSERT INTO provincial_price_multipliers VALUES
  ('gauteng', 'Gauteng', 'GP', 1.000, 'Johannesburg', 'Baseline province: Highest supplier density, best logistics infrastructure', NOW()),
  ('western-cape', 'Western Cape', 'WC', 1.045, 'Cape Town', 'Major port city. +4.5% transport from Gauteng manufacturers', NOW()),
  ('kwazulu-natal', 'KwaZulu-Natal', 'KZN', 1.035, 'Durban', 'Major port. +3.5% transport costs from Gauteng', NOW()),
  ('eastern-cape', 'Eastern Cape', 'EC', 1.085, 'Port Elizabeth', '+8.5% distance, less competition, transport costs', NOW()),
  ('free-state', 'Free State', 'FS', 1.025, 'Bloemfontein', '+2.5% smaller market, central location', NOW()),
  ('mpumalanga', 'Mpumalanga', 'MP', 1.020, 'Mbombela', '+2.0% smaller market, proximity to Gauteng', NOW()),
  ('limpopo', 'Limpopo', 'LP', 1.095, 'Polokwane', '+9.5% distance, limited competition, transport costs', NOW()),
  ('north-west', 'North West', 'NW', 1.040, 'Mahikeng', '+4.0% smaller market, mining activity provides local supply', NOW()),
  ('northern-cape', 'Northern Cape', 'NC', 1.125, 'Kimberley', '+12.5% extreme remoteness, limited suppliers', NOW());

-- Enable Row Level Security and allow public read access
ALTER TABLE provincial_price_multipliers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON provincial_price_multipliers;
CREATE POLICY "Allow public read access" ON provincial_price_multipliers
  FOR SELECT TO PUBLIC USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_provincial_price_multipliers_short_name 
  ON provincial_price_multipliers(short_name);

-- ✅ Verify: Should show 9 provinces
SELECT short_name, province_name, multiplier FROM provincial_price_multipliers ORDER BY multiplier;
