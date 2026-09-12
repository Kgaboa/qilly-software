-- ========================================================================
-- FIX: INFINITE RECURSION ERROR IN RLS POLICIES
-- ========================================================================
-- Error: "infinite recursion detected in policy for relation \"users\""
-- 
-- CAUSE: The "Admins can view all users" policy queries the users table
--        from within a users table policy, creating infinite recursion.
-- 
-- SOLUTION: Remove the admin policies that cause recursion OR
--           use a separate admin_users table OR
--           use SECURITY DEFINER functions
-- ========================================================================

-- ========================================================================
-- STEP 1: DROP ALL EXISTING POLICIES (Clean slate)
-- ========================================================================

-- Drop all users table policies
DROP POLICY IF EXISTS "Users can view own record" ON public.users;
DROP POLICY IF EXISTS "Users can update own trial count" ON public.users;
DROP POLICY IF EXISTS "Users can update own record" ON public.users;
DROP POLICY IF EXISTS "Users can create own record" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Drop all bills table policies
DROP POLICY IF EXISTS "Users can view own bills" ON public.bills;
DROP POLICY IF EXISTS "Users can create own bills" ON public.bills;
DROP POLICY IF EXISTS "Admins can view all bills" ON public.bills;

-- Drop all bill_items table policies
DROP POLICY IF EXISTS "Users can view own bill items" ON public.bill_items;
DROP POLICY IF EXISTS "Users can create own bill items" ON public.bill_items;

-- ========================================================================
-- STEP 2: CREATE SAFE POLICIES (No recursion)
-- ========================================================================

-- ========================================================================
-- USERS TABLE POLICIES
-- ========================================================================

-- Allow users to view their own record
CREATE POLICY "Users can view own record"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own trial count
CREATE POLICY "Users can update own trial count"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to insert their own record (during first login)
-- FIXED: Use UPSERT logic in code instead of trying to INSERT duplicate keys
CREATE POLICY "Users can create own record"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ========================================================================
-- BILLS TABLE POLICIES
-- ========================================================================

-- Allow users to view their own bills
CREATE POLICY "Users can view own bills"
ON public.bills
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to create their own bills
CREATE POLICY "Users can create own bills"
ON public.bills
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ========================================================================
-- BILL_ITEMS TABLE POLICIES
-- ========================================================================

-- Allow users to view bill items for their bills
CREATE POLICY "Users can view own bill items"
ON public.bill_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bills
    WHERE bills.id = bill_items.bill_id
    AND bills.user_id = auth.uid()
  )
);

-- Allow users to insert bill items for their bills
CREATE POLICY "Users can create own bill items"
ON public.bill_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bills
    WHERE bills.id = bill_items.bill_id
    AND bills.user_id = auth.uid()
  )
);

-- ========================================================================
-- STEP 3: Enable RLS on all tables
-- ========================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_items ENABLE ROW LEVEL SECURITY;

-- ========================================================================
-- STEP 4: Verify policies were created correctly
-- ========================================================================

SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  SUBSTRING(qual::text, 1, 50) as using_clause,
  SUBSTRING(with_check::text, 1, 50) as with_check_clause
FROM pg_policies
WHERE tablename IN ('users', 'bills', 'bill_items')
ORDER BY tablename, policyname;

-- ========================================================================
-- EXPECTED OUTPUT (7 policies total - NO ADMIN POLICIES):
-- ========================================================================
-- tablename   | policyname                     | cmd    
-- ------------|--------------------------------|--------
-- bills       | Users can create own bills     | INSERT 
-- bills       | Users can view own bills       | SELECT 
-- bill_items  | Users can create own bill items| INSERT 
-- bill_items  | Users can view own bill items  | SELECT 
-- users       | Users can create own record    | INSERT 
-- users       | Users can update own trial count| UPDATE 
-- users       | Users can view own record      | SELECT 
-- ========================================================================

-- ========================================================================
-- SUCCESS MESSAGE
-- ========================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies fixed! Infinite recursion removed!';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Changes made:';
  RAISE NOTICE '   - Removed "Admins can view all users" policy (caused recursion)';
  RAISE NOTICE '   - Removed "Admins can view all bills" policy (caused recursion)';
  RAISE NOTICE '   - Kept 7 essential policies for normal users';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  For admin functionality:';
  RAISE NOTICE '   - Use service_role key (bypasses RLS)';
  RAISE NOTICE '   - OR use SECURITY DEFINER functions';
  RAISE NOTICE '   - OR create separate admin_users table';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Next steps:';
  RAISE NOTICE '   1. Run the code fix to handle duplicate user records';
  RAISE NOTICE '   2. Hard refresh browser (Ctrl+Shift+R)';
  RAISE NOTICE '   3. Login and test';
END $$;
