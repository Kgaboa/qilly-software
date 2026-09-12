-- ============================================
-- FIX ERROR 42501: RLS Policy Violation
-- ============================================
-- Problem: New contractor rows violate RLS policy
-- Cause: INSERT policy requires authenticated user,
--        but signup happens before auth session established
-- Solution: Fix RLS policies to allow signup
-- ============================================

-- Step 1: Drop existing RLS policies
DROP POLICY IF EXISTS "Users can create contractor profiles" ON contractors;
DROP POLICY IF EXISTS "Authenticated users can read contractors" ON contractors;
DROP POLICY IF EXISTS "Users can update own contractor profile" ON contractors;

-- Step 2: Create NEW permissive RLS policies

-- INSERT Policy: Allow anyone authenticated to create contractor profile
-- This works because auth.signUp creates the user FIRST, then we insert contractor
CREATE POLICY "Enable insert for authenticated users only"
  ON contractors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- SELECT Policy: Authenticated users can read all contractors
CREATE POLICY "Enable read access for authenticated users"
  ON contractors FOR SELECT
  TO authenticated
  USING (true);

-- UPDATE Policy: Users can only update their own profile
CREATE POLICY "Enable update for users based on user_id"
  ON contractors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 3: Verify policies were created
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
WHERE tablename = 'contractors'
ORDER BY cmd;

-- Step 4: Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ================================================';
  RAISE NOTICE '✅  RLS POLICIES FIXED!';
  RAISE NOTICE '✅ ================================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ INSERT: Requires auth.uid() = user_id';
  RAISE NOTICE '✅ SELECT: All authenticated users';
  RAISE NOTICE '✅ UPDATE: Only own profile';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANT:';
  RAISE NOTICE '';
  RAISE NOTICE '1. The user must be created in auth.users FIRST';
  RAISE NOTICE '2. Then contractor record created with same user_id';
  RAISE NOTICE '3. The auth.uid() must match the user_id being inserted';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Try contractor signup again!';
  RAISE NOTICE '';
END $$;
