-- =====================================================
-- FIX: Permission denied for table users
-- =====================================================
-- Error: "permission denied for table users" (42501)
-- When: Creating contractor profile
-- Cause: No RLS policies on users table for INSERT/UPDATE
-- =====================================================
-- Run this in SIT Supabase SQL Editor
-- Project: kcptusoevqapcvptlgkd
-- =====================================================

BEGIN;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 1: CHECK CURRENT STATE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
DECLARE
  rls_enabled BOOLEAN;
  policy_count INTEGER;
BEGIN
  -- Check if RLS is enabled on users table
  SELECT relrowsecurity INTO rls_enabled
  FROM pg_class
  WHERE relname = 'users';
  
  RAISE NOTICE '🔒 RLS enabled on users table: %', CASE WHEN rls_enabled THEN 'YES' ELSE 'NO' END;
  
  -- Count existing policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'users';
  
  RAISE NOTICE '📊 Existing policies on users table: %', policy_count;
END $$;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: DROP OLD POLICIES (if any)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_delete_policy" ON users;

RAISE NOTICE '🗑️ Old policies dropped (if they existed)';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: CREATE NEW PERMISSIVE RLS POLICIES FOR USERS TABLE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Policy 1: SELECT - Users can view their own profile OR admins view all
CREATE POLICY "users_select_policy"
ON users FOR SELECT TO authenticated
USING (
  -- User views their own profile
  id = auth.uid()
  -- OR user is admin (can view all)
  OR role = 'admin'
);

-- Policy 2: INSERT - Allow authenticated users to insert their own record
-- This is CRITICAL for contractor registration flow!
CREATE POLICY "users_insert_policy"
ON users FOR INSERT TO authenticated
WITH CHECK (
  -- User can only insert their own ID
  id = auth.uid()
  -- OR they are admin
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Policy 3: UPDATE - Users can update their own profile
CREATE POLICY "users_update_policy"
ON users FOR UPDATE TO authenticated
USING (
  -- User updates their own profile
  id = auth.uid()
  -- OR they are admin
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
)
WITH CHECK (
  -- Can only update their own record (prevent ID hijacking)
  id = auth.uid()
  -- OR they are admin
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Policy 4: DELETE - Only admins can delete users
CREATE POLICY "users_delete_policy"
ON users FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

RAISE NOTICE '✅ Users table policies created';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 4: ENSURE RLS IS ENABLED
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

RAISE NOTICE '🔒 RLS enabled on users table';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 5: VERIFY POLICIES CREATED
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count 
  FROM pg_policies 
  WHERE tablename = 'users';
  
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ USERS TABLE POLICIES CREATED';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📊 Total policies: %', policy_count;
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  
  IF policy_count < 4 THEN
    RAISE WARNING '⚠️ Expected 4 policies, got %', policy_count;
  END IF;
END $$;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 6: SHOW ALL POLICIES
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  '📋 ALL POLICIES ON USERS TABLE:' as info,
  tablename,
  policyname,
  cmd as operation,
  CASE 
    WHEN roles::text LIKE '%authenticated%' THEN 'authenticated'
    ELSE roles::text
  END as applies_to
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd;

COMMIT;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TEST QUERY (Run separately to test)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- After running the above, test with this query:
-- This simulates what happens when creating a contractor
/*
SELECT 
  'Testing permissions for new contractor creation' as test,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users') as user_policies,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'contractors') as contractor_policies,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'suppliers') as supplier_policies;
*/

SELECT '✅ USERS TABLE FIX COMPLETE!' as result;
SELECT 'Now try creating a contractor again in SIT!' as next_step;
