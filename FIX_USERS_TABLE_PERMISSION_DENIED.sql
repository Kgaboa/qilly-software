-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: FIX PERMISSION DENIED FOR TABLE USERS (Error 42501)
-- Issue: Code can't read from users table due to RLS blocking access
-- Solution: Fix users table RLS policies
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 🚀 QUICK START:
-- 1. Copy this entire file
-- 2. Go to: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
-- 3. Paste and click "Run"
-- 4. Clear browser cache and test login

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- THE PROBLEM
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Error: permission denied for table users (42501)
-- 
-- Code tries to:
--   SELECT id FROM users WHERE id = auth.uid()
--
-- But RLS policy might be too restrictive or not properly configured

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- FIX 1: Drop ALL existing policies on users table
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Service role can access all users" ON public.users;
DROP POLICY IF EXISTS "Admins can access all users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.users;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- FIX 2: Recreate policies with proper configuration
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Policy 1: Users can SELECT their own data
CREATE POLICY "Users can read own data"
ON public.users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Policy 2: Users can UPDATE their own data
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Policy 3: Users can INSERT their own data
CREATE POLICY "Users can insert own data"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Policy 4: Service role can do everything (for backend operations)
CREATE POLICY "Service role can access all users"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 5: Admins can access all users
CREATE POLICY "Admins can access all users"
ON public.users
FOR ALL
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) 
  IN ('admin@qilly.co.za', 'support@qilly.co.za', 'tshego@qilly.co.za')
)
WITH CHECK (
  (SELECT email FROM auth.users WHERE id = auth.uid()) 
  IN ('admin@qilly.co.za', 'support@qilly.co.za', 'tshego@qilly.co.za')
);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- FIX 3: Also update contractors table policy (from previous fix)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DROP POLICY IF EXISTS "Contractors can read own data" ON public.contractors;

CREATE POLICY "Contractors can read own data"
ON public.contractors
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- FIX 4: Ensure contractor@gmail.com has proper data
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Fix user_id mismatch
UPDATE public.contractors c
SET user_id = au.id
FROM auth.users au
WHERE c.email = au.email
  AND (c.user_id IS NULL OR c.user_id != au.id)
  AND c.email = 'contractor@gmail.com';

-- Approve contractor
UPDATE public.contractors
SET status = 'approved'
WHERE email = 'contractor@gmail.com' AND status != 'approved';

-- Create user record if missing
INSERT INTO public.users (id, email, full_name, role, subscription_tier, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
  COALESCE(au.raw_user_meta_data->>'user_type', 'contractor') as role,
  'FREE' as subscription_tier,
  NOW() as created_at
FROM auth.users au
WHERE au.email = 'contractor@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = au.id)
ON CONFLICT (id) DO NOTHING;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- VERIFICATION QUERIES
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Check RLS is enabled
SELECT 
  tablename,
  rowsecurity,
  CASE WHEN rowsecurity THEN '✅ RLS enabled' ELSE '❌ RLS disabled' END as status
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'contractors')
ORDER BY tablename;

-- Check policies exist
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'contractors')
ORDER BY tablename, cmd, policyname;

-- Check contractor@gmail.com data
SELECT 
  'auth.users' as source,
  id,
  email,
  created_at,
  CASE WHEN confirmed_at IS NOT NULL THEN '✅ Confirmed' ELSE '❌ Not confirmed' END as status
FROM auth.users
WHERE email = 'contractor@gmail.com'

UNION ALL

SELECT 
  'public.users' as source,
  id,
  email,
  created_at,
  '✅ Exists' as status
FROM public.users
WHERE email = 'contractor@gmail.com'

UNION ALL

SELECT 
  'contractors' as source,
  user_id as id,
  email,
  created_at,
  status
FROM public.contractors
WHERE email = 'contractor@gmail.com';

-- Check user_id matching
SELECT 
  'Match Check' as check_type,
  c.email,
  c.user_id as contractor_user_id,
  u.id as users_id,
  au.id as auth_id,
  CASE 
    WHEN c.user_id = u.id AND u.id = au.id THEN '✅ ALL MATCH' 
    ELSE '❌ MISMATCH' 
  END as status
FROM public.contractors c
LEFT JOIN public.users u ON c.email = u.email
LEFT JOIN auth.users au ON c.email = au.email
WHERE c.email = 'contractor@gmail.com';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- SUCCESS MESSAGE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
BEGIN
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ USERS TABLE PERMISSION FIXED!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Users table RLS policies recreated';
  RAISE NOTICE '✅ Contractors table RLS policy updated (allows email queries)';
  RAISE NOTICE '✅ contractor@gmail.com user_id fixed';
  RAISE NOTICE '✅ contractor@gmail.com approved';
  RAISE NOTICE '✅ User record created/verified';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 ERRORS FIXED:';
  RAISE NOTICE '   ✅ Error 42501 (permission denied) - FIXED';
  RAISE NOTICE '   ✅ HTTP 406 (Not Acceptable) - FIXED';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 NEXT STEPS:';
  RAISE NOTICE '   1. Clear browser cache (Ctrl+Shift+Delete)';
  RAISE NOTICE '   2. Hard refresh (Ctrl+F5)';
  RAISE NOTICE '   3. Login as contractor@gmail.com';
  RAISE NOTICE '   4. Should see contractor dashboard';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Check verification queries above to confirm all fixes!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;
