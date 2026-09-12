-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: FIX CONTRACTOR SIGNUP & LOGIN RLS PERMISSIONS (V2)
-- Issue: "permission denied for table users" during contractor signup AND login
-- Root Cause: RLS policies reference users table which also has RLS enabled
-- Solution: Allow authenticated users to read users table for admin checks
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEGIN;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 1: Drop existing RLS policies on both tables
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$ 
BEGIN
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '🔧 FIXING CONTRACTOR SIGNUP & LOGIN RLS POLICIES (V2)...';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

-- Drop all existing policies on contractors table
DROP POLICY IF EXISTS "Contractors can view their own data" ON public.contractors;
DROP POLICY IF EXISTS "Contractors can update their own data" ON public.contractors;
DROP POLICY IF EXISTS "Admins have full access to contractors" ON public.contractors;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.contractors;
DROP POLICY IF EXISTS "Enable insert during signup" ON public.contractors;
DROP POLICY IF EXISTS "Allow contractor signup" ON public.contractors;
DROP POLICY IF EXISTS "contractors_select_policy" ON public.contractors;
DROP POLICY IF EXISTS "contractors_insert_policy" ON public.contractors;
DROP POLICY IF EXISTS "contractors_update_policy" ON public.contractors;
DROP POLICY IF EXISTS "contractors_delete_policy" ON public.contractors;

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Admins have full access to users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: Ensure RLS is enabled
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: Create NEW RLS policies for USERS table (SIMPLIFIED)
-- Key: Allow authenticated users to read users table (needed for admin checks)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- SELECT: All authenticated users can read users table (needed for admin checks in contractor policies)
CREATE POLICY "users_select_policy" ON public.users
  FOR SELECT
  TO authenticated
  USING (true);  -- Allow all authenticated users to read

-- INSERT: Users can only insert their own record
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
-- STEP 4: Create NEW RLS policies for CONTRACTORS table
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- SELECT: Contractors can view their own data OR admins can view all
CREATE POLICY "contractors_select_policy" ON public.contractors
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'
    )
  );

-- INSERT: Authenticated users can insert their own contractor record
CREATE POLICY "contractors_insert_policy" ON public.contractors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Contractors can update their own data OR admins can update all
CREATE POLICY "contractors_update_policy" ON public.contractors
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'
    )
  );

-- DELETE: Only admins can delete contractors
CREATE POLICY "contractors_delete_policy" ON public.contractors
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'
    )
  );

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 5: Grant necessary permissions
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Grant permissions on contractors table
GRANT SELECT, INSERT, UPDATE ON public.contractors TO authenticated;
GRANT SELECT ON public.contractors TO anon;

-- Grant permissions on users table
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 6: Verification
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
DECLARE
  contractors_policies_count INT;
  users_policies_count INT;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ VERIFICATION RESULTS';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  
  -- Count contractors policies
  SELECT COUNT(*) INTO contractors_policies_count
  FROM pg_policies
  WHERE tablename = 'contractors';
  
  -- Count users policies
  SELECT COUNT(*) INTO users_policies_count
  FROM pg_policies
  WHERE tablename = 'users';
  
  RAISE NOTICE '✅ Contractors table: % RLS policies created', contractors_policies_count;
  RAISE NOTICE '✅ Users table: % RLS policies created', users_policies_count;
  RAISE NOTICE '';
  
  IF contractors_policies_count = 4 AND users_policies_count = 4 THEN
    RAISE NOTICE '✅✅✅ ALL POLICIES CREATED SUCCESSFULLY! ✅✅✅';
    RAISE NOTICE '';
    RAISE NOTICE '🔑 KEY CHANGES IN V2:';
    RAISE NOTICE '   • Users table: SELECT policy now allows all authenticated users';
    RAISE NOTICE '   • This fixes "permission denied" when checking admin status';
    RAISE NOTICE '   • Contractors can now load their data after login';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Both contractor signup AND login should now work!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Next Steps:';
    RAISE NOTICE '   1. Clear browser cache (Ctrl+F5)';
    RAISE NOTICE '   2. Try contractor login with: contractor@gmail.com';
    RAISE NOTICE '   3. Should successfully load contractor dashboard';
  ELSE
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ Expected 4 policies per table';
    RAISE NOTICE '   Got % for contractors and % for users', contractors_policies_count, users_policies_count;
  END IF;
  
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

-- Show all policies for verification
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename IN ('contractors', 'users')
ORDER BY tablename, cmd, policyname;

COMMIT;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- EXPLANATION OF KEY FIX (V2):
-- 
-- The problem was that contractor policies check users.user_type = 'admin',
-- but the users table also had RLS which prevented reading other users.
--
-- V2 Solution:
-- • Users SELECT policy now uses USING (true) for authenticated users
-- • This allows any authenticated user to READ the users table
-- • This is needed so contractor policies can check admin status
-- • Other operations (INSERT, UPDATE, DELETE) still restricted to own records
--
-- Security note: 
-- Allowing all authenticated users to read users table is safe because:
-- 1. Passwords are NOT in this table (they're in auth.users)
-- 2. Only basic info like user_type, email is exposed
-- 3. This is standard practice for role-based access control
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
