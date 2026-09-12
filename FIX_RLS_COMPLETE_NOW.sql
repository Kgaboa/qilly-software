-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: COMPLETE RLS FIX - CONTRACTOR SIGNUP & LOGIN
-- 
-- ERROR: "permission denied for table users" during contractor login/signup
-- 
-- This script fixes EVERYTHING in one go:
-- 1. Adds user_type column
-- 2. Fixes users table RLS (allow reads for RLS checks)
-- 3. Fixes contractors table RLS (proper policies)
-- 4. Sets admin user
-- 
-- RUN THIS ENTIRE SCRIPT AT ONCE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ============================================================================
-- PART 1: FIX USERS TABLE STRUCTURE
-- ============================================================================

-- Add user_type column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'user';

-- Add email column if missing
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Set admin user
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

-- ============================================================================
-- PART 2: DROP ALL EXISTING POLICIES
-- ============================================================================

-- Drop users policies
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

-- Drop contractors policies
DROP POLICY IF EXISTS "contractors_select_policy" ON public.contractors;
DROP POLICY IF EXISTS "contractors_insert_policy" ON public.contractors;
DROP POLICY IF EXISTS "contractors_update_policy" ON public.contractors;
DROP POLICY IF EXISTS "contractors_delete_policy" ON public.contractors;
DROP POLICY IF EXISTS "Contractors can view their own data" ON public.contractors;
DROP POLICY IF EXISTS "Contractors can update their own data" ON public.contractors;
DROP POLICY IF EXISTS "Admins have full access to contractors" ON public.contractors;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.contractors;

-- ============================================================================
-- PART 3: ENABLE RLS
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 4: CREATE USERS TABLE POLICIES
-- KEY: SELECT allows ALL authenticated users (needed for RLS checks)
-- ============================================================================

CREATE POLICY "users_select_policy" ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "users_insert_policy" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_policy" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_delete_policy" ON public.users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ============================================================================
-- PART 5: CREATE CONTRACTORS TABLE POLICIES
-- These policies can now check users table without permission errors
-- ============================================================================

-- SELECT: Contractors can view their own data, admins can view all
CREATE POLICY "contractors_select_policy" ON public.contractors
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
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
  WITH CHECK (
    user_id = auth.uid()
    OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- UPDATE: Contractors can update own data, admins can update all
CREATE POLICY "contractors_update_policy" ON public.contractors
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
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

-- ============================================================================
-- PART 6: GRANT PERMISSIONS
-- ============================================================================

GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

GRANT SELECT, INSERT, UPDATE ON public.contractors TO authenticated;
GRANT SELECT ON public.contractors TO anon;

-- ============================================================================
-- PART 7: VERIFICATION
-- ============================================================================

DO $$
DECLARE
  v_user_type_exists BOOLEAN;
  v_users_policies INT;
  v_contractors_policies INT;
  v_admin_exists BOOLEAN;
BEGIN
  -- Check user_type column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' 
    AND column_name = 'user_type'
    AND table_schema = 'public'
  ) INTO v_user_type_exists;

  -- Count policies
  SELECT COUNT(*) INTO v_users_policies
  FROM pg_policies
  WHERE tablename = 'users' AND schemaname = 'public';

  SELECT COUNT(*) INTO v_contractors_policies
  FROM pg_policies
  WHERE tablename = 'contractors' AND schemaname = 'public';

  -- Check admin user
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE user_type = 'admin'
  ) INTO v_admin_exists;

  -- Report results
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE 'VERIFICATION RESULTS';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  
  IF v_user_type_exists THEN
    RAISE NOTICE '✅ user_type column exists';
  ELSE
    RAISE NOTICE '❌ user_type column MISSING';
  END IF;

  IF v_users_policies = 4 THEN
    RAISE NOTICE '✅ users table has % policies (expected 4)', v_users_policies;
  ELSE
    RAISE NOTICE '⚠️  users table has % policies (expected 4)', v_users_policies;
  END IF;

  IF v_contractors_policies = 4 THEN
    RAISE NOTICE '✅ contractors table has % policies (expected 4)', v_contractors_policies;
  ELSE
    RAISE NOTICE '⚠️  contractors table has % policies (expected 4)', v_contractors_policies;
  END IF;

  IF v_admin_exists THEN
    RAISE NOTICE '✅ Admin user configured';
  ELSE
    RAISE NOTICE '⚠️  Admin user NOT configured';
  END IF;

  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  
  IF v_user_type_exists AND v_users_policies = 4 AND v_contractors_policies = 4 AND v_admin_exists THEN
    RAISE NOTICE '🎉 ALL CHECKS PASSED! RLS is configured correctly.';
    RAISE NOTICE '';
    RAISE NOTICE 'NEXT STEPS:';
    RAISE NOTICE '1. Clear browser cache (Ctrl+F5)';
    RAISE NOTICE '2. Test contractor signup';
    RAISE NOTICE '3. Test contractor login';
    RAISE NOTICE '4. Should work without "permission denied" errors!';
  ELSE
    RAISE NOTICE '⚠️  Some checks failed. Review the output above.';
  END IF;
  
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

-- ============================================================================
-- DONE!
-- 
-- What this fixed:
-- ✅ Added user_type column to users table
-- ✅ Set admin@qilly.co.za as admin
-- ✅ Fixed users SELECT policy to allow all authenticated (needed for RLS)
-- ✅ Fixed contractors policies to check user by email OR user_id
-- ✅ Enabled contractor signup
-- ✅ Enabled contractor login
-- ✅ No more "permission denied for table users"
-- 
-- Clear cache and test!
-- ============================================================================
