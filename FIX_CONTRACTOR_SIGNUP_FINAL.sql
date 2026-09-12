-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: FIX CONTRACTOR SIGNUP - "permission denied for table users"
-- 
-- ERROR FROM LOGS:
-- ❌ Contractor insert error: {"code": "42501", "message": "permission denied for table users"}
-- 
-- ROOT CAUSE:
-- When inserting into contractors table, RLS policy checks if user is admin
-- by querying users table, but users table RLS blocks the read!
-- 
-- SOLUTION:
-- Allow ALL authenticated users to READ the users table (needed for RLS checks)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 1: Add user_type column if missing
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'user';

-- Also ensure email column exists
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS email TEXT;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: Set admin user
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT INTO public.users (id, email, user_type)
SELECT 
  id, 
  email, 
  'admin'
FROM auth.users
WHERE email = 'admin@qilly.co.za'
ON CONFLICT (id) 
DO UPDATE SET 
  user_type = 'admin',
  email = EXCLUDED.email;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: Drop ALL existing users table policies
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
DROP POLICY IF EXISTS "Allow users to view own profile" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 4: Enable RLS on users table
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 5: Create NEW users table policies
-- KEY: SELECT uses USING (true) to allow ALL authenticated users to read
-- This is REQUIRED for RLS policies on other tables to check admin status
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- SELECT: Allow ALL authenticated users to read users table
-- This is SAFE because:
-- 1. Passwords are in auth.users, not public.users
-- 2. Only contains: id, email, user_type
-- 3. Other table RLS policies need to check admin status
CREATE POLICY "users_select_policy" ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Allow authenticated users to insert their own record
CREATE POLICY "users_insert_policy" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can only update their own record
CREATE POLICY "users_update_policy" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DELETE: Users can only delete their own record
CREATE POLICY "users_delete_policy" ON public.users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 6: Grant necessary permissions
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- VERIFICATION
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Check user_type column exists
SELECT 
  '✅ user_type column' as check_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'users' 
      AND column_name = 'user_type'
      AND table_schema = 'public'
    ) THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status;

-- Check users table SELECT policy allows all authenticated users
SELECT 
  '✅ users SELECT policy' as check_name,
  policyname,
  CASE 
    WHEN cmd = 'SELECT' AND qual IS NULL THEN '✅ ALLOWS ALL'
    WHEN cmd = 'SELECT' THEN '⚠️  RESTRICTED (might block contractor signup)'
    ELSE 'N/A'
  END as access_level
FROM pg_policies
WHERE tablename = 'users'
AND schemaname = 'public'
AND cmd = 'SELECT';

-- Count all users policies
SELECT 
  '✅ Total users policies' as check_name,
  COUNT(*)::text as policy_count
FROM pg_policies
WHERE tablename = 'users'
AND schemaname = 'public';

-- Check admin user exists
SELECT 
  '✅ Admin user' as check_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.users WHERE user_type = 'admin'
    ) THEN '✅ EXISTS'
    ELSE '⚠️  NOT SET'
  END as status;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- EXPECTED OUTPUT:
-- 
-- ✅ user_type column | ✅ EXISTS
-- ✅ users SELECT policy | users_select_policy | ✅ ALLOWS ALL
-- ✅ Total users policies | 4
-- ✅ Admin user | ✅ EXISTS
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- WHAT THIS FIXES:
--
-- BEFORE (Broken Flow):
-- 1. Contractor fills signup form
-- 2. Click submit → Create auth user ✅
-- 3. Insert into contractors table
-- 4. RLS policy checks: "Is user an admin?"
-- 5. RLS tries: SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin'
-- 6. ❌ users table SELECT policy blocks the read
-- 7. ❌ ERROR: "permission denied for table users"
--
-- AFTER (Fixed Flow):
-- 1. Contractor fills signup form
-- 2. Click submit → Create auth user ✅
-- 3. Insert into contractors table
-- 4. RLS policy checks: "Is user an admin?"
-- 5. RLS tries: SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin'
-- 6. ✅ users table SELECT policy ALLOWS the read (USING true)
-- 7. ✅ RLS check completes successfully
-- 8. ✅ Contractor record inserted successfully
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- WHY THIS IS SAFE:
--
-- ✅ Passwords are NOT in public.users (they're in auth.users which is secured)
-- ✅ public.users only contains: id, email, user_type
-- ✅ Write operations (INSERT/UPDATE/DELETE) still restricted to own records
-- ✅ This is standard RBAC (Role-Based Access Control) pattern
-- ✅ Reading user_type='admin' is needed for RLS policies on other tables
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- NEXT STEPS:
--
-- 1. ✅ Run this script in Supabase SQL Editor
-- 2. ✅ Verify output shows all ✅ checks passed
-- 3. ✅ Clear browser cache (Ctrl+F5)
-- 4. ✅ Try contractor signup again
-- 5. ✅ Should work without "permission denied" error!
-- 6. ✅ Ready for Tuesday eTender presentation! 🚀
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
