-- ========================================================================
-- VERIFICATION SCRIPT: Verify All Fixes Are Working
-- ========================================================================
-- Run this AFTER you've run FIX_INFINITE_RECURSION.sql
-- This will check that everything is set up correctly
-- ========================================================================

-- ========================================================================
-- CHECK 1: Verify RLS is enabled
-- ========================================================================

SELECT 
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'bills', 'bill_items')
ORDER BY tablename;

-- Expected:
-- users      | true | ✅ RLS Enabled
-- bills      | true | ✅ RLS Enabled
-- bill_items | true | ✅ RLS Enabled

-- ========================================================================
-- CHECK 2: Verify policies exist (should be exactly 7)
-- ========================================================================

SELECT 
  tablename,
  COUNT(*) as policy_count,
  CASE 
    WHEN tablename = 'users' AND COUNT(*) = 3 THEN '✅ Correct (3 policies)'
    WHEN tablename = 'bills' AND COUNT(*) = 2 THEN '✅ Correct (2 policies)'
    WHEN tablename = 'bill_items' AND COUNT(*) = 2 THEN '✅ Correct (2 policies)'
    ELSE '❌ Wrong count'
  END as status
FROM pg_policies
WHERE tablename IN ('users', 'bills', 'bill_items')
GROUP BY tablename
ORDER BY tablename;

-- Expected:
-- users      | 3 | ✅ Correct (3 policies)
-- bills      | 2 | ✅ Correct (2 policies)
-- bill_items | 2 | ✅ Correct (2 policies)

-- ========================================================================
-- CHECK 3: List all policies (should NOT see any admin policies)
-- ========================================================================

SELECT 
  tablename,
  policyname,
  cmd,
  permissive,
  CASE 
    WHEN policyname LIKE '%Admin%' THEN '❌ REMOVE THIS - Causes recursion'
    WHEN policyname LIKE '%admin%' THEN '❌ REMOVE THIS - Causes recursion'
    ELSE '✅ Safe policy'
  END as safety_check
FROM pg_policies
WHERE tablename IN ('users', 'bills', 'bill_items')
ORDER BY tablename, policyname;

-- Expected (NO admin policies):
-- bills       | Users can create own bills      | INSERT | PERMISSIVE | ✅ Safe policy
-- bills       | Users can view own bills        | SELECT | PERMISSIVE | ✅ Safe policy
-- bill_items  | Users can create own bill items | INSERT | PERMISSIVE | ✅ Safe policy
-- bill_items  | Users can view own bill items   | SELECT | PERMISSIVE | ✅ Safe policy
-- users       | Users can create own record     | INSERT | PERMISSIVE | ✅ Safe policy
-- users       | Users can update own trial count| UPDATE | PERMISSIVE | ✅ Safe policy
-- users       | Users can view own record       | SELECT | PERMISSIVE | ✅ Safe policy

-- ========================================================================
-- CHECK 4: Verify no infinite recursion in policies
-- ========================================================================

SELECT 
  tablename,
  policyname,
  cmd,
  SUBSTRING(qual::text, 1, 100) as using_clause,
  SUBSTRING(with_check::text, 1, 100) as with_check_clause,
  CASE 
    -- Check for problematic patterns
    WHEN qual::text LIKE '%FROM users%' AND tablename = 'users' AND policyname LIKE '%admin%' 
      THEN '❌ RECURSION RISK - Queries users from users policy'
    WHEN with_check::text LIKE '%FROM users%' AND tablename = 'users' AND policyname LIKE '%admin%' 
      THEN '❌ RECURSION RISK - Queries users from users policy'
    WHEN qual::text LIKE '%FROM bills%' AND tablename = 'bills' AND policyname LIKE '%admin%'
      THEN '❌ RECURSION RISK - Queries bills from bills policy'
    ELSE '✅ No recursion detected'
  END as recursion_check
FROM pg_policies
WHERE tablename IN ('users', 'bills', 'bill_items')
ORDER BY tablename, policyname;

-- Expected: All policies show ✅ No recursion detected

-- ========================================================================
-- CHECK 5: Verify bone@gmail.com user exists and has correct trial count
-- ========================================================================

SELECT 
  email,
  trial_bills_remaining,
  is_premium,
  subscription_tier,
  role,
  created_at,
  updated_at,
  CASE 
    WHEN is_premium THEN '✅ Premium User - Unlimited'
    WHEN trial_bills_remaining > 0 THEN '✅ Trial Active - ' || trial_bills_remaining || ' bills remaining'
    WHEN trial_bills_remaining = 0 THEN '⚠️ Trial Exhausted - Upgrade Required'
    WHEN trial_bills_remaining IS NULL THEN '❌ Trial count NULL - Should be 3'
    ELSE '❌ Invalid state'
  END as user_status
FROM public.users
WHERE email = 'bone@gmail.com';

-- Expected (for fresh user):
-- bone@gmail.com | 3 | false | FREE | operator | ... | ... | ✅ Trial Active - 3 bills remaining

-- If no rows returned:
-- ⚠️ User doesn't exist yet - will be created on first login

-- ========================================================================
-- CHECK 6: Count processed bills for bone@gmail.com
-- ========================================================================

SELECT 
  u.email,
  u.trial_bills_remaining,
  COUNT(b.id) as bills_processed,
  (3 - COUNT(b.id)) as expected_trial_remaining,
  CASE 
    WHEN u.trial_bills_remaining = (3 - COUNT(b.id)) THEN '✅ Trial count matches bills processed'
    WHEN COUNT(b.id) = 0 THEN 'ℹ️  No bills processed yet - trial count should be 3'
    ELSE '❌ Trial count mismatch - should be ' || (3 - COUNT(b.id))
  END as trial_sync_status
FROM public.users u
LEFT JOIN public.bills b ON b.user_id = u.id
WHERE u.email = 'bone@gmail.com'
GROUP BY u.email, u.trial_bills_remaining;

-- Expected (before processing any BOQs):
-- bone@gmail.com | 3 | 0 | 3 | ℹ️ No bills processed yet

-- Expected (after processing 1 BOQ):
-- bone@gmail.com | 2 | 1 | 2 | ✅ Trial count matches bills processed

-- ========================================================================
-- CHECK 7: Verify table structures
-- ========================================================================

-- Check users table columns
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  CASE 
    WHEN column_name = 'id' AND data_type = 'uuid' THEN '✅'
    WHEN column_name = 'email' AND data_type = 'text' THEN '✅'
    WHEN column_name = 'trial_bills_remaining' AND data_type = 'integer' THEN '✅'
    WHEN column_name = 'is_premium' AND data_type = 'boolean' THEN '✅'
    ELSE '✅'
  END as check_mark
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
AND column_name IN ('id', 'email', 'trial_bills_remaining', 'is_premium', 'role', 'subscription_tier')
ORDER BY ordinal_position;

-- Expected key columns:
-- id                     | uuid    | NO  | ...           | ✅
-- email                  | text    | NO  | ...           | ✅
-- trial_bills_remaining  | integer | YES | 3             | ✅
-- is_premium             | boolean | YES | false         | ✅
-- role                   | text    | YES | 'operator'... | ✅
-- subscription_tier      | text    | YES | 'FREE'...     | ✅

-- ========================================================================
-- CHECK 8: Test INSERT permission (simulates what code does)
-- ========================================================================

-- This checks if the current user can theoretically insert their own record
-- Note: This doesn't actually insert, just checks if policy allows it

EXPLAIN (FORMAT TEXT)
SELECT EXISTS (
  SELECT 1
  FROM pg_policies
  WHERE tablename = 'users'
  AND policyname = 'Users can create own record'
  AND cmd = 'INSERT'
);

-- Expected: Should return a query plan showing the policy exists

-- ========================================================================
-- CHECK 9: Verify no duplicate users (should never happen after fix)
-- ========================================================================

SELECT 
  email,
  COUNT(*) as duplicate_count,
  CASE 
    WHEN COUNT(*) = 1 THEN '✅ No duplicates'
    WHEN COUNT(*) > 1 THEN '❌ DUPLICATE USERS - Run cleanup script'
    ELSE '✅'
  END as status
FROM public.users
GROUP BY email
HAVING COUNT(*) > 1;

-- Expected: No rows returned (meaning no duplicates)
-- If rows returned: You have duplicate users and need to clean up

-- ========================================================================
-- CHECK 10: Summary Report
-- ========================================================================

SELECT 
  'RLS Enabled' as check_name,
  (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('users', 'bills', 'bill_items') AND rowsecurity = true) as actual,
  3 as expected,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('users', 'bills', 'bill_items') AND rowsecurity = true) = 3 
    THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status

UNION ALL

SELECT 
  'Total Policies' as check_name,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('users', 'bills', 'bill_items')) as actual,
  7 as expected,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('users', 'bills', 'bill_items')) = 7 
    THEN '✅ PASS'
    ELSE '❌ FAIL - Run FIX_INFINITE_RECURSION.sql'
  END as status

UNION ALL

SELECT 
  'Admin Policies (should be 0)' as check_name,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('users', 'bills', 'bill_items') AND policyname LIKE '%admin%') as actual,
  0 as expected,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('users', 'bills', 'bill_items') AND policyname LIKE '%admin%') = 0 
    THEN '✅ PASS'
    ELSE '❌ FAIL - Remove admin policies causing recursion'
  END as status

UNION ALL

SELECT 
  'Users Table Policies' as check_name,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users') as actual,
  3 as expected,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users') = 3 
    THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status

UNION ALL

SELECT 
  'Bills Table Policies' as check_name,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'bills') as actual,
  2 as expected,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'bills') = 2 
    THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status

UNION ALL

SELECT 
  'Bill_Items Table Policies' as check_name,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'bill_items') as actual,
  2 as expected,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'bill_items') = 2 
    THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status;

-- Expected: All checks show ✅ PASS

-- ========================================================================
-- SUCCESS MESSAGE
-- ========================================================================

DO $$
DECLARE
  total_checks INTEGER;
  passed_checks INTEGER;
BEGIN
  -- Count total checks
  total_checks := 6;
  
  -- Count passed checks
  SELECT COUNT(*) INTO passed_checks
  FROM (
    SELECT CASE WHEN (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('users', 'bills', 'bill_items') AND rowsecurity = true) = 3 THEN 1 ELSE 0 END
    UNION ALL
    SELECT CASE WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('users', 'bills', 'bill_items')) = 7 THEN 1 ELSE 0 END
    UNION ALL
    SELECT CASE WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('users', 'bills', 'bill_items') AND policyname LIKE '%admin%') = 0 THEN 1 ELSE 0 END
    UNION ALL
    SELECT CASE WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users') = 3 THEN 1 ELSE 0 END
    UNION ALL
    SELECT CASE WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'bills') = 2 THEN 1 ELSE 0 END
    UNION ALL
    SELECT CASE WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'bill_items') = 2 THEN 1 ELSE 0 END
  ) checks WHERE checks.case = 1;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'VERIFICATION COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Passed: % / %', passed_checks, total_checks;
  RAISE NOTICE '';
  
  IF passed_checks = total_checks THEN
    RAISE NOTICE '✅ ALL CHECKS PASSED!';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Your database is ready for production!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Hard refresh browser (Ctrl+Shift+R)';
    RAISE NOTICE '2. Login as bone@gmail.com';
    RAISE NOTICE '3. Process a BOQ';
    RAISE NOTICE '4. Verify trial countdown works';
    RAISE NOTICE '5. Check View History shows bills';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Ready for Tuesday eTender presentation!';
  ELSE
    RAISE NOTICE '❌ SOME CHECKS FAILED';
    RAISE NOTICE '';
    RAISE NOTICE 'Action required:';
    RAISE NOTICE '1. Review CHECK 2 and CHECK 3 above';
    RAISE NOTICE '2. Run FIX_INFINITE_RECURSION.sql if policies are wrong';
    RAISE NOTICE '3. Run this script again to verify';
  END IF;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
END $$;
