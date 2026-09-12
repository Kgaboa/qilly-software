-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: FIX "User not found in users table. Creating record..." ERROR
-- Issue: RLS policies blocking user record creation
-- Error: ⚠️ User not found in users table. Creating record...
--        ❌ Failed to create user record: code 42501 (permission denied)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- INSTRUCTIONS:
-- 1. Go to: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
-- 2. Copy this entire file
-- 3. Paste into SQL Editor
-- 4. Click "Run"
-- 5. Test contractor login again

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 1: ENABLE RLS ON USERS TABLE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: DROP EXISTING POLICIES (if they exist)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Service role can access all users" ON public.users;
DROP POLICY IF EXISTS "Admins can access all users" ON public.users;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: CREATE CORRECT RLS POLICIES FOR USERS TABLE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Policy 1: Allow users to SELECT their own data
CREATE POLICY "Users can read own data"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Allow users to UPDATE their own data
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 3: Allow users to INSERT their own record
-- This is CRITICAL - without this, the "Creating record..." error occurs
CREATE POLICY "Users can insert own data"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy 4: Allow service_role to access all (for backend operations)
CREATE POLICY "Service role can access all users"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 5: Allow admins to access all user data
CREATE POLICY "Admins can access all users"
ON public.users
FOR ALL
TO authenticated
USING (
  auth.jwt()->>'email' IN (
    'admin@qilly.co.za',
    'support@qilly.co.za',
    'tshego@qilly.co.za'
  )
);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 4: VERIFY POLICIES WERE CREATED
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Expected: 5 policies listed
-- - Users can read own data (SELECT)
-- - Users can update own data (UPDATE)
-- - Users can insert own data (INSERT)
-- - Service role can access all users (ALL)
-- - Admins can access all users (ALL)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 5: CHECK IF USER RECORD EXISTS FOR CONTRACTOR
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  u.id,
  u.email,
  u.role,
  u.subscription_tier,
  au.email as auth_email,
  CASE 
    WHEN u.id = au.id THEN '✅ user_id matches' 
    ELSE '❌ user_id MISMATCH' 
  END as check_status
FROM public.users u
FULL OUTER JOIN auth.users au ON u.id = au.id
WHERE au.email = 'contractor@gmail.com' OR u.email = 'contractor@gmail.com';

-- If 0 rows: User will be created automatically on next login
-- If 1 row with ✅: Perfect! User exists and matches
-- If 1 row with ❌: Run the fix below

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 6: CREATE USER RECORD FOR CONTRACTOR (if missing)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
  AND NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = au.id
  );

-- This will only insert if user doesn't exist yet

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 7: VERIFY USER WAS CREATED
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
  id,
  email,
  full_name,
  role,
  subscription_tier,
  created_at
FROM public.users
WHERE email = 'contractor@gmail.com';

-- Expected: 1 row showing contractor user data

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- BONUS: CREATE FUNCTION TO AUTO-CREATE USER ON SIGNUP (OPTIONAL)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- This trigger automatically creates a user record when someone signs up
-- Prevents the "User not found" warning in the future

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, subscription_tier, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'contractor'),
    'FREE',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- FINAL SUCCESS MESSAGE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
BEGIN
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ USERS TABLE RLS POLICIES FIXED!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '✅ RLS enabled on users table';
  RAISE NOTICE '✅ 5 policies created (SELECT, UPDATE, INSERT, service_role, admin)';
  RAISE NOTICE '✅ User record created for contractor@gmail.com (if missing)';
  RAISE NOTICE '✅ Auto-trigger installed (auto-creates users on signup)';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 NEXT STEPS:';
  RAISE NOTICE '1. Login as contractor@gmail.com';
  RAISE NOTICE '2. Should NOT see "User not found" warning anymore';
  RAISE NOTICE '3. Should see contractor dashboard';
  RAISE NOTICE '';
  RAISE NOTICE '❓ Still seeing errors?';
  RAISE NOTICE '   Check the verification queries at the bottom of this script';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;
