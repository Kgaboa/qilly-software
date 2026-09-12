-- =====================================================
-- FINAL COMPLETE FIX - Run this ENTIRE script
-- Handles existing tables and adds missing pieces
-- Database: zzdzrlglivtpawtitvgu
-- =====================================================

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 1: Fix users table - Add role column if missing
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Add role column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Update all existing users with their correct roles
UPDATE users SET role = 'admin' WHERE email = 'admin@qilly.co.za';

UPDATE users u
SET role = 'supplier'
WHERE EXISTS (
  SELECT 1 FROM auth.users au 
  WHERE au.id = u.id 
  AND au.raw_user_meta_data->>'user_type' = 'supplier'
);

UPDATE users u
SET role = 'contractor'
WHERE EXISTS (
  SELECT 1 FROM auth.users au 
  WHERE au.id = u.id 
  AND au.raw_user_meta_data->>'user_type' = 'contractor'
);

-- Insert any missing users from auth.users
INSERT INTO users (id, email, role, created_at)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'admin@qilly.co.za' THEN 'admin'
    WHEN au.raw_user_meta_data->>'user_type' = 'contractor' THEN 'contractor'
    WHEN au.raw_user_meta_data->>'user_type' = 'supplier' THEN 'supplier'
    ELSE 'user'
  END as role,
  au.created_at
FROM auth.users au
WHERE au.deleted_at IS NULL
AND NOT EXISTS (SELECT 1 FROM users WHERE users.id = au.id)
ON CONFLICT (id) DO NOTHING;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: Fix suppliers table - Add missing columns
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS operating_provinces TEXT[] DEFAULT '{}';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS delivery_provinces TEXT[] DEFAULT '{}';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS cipc_number TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS vat_number TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bee_level TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: Fix contractors table - Add missing columns
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE contractors ADD COLUMN IF NOT EXISTS operating_provinces TEXT[] DEFAULT '{}';
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS cipc_number TEXT;
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS vat_number TEXT;
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS bee_level TEXT;
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS nhbrc_number TEXT;
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}';
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 4: Ensure RLS is enabled
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 5: Drop and recreate RLS policies
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Suppliers can view own data" ON suppliers;
DROP POLICY IF EXISTS "Admins can view all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Admins can update all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Allow supplier signups" ON suppliers;
DROP POLICY IF EXISTS "Suppliers can update own data" ON suppliers;
DROP POLICY IF EXISTS "Contractors can view own data" ON contractors;
DROP POLICY IF EXISTS "Admins can view all contractors" ON contractors;
DROP POLICY IF EXISTS "Admins can update all contractors" ON contractors;
DROP POLICY IF EXISTS "Allow contractor signups" ON contractors;
DROP POLICY IF EXISTS "Contractors can update own data" ON contractors;

-- Create new policies
-- Users table
CREATE POLICY "Users can view own data"
ON users FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admins can view all users"
ON users FOR SELECT TO authenticated
USING (role = 'admin');

-- Suppliers table - CRITICAL FOR ADMIN ACCESS
CREATE POLICY "Admins can view all suppliers"
ON suppliers FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

CREATE POLICY "Suppliers can view own data"
ON suppliers FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Suppliers can update own data"
ON suppliers FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Allow supplier signups"
ON suppliers FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Contractors table - CRITICAL FOR ADMIN ACCESS
CREATE POLICY "Admins can view all contractors"
ON contractors FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

CREATE POLICY "Contractors can view own data"
ON contractors FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Contractors can update own data"
ON contractors FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Allow contractor signups"
ON contractors FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 6: Add test data
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Add test suppliers
INSERT INTO suppliers (user_id, company_name, email, phone, contact_person, status, operating_provinces, delivery_provinces, bee_level, cipc_number, vat_number)
SELECT 
  id, 'BuildMart Suppliers (Pty) Ltd', 'buildmart@example.com', '+27 11 234 5678', 'John Smith', 
  'approved', ARRAY['GP','WC','KZN'], ARRAY['GP','WC','KZN','EC','FS'], 'Level 2', '2015/123456/07', '4123456789'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM suppliers WHERE email = 'buildmart@example.com');

INSERT INTO suppliers (user_id, company_name, email, phone, contact_person, status, operating_provinces, delivery_provinces, bee_level, cipc_number, vat_number)
SELECT 
  id, 'Cape Concrete & Aggregates CC', 'info@capeconcrete.co.za', '+27 21 555 8888', 'Mary Johnson',
  'approved', ARRAY['WC','NC'], ARRAY['WC','NC','EC'], 'Level 3', '2012/098765/23', '4987654321'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM suppliers WHERE email = 'info@capeconcrete.co.za');

INSERT INTO suppliers (user_id, company_name, email, phone, contact_person, status, operating_provinces, delivery_provinces, bee_level, cipc_number, vat_number)
SELECT 
  id, 'Durban Steel Supplies (Pty) Ltd', 'sales@durbansteel.co.za', '+27 31 789 4567', 'Thabo Ndlovu',
  'pending', ARRAY['KZN'], ARRAY['KZN','EC','FS'], 'Level 4', '2018/234567/07', '4234567890'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM suppliers WHERE email = 'sales@durbansteel.co.za');

INSERT INTO suppliers (user_id, company_name, email, phone, contact_person, status, operating_provinces, delivery_provinces, bee_level, cipc_number, vat_number)
SELECT 
  id, 'Joburg Building Materials', 'sales@joburgbuild.co.za', '+27 11 456 7890', 'Sarah van der Merwe',
  'approved', ARRAY['GP','NW','MP'], ARRAY['GP','NW','MP','FS'], 'Level 1', '2010/345678/07', '4345678901'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM suppliers WHERE email = 'sales@joburgbuild.co.za');

INSERT INTO suppliers (user_id, company_name, email, phone, contact_person, status, operating_provinces, delivery_provinces, bee_level, cipc_number, vat_number)
SELECT 
  id, 'Free State Cement & Sand', 'orders@fscementsand.co.za', '+27 51 123 4567', 'Sipho Molefe',
  'approved', ARRAY['FS','NC'], ARRAY['FS','NC','GP','NW'], 'Level 2', '2013/456789/07', '4456789012'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM suppliers WHERE email = 'orders@fscementsand.co.za');

-- Add test contractors
INSERT INTO contractors (user_id, company_name, email, phone, contact_person, status, operating_provinces, nhbrc_number, bee_level, cipc_number, vat_number)
SELECT 
  id, 'ABC Construction (Pty) Ltd', 'abc@construction.co.za', '+27 11 987 6543', 'Sarah Williams',
  'approved', ARRAY['GP','WC'], 'NHBRC123456', 'Level 1', '2009/567890/07', '4567890123'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM contractors WHERE email = 'abc@construction.co.za');

INSERT INTO contractors (user_id, company_name, email, phone, contact_person, status, operating_provinces, nhbrc_number, bee_level, cipc_number, vat_number)
SELECT 
  id, 'Eastern Cape Builders CC', 'info@ecbuilders.co.za', '+27 43 555 1234', 'Peter Mbeki',
  'approved', ARRAY['EC','KZN'], 'NHBRC789012', 'Level 2', '2011/678901/23', '4678901234'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM contractors WHERE email = 'info@ecbuilders.co.za');

INSERT INTO contractors (user_id, company_name, email, phone, contact_person, status, operating_provinces, nhbrc_number, bee_level, cipc_number, vat_number)
SELECT 
  id, 'Northern Projects (Pty) Ltd', 'projects@northern.co.za', '+27 12 333 9999', 'Lisa Nkosi',
  'pending', ARRAY['LP','MP'], 'NHBRC345678', 'Level 3', '2016/789012/07', '4789012345'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM contractors WHERE email = 'projects@northern.co.za');

INSERT INTO contractors (user_id, company_name, email, phone, contact_person, status, operating_provinces, nhbrc_number, bee_level, cipc_number, vat_number)
SELECT 
  id, 'Gauteng Housing Solutions', 'info@gautenghousing.co.za', '+27 11 222 3333', 'David Mokoena',
  'approved', ARRAY['GP'], 'NHBRC901234', 'Level 1', '2014/890123/07', '4890123456'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM contractors WHERE email = 'info@gautenghousing.co.za');

INSERT INTO contractors (user_id, company_name, email, phone, contact_person, status, operating_provinces, nhbrc_number, bee_level, cipc_number, vat_number)
SELECT 
  id, 'Western Cape Contractors CC', 'contact@wccontractors.co.za', '+27 21 444 5555', 'Amanda Jacobs',
  'approved', ARRAY['WC','NC'], 'NHBRC012345', 'Level 4', '2017/901234/23', '4901234567'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM contractors WHERE email = 'contact@wccontractors.co.za');

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 7: VERIFICATION
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '✅ SETUP COMPLETE - VERIFICATION RESULTS' as status;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

-- User counts by role
SELECT 
  '1. Users by Role:' as check,
  role,
  COUNT(*) as count
FROM users
GROUP BY role
ORDER BY 
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'supplier' THEN 2
    WHEN 'contractor' THEN 3
    ELSE 4
  END;

-- Admin user check
SELECT 
  '2. Admin User:' as check,
  email,
  role
FROM users 
WHERE email = 'admin@qilly.co.za';

-- Supplier count
SELECT 
  '3. Suppliers:' as check,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'pending') as pending
FROM suppliers;

-- Contractor count
SELECT 
  '4. Contractors:' as check,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'pending') as pending
FROM contractors;

-- Sample suppliers
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '📦 Sample Suppliers (first 5):' as info;
SELECT company_name, email, status, bee_level, operating_provinces 
FROM suppliers 
ORDER BY created_at DESC 
LIMIT 5;

-- Sample contractors
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '🏗️ Sample Contractors (first 5):' as info;
SELECT company_name, email, status, bee_level, nhbrc_number, operating_provinces 
FROM contractors 
ORDER BY created_at DESC 
LIMIT 5;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '✅ ALL DONE! Now refresh Figma Make and login as admin@qilly.co.za' as next_step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
