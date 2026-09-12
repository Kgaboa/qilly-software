-- =====================================================
-- FIX 403 FORBIDDEN - RLS POLICY ISSUE
-- =====================================================
-- Error: GET /contractors?user_id=eq.XXX 403 (Forbidden)
-- Cause: RLS policies blocking authenticated user
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
  user_exists BOOLEAN;
  contractor_count INTEGER;
  supplier_count INTEGER;
BEGIN
  -- Check if user exists
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = '7dd06dfd-368e-453e-9101-7a4cffae22a6') 
  INTO user_exists;
  
  RAISE NOTICE '👤 User in auth.users: %', CASE WHEN user_exists THEN '✅ YES' ELSE '❌ NO' END;
  
  -- Check if user exists in users table
  SELECT EXISTS(SELECT 1 FROM users WHERE id = '7dd06dfd-368e-453e-9101-7a4cffae22a6') 
  INTO user_exists;
  
  RAISE NOTICE '👤 User in users table: %', CASE WHEN user_exists THEN '✅ YES' ELSE '❌ NO' END;
  
  -- Check data count
  SELECT COUNT(*) INTO contractor_count FROM contractors;
  SELECT COUNT(*) INTO supplier_count FROM suppliers;
  
  RAISE NOTICE '📊 Total contractors: %', contractor_count;
  RAISE NOTICE '📊 Total suppliers: %', supplier_count;
END $$;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: CREATE USER IN USERS TABLE (if missing)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- The 403 error often happens when user is in auth.users but NOT in users table
INSERT INTO users (id, email, role, created_at)
SELECT 
  au.id,
  au.email,
  'contractor', -- Default role
  NOW()
FROM auth.users au
WHERE au.id = '7dd06dfd-368e-453e-9101-7a4cffae22a6'
  AND NOT EXISTS (SELECT 1 FROM users WHERE id = au.id)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: DROP ALL EXISTING RLS POLICIES (clean slate)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Drop contractor policies
DROP POLICY IF EXISTS "Users can view own contractor data" ON contractors;
DROP POLICY IF EXISTS "Users can insert own contractor data" ON contractors;
DROP POLICY IF EXISTS "Users can update own contractor data" ON contractors;
DROP POLICY IF EXISTS "Users can delete own contractor data" ON contractors;
DROP POLICY IF EXISTS "Admins can view all contractors" ON contractors;
DROP POLICY IF EXISTS "Admins can manage all contractors" ON contractors;
DROP POLICY IF EXISTS "Public read access for approved contractors" ON contractors;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON contractors;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON contractors;

-- Drop supplier policies
DROP POLICY IF EXISTS "Users can view own supplier data" ON suppliers;
DROP POLICY IF EXISTS "Users can insert own supplier data" ON suppliers;
DROP POLICY IF EXISTS "Users can update own supplier data" ON suppliers;
DROP POLICY IF EXISTS "Users can delete own supplier data" ON suppliers;
DROP POLICY IF EXISTS "Admins can view all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Admins can manage all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Public read access for approved suppliers" ON suppliers;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON suppliers;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON suppliers;

RAISE NOTICE '🗑️ Old policies dropped';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 4: CREATE NEW PERMISSIVE RLS POLICIES
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- CONTRACTORS POLICIES

-- Policy 1: Users can view their own data OR admin can view all
CREATE POLICY "contractors_select_policy"
ON contractors FOR SELECT TO authenticated
USING (
  -- User owns this record
  user_id = auth.uid()
  -- OR user is admin
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Policy 2: Users can insert their own data
CREATE POLICY "contractors_insert_policy"
ON contractors FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Policy 3: Users can update their own data
CREATE POLICY "contractors_update_policy"
ON contractors FOR UPDATE TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Policy 4: Users can delete their own data
CREATE POLICY "contractors_delete_policy"
ON contractors FOR DELETE TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

RAISE NOTICE '✅ Contractor policies created';

-- SUPPLIERS POLICIES

-- Policy 1: Users can view their own data OR admin can view all
CREATE POLICY "suppliers_select_policy"
ON suppliers FOR SELECT TO authenticated
USING (
  -- User owns this record
  user_id = auth.uid()
  -- OR user is admin
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Policy 2: Users can insert their own data
CREATE POLICY "suppliers_insert_policy"
ON suppliers FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Policy 3: Users can update their own data
CREATE POLICY "suppliers_update_policy"
ON suppliers FOR UPDATE TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Policy 4: Users can delete their own data
CREATE POLICY "suppliers_delete_policy"
ON suppliers FOR DELETE TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

RAISE NOTICE '✅ Supplier policies created';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 5: ENSURE RLS IS ENABLED
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

RAISE NOTICE '🔒 RLS enabled on contractors and suppliers';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 6: VERIFY POLICIES CREATED
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
DECLARE
  contractor_policy_count INTEGER;
  supplier_policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO contractor_policy_count 
  FROM pg_policies 
  WHERE tablename = 'contractors';
  
  SELECT COUNT(*) INTO supplier_policy_count 
  FROM pg_policies 
  WHERE tablename = 'suppliers';
  
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ POLICIES CREATED SUCCESSFULLY';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📊 Contractor policies: %', contractor_policy_count;
  RAISE NOTICE '📊 Supplier policies: %', supplier_policy_count;
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  
  IF contractor_policy_count = 0 OR supplier_policy_count = 0 THEN
    RAISE WARNING '⚠️ Some policies missing! Expected 4 per table.';
  END IF;
END $$;

COMMIT;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 7: TEST ACCESS FOR SPECIFIC USER
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Check what the user can access
SELECT 
  '🔍 CHECKING USER ACCESS' as status,
  (SELECT email FROM auth.users WHERE id = '7dd06dfd-368e-453e-9101-7a4cffae22a6') as user_email,
  (SELECT role FROM users WHERE id = '7dd06dfd-368e-453e-9101-7a4cffae22a6') as user_role,
  (SELECT COUNT(*) FROM contractors WHERE user_id = '7dd06dfd-368e-453e-9101-7a4cffae22a6') as user_contractors,
  (SELECT COUNT(*) FROM suppliers WHERE user_id = '7dd06dfd-368e-453e-9101-7a4cffae22a6') as user_suppliers;

-- Show all policies
SELECT 
  tablename,
  policyname,
  cmd as operation,
  CASE 
    WHEN roles::text LIKE '%authenticated%' THEN 'authenticated'
    ELSE roles::text
  END as applies_to
FROM pg_policies
WHERE tablename IN ('contractors', 'suppliers')
ORDER BY tablename, cmd;

SELECT '✅ RLS POLICY FIX COMPLETE!' as result;
SELECT 'Refresh your SIT app (Ctrl+Shift+R) and the 403 errors should be gone!' as next_step;
