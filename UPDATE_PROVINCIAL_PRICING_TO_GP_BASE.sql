-- ============================================
-- UPDATE PROVINCIAL PRICING TO GP-ONLY BASE
-- Run this to update your database to match the new pricing structure
-- Date: February 23, 2026
-- ============================================

-- This will update your existing provincial_price_multipliers table
-- to use GP as the ONLY base province (factor 1.0)
-- All other provinces get adjustments based on distance from GP

-- ============================================
-- BACKUP: Check current values first
-- ============================================
SELECT 
  'BEFORE UPDATE:' as status,
  province_code,
  province_name,
  pricing_factor,
  CASE 
    WHEN pricing_factor = 1.0 THEN 'Base Rate'
    ELSE '+' || ROUND((pricing_factor - 1.0) * 100, 1) || '%'
  END as adjustment
FROM provincial_price_multipliers
ORDER BY province_code;

-- ============================================
-- UPDATE: New pricing factors (GP-only base)
-- ============================================
UPDATE provincial_price_multipliers SET pricing_factor = 1.05, description = 'Cape Town metro - port access but +5% transport from GP', updated_at = NOW() WHERE province_code = 'WC';
UPDATE provincial_price_multipliers SET pricing_factor = 1.00, description = 'Johannesburg/Pretoria metro - manufacturing hub, base pricing', updated_at = NOW() WHERE province_code = 'GP';
UPDATE provincial_price_multipliers SET pricing_factor = 1.03, description = 'Durban metro - port access but +3% transport from GP', updated_at = NOW() WHERE province_code = 'KZN';
UPDATE provincial_price_multipliers SET pricing_factor = 1.08, description = 'Port Elizabeth/East London - distance and rural logistics', updated_at = NOW() WHERE province_code = 'EC';
UPDATE provincial_price_multipliers SET pricing_factor = 1.05, description = 'Bloemfontein area - central location but lower volume', updated_at = NOW() WHERE province_code = 'FS';
UPDATE provincial_price_multipliers SET pricing_factor = 1.06, description = 'Polokwane area - rural delivery, lower volume', updated_at = NOW() WHERE province_code = 'LP';
UPDATE provincial_price_multipliers SET pricing_factor = 1.04, description = 'Nelspruit/Witbank area - proximity to GP, moderate costs', updated_at = NOW() WHERE province_code = 'MP';
UPDATE provincial_price_multipliers SET pricing_factor = 1.12, description = 'Kimberley area - most remote, very low volume', updated_at = NOW() WHERE province_code = 'NC';
UPDATE provincial_price_multipliers SET pricing_factor = 1.07, description = 'Rustenburg/Mahikeng area - mining region, scattered demand', updated_at = NOW() WHERE province_code = 'NW';

-- ============================================
-- VERIFY: Check updated values
-- ============================================
SELECT 
  'AFTER UPDATE:' as status,
  province_code,
  province_name,
  pricing_factor,
  CASE 
    WHEN pricing_factor = 1.0 THEN 'Base Rate'
    ELSE '+' || ROUND((pricing_factor - 1.0) * 100, 1) || '%'
  END as adjustment,
  description
FROM provincial_price_multipliers
ORDER BY pricing_factor, province_code;

-- ============================================
-- SUMMARY: Changes made
-- ============================================
SELECT 
  '✅ SUMMARY' as status,
  COUNT(*) as total_provinces,
  COUNT(CASE WHEN pricing_factor = 1.0 THEN 1 END) as base_provinces,
  COUNT(CASE WHEN pricing_factor > 1.0 THEN 1 END) as adjusted_provinces,
  ROUND(MIN(pricing_factor), 2) as lowest_factor,
  ROUND(MAX(pricing_factor), 2) as highest_factor,
  ROUND(AVG(pricing_factor), 3) as average_factor
FROM provincial_price_multipliers;

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- Base provinces: 1 (GP only)
-- Adjusted provinces: 8 (all others)
-- Lowest factor: 1.00 (GP)
-- Highest factor: 1.12 (NC)
-- Average factor: ~1.06

-- ============================================
-- VERIFICATION TEST
-- ============================================
-- Test with sample R150 cement bag
WITH sample_item AS (
  SELECT 150.00 as gp_price, 'Cement 50kg Bag' as item_name
)
SELECT 
  'PRICING EXAMPLE' as test,
  p.province_code,
  p.province_name,
  s.gp_price as gauteng_price,
  ROUND(s.gp_price * p.pricing_factor, 2) as provincial_price,
  ROUND((s.gp_price * p.pricing_factor) - s.gp_price, 2) as additional_cost,
  CASE 
    WHEN p.pricing_factor = 1.0 THEN 'Base Rate'
    ELSE '+' || ROUND((p.pricing_factor - 1.0) * 100, 1) || '%'
  END as markup
FROM provincial_price_multipliers p
CROSS JOIN sample_item s
ORDER BY p.pricing_factor, p.province_code;

-- ============================================
-- FINAL CHECK: Ensure consistency
-- ============================================
DO $$
DECLARE
  base_count INTEGER;
BEGIN
  -- Count base provinces
  SELECT COUNT(*) INTO base_count
  FROM provincial_price_multipliers
  WHERE pricing_factor = 1.0;
  
  -- Verify we have exactly 1 base province (GP)
  IF base_count = 1 THEN
    RAISE NOTICE '✅ SUCCESS: Exactly 1 base province (GP)';
    
    -- Verify it's GP
    IF EXISTS (SELECT 1 FROM provincial_price_multipliers WHERE province_code = 'GP' AND pricing_factor = 1.0) THEN
      RAISE NOTICE '✅ SUCCESS: GP is the base province';
    ELSE
      RAISE NOTICE '❌ ERROR: Base province is not GP!';
    END IF;
    
  ELSIF base_count = 0 THEN
    RAISE NOTICE '❌ ERROR: No base province found!';
  ELSE
    RAISE NOTICE '⚠️  WARNING: Multiple base provinces found (expected 1, found %)', base_count;
  END IF;
  
  -- Verify WC and KZN are NOT base
  IF EXISTS (SELECT 1 FROM provincial_price_multipliers WHERE province_code = 'WC' AND pricing_factor > 1.0) THEN
    RAISE NOTICE '✅ SUCCESS: WC has regional adjustment (+5%%)';
  ELSE
    RAISE NOTICE '❌ ERROR: WC should have +5%% adjustment';
  END IF;
  
  IF EXISTS (SELECT 1 FROM provincial_price_multipliers WHERE province_code = 'KZN' AND pricing_factor > 1.0) THEN
    RAISE NOTICE '✅ SUCCESS: KZN has regional adjustment (+3%%)';
  ELSE
    RAISE NOTICE '❌ ERROR: KZN should have +3%% adjustment';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'UPDATE COMPLETE!';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Next step: Refresh your Provincial Pricing page';
  RAISE NOTICE 'Expected: Only GP shows "Base Rate"';
  RAISE NOTICE 'Expected: WC shows +5%%, KZN shows +3%%';
  RAISE NOTICE '================================================';
END $$;
