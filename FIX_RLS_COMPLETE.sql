-- ============================================
-- COMPLETE FIX FOR RLS ERROR 42501
-- ============================================
-- This fixes the "new row violates row-level security policy" error
-- by making the INSERT policy work with Supabase auth.signUp()
-- ============================================

-- Step 1: Disable RLS temporarily (to clean up)
ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies
DROP POLICY IF EXISTS "Users can create contractor profiles" ON contractors;
DROP POLICY IF EXISTS "Authenticated users can read contractors" ON contractors;
DROP POLICY IF EXISTS "Users can update own contractor profile" ON contractors;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON contractors;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON contractors;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON contractors;

-- Step 3: Re-enable RLS
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- Step 4: Create CORRECT RLS policies

-- INSERT Policy: Allow authenticated users to insert IF user_id matches their auth.uid()
-- This works with auth.signUp() because the session is established during signup
CREATE POLICY "contractors_insert_policy"
  ON contractors FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );

-- SELECT Policy: Authenticated users can see all contractors
-- (Admins need to see all, contractors might need to see others too)
CREATE POLICY "contractors_select_policy"
  ON contractors FOR SELECT
  TO authenticated
  USING (true);

-- UPDATE Policy: Users can only update their own profile
CREATE POLICY "contractors_update_policy"
  ON contractors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE Policy: Users can delete their own profile (optional - commented out for safety)
-- CREATE POLICY "contractors_delete_policy"
--   ON contractors FOR DELETE
--   TO authenticated
--   USING (auth.uid() = user_id);

-- Step 5: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON contractors TO authenticated;

-- Step 6: Verify RLS is enabled and policies exist
SELECT 
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE tablename = 'contractors';

SELECT 
  policyname as "Policy Name",
  cmd as "Command",
  qual as "USING Clause",
  with_check as "WITH CHECK Clause"
FROM pg_policies
WHERE tablename = 'contractors'
ORDER BY cmd;

-- Step 7: Test query (this should work after signup)
-- Run this AFTER creating a contractor to verify:
-- SELECT * FROM contractors WHERE user_id = auth.uid();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ════════════════════════════════════════════════';
  RAISE NOTICE '✅  RLS POLICIES COMPLETELY FIXED!';
  RAISE NOTICE '✅ ════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Policies Created:';
  RAISE NOTICE '   • INSERT: contractors_insert_policy';
  RAISE NOTICE '     → Requires: auth.uid() = user_id';
  RAISE NOTICE '';
  RAISE NOTICE '   • SELECT: contractors_select_policy';
  RAISE NOTICE '     → Allows: All authenticated users';
  RAISE NOTICE '';
  RAISE NOTICE '   • UPDATE: contractors_update_policy';
  RAISE NOTICE '     → Allows: Only own profile';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANT FOR SIGNUP TO WORK:';
  RAISE NOTICE '';
  RAISE NOTICE '1. auth.signUp() creates user in auth.users';
  RAISE NOTICE '2. This ALSO establishes authenticated session';
  RAISE NOTICE '3. Then contractor insert uses that session auth.uid()';
  RAISE NOTICE '4. RLS policy checks: auth.uid() = user_id ✅';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Contractor signup should work now!';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  If you get "email rate limit exceeded":';
  RAISE NOTICE '   → Wait 1 hour OR use different email';
  RAISE NOTICE '   → Supabase limits signup attempts per email';
  RAISE NOTICE '';
END $$;
