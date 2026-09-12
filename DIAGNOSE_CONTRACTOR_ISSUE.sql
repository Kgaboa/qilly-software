-- ============================================================================
-- DIAGNOSE CONTRACTOR CARD ISSUE FOR bone@gmail.com
-- ============================================================================

-- Step 1: Check if bone@gmail.com exists in public.users table
-- ============================================================================
SELECT 
  'Step 1: Check public.users table' as check_name,
  id,
  email,
  full_name,
  role,
  company_name,
  cidb_grade,
  trial_bills_remaining,
  is_premium,
  subscription_tier,
  created_at
FROM public.users 
WHERE email = 'bone@gmail.com';

-- Expected: Should return 1 row with role='contractor'
-- ============================================================================

-- Step 2: Check if bone@gmail.com exists in contractors table
-- ============================================================================
SELECT 
  'Step 2: Check contractors table' as check_name,
  id,
  user_id,
  email,
  company_name,
  contact_person,
  cidb_registration_number,
  cidb_grade,
  status,
  operating_provinces,
  project_types,
  subscription_tier,
  created_at
FROM contractors 
WHERE email = 'bone@gmail.com';

-- Expected: Should return 1 row with company details
-- If EMPTY = This is the problem! Run FIX_ALL_MISSING_CONTRACTORS.sql
-- ============================================================================

-- Step 3: Check RLS policies on contractors table
-- ============================================================================
SELECT 
  'Step 3: Check RLS status' as check_name,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'contractors';

-- If rls_enabled = true, check policies:
SELECT 
  'Step 3b: Check RLS policies' as check_name,
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'contractors';

-- ============================================================================

-- Step 4: Count all contractors vs users with role='contractor'
-- ============================================================================
SELECT 
  'Step 4: Count users vs contractors' as check_name,
  (SELECT COUNT(*) FROM public.users WHERE role = 'contractor') as users_with_contractor_role,
  (SELECT COUNT(*) FROM contractors) as total_contractor_records,
  (SELECT COUNT(*) 
   FROM public.users u 
   WHERE u.role = 'contractor' 
     AND NOT EXISTS (SELECT 1 FROM contractors c WHERE c.email = u.email)
  ) as missing_contractor_records;

-- Expected: missing_contractor_records should be 0
-- If > 0 = Run FIX_ALL_MISSING_CONTRACTORS.sql
-- ============================================================================

-- Step 5: List all users missing contractor records
-- ============================================================================
SELECT 
  'Step 5: Users missing contractor records' as check_name,
  u.email,
  u.full_name,
  u.role,
  u.company_name as users_table_company,
  u.cidb_grade as users_table_cidb,
  u.created_at,
  CASE 
    WHEN c.id IS NULL THEN '❌ MISSING CONTRACTOR RECORD'
    ELSE '✅ Has contractor record'
  END as status
FROM public.users u
LEFT JOIN contractors c ON c.email = u.email
WHERE u.role = 'contractor'
ORDER BY u.created_at DESC;

-- ============================================================================

-- Step 6: Test SELECT as current user (mimics what the app does)
-- ============================================================================
SELECT 
  'Step 6: Test SELECT with RLS' as check_name,
  *
FROM contractors
WHERE email = 'bone@gmail.com'
LIMIT 1;

-- If this returns empty BUT Step 2 returned data, RLS is blocking!
-- Solution: Temporarily disable RLS or fix policies
-- ============================================================================

-- ============================================================================
-- QUICK FIXES
-- ============================================================================

-- If bone@gmail.com is missing from contractors table, run this:
/*
INSERT INTO contractors (
  user_id,
  email,
  company_name,
  contact_person,
  cidb_registration_number,
  cidb_grade,
  status,
  subscription_tier,
  annual_turnover,
  operating_provinces,
  project_types
)
SELECT 
  u.id,
  u.email,
  COALESCE(u.company_name, 'Bone Construction (Pty) Ltd'),
  COALESCE(u.full_name, 'Bone User'),
  'CIDB/2026/BONE123',
  COALESCE(u.cidb_grade, 'Grade 4 GB'),
  'approved',
  'FREE',
  0,
  ARRAY['GP']::text[],
  ARRAY['General Building', 'Road Construction']::text[]
FROM public.users u
WHERE u.email = 'bone@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM contractors c WHERE c.email = u.email);
*/

-- If RLS is blocking, temporarily disable it:
/*
ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;
*/

-- Then verify again:
/*
SELECT * FROM contractors WHERE email = 'bone@gmail.com';
*/

-- ============================================================================
-- END OF DIAGNOSTIC
-- ============================================================================

-- After running this script, you'll know exactly what's wrong:
-- 1. If Step 2 is EMPTY → Run FIX_ALL_MISSING_CONTRACTORS.sql
-- 2. If Step 2 has data but Step 6 is EMPTY → RLS is blocking (disable RLS)
-- 3. If both have data → Check browser console for errors
-- ============================================================================
