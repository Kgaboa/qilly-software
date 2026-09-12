-- ============================================
-- FIX PROVINCIAL PRICING: Update to GP-only base
-- For database using EFFICIENT_PROVINCIAL_PRICING.sql schema
-- Column name: multiplier (not pricing_factor)
-- Province codes: full names like 'gauteng' (not 2-letter like 'GP')
-- Date: February 23, 2026
-- ============================================

-- ============================================
-- STEP 1: Check current values
-- ============================================
SELECT 
  '🔍 BEFORE UPDATE:' as status,
  province_code,
  province_name,
  short_name,
  multiplier,
  CASE 
    WHEN multiplier = 1.0 THEN 'Base Rate'
    ELSE '+' || ROUND((multiplier - 1.0) * 100, 1) || '%'
  END as adjustment,
  major_city,
  logistics_notes
FROM provincial_price_multipliers
ORDER BY multiplier, short_name;

-- ============================================
-- STEP 2: Update to GP-only base pricing
-- ============================================

-- Gauteng remains base (1.00)
UPDATE provincial_price_multipliers 
SET 
  multiplier = 1.00,
  logistics_notes = 'Base pricing - manufacturing hub, central distribution',
  last_updated = NOW()
WHERE province_code = 'gauteng';

-- Western Cape: Change from 1.05 to 1.05 (already correct, just update description)
UPDATE provincial_price_multipliers 
SET 
  multiplier = 1.05,
  logistics_notes = '+5% - Distance from GP, coastal logistics, port city',
  last_updated = NOW()
WHERE province_code = 'western-cape';

-- KwaZulu-Natal: Keep at 1.03 (already correct)
UPDATE provincial_price_multipliers 
SET 
  multiplier = 1.03,
  logistics_notes = '+3% - Coastal port access, good infrastructure, transport from GP',
  last_updated = NOW()
WHERE province_code = 'kwazulu-natal';

-- Mpumalanga: Change from 1.04 to 1.04 (already correct)
UPDATE provincial_price_multipliers 
SET 
  multiplier = 1.04,
  logistics_notes = '+4% - Proximity to Gauteng, moderate volume',
  last_updated = NOW()
WHERE province_code = 'mpumalanga';

-- Free State: Change from 1.05 to 1.05 (already correct)
UPDATE provincial_price_multipliers 
SET 
  multiplier = 1.05,
  logistics_notes = '+5% - Central location but lower volume',
  last_updated = NOW()
WHERE province_code = 'free-state';

-- Limpopo: Change from 1.06 to 1.06 (already correct)
UPDATE provincial_price_multipliers 
SET 
  multiplier = 1.06,
  logistics_notes = '+6% - Rural delivery, lower volume',
  last_updated = NOW()
WHERE province_code = 'limpopo';

-- North West: Change from 1.07 to 1.07 (already correct)
UPDATE provincial_price_multipliers 
SET 
  multiplier = 1.07,
  logistics_notes = '+7% - Mining region, scattered demand',
  last_updated = NOW()
WHERE province_code = 'north-west';

-- Eastern Cape: Keep at 1.08 (already correct)
UPDATE provincial_price_multipliers 
SET 
  multiplier = 1.08,
  logistics_notes = '+8% - Distance + rural logistics challenges',
  last_updated = NOW()
WHERE province_code = 'eastern-cape';

-- Northern Cape: Keep at 1.12 (already correct)
UPDATE provincial_price_multipliers 
SET 
  multiplier = 1.12,
  logistics_notes = '+12% - Most remote, very low volume',
  last_updated = NOW()
WHERE province_code = 'northern-cape';

-- ============================================
-- STEP 3: Verify updates
-- ============================================
SELECT 
  '✅ AFTER UPDATE:' as status,
  province_code,
  province_name,
  short_name,
  multiplier,
  CASE 
    WHEN multiplier = 1.0 THEN 'Base Rate'
    ELSE '+' || ROUND((multiplier - 1.0) * 100, 1) || '%'
  END as adjustment,
  major_city,
  logistics_notes
FROM provincial_price_multipliers
ORDER BY multiplier, short_name;

-- ============================================
-- STEP 4: Summary statistics
-- ============================================
SELECT 
  '📊 SUMMARY' as status,
  COUNT(*) as total_provinces,
  COUNT(CASE WHEN multiplier = 1.0 THEN 1 END) as base_provinces,
  COUNT(CASE WHEN multiplier > 1.0 THEN 1 END) as adjusted_provinces,
  ROUND(MIN(multiplier), 2) as lowest_multiplier,
  ROUND(MAX(multiplier), 2) as highest_multiplier,
  ROUND(AVG(multiplier), 3) as average_multiplier
FROM provincial_price_multipliers;

-- ============================================
-- STEP 5: Test calculation
-- ============================================
WITH sample_item AS (
  SELECT 150.00 as base_price, 'Cement 50kg Bag' as item_name
)
SELECT 
  '💰 PRICING TEST' as example,
  p.short_name as province,
  p.province_name,
  s.base_price as gp_base,
  ROUND(s.base_price * p.multiplier, 2) as provincial_price,
  ROUND((s.base_price * p.multiplier) - s.base_price, 2) as additional_cost,
  CASE 
    WHEN p.multiplier = 1.0 THEN 'Base Rate'
    ELSE '+' || ROUND((p.multiplier - 1.0) * 100, 1) || '%'
  END as markup
FROM provincial_price_multipliers p
CROSS JOIN sample_item s
ORDER BY p.multiplier, p.short_name;

-- ============================================
-- STEP 6: Final verification
-- ============================================
DO $$
DECLARE
  base_count INTEGER;
  gp_multiplier DECIMAL;
  wc_multiplier DECIMAL;
  kzn_multiplier DECIMAL;
BEGIN
  -- Count base provinces (should be 1)
  SELECT COUNT(*) INTO base_count
  FROM provincial_price_multipliers
  WHERE multiplier = 1.0;
  
  -- Get specific multipliers
  SELECT multiplier INTO gp_multiplier
  FROM provincial_price_multipliers
  WHERE province_code = 'gauteng';
  
  SELECT multiplier INTO wc_multiplier
  FROM provincial_price_multipliers
  WHERE province_code = 'western-cape';
  
  SELECT multiplier INTO kzn_multiplier
  FROM provincial_price_multipliers
  WHERE province_code = 'kwazulu-natal';
  
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'VERIFICATION RESULTS';
  RAISE NOTICE '================================================';
  
  -- Check base provinces count
  IF base_count = 1 THEN
    RAISE NOTICE '✅ Exactly 1 base province found';
  ELSE
    RAISE NOTICE '❌ ERROR: Found % base provinces (expected 1)', base_count;
  END IF;
  
  -- Check GP
  IF gp_multiplier = 1.0 THEN
    RAISE NOTICE '✅ GP (Gauteng) is base province (1.00)';
  ELSE
    RAISE NOTICE '❌ ERROR: GP multiplier is % (expected 1.00)', gp_multiplier;
  END IF;
  
  -- Check WC
  IF wc_multiplier = 1.05 THEN
    RAISE NOTICE '✅ WC (Western Cape) has +5%% adjustment (1.05)';
  ELSE
    RAISE NOTICE '⚠️  WC multiplier is % (expected 1.05)', wc_multiplier;
  END IF;
  
  -- Check KZN
  IF kzn_multiplier = 1.03 THEN
    RAISE NOTICE '✅ KZN (KwaZulu-Natal) has +3%% adjustment (1.03)';
  ELSE
    RAISE NOTICE '⚠️  KZN multiplier is % (expected 1.03)', kzn_multiplier;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'UPDATE COMPLETE!';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Your database now uses:';
  RAISE NOTICE '  • GP (Gauteng) as ONLY base province (1.00)';
  RAISE NOTICE '  • WC gets +5%% regional adjustment';
  RAISE NOTICE '  • KZN gets +3%% regional adjustment';
  RAISE NOTICE '';
  RAISE NOTICE 'BUT WAIT! Your TypeScript code needs fixing too...';
  RAISE NOTICE 'See: /FIX_TYPESCRIPT_SCHEMA_MISMATCH.md';
  RAISE NOTICE '================================================';
END $$;
