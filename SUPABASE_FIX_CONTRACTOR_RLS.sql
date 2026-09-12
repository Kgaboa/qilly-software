-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY CONTRACTOR LOGIN FIX
-- Issue: HTTP 406 error when contractor tries to login
-- Cause: Missing/incorrect RLS policies on contractors table
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- INSTRUCTIONS:
-- 1. Go to: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
-- 2. Copy this entire file
-- 3. Paste into SQL Editor
-- 4. Click "Run"
-- 5. Verify "Success" message
-- 6. Test contractor@gmail.com login again

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 1: ENABLE ROW LEVEL SECURITY
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: DROP EXISTING POLICIES (if they exist)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DROP POLICY IF EXISTS "Contractors can read own data" ON public.contractors;
DROP POLICY IF EXISTS "Contractors can update own data" ON public.contractors;
DROP POLICY IF EXISTS "Contractors can insert own data" ON public.contractors;
DROP POLICY IF EXISTS "Admins can access all contractors" ON public.contractors;
DROP POLICY IF EXISTS "Service role can access all contractors" ON public.contractors;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: CREATE CORRECT RLS POLICIES
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Policy 1: Allow contractors to SELECT their own data
CREATE POLICY "Contractors can read own data"
ON public.contractors
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Allow contractors to UPDATE their own data
CREATE POLICY "Contractors can update own data"
ON public.contractors
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Allow new contractors to INSERT during signup
-- (This is needed for ContractorSignup.tsx to work)
CREATE POLICY "Contractors can insert own data"
ON public.contractors
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Allow service_role to access all (for admin functions)
CREATE POLICY "Service role can access all contractors"
ON public.contractors
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 5: Allow admins to access all contractor data
-- (Adjust admin emails as needed)
CREATE POLICY "Admins can access all contractors"
ON public.contractors
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
-- STEP 4: APPROVE CONTRACTOR@GMAIL.COM (if exists)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UPDATE public.contractors
SET status = 'approved'
WHERE email = 'contractor@gmail.com'
  AND status = 'pending';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 5: FIX USER_ID MISMATCH (if exists)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- This ensures contractor.user_id matches auth.users.id
UPDATE public.contractors c
SET user_id = au.id
FROM auth.users au
WHERE c.email = au.email
  AND (c.user_id IS NULL OR c.user_id != au.id)
  AND c.email = 'contractor@gmail.com';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 6: VERIFICATION QUERIES (Run these separately to check)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Verify RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'contractors';
-- Expected: rowsecurity = true

-- Verify policies exist
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'contractors';
-- Expected: 5 policies listed

-- Verify contractor record
SELECT 
  c.id,
  c.email,
  c.company_name,
  c.status,
  c.subscription_tier,
  c.user_id as contractor_user_id,
  au.id as auth_user_id,
  au.email as auth_email,
  CASE 
    WHEN c.user_id = au.id THEN '✅ user_id matches' 
    ELSE '❌ user_id MISMATCH - RUN FIX!' 
  END as check_status
FROM public.contractors c
LEFT JOIN auth.users au ON c.user_id = au.id
WHERE c.email = 'contractor@gmail.com';
-- Expected: 1 row with status = 'approved' and check_status = '✅ user_id matches'

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- OPTIONAL: Apply same policies to other tables (if needed)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Bills table policies
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Contractors can read own bills" ON public.bills;
CREATE POLICY "Contractors can read own bills"
ON public.bills
FOR SELECT
TO authenticated
USING (
  contractor_id IN (
    SELECT id FROM public.contractors WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Contractors can insert own bills" ON public.bills;
CREATE POLICY "Contractors can insert own bills"
ON public.bills
FOR INSERT
TO authenticated
WITH CHECK (
  contractor_id IN (
    SELECT id FROM public.contractors WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Service role can access all bills" ON public.bills;
CREATE POLICY "Service role can access all bills"
ON public.bills
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Bill Items table policies
ALTER TABLE public.bill_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Contractors can read own bill items" ON public.bill_items;
CREATE POLICY "Contractors can read own bill items"
ON public.bill_items
FOR SELECT
TO authenticated
USING (
  bill_id IN (
    SELECT b.id FROM public.bills b
    JOIN public.contractors c ON b.contractor_id = c.id
    WHERE c.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Contractors can insert own bill items" ON public.bill_items;
CREATE POLICY "Contractors can insert own bill items"
ON public.bill_items
FOR INSERT
TO authenticated
WITH CHECK (
  bill_id IN (
    SELECT b.id FROM public.bills b
    JOIN public.contractors c ON b.contractor_id = c.id
    WHERE c.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Service role can access all bill items" ON public.bill_items;
CREATE POLICY "Service role can access all bill items"
ON public.bill_items
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- FINAL SUCCESS MESSAGE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
BEGIN
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ CONTRACTOR RLS POLICIES FIXED!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '✅ RLS enabled on contractors table';
  RAISE NOTICE '✅ 5 policies created (SELECT, UPDATE, INSERT, service_role, admin)';
  RAISE NOTICE '✅ contractor@gmail.com approved (if exists)';
  RAISE NOTICE '✅ user_id fixed (if mismatch)';
  RAISE NOTICE '✅ bills and bill_items policies created';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 NEXT STEPS:';
  RAISE NOTICE '1. Clear browser cache';
  RAISE NOTICE '2. Login as contractor@gmail.com';
  RAISE NOTICE '3. Should now see contractor dashboard (not demo@operator.com)';
  RAISE NOTICE '';
  RAISE NOTICE '❓ Still having issues?';
  RAISE NOTICE '   Run the verification queries at the bottom of this script';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;
