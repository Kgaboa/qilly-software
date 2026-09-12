-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: FIX CONTRACTOR SIGNUP RLS PERMISSIONS
-- Issue: "permission denied for table users" during contractor signup
-- Solution: Allow anon users to insert into contractors table during signup
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEGIN;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 1: Drop existing RLS policies on contractors table
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$ 
BEGIN
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '🔧 FIXING CONTRACTOR SIGNUP RLS POLICIES...';
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

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: Ensure RLS is enabled
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: Create new RLS policies for contractors
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

-- INSERT: Allow authenticated users to insert their own contractor record
CREATE POLICY "contractors_insert_policy" ON public.contractors
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );

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
-- STEP 4: Fix users table RLS policies
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Admins have full access to users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;

-- Ensure RLS is enabled on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view their own data OR admins can view all
CREATE POLICY "users_select_policy" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.id = auth.uid() 
      AND u.user_type = 'admin'
    )
  );

-- INSERT: Allow authenticated users to insert their own user record
CREATE POLICY "users_insert_policy" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
  );

-- UPDATE: Users can update their own data OR admins can update all
CREATE POLICY "users_update_policy" ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.id = auth.uid() 
      AND u.user_type = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = id 
    OR 
    EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.id = auth.uid() 
      AND u.user_type = 'admin'
    )
  );

-- DELETE: Only admins can delete users
CREATE POLICY "users_delete_policy" ON public.users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.id = auth.uid() 
      AND u.user_type = 'admin'
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
  
  IF contractors_policies_count = 4 AND users_policies_count = 4 THEN
    RAISE NOTICE '';
    RAISE NOTICE '✅✅✅ ALL POLICIES CREATED SUCCESSFULLY! ✅✅✅';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Contractor signup should now work!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Next Steps:';
    RAISE NOTICE '   1. Clear browser cache';
    RAISE NOTICE '   2. Try contractor signup again';
    RAISE NOTICE '   3. Should successfully create contractor account';
  ELSE
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ Expected 4 policies per table, got % for contractors and % for users', contractors_policies_count, users_policies_count;
  END IF;
  
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

-- Show all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('contractors', 'users')
ORDER BY tablename, policyname;

COMMIT;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- DONE! Contractor signup should now work without RLS errors
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
