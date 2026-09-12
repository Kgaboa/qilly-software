-- =====================================================
-- FIX CONTRACTOR SUBSCRIPTION TIER SYNC ISSUE
-- =====================================================
-- This script fixes contractors who have been approved
-- and upgraded to paid tiers, but their users table
-- still shows subscription_tier = 'FREE'
-- =====================================================

-- STEP 1: Diagnose the Issue
-- =====================================================

-- Check contractor@gmail.com current state
SELECT 
  '🔍 contractor@gmail.com CURRENT STATE' AS check_type,
  c.email,
  c.company_name,
  c.status AS contractor_status,
  c.subscription_tier AS contractor_tier,
  c.subscription_status,
  u.subscription_tier AS users_tier,
  u.trial_bills_remaining,
  u.is_premium,
  CASE 
    WHEN c.status = 'approved' AND c.subscription_tier != 'FREE' AND u.subscription_tier = 'FREE'
    THEN '❌ MISMATCH - NEEDS FIX'
    WHEN c.subscription_tier = u.subscription_tier
    THEN '✅ SYNCED'
    ELSE '⚠️ CHECK NEEDED'
  END AS sync_status
FROM contractors c
LEFT JOIN auth.users au ON au.email = c.email
LEFT JOIN users u ON u.id = au.id
WHERE c.email = 'contractor@gmail.com';

-- Check ALL contractors with subscription tier mismatches
SELECT 
  '⚠️ ALL CONTRACTORS WITH TIER MISMATCHES' AS check_type,
  c.email,
  c.company_name,
  c.status AS contractor_status,
  c.subscription_tier AS contractor_tier,
  c.approved_at,
  u.subscription_tier AS users_tier,
  u.trial_bills_remaining,
  CASE 
    WHEN c.status = 'approved' AND c.subscription_tier != 'FREE' AND (u.subscription_tier = 'FREE' OR u.subscription_tier IS NULL)
    THEN '❌ NEEDS FIX'
    ELSE '✅ OK'
  END AS fix_needed
FROM contractors c
LEFT JOIN auth.users au ON au.email = c.email
LEFT JOIN users u ON u.id = au.id
WHERE c.status = 'approved'
  AND c.subscription_tier IS NOT NULL
ORDER BY fix_needed DESC, c.email;

-- STEP 2: Fix contractor@gmail.com Specifically
-- =====================================================

-- Update users table to match contractors table subscription tier
UPDATE users
SET 
  subscription_tier = (
    SELECT c.subscription_tier 
    FROM contractors c
    LEFT JOIN auth.users au ON au.email = c.email
    WHERE au.id = users.id
    AND c.status = 'approved'
    AND c.subscription_tier IS NOT NULL
  ),
  is_premium = true,
  trial_bills_remaining = NULL -- Set to NULL for paid users (or keep as-is for historical record)
WHERE id IN (
  SELECT au.id
  FROM auth.users au
  JOIN contractors c ON c.email = au.email
  WHERE c.email = 'contractor@gmail.com'
    AND c.status = 'approved'
);

-- STEP 3: Fix ALL Approved Contractors with Mismatched Tiers
-- =====================================================

-- Sync all approved contractors' subscription tiers to users table
UPDATE users
SET 
  subscription_tier = subquery.contractor_tier,
  is_premium = CASE 
    WHEN subquery.contractor_tier IN ('professional', 'enterprise', 'PROFESSIONAL', 'ENTERPRISE') 
    THEN true 
    ELSE false 
  END,
  trial_bills_remaining = CASE
    WHEN subquery.contractor_tier IN ('professional', 'enterprise', 'PROFESSIONAL', 'ENTERPRISE')
    THEN NULL -- Paid users don't need trial tracking
    ELSE trial_bills_remaining -- Keep existing value for FREE tier
  END
FROM (
  SELECT 
    au.id AS user_id,
    c.subscription_tier AS contractor_tier
  FROM contractors c
  JOIN auth.users au ON au.email = c.email
  WHERE c.status = 'approved'
    AND c.subscription_tier IS NOT NULL
    AND c.subscription_tier != 'FREE'
) AS subquery
WHERE users.id = subquery.user_id;

-- STEP 4: Verify the Fix
-- =====================================================

-- Check contractor@gmail.com after fix
SELECT 
  '✅ contractor@gmail.com AFTER FIX' AS check_type,
  c.email,
  c.company_name,
  c.status AS contractor_status,
  c.subscription_tier AS contractor_tier,
  u.subscription_tier AS users_tier,
  u.is_premium,
  u.trial_bills_remaining,
  CASE 
    WHEN c.subscription_tier = u.subscription_tier
    THEN '✅ SYNCED'
    ELSE '❌ STILL MISMATCHED'
  END AS sync_status
FROM contractors c
LEFT JOIN auth.users au ON au.email = c.email
LEFT JOIN users u ON u.id = au.id
WHERE c.email = 'contractor@gmail.com';

-- Verify ALL approved contractors are now synced
SELECT 
  '✅ ALL APPROVED CONTRACTORS AFTER FIX' AS check_type,
  c.email,
  c.company_name,
  c.subscription_tier AS contractor_tier,
  u.subscription_tier AS users_tier,
  u.is_premium,
  CASE 
    WHEN c.subscription_tier = u.subscription_tier
    THEN '✅ SYNCED'
    WHEN c.subscription_tier IS NULL
    THEN '⚠️ NO TIER SET'
    ELSE '❌ MISMATCH'
  END AS sync_status
FROM contractors c
LEFT JOIN auth.users au ON au.email = c.email
LEFT JOIN users u ON u.id = au.id
WHERE c.status = 'approved'
ORDER BY sync_status DESC, c.email;

-- STEP 5: Summary Report
-- =====================================================

SELECT 
  'CONTRACTOR SUBSCRIPTION SYNC SUMMARY' AS report_type,
  COUNT(DISTINCT c.id) AS total_approved_contractors,
  SUM(CASE WHEN c.subscription_tier = u.subscription_tier THEN 1 ELSE 0 END) AS synced_contractors,
  SUM(CASE WHEN c.subscription_tier != u.subscription_tier OR u.subscription_tier IS NULL THEN 1 ELSE 0 END) AS mismatched_contractors,
  SUM(CASE WHEN u.is_premium = true THEN 1 ELSE 0 END) AS premium_users
FROM contractors c
LEFT JOIN auth.users au ON au.email = c.email
LEFT JOIN users u ON u.id = au.id
WHERE c.status = 'approved';

-- =====================================================
-- EXPECTED RESULTS FOR contractor@gmail.com:
-- =====================================================
-- BEFORE FIX:
-- contractor_tier: 'enterprise' (or 'professional')
-- users_tier: 'FREE'
-- is_premium: false
-- trial_bills_remaining: 0
-- sync_status: ❌ MISMATCH
--
-- AFTER FIX:
-- contractor_tier: 'enterprise'
-- users_tier: 'enterprise'
-- is_premium: true
-- trial_bills_remaining: NULL (or 0)
-- sync_status: ✅ SYNCED
-- =====================================================

-- =====================================================
-- INSTRUCTIONS:
-- =====================================================
-- 1. Copy this entire script
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and click "Run"
-- 4. Verify the output shows:
--    - contractor@gmail.com: ✅ SYNCED
--    - All contractors: ✅ SYNCED
-- 5. Test login as contractor@gmail.com
-- 6. Should now show proper subscription tier
-- =====================================================
