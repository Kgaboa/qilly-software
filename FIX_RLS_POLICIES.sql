-- ========================================================================
-- FIX: RLS Policies for Trial Countdown & Bill History
-- ========================================================================
-- Run this in Supabase SQL Editor if trial countdown isn't working
-- ========================================================================

-- ========================================================================
-- POLICY 1: Allow users to UPDATE their own trial_bills_remaining
-- ========================================================================

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can update own trial count" ON public.users;
DROP POLICY IF EXISTS "Users can update own record" ON public.users;

-- Create new policy for users to update their own trial count
CREATE POLICY "Users can update own trial count"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ========================================================================
-- POLICY 2: Allow users to SELECT their own record (for dashboard)
-- ========================================================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view own record" ON public.users;

-- Create new policy
CREATE POLICY "Users can view own record"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- ========================================================================
-- POLICY 3: Allow users to INSERT their own record (during signup/first login)
-- ========================================================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can create own record" ON public.users;

-- Create new policy - allows authenticated users to create their own record
CREATE POLICY "Users can create own record"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ========================================================================
-- POLICY 4: Allow users to view their own bills
-- ========================================================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view own bills" ON public.bills;

-- Create new policy
CREATE POLICY "Users can view own bills"
ON public.bills
FOR SELECT
USING (auth.uid() = user_id);

-- ========================================================================
-- POLICY 5: Allow users to INSERT their own bills
-- ========================================================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can create own bills" ON public.bills;

-- Create new policy
CREATE POLICY "Users can create own bills"
ON public.bills
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ========================================================================
-- POLICY 6: Allow users to view bill items for their bills
-- ========================================================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view own bill items" ON public.bill_items;

-- Create new policy (using subquery to check bill ownership)
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

-- ========================================================================
-- POLICY 7: Allow users to INSERT bill items for their bills
-- ========================================================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can create own bill items" ON public.bill_items;

-- Create new policy
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
-- Enable RLS on all tables (if not already enabled)
-- ========================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_items ENABLE ROW LEVEL SECURITY;

-- ========================================================================
-- Verify policies were created
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
-- Expected Output:
-- ========================================================================
-- tablename   | policyname                     | cmd    | using_clause              | with_check_clause
-- ------------|--------------------------------|--------|---------------------------|--------------------------
-- users       | Users can view own record      | SELECT | (auth.uid() = id)         | 
-- users       | Users can update own trial...  | UPDATE | (auth.uid() = id)         | (auth.uid() = id)
-- users       | Users can create own record    | INSERT |                           | (auth.uid() = id)
-- bills       | Users can view own bills       | SELECT | (auth.uid() = user_id)    | 
-- bills       | Users can create own bills     | INSERT |                           | (auth.uid() = user_id)
-- bill_items  | Users can view own bill items  | SELECT | (EXISTS...)               | 
-- bill_items  | Users can create own bill...   | INSERT |                           | (EXISTS...)
-- ========================================================================

-- ========================================================================
-- TEST: Verify you can update trial_bills_remaining
-- ========================================================================

-- This should work for authenticated users
-- UPDATE public.users 
-- SET trial_bills_remaining = trial_bills_remaining - 1
-- WHERE id = auth.uid();

-- ========================================================================
-- TROUBLESHOOTING
-- ========================================================================
-- 
-- If policies still don't work:
-- 
-- 1. Check if RLS is enabled:
--    SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- 
-- 2. Temporarily disable RLS for testing (NOT for production):
--    ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
-- 
-- 3. Check if user is authenticated:
--    SELECT auth.uid();  -- Should return UUID, not NULL
-- 
-- 4. Check if user exists in users table:
--    SELECT * FROM public.users WHERE id = auth.uid();
-- 
-- ========================================================================

-- ========================================================================
-- OPTIONAL: Admin policies (for admin panel)
-- ========================================================================

-- Allow admins to view all users
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow admins to view all bills
DROP POLICY IF EXISTS "Admins can view all bills" ON public.bills;
CREATE POLICY "Admins can view all bills"
ON public.bills
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- ========================================================================
-- SUCCESS MESSAGE
-- ========================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Hard refresh your browser (Ctrl+Shift+R)';
  RAISE NOTICE '2. Login as bone@gmail.com';
  RAISE NOTICE '3. Process a BOQ';
  RAISE NOTICE '4. Check console for: "✅ Supabase trial_bills_remaining updated to: X"';
  RAISE NOTICE '5. Run CHECK_TRIAL_COUNTDOWN.sql to verify';
END $$;