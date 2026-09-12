-- ============================================
-- PROVINCIAL PRICING DATABASE VERIFICATION SCRIPT
-- Run this in Supabase SQL Editor to diagnose issues
-- Date: February 23, 2026
-- ============================================

-- ============================================
-- TEST 1: Check if table exists
-- ============================================
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'provincial_price_multipliers'
  ) THEN
    RAISE NOTICE '✅ TEST 1 PASSED: Table "provincial_price_multipliers" exists';
  ELSE
    RAISE NOTICE '❌ TEST 1 FAILED: Table "provincial_price_multipliers" does NOT exist';
    RAISE NOTICE '   → Run /src/utils/sql/provincial_pricing_factors.sql to create it';
  END IF;
END $$;

-- ============================================
-- TEST 2: Check row count
-- ============================================
DO $$
DECLARE
  row_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO row_count FROM provincial_price_multipliers;
  
  IF row_count = 9 THEN
    RAISE NOTICE '✅ TEST 2 PASSED: Found exactly 9 provinces (expected)';
  ELSIF row_count = 0 THEN
    RAISE NOTICE '❌ TEST 2 FAILED: Table is EMPTY (0 rows)';
    RAISE NOTICE '   → Run /src/utils/sql/provincial_pricing_factors.sql to populate it';
  ELSE
    RAISE NOTICE '⚠️  TEST 2 WARNING: Found % provinces (expected 9)', row_count;
  END IF;
END $$;

-- ============================================
-- TEST 3: Display all provincial factors
-- ============================================
SELECT 
  '✅ TEST 3: Provincial Pricing Factors' as test_name,
  province_code,
  province_name,
  pricing_factor,
  CASE 
    WHEN pricing_factor = 1.0 THEN 'Base Rate (no adjustment)'
    ELSE 'Regional Adjustment +' || ROUND((pricing_factor - 1.0) * 100, 1) || '%'
  END as adjustment_description,
  description
FROM provincial_price_multipliers
ORDER BY province_code;

-- ============================================
-- TEST 4: Check RLS (Row Level Security) status
-- ============================================
SELECT 
  '✅ TEST 4: RLS Configuration' as test_name,
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity = true THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status
FROM pg_tables
WHERE tablename = 'provincial_price_multipliers';

-- ============================================
-- TEST 5: Check RLS policies
-- ============================================
SELECT 
  '✅ TEST 5: RLS Policies' as test_name,
  policyname as policy_name,
  CASE cmd
    WHEN 'SELECT' THEN '✅ SELECT (Read)'
    WHEN 'UPDATE' THEN '✅ UPDATE (Write)'
    WHEN 'INSERT' THEN '✅ INSERT (Create)'
    WHEN 'DELETE' THEN '✅ DELETE (Remove)'
    ELSE cmd
  END as permission_type,
  CASE 
    WHEN roles = '{public}' THEN '🌍 Public (anyone can access)'
    WHEN roles = '{authenticated}' THEN '🔐 Authenticated users only'
    ELSE array_to_string(roles, ', ')
  END as who_can_access
FROM pg_policies
WHERE tablename = 'provincial_price_multipliers'
ORDER BY cmd;

-- ============================================
-- TEST 6: Verify factor values match expected
-- ============================================
WITH expected_factors AS (
  SELECT 'WC' as code, 1.00 as expected_factor UNION ALL
  SELECT 'GP', 1.00 UNION ALL
  SELECT 'KZN', 1.00 UNION ALL
  SELECT 'EC', 1.08 UNION ALL
  SELECT 'FS', 1.06 UNION ALL
  SELECT 'LP', 1.12 UNION ALL
  SELECT 'MP', 1.07 UNION ALL
  SELECT 'NC', 1.15 UNION ALL
  SELECT 'NW', 1.09
),
comparison AS (
  SELECT 
    COALESCE(e.code, p.province_code) as province_code,
    e.expected_factor,
    p.pricing_factor as actual_factor,
    CASE 
      WHEN e.expected_factor IS NULL THEN '⚠️ Unexpected province in database'
      WHEN p.pricing_factor IS NULL THEN '❌ Missing from database'
      WHEN e.expected_factor = p.pricing_factor THEN '✅ Match'
      ELSE '❌ Mismatch'
    END as status
  FROM expected_factors e
  FULL OUTER JOIN provincial_price_multipliers p 
    ON e.code = p.province_code
)
SELECT 
  '✅ TEST 6: Factor Value Verification' as test_name,
  province_code,
  expected_factor,
  actual_factor,
  status
FROM comparison
ORDER BY province_code;

-- ============================================
-- TEST 7: Summary statistics
-- ============================================
SELECT 
  '✅ TEST 7: Summary Statistics' as test_name,
  COUNT(*) as total_provinces,
  COUNT(CASE WHEN pricing_factor = 1.0 THEN 1 END) as base_pricing_provinces,
  COUNT(CASE WHEN pricing_factor > 1.0 THEN 1 END) as regional_adjustment_provinces,
  ROUND(MIN(pricing_factor), 2) as lowest_factor,
  ROUND(MAX(pricing_factor), 2) as highest_factor,
  ROUND(AVG(pricing_factor), 3) as average_factor
FROM provincial_price_multipliers;

-- ============================================
-- TEST 8: Test calculation with sample item
-- ============================================
WITH sample_item AS (
  SELECT 
    'Cement Bag 50kg' as item_name,
    150.00 as gp_base_price
)
SELECT 
  '✅ TEST 8: Sample Pricing Calculation' as test_name,
  s.item_name,
  s.gp_base_price as gauteng_price,
  p.province_code,
  p.province_name,
  p.pricing_factor,
  ROUND(s.gp_base_price * p.pricing_factor, 2) as provincial_price,
  ROUND((s.gp_base_price * p.pricing_factor) - s.gp_base_price, 2) as price_difference,
  CASE 
    WHEN p.pricing_factor = 1.0 THEN 'No adjustment'
    ELSE '+' || ROUND((p.pricing_factor - 1.0) * 100, 1) || '%'
  END as adjustment_percentage
FROM provincial_price_multipliers p
CROSS JOIN sample_item s
ORDER BY p.province_code;

-- ============================================
-- TEST 9: Check for data integrity issues
-- ============================================
DO $$
DECLARE
  issue_count INTEGER := 0;
BEGIN
  -- Check for NULL values
  SELECT COUNT(*) INTO issue_count
  FROM provincial_price_multipliers
  WHERE province_code IS NULL 
     OR province_name IS NULL 
     OR pricing_factor IS NULL 
     OR description IS NULL;
  
  IF issue_count > 0 THEN
    RAISE NOTICE '❌ TEST 9 FAILED: Found % rows with NULL values', issue_count;
  ELSE
    RAISE NOTICE '✅ TEST 9 PASSED: No NULL values found';
  END IF;
  
  -- Check for duplicate province codes
  SELECT COUNT(*) INTO issue_count
  FROM (
    SELECT province_code, COUNT(*) as cnt
    FROM provincial_price_multipliers
    GROUP BY province_code
    HAVING COUNT(*) > 1
  ) duplicates;
  
  IF issue_count > 0 THEN
    RAISE NOTICE '❌ TEST 9 FAILED: Found % duplicate province codes', issue_count;
  ELSE
    RAISE NOTICE '✅ TEST 9 PASSED: No duplicate province codes';
  END IF;
  
  -- Check for factors out of reasonable range
  SELECT COUNT(*) INTO issue_count
  FROM provincial_price_multipliers
  WHERE pricing_factor < 0.5 OR pricing_factor > 2.0;
  
  IF issue_count > 0 THEN
    RAISE NOTICE '⚠️  TEST 9 WARNING: Found % factors outside range 0.5-2.0', issue_count;
  ELSE
    RAISE NOTICE '✅ TEST 9 PASSED: All factors within reasonable range (0.5-2.0)';
  END IF;
END $$;

-- ============================================
-- TEST 10: Test public read access (simulate anonymous user)
-- ============================================
DO $$
DECLARE
  can_read BOOLEAN;
BEGIN
  -- Check if there's a policy allowing public SELECT
  SELECT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'provincial_price_multipliers'
    AND cmd = 'SELECT'
    AND qual = 'true'
  ) INTO can_read;
  
  IF can_read THEN
    RAISE NOTICE '✅ TEST 10 PASSED: Public read access is enabled';
    RAISE NOTICE '   → Anonymous users CAN read provincial pricing factors';
  ELSE
    RAISE NOTICE '❌ TEST 10 FAILED: Public read access is NOT enabled';
    RAISE NOTICE '   → Your frontend will get "permission denied" errors';
    RAISE NOTICE '   → Run this to fix:';
    RAISE NOTICE '   CREATE POLICY "Anyone can view price multipliers" ON provincial_price_multipliers FOR SELECT USING (true);';
  END IF;
END $$;

-- ============================================
-- FINAL SUMMARY
-- ============================================
DO $$
DECLARE
  table_exists BOOLEAN;
  row_count INTEGER;
  has_rls BOOLEAN;
  has_select_policy BOOLEAN;
  all_tests_passed BOOLEAN := true;
BEGIN
  -- Check all conditions
  SELECT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'provincial_price_multipliers'
  ) INTO table_exists;
  
  IF table_exists THEN
    SELECT COUNT(*) INTO row_count FROM provincial_price_multipliers;
  ELSE
    row_count := 0;
  END IF;
  
  SELECT rowsecurity INTO has_rls
  FROM pg_tables
  WHERE tablename = 'provincial_price_multipliers';
  
  SELECT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'provincial_price_multipliers'
    AND cmd = 'SELECT'
    AND qual = 'true'
  ) INTO has_select_policy;
  
  -- Print summary
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '         FINAL DIAGNOSTIC SUMMARY';
  RAISE NOTICE '================================================';
  RAISE NOTICE '';
  
  IF NOT table_exists THEN
    RAISE NOTICE '❌ CRITICAL: Table does not exist';
    RAISE NOTICE '   → Action: Run /src/utils/sql/provincial_pricing_factors.sql';
    all_tests_passed := false;
  ELSIF row_count = 0 THEN
    RAISE NOTICE '❌ CRITICAL: Table exists but is EMPTY';
    RAISE NOTICE '   → Action: Run /src/utils/sql/provincial_pricing_factors.sql';
    all_tests_passed := false;
  ELSIF row_count != 9 THEN
    RAISE NOTICE '⚠️  WARNING: Expected 9 provinces, found %', row_count;
    all_tests_passed := false;
  ELSE
    RAISE NOTICE '✅ Table exists with 9 provinces';
  END IF;
  
  IF has_rls IS NULL THEN
    RAISE NOTICE '❌ Cannot check RLS status (table missing)';
    all_tests_passed := false;
  ELSIF NOT has_rls THEN
    RAISE NOTICE '⚠️  WARNING: RLS is disabled (should be enabled)';
  ELSE
    RAISE NOTICE '✅ RLS is enabled';
  END IF;
  
  IF NOT has_select_policy THEN
    RAISE NOTICE '❌ CRITICAL: No public SELECT policy (frontend will fail)';
    RAISE NOTICE '   → Action: Run this command:';
    RAISE NOTICE '   CREATE POLICY "Anyone can view price multipliers" ON provincial_price_multipliers FOR SELECT USING (true);';
    all_tests_passed := false;
  ELSE
    RAISE NOTICE '✅ Public read access is configured';
  END IF;
  
  RAISE NOTICE '';
  IF all_tests_passed THEN
    RAISE NOTICE '🎉 ALL TESTS PASSED - Your database is correctly configured!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next step: Refresh your Provincial Pricing page';
    RAISE NOTICE 'Expected badge: "DB Factors (9)" in green';
  ELSE
    RAISE NOTICE '❌ SOME TESTS FAILED - Follow the actions above to fix';
  END IF;
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
END $$;
