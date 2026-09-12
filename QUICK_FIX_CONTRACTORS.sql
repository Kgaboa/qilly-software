-- ========================================================================
-- QUICK FIX: Create Missing Contractor Records (with phone numbers)
-- ========================================================================
-- Copy and paste this ENTIRE script into Supabase SQL Editor and click RUN
-- ========================================================================

-- Step 1: Create missing contractor records
-- ========================================================================
INSERT INTO contractors (
  user_id,
  email,
  company_name,
  contact_person,
  cidb_registration_number,
  cidb_grade,
  phone,
  street_address,
  city,
  province,
  postal_code,
  status,
  subscription_tier,
  subscription_status,
  annual_turnover,
  operating_provinces,
  project_types,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.email,
  -- Company name from users table or generate from email
  COALESCE(
    NULLIF(u.company_name, ''),
    INITCAP(SPLIT_PART(u.email, '@', 1)) || ' Construction (Pty) Ltd'
  ) as company_name,
  
  -- Contact person from full_name or email
  COALESCE(
    NULLIF(u.full_name, ''),
    INITCAP(SPLIT_PART(u.email, '@', 1))
  ) as contact_person,
  
  -- Generate unique CIDB number
  'CIDB/2026/' || UPPER(SUBSTRING(MD5(u.email), 1, 8)) as cidb_registration_number,
  
  -- CIDB grade
  COALESCE(u.cidb_grade, 'Grade 4 GB') as cidb_grade,
  
  -- ✅ Phone number (placeholder - can be updated later)
  '+27 ' || SUBSTRING(MD5(u.email), 1, 2) || ' ' || 
  SUBSTRING(MD5(u.email), 3, 3) || ' ' || 
  SUBSTRING(MD5(u.email), 6, 4) as phone,
  
  -- ✅ Street address (placeholder - can be updated later)
  'Unit ' || (FLOOR(RANDOM() * 100 + 1))::text || ', ' ||
  CASE (FLOOR(RANDOM() * 5))::integer
    WHEN 0 THEN 'Business Park'
    WHEN 1 THEN 'Industrial Estate'
    WHEN 2 THEN 'Commercial Centre'
    WHEN 3 THEN 'Trade Centre'
    ELSE 'Office Park'
  END as street_address,
  
  -- ✅ City (placeholder - can be updated later)
  CASE (FLOOR(RANDOM() * 9))::integer
    WHEN 0 THEN 'Johannesburg'
    WHEN 1 THEN 'Pretoria'
    WHEN 2 THEN 'Cape Town'
    WHEN 3 THEN 'Durban'
    WHEN 4 THEN 'Sandton'
    WHEN 5 THEN 'Midrand'
    WHEN 6 THEN 'Centurion'
    WHEN 7 THEN 'Randburg'
    ELSE 'Roodepoort'
  END as city,
  
  -- ✅ Province (placeholder - default to Gauteng)
  'Gauteng' as province,
  
  -- ✅ Postal code (placeholder - Johannesburg area codes)
  CASE (FLOOR(RANDOM() * 10))::integer
    WHEN 0 THEN '2000'
    WHEN 1 THEN '2001'
    WHEN 2 THEN '2196'
    WHEN 3 THEN '2146'
    WHEN 4 THEN '2090'
    WHEN 5 THEN '2091'
    WHEN 6 THEN '2157'
    WHEN 7 THEN '2194'
    WHEN 8 THEN '2170'
    ELSE '2198'
  END as postal_code,
  
  -- Status
  'approved' as status,
  
  -- Subscription
  COALESCE(u.subscription_tier, 'FREE') as subscription_tier,
  'trial' as subscription_status,
  
  -- Financials
  0 as annual_turnover,
  
  -- Location
  ARRAY['GP']::text[] as operating_provinces,
  
  -- Project types
  ARRAY[
    'General Building',
    'Road Construction', 
    'Housing Development'
  ]::text[] as project_types,
  
  -- Timestamps
  u.created_at,
  NOW() as updated_at
FROM public.users u
WHERE u.role = 'contractor'
  AND NOT EXISTS (
    SELECT 1 FROM contractors c WHERE c.email = u.email
  );

-- ========================================================================
-- Step 2: Verify it worked
-- ========================================================================
SELECT 
  email,
  company_name,
  contact_person,
  phone,
  cidb_grade,
  status,
  operating_provinces,
  project_types
FROM contractors
WHERE email IN (
  'bone@gmail.com',
  'start@gmail.com',
  'letstest@gmail.com',
  'newtest@gmail.com',
  'sqltest@gmail.com',
  'weed@gmail.com',
  'weeding@gmail.com'
)
ORDER BY created_at DESC;

-- ========================================================================
-- Step 3: Final count check
-- ========================================================================
SELECT 
  COUNT(*) FILTER (WHERE role = 'contractor') as total_contractor_users,
  COUNT(c.id) as total_contractor_records,
  COUNT(*) FILTER (WHERE role = 'contractor' AND c.id IS NULL) as missing_records,
  CASE 
    WHEN COUNT(*) FILTER (WHERE role = 'contractor' AND c.id IS NULL) = 0 
    THEN '✅ ALL CONTRACTORS HAVE RECORDS'
    ELSE '⚠️ SOME CONTRACTORS STILL MISSING'
  END as status
FROM public.users u
LEFT JOIN contractors c ON c.email = u.email
WHERE u.role = 'contractor';

-- ========================================================================
-- Expected Result:
-- ========================================================================
-- total_contractor_users: 7 or 8
-- total_contractor_records: 7 or 8  
-- missing_records: 0
-- status: ✅ ALL CONTRACTORS HAVE RECORDS
-- ========================================================================

-- ========================================================================
-- If you want to update phone numbers later, use this:
-- ========================================================================
/*
UPDATE contractors 
SET phone = '+27 11 123 4567'
WHERE email = 'bone@gmail.com';
*/

-- ========================================================================
-- END
-- ========================================================================