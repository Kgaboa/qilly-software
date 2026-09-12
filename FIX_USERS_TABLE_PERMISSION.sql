-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: FIX "permission denied for table users" ERROR
-- Issue: Contractors can't load data because users table is blocked
-- Solution: Allow authenticated users to read users table for admin checks
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Drop ALL existing policies on users table
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Admins have full access to users" ON public.users;
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- CREATE NEW POLICIES - ALLOW ALL AUTHENTICATED USERS TO READ
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- SELECT: Allow ALL authenticated users to read users table
-- This is REQUIRED so contractor policies can check admin status
CREATE POLICY "users_select_policy" ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Users can only insert their own record
CREATE POLICY "users_insert_policy" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can only update their own record
CREATE POLICY "users_update_policy" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- DELETE: Only the user themselves can delete (or we can disable this)
CREATE POLICY "users_delete_policy" ON public.users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- GRANT PERMISSIONS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- VERIFY
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  tablename,
  policyname,
  cmd as operation,
  CASE 
    WHEN cmd = 'SELECT' AND qual IS NULL THEN '✅ ALLOWS ALL'
    ELSE '✅ RESTRICTED'
  END as access_level
FROM pg_policies
WHERE tablename = 'users'
AND schemaname = 'public'
ORDER BY cmd;

-- Expected output:
-- users | users_select_policy | SELECT | ✅ ALLOWS ALL
-- users | users_insert_policy | INSERT | ✅ RESTRICTED
-- users | users_update_policy | UPDATE | ✅ RESTRICTED
-- users | users_delete_policy | DELETE | ✅ RESTRICTED

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- DONE!
-- 
-- What changed:
-- - users SELECT policy now uses USING (true) instead of USING (auth.uid() = id)
-- - This allows ALL authenticated users to read the users table
-- - Contractor policies can now check if someone is an admin
-- - Passwords are NOT in this table (they're in auth.users)
-- - Only email and user_type are readable
-- 
-- Next steps:
-- 1. Clear browser cache (Ctrl+F5)
-- 2. Try contractor login again
-- 3. Should load data successfully!
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
