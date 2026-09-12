-- Provincial Pricing Factors Table
-- This table stores the base pricing indices/multipliers for all 9 South African provinces
-- Used by Qilly to calculate regional price variations based on transportation costs and market dynamics

-- Create the provincial_price_multipliers table
CREATE TABLE IF NOT EXISTS provincial_price_multipliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province_code TEXT NOT NULL UNIQUE,  -- Changed from VARCHAR(2) to TEXT, now uses 'gauteng' format
  province_name TEXT NOT NULL,         -- Changed from VARCHAR(50) to TEXT
  short_name TEXT NOT NULL,            -- NEW: 2-letter code like 'GP', 'WC'
  multiplier DECIMAL(4, 2) NOT NULL DEFAULT 1.00,  -- Changed from pricing_factor to multiplier
  major_city TEXT NOT NULL,            -- NEW: Major city for reference
  logistics_notes TEXT,                -- Changed from description to logistics_notes
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- Changed from created_at/updated_at
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups by province code
CREATE INDEX IF NOT EXISTS idx_provincial_price_multipliers_code ON provincial_price_multipliers(province_code);

-- Create index for short_name lookups
CREATE INDEX IF NOT EXISTS idx_provincial_price_multipliers_short_name ON provincial_price_multipliers(short_name);

-- Enable RLS
ALTER TABLE provincial_price_multipliers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (this is reference data)
DO $$ 
BEGIN
  DROP POLICY IF EXISTS provincial_price_multipliers_select ON provincial_price_multipliers;
  DROP POLICY IF EXISTS provincial_price_multipliers_insert ON provincial_price_multipliers;
  DROP POLICY IF EXISTS provincial_price_multipliers_update ON provincial_price_multipliers;

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

-- Insert provincial pricing factors for all 9 South African provinces
-- Base pricing province: Gauteng (manufacturing and distribution hub)
-- All other provinces have adjustments based on distance from GP and logistics costs

INSERT INTO provincial_price_multipliers (province_code, province_name, short_name, multiplier, major_city, logistics_notes) VALUES
  ('gauteng', 'Gauteng', 'GP', 1.00, 'Johannesburg', 'Base pricing - manufacturing hub, central distribution'),
  ('western-cape', 'Western Cape', 'WC', 1.05, 'Cape Town', '+5% - Distance from GP, coastal logistics'),
  ('kwazulu-natal', 'KwaZulu-Natal', 'KZN', 1.03, 'Durban', '+3% - Coastal port access, good infrastructure'),
  ('eastern-cape', 'Eastern Cape', 'EC', 1.08, 'Port Elizabeth', '+8% - Distance + rural logistics challenges'),
  ('limpopo', 'Limpopo', 'LP', 1.06, 'Polokwane', '+6% - Rural delivery, lower volume'),
  ('mpumalanga', 'Mpumalanga', 'MP', 1.04, 'Nelspruit', '+4% - Proximity to Gauteng, moderate volume'),
  ('north-west', 'North West', 'NW', 1.07, 'Rustenburg', '+7% - Mining region, scattered demand'),
  ('free-state', 'Free State', 'FS', 1.05, 'Bloemfontein', '+5% - Central location but lower volume'),
  ('northern-cape', 'Northern Cape', 'NC', 1.12, 'Kimberley', '+12% - Most remote, very low volume')
ON CONFLICT (province_code) DO UPDATE SET
  province_name = EXCLUDED.province_name,
  short_name = EXCLUDED.short_name,
  multiplier = EXCLUDED.multiplier,
  major_city = EXCLUDED.major_city,
  logistics_notes = EXCLUDED.logistics_notes,
  last_updated = NOW();

-- Create a function to automatically update the last_updated timestamp
CREATE OR REPLACE FUNCTION update_provincial_price_multipliers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before updates
DROP TRIGGER IF EXISTS set_provincial_price_multipliers_updated_at ON provincial_price_multipliers;
CREATE TRIGGER set_provincial_price_multipliers_updated_at
  BEFORE UPDATE ON provincial_price_multipliers
  FOR EACH ROW
  EXECUTE FUNCTION update_provincial_price_multipliers_updated_at();

-- Add comments to document the table and columns
COMMENT ON TABLE provincial_price_multipliers IS 'Stores base pricing indices/multipliers for all 9 South African provinces used in regional price optimization';
COMMENT ON COLUMN provincial_price_multipliers.province_code IS 'Province code in kebab-case format (gauteng, western-cape, kwazulu-natal, etc.)';
COMMENT ON COLUMN provincial_price_multipliers.province_name IS 'Full name of the province';
COMMENT ON COLUMN provincial_price_multipliers.short_name IS 'Two-letter province code (GP, WC, KZN, EC, FS, LP, MP, NC, NW)';
COMMENT ON COLUMN provincial_price_multipliers.multiplier IS 'Multiplier applied to base prices (1.0 = no adjustment, >1.0 = price increase)';
COMMENT ON COLUMN provincial_price_multipliers.major_city IS 'Major city in the province for reference';
COMMENT ON COLUMN provincial_price_multipliers.logistics_notes IS 'Explanation of the pricing factor and regional logistics characteristics';

-- Verify the data
SELECT 
  province_code,
  province_name,
  short_name,
  multiplier,
  major_city,
  logistics_notes
FROM provincial_price_multipliers
ORDER BY multiplier;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully inserted/updated % provincial pricing factors', 
    (SELECT COUNT(*) FROM provincial_price_multipliers);
END $$;