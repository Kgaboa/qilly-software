-- ============================================================================
-- FIX TRIAL COUNTER FOR CONTRACTORS - CRITICAL FIX
-- ============================================================================
-- Issue: Contractors with 'free_trial' subscription_tier weren't getting their
-- trial counter decremented because the logic only checked for 'FREE' tier
-- 
-- This script:
-- 1. Ensures all contractors have a corresponding users table entry
-- 2. Resets trial_bills_remaining to 3 for all free trial contractors
-- 3. Fixes the tee@gmail.com account specifically
-- ============================================================================

-- Step 1: Check current state
SELECT 
  'Before Fix - Contractors' as table_name,
  c.email,
  c.company_name,
  c.subscription_tier,
  u.trial_bills_remaining,
  CASE 
    WHEN u.id IS NULL THEN 'NO USERS TABLE ENTRY'
    WHEN u.trial_bills_remaining IS NULL THEN 'trial_bills_remaining IS NULL'
    ELSE 'OK'
  END as status
FROM contractors c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.subscription_tier = 'free_trial'
ORDER BY c.email;

-- Step 2: Create users table entries for contractors who don't have them
INSERT INTO users (id, email, full_name, subscription_tier, trial_bills_remaining, created_at)
SELECT 
  c.user_id,
  c.email,
  c.contact_person,
  'free_trial',
  3,
  COALESCE(c.created_at, NOW())
FROM contractors c
WHERE c.subscription_tier = 'free_trial'
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = c.user_id)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Update existing users table entries for free trial contractors
-- Set subscription_tier to 'free_trial' and reset trial_bills_remaining to 3
UPDATE users u
SET 
  subscription_tier = 'free_trial',
  trial_bills_remaining = 3
FROM contractors c
WHERE u.id = c.user_id
  AND c.subscription_tier = 'free_trial';

-- Step 4: Verify the fix
SELECT 
  'After Fix - Contractors' as table_name,
  c.email,
  c.company_name,
  c.subscription_tier as contractor_tier,
  u.subscription_tier as user_tier,
  u.trial_bills_remaining,
  CASE 
    WHEN u.id IS NULL THEN '❌ NO USERS TABLE ENTRY'
    WHEN u.subscription_tier != c.subscription_tier THEN '⚠️ TIER MISMATCH'
    WHEN u.trial_bills_remaining != 3 THEN '⚠️ TRIAL COUNT NOT 3'
    ELSE '✅ OK'
  END as status
FROM contractors c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.subscription_tier = 'free_trial'
ORDER BY c.email;

-- Step 5: Specific check for tee@gmail.com
SELECT 
  '🔍 Checking tee@gmail.com' as check_type,
  c.email,
  c.user_id,
  c.subscription_tier as contractor_tier,
  c.status as contractor_status,
  u.id as user_table_id,
  u.subscription_tier as user_tier,
  u.trial_bills_remaining,
  (SELECT COUNT(*) FROM bills WHERE user_id = c.user_id) as total_bills_generated
FROM contractors c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.email = 'tee@gmail.com';

-- ============================================================================
-- MANUAL VERIFICATION STEPS:
-- ============================================================================
-- 1. Run this script in your Supabase SQL Editor
-- 2. Check the output to ensure all contractors have users table entries
-- 3. Log in as tee@gmail.com and verify:
--    - Trial counter shows "3 bills left"
--    - Counter decrements when generating a BOQ
--    - After 3 BOQs, you get the upgrade message
-- ============================================================================

-- ============================================================================
-- EXPECTED RESULTS:
-- ============================================================================
-- ✅ All contractors with 'free_trial' tier have users table entries
-- ✅ All trial_bills_remaining are set to 3
-- ✅ subscription_tier in users table matches contractors table
-- ✅ tee@gmail.com can now generate exactly 3 BOQs before trial expires
-- ============================================================================
