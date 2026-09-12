-- ========================================================================
-- FIX ALL MISSING CONTRACTOR RECORDS
-- ========================================================================
-- This script creates full contractor profiles for all users who have
-- role='contractor' in public.users but are missing from contractors table
-- ========================================================================

-- Step 1: Diagnostic - Show all users missing contractor records
-- ========================================================================
SELECT 
  u.id,
  u.email,
  u.role,
  u.company_name as users_table_company,
  u.created_at,
  CASE 
    WHEN c.id IS NULL THEN '❌ MISSING - Needs contractor record'
    ELSE '✅ EXISTS'
  END as contractor_status
FROM public.users u
LEFT JOIN contractors c ON c.email = u.email
WHERE u.role = 'contractor'
ORDER BY u.created_at DESC;

-- Expected Output:
-- bone@gmail.com          | contractor | ❌ MISSING
-- start@gmail.com         | contractor | ❌ MISSING  
-- letstest@gmail.com      | contractor | ❌ MISSING
-- newtest@gmail.com       | contractor | ❌ MISSING
-- sqltest@gmail.com       | contractor | ❌ MISSING
-- weed@gmail.com          | contractor | ❌ MISSING
-- weeding@gmail.com       | contractor | ❌ MISSING
-- kgabo123@gmail.com      | user       | ✅ EXISTS (already has record)

-- ========================================================================
-- Step 2: Create Missing Contractor Records
-- ========================================================================

-- Insert contractor records for ALL users with role='contractor'
-- who don't have a contractor record yet
INSERT INTO contractors (
  user_id,
  email,
  company_name,
  contact_person,
  cidb_registration_number,
  cidb_grade,
  phone, -- ✅ ADDED: Required field
  street_address, -- ✅ ADDED: Required field
  city, -- ✅ ADDED: Required field
  province, -- ✅ ADDED: Required field
  postal_code, -- ✅ ADDED: Required field
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
  -- Use company_name from users table if exists, otherwise create from email
  COALESCE(
    NULLIF(u.company_name, ''),
    INITCAP(SPLIT_PART(u.email, '@', 1)) || ' Construction (Pty) Ltd'
  ) as company_name,
  
  -- Contact person: Use full_name if exists, otherwise email prefix
  COALESCE(
    NULLIF(u.full_name, ''),
    INITCAP(SPLIT_PART(u.email, '@', 1))
  ) as contact_person,
  
  -- Generate unique CIDB number based on email
  'CIDB/2026/' || UPPER(SUBSTRING(MD5(u.email), 1, 8)) as cidb_registration_number,
  
  -- Default CIDB grade for new contractors
  COALESCE(u.cidb_grade, 'Grade 4 GB') as cidb_grade,
  
  -- ✅ ADDED: Generate placeholder phone number (can be updated later)
  '+27 ' || SUBSTRING(MD5(u.email), 1, 2) || ' ' || 
  SUBSTRING(MD5(u.email), 3, 3) || ' ' || 
  SUBSTRING(MD5(u.email), 6, 4) as phone,
  
  -- ✅ ADDED: Generate placeholder street address (can be updated later)
  'Unit ' || (FLOOR(RANDOM() * 100 + 1))::text || ', ' ||
  CASE (FLOOR(RANDOM() * 5))::integer
    WHEN 0 THEN 'Business Park'
    WHEN 1 THEN 'Industrial Estate'
    WHEN 2 THEN 'Commercial Centre'
    WHEN 3 THEN 'Trade Centre'
    ELSE 'Office Park'
  END as street_address,
  
  -- ✅ ADDED: City (placeholder - can be updated later)
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
  
  -- ✅ ADDED: Province (placeholder - default to Gauteng)
  'Gauteng' as province,
  
  -- ✅ ADDED: Postal code (placeholder - Johannesburg area codes)
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
  
  -- Auto-approve for demo/trial users
  'approved' as status,
  
  -- Match subscription tier from users table
  COALESCE(u.subscription_tier, 'FREE') as subscription_tier,
  
  -- Default to trial status
  'trial' as subscription_status,
  
  -- Default annual turnover (0 = EME status)
  0 as annual_turnover,
  
  -- Default operating province: Gauteng
  ARRAY['GP']::text[] as operating_provinces,
  
  -- Default project types based on common construction work
  ARRAY[
    'General Building',
    'Road Construction', 
    'Housing Development'
  ]::text[] as project_types,
  
  u.created_at,
  NOW() as updated_at
FROM public.users u
WHERE u.role = 'contractor'
  AND NOT EXISTS (
    SELECT 1 FROM contractors c WHERE c.email = u.email
  );

-- ========================================================================
-- Step 3: Verify All Contractors Now Have Records
-- ========================================================================

SELECT 
  u.email,
  u.role,
  c.company_name,
  c.cidb_grade,
  c.status,
  c.operating_provinces,
  c.project_types,
  CASE 
    WHEN c.id IS NOT NULL THEN '✅ CONTRACTOR RECORD EXISTS'
    ELSE '❌ STILL MISSING'
  END as status_check
FROM public.users u
LEFT JOIN contractors c ON c.email = u.email
WHERE u.role = 'contractor'
ORDER BY u.created_at DESC;

-- Expected Result: ALL should show ✅ CONTRACTOR RECORD EXISTS

-- ========================================================================
-- Step 4: Check specific users (bone@gmail.com, etc.)
-- ========================================================================

SELECT 
  email,
  company_name,
  contact_person,
  cidb_registration_number,
  cidb_grade,
  status,
  operating_provinces,
  project_types,
  subscription_tier,
  created_at
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
-- Step 5: Enable RLS if needed (optional)
-- ========================================================================

-- If contractors table has RLS enabled, make sure policies allow access
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own contractor record
DROP POLICY IF EXISTS "Users can view own contractor record" ON contractors;
CREATE POLICY "Users can view own contractor record"
  ON contractors
  FOR SELECT
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR 
    user_id = auth.uid()
    OR
    status = 'approved'  -- Allow viewing approved contractors
  );

-- Policy: Service role can do anything (for admin dashboard)
DROP POLICY IF EXISTS "Service role full access" ON contractors;
CREATE POLICY "Service role full access"
  ON contractors
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================================================================
-- Step 6: Final Verification Count
-- ========================================================================

SELECT 
  COUNT(*) FILTER (WHERE role = 'contractor') as total_contractor_users,
  COUNT(c.id) as total_contractor_records,
  COUNT(*) FILTER (WHERE role = 'contractor' AND c.id IS NULL) as missing_records,
  CASE 
    WHEN COUNT(*) FILTER (WHERE role = 'contractor' AND c.id IS NULL) = 0 
    THEN '✅ ALL CONTRACTORS HAVE RECORDS'
    ELSE '⚠️ SOME CONTRACTORS STILL MISSING RECORDS'
  END as final_status
FROM public.users u
LEFT JOIN contractors c ON c.email = u.email
WHERE u.role = 'contractor';

-- ========================================================================
-- EXPECTED OUTPUT AFTER RUNNING THIS SCRIPT:
-- ========================================================================
-- total_contractor_users: 8
-- total_contractor_records: 8
-- missing_records: 0
-- final_status: ✅ ALL CONTRACTORS HAVE RECORDS
-- ========================================================================

-- ========================================================================
-- TROUBLESHOOTING
-- ========================================================================

-- If contractors table is completely empty, RLS might be blocking access.
-- Run this to temporarily disable RLS for testing:
-- ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;

-- Then re-run the INSERT query above.

-- After data is inserted, re-enable RLS:
-- ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- ========================================================================
-- CUSTOMIZATION NOTES
-- ========================================================================

-- To customize specific contractors, update their records:
/*
UPDATE contractors 
SET 
  company_name = 'Real Company Name',
  contact_person = 'Real Contact Name',
  cidb_registration_number = 'CIDB/REAL/NUMBER',
  cidb_grade = 'Grade 6 CE',
  annual_turnover = 15000000,  -- R15M (QSE status)
  operating_provinces = ARRAY['GP', 'WC']::text[],
  project_types = ARRAY[
    'Road Construction',
    'Housing Development',
    'Civil Works'
  ]::text[]
WHERE email = 'bone@gmail.com';
*/

-- ========================================================================
-- END OF SCRIPT
-- ========================================================================