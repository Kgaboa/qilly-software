-- 🔧 FIX: Missing Contractor Records (bone@gmail.com and others)

-- STEP 1: Check if RLS is blocking queries
-- Run this first to see if RLS is the issue
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'contractors';

-- If rowsecurity = true, RLS is enabled. Run the disable script:
-- /DISABLE_RLS_COMPLETE_V2.sql

-- STEP 2: Find all users in auth.users who should be contractors
-- but don't have contractor records
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.raw_user_meta_data->>'company_name' as company_name,
  CASE 
    WHEN c.id IS NULL THEN '❌ Missing from contractors table'
    WHEN c.status != 'approved' THEN '⚠️ Status: ' || c.status
    ELSE '✅ Approved'
  END as contractor_status
FROM auth.users au
LEFT JOIN contractors c ON c.email = au.email
WHERE au.email LIKE '%gmail.com'  -- Adjust this filter as needed
ORDER BY au.created_at DESC;

-- STEP 3: Check if bone@gmail.com exists anywhere
SELECT 
  'auth.users' as source_table,
  id,
  email,
  created_at
FROM auth.users
WHERE email = 'bone@gmail.com'

UNION ALL

SELECT 
  'contractors' as source_table,
  id::text,
  email,
  created_at
FROM contractors
WHERE email = 'bone@gmail.com'

UNION ALL

SELECT 
  'public.users' as source_table,
  id::text,
  email,
  created_at
FROM public.users
WHERE email = 'bone@gmail.com';

-- STEP 4: If bone@gmail.com exists in auth.users but NOT in contractors,
-- create the contractor record
-- (Uncomment and modify with actual data)

/*
INSERT INTO contractors (
  user_id,
  email,
  company_name,
  contact_person,
  cidb_registration_number,
  cidb_grade,
  status,
  subscription_tier,
  annual_turnover,
  operating_provinces,
  project_types,
  created_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'company_name', 'Company Name'),
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  'CIDB/TBD/' || substr(md5(random()::text), 1, 8),
  'Grade 4 GB',  -- Default grade
  'approved',    -- Set to approved
  'FREE',
  0,
  ARRAY['GP']::text[],
  ARRAY['General Building']::text[],
  NOW()
FROM auth.users au
WHERE au.email = 'bone@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM contractors c WHERE c.email = au.email
  );
*/

-- STEP 5: Update existing contractors to 'approved' status if they're pending
-- (Uncomment to auto-approve all pending contractors)

/*
UPDATE contractors
SET 
  status = 'approved',
  updated_at = NOW()
WHERE status IN ('pending', 'pending_approval', NULL)
  AND email IN ('bone@gmail.com');  -- Add other emails as needed
*/

-- STEP 6: Verify all contractors have proper CIDB grades
SELECT 
  email,
  company_name,
  cidb_grade,
  status,
  CASE 
    WHEN cidb_grade IS NULL THEN '❌ Missing CIDB grade'
    WHEN cidb_grade NOT IN (
      'Grade 1 GB', 'Grade 2 GB', 'Grade 3 GB', 'Grade 4 GB', 
      'Grade 5 GB', 'Grade 6 GB', 'Grade 7 GB', 'Grade 8 GB', 'Grade 9 GB',
      'Grade 1 CE', 'Grade 2 CE', 'Grade 3 CE', 'Grade 4 CE', 
      'Grade 5 CE', 'Grade 6 CE', 'Grade 7 CE', 'Grade 8 CE', 'Grade 9 CE'
    ) THEN '⚠️ Invalid CIDB grade format'
    ELSE '✅ Valid'
  END as grade_status
FROM contractors
ORDER BY created_at DESC;

-- STEP 7: Show all contractors with their current status
SELECT 
  email,
  company_name,
  cidb_grade,
  status,
  subscription_tier,
  created_at,
  updated_at
FROM contractors
ORDER BY created_at DESC;
