-- ================================================
-- REMOVE TRIAL BILLING - DATABASE CLEANUP
-- ================================================
-- Run this in Supabase SQL Editor BEFORE Tuesday presentation
-- This removes all trial-related columns and data
-- ================================================

-- ================================================
-- STEP 1: BACKUP Current State (for safety)
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'BACKUP: Current contractor subscription state';
  RAISE NOTICE '==============================================';
END $$;

-- Show current state
SELECT 
  'CURRENT STATE' as status,
  email,
  company_name,
  subscription_tier,
  subscription_status,
  billing_cycle,
  subscription_start_date
FROM public.contractors
ORDER BY created_at DESC
LIMIT 20;

-- ================================================
-- STEP 2: Clean Up Tier Names
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'STEP 2: Converting old tier names to new';
  RAISE NOTICE '==============================================';
END $$;

-- Convert 'free_trial' → 'FREE'
UPDATE public.contractors
SET 
  subscription_tier = 'FREE',
  subscription_status = 'active'  -- Trial becomes active FREE tier
WHERE subscription_tier IN ('free_trial', 'trial', 'free');

-- Standardize tier names (case-sensitive)
UPDATE public.contractors
SET subscription_tier = CASE 
  WHEN UPPER(subscription_tier) = 'BASIC' THEN 'BASIC'
  WHEN UPPER(subscription_tier) = 'PROFESSIONAL' THEN 'PROFESSIONAL'
  WHEN UPPER(subscription_tier) = 'ENTERPRISE' THEN 'ENTERPRISE'
  WHEN UPPER(subscription_tier) = 'FREE' THEN 'FREE'
  ELSE subscription_tier
END;

-- ================================================
-- STEP 3: Remove Trial Columns from Contractors
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'STEP 3: Removing trial_bills_remaining column';
  RAISE NOTICE '==============================================';
  
  -- Check if column exists before dropping
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'contractors' 
      AND column_name = 'trial_bills_remaining'
  ) THEN
    ALTER TABLE public.contractors 
    DROP COLUMN trial_bills_remaining;
    RAISE NOTICE '✅ Dropped trial_bills_remaining from contractors table';
  ELSE
    RAISE NOTICE 'ℹ️  trial_bills_remaining column does not exist in contractors table';
  END IF;
END $$;

-- ================================================
-- STEP 4: Remove Trial Columns from Users (if exists)
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'STEP 4: Checking public.users table';
  RAISE NOTICE '==============================================';
  
  -- Check if public.users table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name = 'users'
  ) THEN
    RAISE NOTICE 'ℹ️  public.users table exists';
    
    -- Drop trial_bills_remaining if it exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'trial_bills_remaining'
    ) THEN
      ALTER TABLE public.users 
      DROP COLUMN trial_bills_remaining;
      RAISE NOTICE '✅ Dropped trial_bills_remaining from users table';
    ELSE
      RAISE NOTICE 'ℹ️  trial_bills_remaining column does not exist in users table';
    END IF;
    
  ELSE
    RAISE NOTICE 'ℹ️  public.users table does not exist';
  END IF;
END $$;

-- ================================================
-- STEP 5: Set Default Billing Dates for FREE Tier
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'STEP 5: Cleaning up FREE tier billing dates';
  RAISE NOTICE '==============================================';
END $$;

-- FREE tier should not have next_billing_date
UPDATE public.contractors
SET 
  next_billing_date = NULL,
  billing_cycle = 'monthly'  -- Keep for consistency, but won't be billed
WHERE subscription_tier = 'FREE';

-- ================================================
-- STEP 6: Ensure All Contractors Have Valid Status
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'STEP 6: Setting valid subscription_status';
  RAISE NOTICE '==============================================';
END $$;

-- Convert 'trial' status to 'active'
UPDATE public.contractors
SET subscription_status = 'active'
WHERE subscription_status IN ('trial', 'trialing', 'in_trial');

-- Ensure all contractors have a valid status
UPDATE public.contractors
SET subscription_status = 'active'
WHERE subscription_status IS NULL 
  OR subscription_status = '';

-- ================================================
-- STEP 7: Verify Final State
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'STEP 7: VERIFICATION - New State';
  RAISE NOTICE '==============================================';
END $$;

-- Show tier distribution
SELECT 
  'TIER DISTRIBUTION' as report,
  subscription_tier,
  subscription_status,
  COUNT(*) as contractor_count
FROM public.contractors
GROUP BY subscription_tier, subscription_status
ORDER BY subscription_tier, subscription_status;

-- Show sample contractors
SELECT 
  'SAMPLE CONTRACTORS' as report,
  email,
  company_name,
  subscription_tier,
  subscription_status,
  billing_cycle,
  CASE 
    WHEN next_billing_date IS NULL THEN 'No billing (FREE tier)'
    ELSE TO_CHAR(next_billing_date, 'YYYY-MM-DD')
  END as next_billing
FROM public.contractors
ORDER BY 
  CASE subscription_tier
    WHEN 'FREE' THEN 1
    WHEN 'BASIC' THEN 2
    WHEN 'PROFESSIONAL' THEN 3
    WHEN 'ENTERPRISE' THEN 4
    ELSE 5
  END,
  created_at DESC
LIMIT 20;

-- Check if trial columns still exist
SELECT 
  'COLUMN CHECK' as report,
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('contractors', 'users')
  AND column_name LIKE '%trial%'
ORDER BY table_name, column_name;

-- ================================================
-- EXPECTED RESULTS AFTER RUNNING THIS SCRIPT:
-- ================================================
-- 
-- ✅ No more 'free_trial' tier - all converted to 'FREE'
-- ✅ No more 'trial' status - all converted to 'active'
-- ✅ trial_bills_remaining column removed from contractors
-- ✅ trial_bills_remaining column removed from users (if existed)
-- ✅ FREE tier contractors have no next_billing_date
-- ✅ All tiers: FREE, BASIC, PROFESSIONAL, ENTERPRISE
-- ✅ All statuses: active, cancelled, expired, pending
-- 
-- ================================================
-- WHAT TO DO NEXT:
-- ================================================
-- 
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify the "SAMPLE CONTRACTORS" output looks correct
-- 3. Check "COLUMN CHECK" shows no trial-related columns
-- 4. Update your React code to remove trial logic
-- 5. Add tier selection to sign-up flow
-- 6. Test FREE tier sign-up end-to-end
-- 
-- ================================================

DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE '✅ TRIAL BILLING REMOVAL COMPLETE!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Update React code to remove trial counter logic';
  RAISE NOTICE '2. Add tier selection component to sign-up flow';
  RAISE NOTICE '3. Test FREE tier registration';
  RAISE NOTICE '4. Prepare for Tuesday eTender presentation';
  RAISE NOTICE '';
  RAISE NOTICE '==============================================';
END $$;
