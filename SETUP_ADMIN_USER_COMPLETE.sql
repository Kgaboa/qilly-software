-- =====================================================
-- COMPLETE ADMIN USER SETUP - ONE SCRIPT TO RUN
-- This creates the admin user AND sets up all tables
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 1: CREATE ADMIN USER IN AUTH.USERS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@qilly.co.za';

  IF admin_user_id IS NULL THEN
    -- Create admin user if doesn't exist
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@qilly.co.za',
      crypt('QillyAdmin2026!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"user_type":"admin"}',
      false
    )
    RETURNING id INTO admin_user_id;

    RAISE NOTICE '✅ Created admin user with ID: %', admin_user_id;
  ELSE
    RAISE NOTICE '✅ Admin user already exists with ID: %', admin_user_id;
    
    -- Make sure the user is confirmed
    UPDATE auth.users
    SET 
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      confirmed_at = COALESCE(confirmed_at, NOW()),
      raw_user_meta_data = '{"user_type":"admin"}'
    WHERE id = admin_user_id;
    
    RAISE NOTICE '✅ Confirmed admin user email';
  END IF;

  -- Also create identity record for email/password auth
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    admin_user_id,
    jsonb_build_object(
      'sub', admin_user_id::text,
      'email', 'admin@qilly.co.za'
    ),
    'email',
    admin_user_id::text,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (provider, provider_id) DO NOTHING;

  RAISE NOTICE '✅ Admin user authentication setup complete!';
END $$;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 2: FIX USERS TABLE - ADD ROLE COLUMN
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

-- Insert any missing users from auth.users (including the admin we just created)
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
ON CONFLICT (id) DO UPDATE
SET role = EXCLUDED.role;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 3: FIX SUPPLIERS TABLE - ADD MISSING COLUMNS
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
-- PART 4: FIX CONTRACTORS TABLE - ADD MISSING COLUMNS
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
-- PART 5: ENABLE RLS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 6: DROP AND RECREATE RLS POLICIES
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
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

CREATE POLICY "Users can insert own data"
ON users FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all users"
ON users FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

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
-- PART 7: ADD TEST DATA
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Get admin user ID for test data
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@qilly.co.za';

  -- Add test suppliers
  INSERT INTO suppliers (user_id, company_name, email, phone, contact_person, status, operating_provinces, delivery_provinces, bee_level, cipc_number, vat_number)
  VALUES
    (admin_id, 'BuildMart Suppliers (Pty) Ltd', 'buildmart@example.com', '+27 11 234 5678', 'John Smith', 'approved', ARRAY['GP','WC','KZN'], ARRAY['GP','WC','KZN','EC','FS'], 'Level 2', '2015/123456/07', '4123456789'),
    (admin_id, 'Cape Concrete & Aggregates CC', 'info@capeconcrete.co.za', '+27 21 555 8888', 'Mary Johnson', 'approved', ARRAY['WC','NC'], ARRAY['WC','NC','EC'], 'Level 3', '2012/098765/23', '4987654321'),
    (admin_id, 'Durban Steel Supplies (Pty) Ltd', 'sales@durbansteel.co.za', '+27 31 789 4567', 'Thabo Ndlovu', 'pending', ARRAY['KZN'], ARRAY['KZN','EC','FS'], 'Level 4', '2018/234567/07', '4234567890'),
    (admin_id, 'Joburg Building Materials', 'sales@joburgbuild.co.za', '+27 11 456 7890', 'Sarah van der Merwe', 'approved', ARRAY['GP','NW','MP'], ARRAY['GP','NW','MP','FS'], 'Level 1', '2010/345678/07', '4345678901'),
    (admin_id, 'Free State Cement & Sand', 'orders@fscementsand.co.za', '+27 51 123 4567', 'Sipho Molefe', 'approved', ARRAY['FS','NC'], ARRAY['FS','NC','GP','NW'], 'Level 2', '2013/456789/07', '4456789012')
  ON CONFLICT (email) DO NOTHING;

  -- Add test contractors
  INSERT INTO contractors (user_id, company_name, email, phone, contact_person, status, operating_provinces, nhbrc_number, bee_level, cipc_number, vat_number)
  VALUES
    (admin_id, 'ABC Construction (Pty) Ltd', 'abc@construction.co.za', '+27 11 987 6543', 'Sarah Williams', 'approved', ARRAY['GP','WC'], 'NHBRC123456', 'Level 1', '2009/567890/07', '4567890123'),
    (admin_id, 'Eastern Cape Builders CC', 'info@ecbuilders.co.za', '+27 43 555 1234', 'Peter Mbeki', 'approved', ARRAY['EC','KZN'], 'NHBRC789012', 'Level 2', '2011/678901/23', '4678901234'),
    (admin_id, 'Northern Projects (Pty) Ltd', 'projects@northern.co.za', '+27 12 333 9999', 'Lisa Nkosi', 'pending', ARRAY['LP','MP'], 'NHBRC345678', 'Level 3', '2016/789012/07', '4789012345'),
    (admin_id, 'Gauteng Housing Solutions', 'info@gautenghousing.co.za', '+27 11 222 3333', 'David Mokoena', 'approved', ARRAY['GP'], 'NHBRC901234', 'Level 1', '2014/890123/07', '4890123456'),
    (admin_id, 'Western Cape Contractors CC', 'contact@wccontractors.co.za', '+27 21 444 5555', 'Amanda Jacobs', 'approved', ARRAY['WC','NC'], 'NHBRC012345', 'Level 4', '2017/901234/23', '4901234567')
  ON CONFLICT (email) DO NOTHING;

  RAISE NOTICE '✅ Test data added successfully';
END $$;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 8: VERIFICATION
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '✅ COMPLETE SETUP FINISHED - VERIFICATION' as status;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

-- 1. Check admin user in auth.users
SELECT 
  '1. Admin User (auth.users):' as check,
  id,
  email,
  email_confirmed_at IS NOT NULL as email_confirmed,
  raw_user_meta_data->>'user_type' as user_type
FROM auth.users 
WHERE email = 'admin@qilly.co.za';

-- 2. Check admin user in users table
SELECT 
  '2. Admin User (users table):' as check,
  id,
  email,
  role
FROM users 
WHERE email = 'admin@qilly.co.za';

-- 3. User counts by role
SELECT 
  '3. Users by Role:' as check,
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

-- 4. Supplier count
SELECT 
  '4. Suppliers:' as check,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'pending') as pending
FROM suppliers;

-- 5. Contractor count
SELECT 
  '5. Contractors:' as check,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'pending') as pending
FROM contractors;

-- 6. RLS Policies check
SELECT 
  '6. RLS Policies:' as check,
  tablename,
  policyname
FROM pg_policies 
WHERE tablename IN ('users', 'suppliers', 'contractors')
ORDER BY tablename, policyname;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '✅ ALL DONE! Now try logging in as admin@qilly.co.za' as next_step;
SELECT 'Password: QillyAdmin2026!' as credentials;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
