-- =====================================================
-- FIX HTTP 406 ERRORS IN SIT ENVIRONMENT
-- =====================================================
-- Project: SIT (kcptusoevqapcvptlgkd)
-- Error: HTTP 406 on contractor/supplier queries
-- =====================================================

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 1: DIAGNOSE THE ISSUE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '🔍 DIAGNOSING HTTP 406 ISSUE' as status;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

-- Check if tables exist
SELECT 
  'Tables Check' as check_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'contractors') THEN '✅ contractors exists'
    ELSE '❌ contractors missing'
  END as contractors_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'suppliers') THEN '✅ suppliers exists'
    ELSE '❌ suppliers missing'
  END as suppliers_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users') THEN '✅ users exists'
    ELSE '❌ users missing'
  END as users_status;

-- Check if data exists
SELECT 
  'Data Check' as check_name,
  (SELECT COUNT(*) FROM contractors) as contractor_count,
  (SELECT COUNT(*) FROM suppliers) as supplier_count,
  (SELECT COUNT(*) FROM users) as user_count;

-- Check if user exists (from your error log)
SELECT 
  'User Check' as check_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM auth.users WHERE id = 'c36eb0dd-0fab-4f44-b38e-92d893723a5c') 
    THEN '✅ User exists in auth.users'
    ELSE '❌ User missing from auth.users'
  END as auth_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM users WHERE id = 'c36eb0dd-0fab-4f44-b38e-92d893723a5c') 
    THEN '✅ User exists in users table'
    ELSE '❌ User missing from users table'
  END as users_table_status;

-- Check RLS status
SELECT 
  'RLS Check' as check_name,
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '🔒 RLS Enabled' ELSE '🔓 RLS Disabled' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('contractors', 'suppliers', 'users')
ORDER BY tablename;

-- Check RLS policies
SELECT 
  'Policy Check' as check_name,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('contractors', 'suppliers', 'users')
GROUP BY tablename
ORDER BY tablename;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: FIX THE ISSUE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- HTTP 406 is usually caused by:
-- 1. Missing RLS policies
-- 2. User not in users table
-- 3. Wrong Accept header (can't fix in SQL)

-- Fix 1: Create user in users table if missing
DO $$
DECLARE
  test_user_id UUID := 'c36eb0dd-0fab-4f44-b38e-92d893723a5c';
  test_email TEXT := 'sit-test@gmail.com';
BEGIN
  -- Check if user exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = test_user_id) THEN
    RAISE NOTICE '⚠️ User does not exist in auth.users - cannot create in users table';
    RAISE NOTICE '📝 User must be created in Supabase Auth first';
  ELSE
    RAISE NOTICE '✅ User exists in auth.users';
    
    -- Create in users table if missing
    INSERT INTO users (id, email, role, created_at)
    VALUES (test_user_id, test_email, 'contractor', NOW())
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE '✅ User created/verified in users table';
  END IF;
END $$;

-- Fix 2: Ensure RLS policies exist for contractors
DROP POLICY IF EXISTS "Users can view own contractor data" ON contractors;
CREATE POLICY "Users can view own contractor data"
ON contractors FOR SELECT TO authenticated
USING (user_id = auth.uid() OR email = (SELECT email FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own contractor data" ON contractors;
CREATE POLICY "Users can insert own contractor data"
ON contractors FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all contractors" ON contractors;
CREATE POLICY "Admins can view all contractors"
ON contractors FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Fix 3: Ensure RLS policies exist for suppliers
DROP POLICY IF EXISTS "Users can view own supplier data" ON suppliers;
CREATE POLICY "Users can view own supplier data"
ON suppliers FOR SELECT TO authenticated
USING (user_id = auth.uid() OR email = (SELECT email FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own supplier data" ON suppliers;
CREATE POLICY "Users can insert own supplier data"
ON suppliers FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all suppliers" ON suppliers;
CREATE POLICY "Admins can view all suppliers"
ON suppliers FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '✅ RLS POLICIES CREATED/UPDATED' as status;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: VERIFY THE FIX
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '🔍 VERIFICATION' as status;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

-- Verify policies
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE tablename IN ('contractors', 'suppliers')
ORDER BY tablename, cmd, policyname;

-- Verify user exists in both tables
SELECT 
  'User Verification' as check,
  au.email as auth_email,
  u.email as users_email,
  u.role,
  CASE 
    WHEN au.id IS NOT NULL AND u.id IS NOT NULL THEN '✅ User in both tables'
    WHEN au.id IS NOT NULL THEN '⚠️ User only in auth.users'
    WHEN u.id IS NOT NULL THEN '⚠️ User only in users table'
    ELSE '❌ User not found'
  END as status
FROM auth.users au
FULL OUTER JOIN users u ON u.id = au.id
WHERE au.id = 'c36eb0dd-0fab-4f44-b38e-92d893723a5c'
   OR u.id = 'c36eb0dd-0fab-4f44-b38e-92d893723a5c';

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 4: NEXT STEPS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
DECLARE
  contractor_count INTEGER;
  supplier_count INTEGER;
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO contractor_count FROM contractors;
  SELECT COUNT(*) INTO supplier_count FROM suppliers;
  SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE tablename IN ('contractors', 'suppliers');
  
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📊 DATABASE STATUS:';
  RAISE NOTICE '   Contractors: %', contractor_count;
  RAISE NOTICE '   Suppliers: %', supplier_count;
  RAISE NOTICE '   RLS Policies: %', policy_count;
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  
  IF contractor_count = 0 OR supplier_count = 0 THEN
    RAISE NOTICE '⚠️ NO DATA FOUND!';
    RAISE NOTICE '📝 Run /SETUP_ADMIN_USER_COMPLETE.sql to add test data';
  ELSE
    RAISE NOTICE '✅ Data exists';
  END IF;
  
  IF policy_count < 6 THEN
    RAISE NOTICE '⚠️ Some policies might be missing';
    RAISE NOTICE '📝 Expected at least 6 policies (3 per table)';
  ELSE
    RAISE NOTICE '✅ RLS policies look good';
  END IF;
  
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📝 NEXT STEPS:';
  RAISE NOTICE '1. Refresh your SIT app (https://qilly-sit.vercel.app)';
  RAISE NOTICE '2. Login with sit-test@gmail.com';
  RAISE NOTICE '3. Check browser console for 406 errors';
  RAISE NOTICE '4. If 406 persists, check CORS settings';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

SELECT '✅ SCRIPT COMPLETE' as status;
SELECT 'HTTP 406 should be fixed now' as result;
SELECT 'If 406 persists, the issue is likely CORS or Accept headers' as note;
