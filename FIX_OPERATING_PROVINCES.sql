-- ============================================
-- FIX: Add operating_provinces column to suppliers table
-- ============================================
-- Run this in Supabase SQL Editor

-- Add operating_provinces column if it doesn't exist
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS operating_provinces TEXT[] DEFAULT '{}';

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_suppliers_operating_provinces 
  ON suppliers USING GIN (operating_provinces);

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'suppliers' 
AND column_name = 'operating_provinces';

-- Show current suppliers and their provinces
SELECT 
  name,
  category,
  operating_provinces,
  is_active,
  last_sync
FROM suppliers
ORDER BY name;

-- ============================================
-- EXPECTED RESULT:
-- ============================================
-- Suppliers should now have operating_provinces column
-- Next sync will populate this field automatically
-- Example: operating_provinces = {gauteng,western-cape,kwazulu-natal}
