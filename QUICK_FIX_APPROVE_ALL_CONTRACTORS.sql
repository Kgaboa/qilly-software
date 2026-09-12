-- ⚡ QUICK FIX: Approve All Contractors (30 seconds)

-- Run this in DEV Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new

-- STEP 1: Check current contractor statuses
SELECT 
  email,
  company_name,
  status,
  cidb_grade,
  created_at
FROM contractors
ORDER BY created_at DESC;

-- STEP 2: Update ALL contractors to 'approved' status
UPDATE contractors
SET 
  status = 'approved',
  updated_at = NOW()
WHERE status IS NULL 
   OR status != 'approved';

-- STEP 3: Verify all are approved now
SELECT 
  email,
  company_name,
  status,
  cidb_grade,
  subscription_tier
FROM contractors
WHERE status = 'approved'
ORDER BY created_at DESC;

-- STEP 4: Count approved vs pending
SELECT 
  status,
  COUNT(*) as count
FROM contractors
GROUP BY status;

-- Expected result: All contractors should be 'approved'

-- ✅ DONE! Now hard refresh browser and test login
