-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: DIAGNOSE WHY 406 ERROR STILL HAPPENS
-- Run this to see what's wrong with the RLS setup
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- CHECK 1: Is RLS enabled on contractors table?
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  schemaname,
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN '✅ RLS is ENABLED' 
    ELSE '❌ RLS is DISABLED - This is why 406 happens!' 
  END as status
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'contractors';

-- Expected: rowsecurity = true (✅ RLS is ENABLED)
-- If false: RLS is disabled, which causes 406 errors

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- CHECK 2: How many policies exist on contractors table?
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ NO POLICIES - This causes 406!' 
    WHEN COUNT(*) < 3 THEN '⚠️ Not enough policies' 
    ELSE '✅ Policies exist' 
  END as status
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'contractors';

-- Expected: 5 policies
-- If 0: No policies exist, everything gets blocked

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- CHECK 3: What SELECT policy exists?
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'contractors'
  AND cmd = 'SELECT';

-- Expected: "Contractors can read own data" with qual = (auth.uid() = user_id)
-- If no rows: No SELECT policy exists - this causes 406!

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- CHECK 4: Does contractor@gmail.com exist in contractors table?
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  id,
  email,
  company_name,
  status,
  subscription_tier,
  user_id,
  created_at
FROM public.contractors
WHERE email = 'contractor@gmail.com';

-- Expected: 1 row with status = 'approved'
-- If 0 rows: Contractor doesn't exist in database!

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- CHECK 5: Does auth user exist?
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  id,
  email,
  created_at,
  confirmed_at,
  CASE 
    WHEN confirmed_at IS NULL THEN '⚠️ Email not confirmed' 
    ELSE '✅ Email confirmed' 
  END as status
FROM auth.users
WHERE email = 'contractor@gmail.com';

-- Expected: 1 row with confirmed_at NOT NULL
-- If 0 rows: Auth user doesn't exist!

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- CHECK 6: Do user_id values match?
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  c.email as contractor_email,
  c.user_id as contractor_user_id,
  au.id as auth_user_id,
  au.email as auth_email,
  CASE 
    WHEN c.user_id = au.id THEN '✅ user_id MATCHES' 
    WHEN c.user_id IS NULL THEN '❌ contractor.user_id is NULL!' 
    ELSE '❌ user_id MISMATCH - This causes 406!' 
  END as match_status
FROM public.contractors c
LEFT JOIN auth.users au ON c.email = au.email
WHERE c.email = 'contractor@gmail.com';

-- Expected: match_status = '✅ user_id MATCHES'
-- If MISMATCH or NULL: RLS policy won't work

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- CHECK 7: Test the exact query the code runs
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- This simulates what MainDashboard.tsx does on line 95-98:
-- SELECT * FROM contractors WHERE email = 'contractor@gmail.com'

-- NOTE: This will work here because we're running as admin/service_role
-- But for authenticated user, it depends on RLS policy

SELECT 
  'This query works for YOU because you are admin' as note,
  email,
  company_name,
  status
FROM public.contractors
WHERE email = 'contractor@gmail.com';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- CHECK 8: List ALL policies on contractors table
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'contractors'
ORDER BY cmd, policyname;

-- Expected: 5 policies
-- - Contractors can read own data (SELECT)
-- - Contractors can update own data (UPDATE)
-- - Contractors can insert own data (INSERT)
-- - Service role can access all contractors (ALL)
-- - Admins can access all contractors (ALL)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- DIAGNOSTIC SUMMARY
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
DECLARE
  rls_enabled BOOLEAN;
  policy_count INTEGER;
  contractor_exists BOOLEAN;
  user_id_matches BOOLEAN;
BEGIN
  -- Check RLS
  SELECT rowsecurity INTO rls_enabled
  FROM pg_tables
  WHERE schemaname = 'public' AND tablename = 'contractors';
  
  -- Check policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'contractors';
  
  -- Check contractor exists
  SELECT EXISTS(SELECT 1 FROM public.contractors WHERE email = 'contractor@gmail.com')
  INTO contractor_exists;
  
  -- Check user_id match
  SELECT EXISTS(
    SELECT 1 FROM public.contractors c
    JOIN auth.users au ON c.user_id = au.id
    WHERE c.email = 'contractor@gmail.com'
  ) INTO user_id_matches;
  
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📊 DIAGNOSTIC SUMMARY';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  
  IF rls_enabled THEN
    RAISE NOTICE '✅ RLS is enabled';
  ELSE
    RAISE NOTICE '❌ RLS is NOT enabled - THIS IS THE PROBLEM!';
  END IF;
  
  RAISE NOTICE '📋 Policies count: % (expected: 5)', policy_count;
  IF policy_count = 0 THEN
    RAISE NOTICE '❌ NO POLICIES EXIST - THIS IS THE PROBLEM!';
  ELSIF policy_count < 5 THEN
    RAISE NOTICE '⚠️ Missing some policies';
  ELSE
    RAISE NOTICE '✅ All policies exist';
  END IF;
  
  IF contractor_exists THEN
    RAISE NOTICE '✅ Contractor record exists';
  ELSE
    RAISE NOTICE '❌ Contractor does NOT exist in database';
  END IF;
  
  IF user_id_matches THEN
    RAISE NOTICE '✅ user_id matches between contractors and auth.users';
  ELSE
    RAISE NOTICE '❌ user_id MISMATCH - THIS IS THE PROBLEM!';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  
  -- Final diagnosis
  IF NOT rls_enabled OR policy_count = 0 THEN
    RAISE NOTICE '🔧 FIX: Run /COMPLETE_RLS_FIX_ALL_TABLES.sql again';
  ELSIF NOT user_id_matches THEN
    RAISE NOTICE '🔧 FIX: Run UPDATE contractors SET user_id = (SELECT id FROM auth.users WHERE email = contractors.email)';
  ELSE
    RAISE NOTICE '🔧 FIX: Run /FIX_CONTRACTOR_RLS_BY_EMAIL.sql to allow email queries';
  END IF;
  
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;
