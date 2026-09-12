-- ================================================================
-- DATABASE SYNCHRONIZATION VERIFICATION SCRIPT
-- ================================================================
-- Run this in BOTH databases to verify they are in sync
-- Compare the results from Development vs SIT
-- ================================================================

-- 1. CHECK LABOR RATES COUNT
SELECT 
  'LABOR_RATES_COUNT' as check_name,
  COUNT(*) as count
FROM labor_rates;

-- Expected: 39 in both databases

-- ================================================================

-- 2. CHECK CATEGORIES DISTRIBUTION
SELECT 
  'CATEGORY_DISTRIBUTION' as check_name,
  category,
  COUNT(*) as count
FROM labor_rates
GROUP BY category
ORDER BY category;

-- Expected: Same categories and counts in both databases

-- ================================================================

-- 3. CHECK SKILL LEVELS DISTRIBUTION  
SELECT 
  'SKILL_LEVEL_DISTRIBUTION' as check_name,
  skill_level,
  COUNT(*) as count
FROM labor_rates
GROUP BY skill_level
ORDER BY skill_level;

-- Expected: Same skill levels and counts in both databases

-- ================================================================

-- 4. CHECK RATE RANGES
SELECT 
  'RATE_RANGES' as check_name,
  MIN(base_rate) as min_rate,
  MAX(base_rate) as max_rate,
  AVG(base_rate)::DECIMAL(10,2) as avg_rate,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY base_rate)::DECIMAL(10,2) as median_rate
FROM labor_rates;

-- Expected: Same ranges in both databases
-- Min: 150.00, Max: 550.00

-- ================================================================

-- 5. CHECK FOR DUPLICATES (Should be 0)
SELECT 
  'DUPLICATE_CODES' as check_name,
  code,
  COUNT(*) as duplicate_count
FROM labor_rates
GROUP BY code
HAVING COUNT(*) > 1;

-- Expected: 0 rows in both databases

-- ================================================================

-- 6. CHECK SPECIFIC HIGH-VALUE RATES
SELECT 
  'HIGH_VALUE_RATES' as check_name,
  code,
  description,
  base_rate
FROM labor_rates
WHERE base_rate >= 450
ORDER BY base_rate DESC;

-- Expected: Same high-value rates in both databases

-- ================================================================

-- 7. CHECK TABLE STRUCTURE
SELECT 
  'TABLE_STRUCTURE' as check_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'labor_rates'
ORDER BY ordinal_position;

-- Expected: Same columns and data types in both databases

-- ================================================================

-- 8. CHECK RLS POLICIES
SELECT 
  'RLS_POLICIES' as check_name,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'labor_rates'
ORDER BY policyname;

-- Expected: Same policies in both databases

-- ================================================================

-- 9. CHECK INDEXES
SELECT 
  'INDEXES' as check_name,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'labor_rates'
  AND schemaname = 'public'
ORDER BY indexname;

-- Expected: Same indexes in both databases

-- ================================================================

-- 10. CHECKSUM VERIFICATION (Optional - Advanced)
-- This creates a checksum of all data to verify exact match
SELECT 
  'DATA_CHECKSUM' as check_name,
  MD5(
    STRING_AGG(
      code || '|' || 
      description || '|' || 
      category || '|' || 
      base_rate::TEXT || '|' || 
      unit || '|' || 
      COALESCE(skill_level, 'NULL'),
      ','
      ORDER BY code
    )
  ) as data_checksum
FROM labor_rates;

-- Expected: Same checksum in both databases means exact data match

-- ================================================================
-- QUICK VERIFICATION SUMMARY
-- ================================================================

DO $$
DECLARE
  rate_count INTEGER;
  category_count INTEGER;
  min_rate DECIMAL;
  max_rate DECIMAL;
BEGIN
  SELECT COUNT(*) INTO rate_count FROM labor_rates;
  SELECT COUNT(DISTINCT category) INTO category_count FROM labor_rates;
  SELECT MIN(base_rate), MAX(base_rate) INTO min_rate, max_rate FROM labor_rates;
  
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE 'QILLY DATABASE VERIFICATION SUMMARY';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE 'Total Labor Rates: %', rate_count;
  RAISE NOTICE 'Total Categories: %', category_count;
  RAISE NOTICE 'Rate Range: R% - R%', min_rate, max_rate;
  RAISE NOTICE '═══════════════════════════════════════════════════';
  
  IF rate_count = 39 THEN
    RAISE NOTICE '✅ Labor rates count is correct (39)';
  ELSE
    RAISE NOTICE '❌ Labor rates count is INCORRECT (expected 39, got %)', rate_count;
  END IF;
  
  IF category_count = 11 THEN
    RAISE NOTICE '✅ Category count is correct (11)';
  ELSE
    RAISE NOTICE '❌ Category count is INCORRECT (expected 11, got %)', category_count;
  END IF;
  
  IF min_rate = 150.00 AND max_rate = 550.00 THEN
    RAISE NOTICE '✅ Rate ranges are correct';
  ELSE
    RAISE NOTICE '❌ Rate ranges are INCORRECT';
  END IF;
  
  RAISE NOTICE '═══════════════════════════════════════════════════';
END $$;
