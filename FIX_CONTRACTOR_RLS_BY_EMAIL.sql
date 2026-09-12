-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: FIX HTTP 406 ERROR - Allow Email Queries
-- Issue: Code queries contractors by email, but RLS only allows user_id
-- Solution: Update RLS policy to allow BOTH user_id AND email matching
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 🚀 QUICK START:
-- 1. Copy this entire file
-- 2. Go to: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
-- 3. Paste and click "Run"
-- 4. Clear browser cache and test login

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- THE PROBLEM
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Current RLS policy:
-- USING (auth.uid() = user_id)
-- 
-- This only allows:
--   SELECT * FROM contractors WHERE user_id = auth.uid()  ✅
--
-- But the code does:
--   SELECT * FROM contractors WHERE email = 'contractor@gmail.com'  ❌
--
-- Result: HTTP 406 (Not Acceptable) because RLS blocks email queries

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- THE FIX: Update Contractors SELECT Policy
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Drop old policy
DROP POLICY IF EXISTS "Contractors can read own data" ON public.contractors;

-- Create new policy that allows BOTH user_id AND email matching
CREATE POLICY "Contractors can read own data"
ON public.contractors
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- This now allows:
--   SELECT * FROM contractors WHERE user_id = auth.uid()  ✅
--   SELECT * FROM contractors WHERE email = 'contractor@gmail.com'  ✅ (if email matches authenticated user)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- VERIFICATION
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Check the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'contractors' 
  AND policyname = 'Contractors can read own data';

-- Expected result:
-- policyname: "Contractors can read own data"
-- cmd: SELECT
-- qual: (auth.uid() = user_id) OR (email = (SELECT email FROM auth.users WHERE id = auth.uid()))

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- TEST THE FIX
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Verify contractor data exists
SELECT 
  email,
  company_name,
  status,
  user_id,
  subscription_tier
FROM public.contractors
WHERE email = 'contractor@gmail.com';

-- Expected: 1 row with status = 'approved'

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- SUCCESS MESSAGE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
BEGIN
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✅ CONTRACTOR RLS POLICY UPDATED!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Now allows queries by email AND user_id';
  RAISE NOTICE '✅ HTTP 406 error should be fixed';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 NEXT STEPS:';
  RAISE NOTICE '   1. Clear browser cache (Ctrl+Shift+Delete)';
  RAISE NOTICE '   2. Hard refresh page (Ctrl+F5)';
  RAISE NOTICE '   3. Login as contractor@gmail.com';
  RAISE NOTICE '   4. Should see contractor dashboard (no more demo card)';
  RAISE NOTICE '';
  RAISE NOTICE '❓ Still seeing 406 error?';
  RAISE NOTICE '   Run verification queries above and share results';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;
