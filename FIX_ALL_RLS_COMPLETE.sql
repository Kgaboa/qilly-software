-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: COMPLETE RLS FIX - ALL ERRORS
-- Fixes:
-- 1. "column users.user_type does not exist"
-- 2. "permission denied for table users"
-- 3. Contractor signup not working
-- 4. Contractor login failing
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 1: FIX USERS TABLE STRUCTURE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Add user_type column if missing
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'user';

-- Add email column if missing (in case table was created incorrectly)
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

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 2: DROP ALL EXISTING RLS POLICIES
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
DROP POLICY IF EXISTS "Enable insert during signup" ON public.contractors;
DROP POLICY IF EXISTS "Allow contractor signup" ON public.contractors;

-- Drop suppliers policies
DROP POLICY IF EXISTS "suppliers_select_policy" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_insert_policy" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_update_policy" ON public.suppliers;
DROP POLICY IF EXISTS "suppliers_delete_policy" ON public.suppliers;
DROP POLICY IF EXISTS "Suppliers can view their own data" ON public.suppliers;
DROP POLICY IF EXISTS "Admins have full access to suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.suppliers;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 3: ENABLE RLS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 4: CREATE USERS TABLE POLICIES
-- KEY: Allow ALL authenticated users to READ (needed for admin checks)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
  USING (auth.uid() = id);

CREATE POLICY "users_delete_policy" ON public.users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 5: CREATE CONTRACTORS TABLE POLICIES
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

CREATE POLICY "contractors_insert_policy" ON public.contractors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

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
  );

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
-- PART 6: CREATE SUPPLIERS TABLE POLICIES
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE POLICY "suppliers_select_policy" ON public.suppliers
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

CREATE POLICY "suppliers_insert_policy" ON public.suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "suppliers_update_policy" ON public.suppliers
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
  );

CREATE POLICY "suppliers_delete_policy" ON public.suppliers
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
-- PART 7: GRANT PERMISSIONS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

GRANT SELECT, INSERT, UPDATE ON public.contractors TO authenticated;
GRANT SELECT ON public.contractors TO anon;

GRANT SELECT, INSERT, UPDATE ON public.suppliers TO authenticated;
GRANT SELECT ON public.suppliers TO anon;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 8: VERIFICATION
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Check user_type column exists
SELECT 
  '✅ user_type column exists' as status,
  data_type
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name = 'user_type'
AND table_schema = 'public';

-- Count policies per table
SELECT 
  '✅ RLS policies created' as status,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('users', 'contractors', 'suppliers')
AND schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Check admin user exists
SELECT 
  '✅ Admin user configured' as status,
  email,
  user_type
FROM public.users
WHERE user_type = 'admin';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- EXPECTED VERIFICATION OUTPUT:
-- 
-- ✅ user_type column exists | text
-- ✅ RLS policies created | contractors | 4
-- ✅ RLS policies created | suppliers | 4
-- ✅ RLS policies created | users | 4
-- ✅ Admin user configured | admin@qilly.co.za | admin
--
-- NEXT STEPS:
-- 1. Clear browser cache (Ctrl+F5)
-- 2. Test contractor signup - should work!
-- 3. Test contractor login - should work!
-- 4. No more "permission denied" errors!
-- 5. Ready for Tuesday eTender presentation! 🚀
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
