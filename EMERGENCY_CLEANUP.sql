-- ========================================================================
-- EMERGENCY CLEANUP SCRIPT
-- ========================================================================
-- ⚠️ USE ONLY IF THINGS GO WRONG DURING PRESENTATION
-- This script will reset everything to a working state
-- ========================================================================

-- ========================================================================
-- OPTION 1: Quick Fix - Remove Only Problematic Policies
-- ========================================================================

-- Remove admin policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all bills" ON public.bills;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

-- Verify they're gone
SELECT 
  tablename,
  policyname,
  'Removed ❌' as status
FROM pg_policies
WHERE tablename IN ('users', 'bills')
AND policyname LIKE '%Admin%';

-- Expected: No rows returned (all admin policies removed)

-- ========================================================================
-- OPTION 2: Nuclear Option - Temporarily Disable RLS
-- ========================================================================
-- ⚠️ WARNING: This disables ALL security on these tables
-- ⚠️ Use ONLY during presentation emergency
-- ⚠️ Must re-enable immediately after!

/*
-- Uncomment to disable RLS temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_items DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN '❌ Still enabled'
    ELSE '✅ Disabled (emergency mode)'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'bills', 'bill_items');

-- Expected: All show "✅ Disabled (emergency mode)"
*/

-- ========================================================================
-- OPTION 3: Re-enable RLS After Emergency
-- ========================================================================
-- ⚠️ Run this IMMEDIATELY after presentation if you used Option 2

/*
-- Uncomment to re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_items ENABLE ROW LEVEL SECURITY;

-- Verify RLS is re-enabled
SELECT 
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled (secure)'
    ELSE '❌ Still disabled - SECURITY RISK!'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'bills', 'bill_items');

-- Expected: All show "✅ Enabled (secure)"
*/

-- ========================================================================
-- OPTION 4: Clean Up Duplicate Users
-- ========================================================================
-- If you somehow got duplicate users due to the error

-- First, check for duplicates
SELECT 
  email,
  COUNT(*) as count,
  ARRAY_AGG(id) as user_ids,
  MIN(created_at) as first_created
FROM public.users
GROUP BY email
HAVING COUNT(*) > 1;

-- If duplicates found, keep only the oldest record
/*
-- ⚠️ Uncomment and modify with actual email/id if needed
DELETE FROM public.users
WHERE id = 'DUPLICATE_USER_ID_HERE'  -- Replace with actual ID
AND email = 'duplicate@example.com'; -- Replace with actual email

-- Verify duplicates removed
SELECT 
  email,
  COUNT(*) as count
FROM public.users
GROUP BY email
HAVING COUNT(*) > 1;

-- Expected: No rows returned
*/

-- ========================================================================
-- OPTION 5: Fix Trial Count for Specific User
-- ========================================================================
-- If bone@gmail.com trial count is wrong

-- Check current state
SELECT 
  email,
  trial_bills_remaining,
  is_premium,
  (SELECT COUNT(*) FROM bills WHERE user_id = users.id) as bills_processed
FROM public.users
WHERE email = 'bone@gmail.com';

-- Reset trial count to 3
/*
UPDATE public.users
SET trial_bills_remaining = 3
WHERE email = 'bone@gmail.com'
AND is_premium = false;

-- Verify update
SELECT 
  email,
  trial_bills_remaining,
  'Reset to 3 ✅' as status
FROM public.users
WHERE email = 'bone@gmail.com';
*/

-- ========================================================================
-- OPTION 6: Delete All Bills (Reset Everything)
-- ========================================================================
-- ⚠️ DANGER: This deletes ALL processed bills
-- Use only if you need a clean slate

/*
-- Delete all bill items first (foreign key constraint)
DELETE FROM public.bill_items;

-- Delete all bills
DELETE FROM public.bills;

-- Verify deletion
SELECT COUNT(*) as remaining_bills FROM public.bills;
SELECT COUNT(*) as remaining_bill_items FROM public.bill_items;

-- Expected: Both return 0

-- Reset all trial counts to 3
UPDATE public.users
SET trial_bills_remaining = 3
WHERE is_premium = false;

-- Verify reset
SELECT 
  email,
  trial_bills_remaining,
  'Reset ✅' as status
FROM public.users
WHERE is_premium = false;
*/

-- ========================================================================
-- OPTION 7: Quick Diagnostics
-- ========================================================================

-- Check what's wrong
SELECT 
  'Users Table' as check_name,
  (SELECT COUNT(*) FROM public.users) as total_users,
  (SELECT COUNT(*) FROM public.users WHERE email = 'bone@gmail.com') as bone_exists,
  (SELECT trial_bills_remaining FROM public.users WHERE email = 'bone@gmail.com') as bone_trial_count
UNION ALL
SELECT 
  'Bills Table',
  (SELECT COUNT(*) FROM public.bills),
  (SELECT COUNT(*) FROM public.bills WHERE user_id = (SELECT id FROM public.users WHERE email = 'bone@gmail.com' LIMIT 1)),
  NULL
UNION ALL
SELECT 
  'Policies',
  (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('users', 'bills', 'bill_items')),
  (SELECT COUNT(*) FROM pg_policies WHERE policyname LIKE '%admin%'),
  NULL
UNION ALL
SELECT 
  'RLS Enabled',
  (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('users', 'bills', 'bill_items') AND rowsecurity = true),
  3,
  NULL;

-- Interpret results:
-- Row 1: Shows total users, if bone exists (should be 1), and trial count (should be 0-3)
-- Row 2: Shows total bills and bone's bills
-- Row 3: Shows total policies (should be 7) and admin policies (should be 0)
-- Row 4: Shows RLS enabled tables (should be 3)

-- ========================================================================
-- OPTION 8: Grant Temporary Superuser Access
-- ========================================================================
-- ⚠️ DANGER: Only use during presentation if RLS is completely broken

/*
-- Temporarily bypass RLS for specific user
ALTER USER postgres BYPASSRLS;

-- Or grant to specific authenticated user
-- ALTER USER authenticated BYPASSRLS;

-- Verify
SELECT 
  rolname,
  rolbypassrls,
  CASE WHEN rolbypassrls THEN '⚠️ Bypassing RLS' ELSE '✅ Normal' END as status
FROM pg_roles
WHERE rolname IN ('postgres', 'authenticated', 'anon');

-- ⚠️ MUST REVOKE AFTER PRESENTATION:
-- ALTER USER postgres NOBYPASSRLS;
*/

-- ========================================================================
-- OPTION 9: Check for Policy Recursion Issues
-- ========================================================================

SELECT 
  p.tablename,
  p.policyname,
  p.cmd,
  SUBSTRING(p.qual::text, 1, 200) as using_clause,
  CASE 
    -- Detect recursion patterns
    WHEN p.qual::text LIKE '%FROM ' || p.tablename || '%' 
      THEN '❌ RECURSION DETECTED - Policy queries same table'
    WHEN p.with_check::text LIKE '%FROM ' || p.tablename || '%'
      THEN '❌ RECURSION DETECTED - Policy queries same table'
    ELSE '✅ No recursion'
  END as recursion_check
FROM pg_policies p
WHERE p.tablename IN ('users', 'bills', 'bill_items')
ORDER BY p.tablename, p.policyname;

-- Any rows showing "❌ RECURSION DETECTED" must be dropped immediately

-- ========================================================================
-- OPTION 10: Create Emergency Admin User
-- ========================================================================
-- If you need to quickly create an admin user during presentation

/*
-- Insert admin user (replace with actual auth.users ID)
INSERT INTO public.users (id, email, role, created_at)
VALUES (
  'YOUR_AUTH_USER_ID_HERE',  -- Replace with actual UUID from auth.users
  'admin@qilly.co.za',
  'admin',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- Verify
SELECT 
  email,
  role,
  '✅ Admin created' as status
FROM public.users
WHERE role = 'admin';
*/

-- ========================================================================
-- QUICK REFERENCE COMMANDS
-- ========================================================================

-- See all policies:
-- SELECT tablename, policyname, cmd FROM pg_policies WHERE tablename IN ('users', 'bills', 'bill_items');

-- Drop specific policy:
-- DROP POLICY IF EXISTS "policy_name" ON public.table_name;

-- Disable RLS on table:
-- ALTER TABLE public.table_name DISABLE ROW LEVEL SECURITY;

-- Enable RLS on table:
-- ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- Check RLS status:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Reset user trial:
-- UPDATE public.users SET trial_bills_remaining = 3 WHERE email = 'bone@gmail.com';

-- Delete all bills:
-- DELETE FROM public.bill_items; DELETE FROM public.bills;

-- ========================================================================
-- POST-PRESENTATION CHECKLIST
-- ========================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'POST-PRESENTATION CHECKLIST';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '1. ⚠️ Did you disable RLS? RE-ENABLE IT NOW!';
  RAISE NOTICE '   Run: ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;';
  RAISE NOTICE '';
  RAISE NOTICE '2. ⚠️ Did you grant BYPASSRLS? REVOKE IT NOW!';
  RAISE NOTICE '   Run: ALTER USER postgres NOBYPASSRLS;';
  RAISE NOTICE '';
  RAISE NOTICE '3. ✅ Run VERIFY_FIXES.sql to ensure everything is secure';
  RAISE NOTICE '';
  RAISE NOTICE '4. ✅ Run FIX_INFINITE_RECURSION.sql if you had to emergency reset';
  RAISE NOTICE '';
  RAISE NOTICE '5. ✅ Test login and BOQ processing one more time';
  RAISE NOTICE '';
  RAISE NOTICE 'NEVER deploy to production without RLS enabled!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
END $$;

-- ========================================================================
-- END OF EMERGENCY CLEANUP SCRIPT
-- ========================================================================
