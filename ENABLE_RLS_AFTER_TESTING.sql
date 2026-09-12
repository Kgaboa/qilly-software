-- =====================================================
-- RE-ENABLE RLS AFTER TESTING
-- Run this after you're done testing with RLS disabled
-- =====================================================

-- This script re-enables Row Level Security to secure your database.
-- Run this AFTER you've tested with /DISABLE_RLS_FOR_TESTING.sql

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 1: RE-ENABLE RLS (Row Level Security)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

SELECT '✅ RLS RE-ENABLED on all tables' as status;
SELECT '✅ Your database is now secure again!' as info;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: VERIFY RLS IS ACTIVE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT 'RLS STATUS CHECK' as check;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'suppliers', 'contractors', 'bills', 'bill_items', 'subscriptions')
ORDER BY tablename;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: CHECK IF POLICIES EXIST
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT 'RLS POLICIES CHECK' as check;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

SELECT 
  tablename,
  policyname,
  cmd as operation,
  CASE 
    WHEN policyname LIKE '%Admin%' THEN '👑 Admin Policy'
    WHEN policyname LIKE '%Supplier%' THEN '🏢 Supplier Policy'
    WHEN policyname LIKE '%Contractor%' THEN '🏗️ Contractor Policy'
    ELSE '👤 User Policy'
  END as policy_type
FROM pg_policies 
WHERE tablename IN ('users', 'suppliers', 'contractors')
ORDER BY tablename, policyname;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 4: NEXT STEPS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT 'NEXT STEPS:' as info;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

-- Check if policies exist
DO $$
DECLARE
  policy_count INTEGER;
  admin_supplier_policy_exists BOOLEAN;
  admin_contractor_policy_exists BOOLEAN;
BEGIN
  -- Count total policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE tablename IN ('suppliers', 'contractors');
  
  -- Check for critical admin policies
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'suppliers' 
    AND policyname LIKE '%Admin%'
  ) INTO admin_supplier_policy_exists;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contractors' 
    AND policyname LIKE '%Admin%'
  ) INTO admin_contractor_policy_exists;
  
  IF policy_count = 0 THEN
    RAISE NOTICE '⚠️ NO RLS POLICIES FOUND!';
    RAISE NOTICE '❌ You need to create RLS policies or your data will be inaccessible!';
    RAISE NOTICE '📝 Run /SETUP_ADMIN_USER_COMPLETE.sql to create policies';
  ELSIF NOT admin_supplier_policy_exists OR NOT admin_contractor_policy_exists THEN
    RAISE NOTICE '⚠️ ADMIN POLICIES MISSING!';
    RAISE NOTICE '❌ Admin users won''t be able to access suppliers/contractors';
    RAISE NOTICE '📝 Run /SETUP_ADMIN_USER_COMPLETE.sql to create admin policies';
  ELSE
    RAISE NOTICE '✅ RLS policies look good!';
    RAISE NOTICE '✅ Now run /SETUP_ADMIN_USER_COMPLETE.sql to set up admin authentication';
  END IF;
END $$;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '✅ RLS is now ENABLED' as status;
SELECT '📝 Next: Run /SETUP_ADMIN_USER_COMPLETE.sql for proper authentication' as next_step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
