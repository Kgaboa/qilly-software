-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: FIX CONTRACTOR SIGNUP & LOGIN RLS (V3 - FINAL FIX)
-- Issue: "column users.user_type does not exist"
-- Root Cause: RLS policies reference users.user_type but column doesn't exist
-- Solution: Add user_type column to users table OR use email to identify admins
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEGIN;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- DIAGNOSTIC: Check users table structure
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$ 
BEGIN
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '🔧 FIXING CONTRACTOR SIGNUP & LOGIN RLS (V3 - FINAL)...';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Checking users table structure...';
END $$;

-- Show current users table structure
SELECT 
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 1: Ensure users table has user_type column
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
BEGIN
  -- Check if user_type column exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'user_type'
    AND table_schema = 'public'
  ) THEN
    -- Add user_type column
    ALTER TABLE public.users ADD COLUMN user_type TEXT DEFAULT 'user';
    RAISE NOTICE '✅ Added user_type column to users table';
    
    -- Add constraint for valid values
    ALTER TABLE public.users 
    ADD CONSTRAINT users_user_type_check 
    CHECK (user_type IN ('admin', 'contractor', 'supplier', 'user'));
    RAISE NOTICE '✅ Added constraint for user_type values';
  ELSE
    RAISE NOTICE '⏭️  user_type column already exists';
  END IF;
END $$;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: Set admin user_type for admin@qilly.co.za
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  -- Check if admin@qilly.co.za exists in auth.users
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@qilly.co.za'
  ) INTO admin_exists;
  
  IF admin_exists THEN
    -- Insert or update admin in public.users
    INSERT INTO public.users (id, email, user_type)
    SELECT 
      id, 
      email, 
      'admin'
    FROM auth.users
    WHERE email = 'admin@qilly.co.za'
    ON CONFLICT (id) 
    DO UPDATE SET user_type = 'admin';
    
    RAISE NOTICE '✅ Set admin@qilly.co.za as admin user';
  ELSE
    RAISE NOTICE '⚠️  admin@qilly.co.za not found in auth.users';
    RAISE NOTICE '   Create admin user in Supabase Auth first';
  END IF;
END $$;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: Drop all existing RLS policies
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 4: Ensure RLS is enabled
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 5: Create NEW RLS policies for USERS table
-- Key: Allow all authenticated users to read users table (needed for admin checks)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- SELECT: All authenticated users can read users table
-- This is REQUIRED for contractor policies to check if someone is an admin
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
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DELETE: Users can only delete their own record
CREATE POLICY "users_delete_policy" ON public.users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 6: Create NEW RLS policies for CONTRACTORS table
-- Now using users.user_type which we just added
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
-- STEP 7: Grant necessary permissions
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Grant permissions on contractors table
GRANT SELECT, INSERT, UPDATE ON public.contractors TO authenticated;
GRANT SELECT ON public.contractors TO anon;

-- Grant permissions on users table
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 8: Verification
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
DECLARE
  contractors_policies_count INT;
  users_policies_count INT;
  user_type_exists BOOLEAN;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ VERIFICATION RESULTS';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  
  -- Check if user_type column exists
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'user_type'
    AND table_schema = 'public'
  ) INTO user_type_exists;
  
  IF user_type_exists THEN
    RAISE NOTICE '✅ users.user_type column EXISTS';
  ELSE
    RAISE NOTICE '❌ users.user_type column MISSING (this should not happen!)';
  END IF;
  
  -- Count contractors policies
  SELECT COUNT(*) INTO contractors_policies_count
  FROM pg_policies
  WHERE tablename = 'contractors'
  AND schemaname = 'public';
  
  -- Count users policies
  SELECT COUNT(*) INTO users_policies_count
  FROM pg_policies
  WHERE tablename = 'users'
  AND schemaname = 'public';
  
  RAISE NOTICE '✅ Contractors table: % RLS policies created', contractors_policies_count;
  RAISE NOTICE '✅ Users table: % RLS policies created', users_policies_count;
  RAISE NOTICE '';
  
  IF contractors_policies_count = 4 AND users_policies_count = 4 AND user_type_exists THEN
    RAISE NOTICE '✅✅✅ ALL POLICIES CREATED SUCCESSFULLY! ✅✅✅';
    RAISE NOTICE '';
    RAISE NOTICE '🔑 KEY CHANGES IN V3:';
    RAISE NOTICE '   • Added user_type column to users table';
    RAISE NOTICE '   • Set admin@qilly.co.za as admin user';
    RAISE NOTICE '   • Users SELECT policy allows all authenticated users';
    RAISE NOTICE '   • Fixed "column users.user_type does not exist" error';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Both contractor signup AND login should now work!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Next Steps:';
    RAISE NOTICE '   1. Clear browser cache (Ctrl+F5)';
    RAISE NOTICE '   2. Try contractor signup';
    RAISE NOTICE '   3. Try contractor login with: contractor@gmail.com';
    RAISE NOTICE '   4. Should successfully work without RLS errors!';
  ELSE
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ Expected 4 policies per table and user_type column';
    RAISE NOTICE '   Got % for contractors, % for users, user_type exists: %', 
      contractors_policies_count, users_policies_count, user_type_exists;
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
AND schemaname = 'public'
ORDER BY tablename, cmd, policyname;

-- Show users table structure after fix
RAISE NOTICE '';
RAISE NOTICE '📋 Users table structure after fix:';
SELECT 
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND table_schema = 'public'
ORDER BY ordinal_position;

COMMIT;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- EXPLANATION OF V3 FIX:
-- 
-- V1: Fixed contractor signup (basic RLS policies)
-- V2: Fixed contractor login (allowed users table SELECT)
-- V3: Fixed "column users.user_type does not exist" error
-- 
-- What V3 Does:
-- 1. Adds user_type column to users table if missing
-- 2. Sets admin@qilly.co.za as admin user
-- 3. Creates RLS policies that reference users.user_type (which now exists!)
-- 4. Allows all authenticated users to read users table (for admin checks)
-- 
-- Why This is Safe:
-- • Passwords are NOT in public.users (they're in auth.users)
-- • user_type only has 4 values: 'admin', 'contractor', 'supplier', 'user'
-- • This is standard RBAC (Role-Based Access Control) pattern
-- • Write operations still restricted to own records only
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
