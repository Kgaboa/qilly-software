-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: DIAGNOSTIC SCRIPT - CHECK CURRENT DATABASE STATE
-- 
-- Run this first to see what's wrong with your database
-- Copy the output and we can see exactly what needs to be fixed
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ============================================================================
-- CHECK 1: Does users table exist?
-- ============================================================================

SELECT 
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator,
  'CHECK 1: USERS TABLE' as check_name;

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public')
    THEN '✅ users table EXISTS'
    ELSE '❌ users table DOES NOT EXIST'
  END as status;

-- ============================================================================
-- CHECK 2: What columns does users table have?
-- ============================================================================

SELECT 
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator,
  'CHECK 2: USERS TABLE COLUMNS' as check_name;

SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- CHECK 3: Is RLS enabled on users table?
-- ============================================================================

SELECT 
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator,
  'CHECK 3: RLS STATUS' as check_name;

SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS ENABLED'
    ELSE '❌ RLS DISABLED'
  END as rls_status
FROM pg_tables
WHERE tablename IN ('users', 'contractors')
  AND schemaname = 'public';

-- ============================================================================
-- CHECK 4: What RLS policies exist on users table?
-- ============================================================================

SELECT 
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator,
  'CHECK 4: USERS TABLE RLS POLICIES' as check_name;

SELECT 
  policyname as policy_name,
  cmd as command,
  CASE 
    WHEN roles = '{authenticated}' THEN 'authenticated'
    WHEN roles = '{anon}' THEN 'anon'
    ELSE roles::text
  END as applies_to,
  CASE 
    WHEN qual IS NULL THEN 'ALLOWS ALL (USING true)'
    ELSE 'RESTRICTED (has conditions)'
  END as access_level,
  qual as using_clause
FROM pg_policies
WHERE tablename = 'users'
  AND schemaname = 'public'
ORDER BY cmd, policyname;

-- ============================================================================
-- CHECK 5: What RLS policies exist on contractors table?
-- ============================================================================

SELECT 
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator,
  'CHECK 5: CONTRACTORS TABLE RLS POLICIES' as check_name;

SELECT 
  policyname as policy_name,
  cmd as command,
  CASE 
    WHEN roles = '{authenticated}' THEN 'authenticated'
    WHEN roles = '{anon}' THEN 'anon'
    ELSE roles::text
  END as applies_to,
  qual as using_clause
FROM pg_policies
WHERE tablename = 'contractors'
  AND schemaname = 'public'
ORDER BY cmd, policyname;

-- ============================================================================
-- CHECK 6: What grants exist on users table?
-- ============================================================================

SELECT 
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator,
  'CHECK 6: USERS TABLE GRANTS' as check_name;

SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'users'
  AND table_schema = 'public'
ORDER BY grantee, privilege_type;

-- ============================================================================
-- CHECK 7: Does admin user exist?
-- ============================================================================

SELECT 
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator,
  'CHECK 7: ADMIN USER' as check_name;

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.users WHERE user_type = 'admin')
    THEN '✅ Admin user EXISTS'
    ELSE '❌ Admin user DOES NOT EXIST'
  END as status;

SELECT 
  id,
  email,
  user_type,
  created_at
FROM public.users
WHERE user_type = 'admin'
LIMIT 5;

-- ============================================================================
-- CHECK 8: How many total users?
-- ============================================================================

SELECT 
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator,
  'CHECK 8: USER COUNT' as check_name;

SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as admin_count,
  COUNT(CASE WHEN user_type = 'user' THEN 1 END) as regular_user_count,
  COUNT(CASE WHEN user_type IS NULL THEN 1 END) as null_user_type_count
FROM public.users;

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT 
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as separator,
  'DIAGNOSTIC COMPLETE' as status,
  'Copy the output above to see what needs to be fixed' as next_step;
