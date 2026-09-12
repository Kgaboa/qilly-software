-- =====================================================
-- QILLY DATABASE FIX - STEP BY STEP
-- Run each section ONE AT A TIME
-- Database: zzdzrlglivtpawtitvgu
-- =====================================================

-- =====================================================
-- SECTION 1: CREATE USERS TABLE (Run this first)
-- =====================================================

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'supplier', 'contractor', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If the table already exists but doesn't have role column, add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
    ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'supplier', 'contractor', 'user'));
  END IF;
END $$;

-- =====================================================
-- SECTION 2: SET ADMIN USER (Run after Section 1)
-- =====================================================

-- Find and set admin user
DO $$
DECLARE
  admin_auth_id UUID;
BEGIN
  SELECT id INTO admin_auth_id FROM auth.users WHERE email = 'admin@qilly.co.za';
  
  IF admin_auth_id IS NOT NULL THEN
    INSERT INTO users (id, email, role, created_at)
    VALUES (admin_auth_id, 'admin@qilly.co.za', 'admin', NOW())
    ON CONFLICT (id) DO UPDATE SET role = 'admin', email = 'admin@qilly.co.za';
    RAISE NOTICE 'Admin user created with ID: %', admin_auth_id;
  ELSE
    RAISE EXCEPTION 'Admin user admin@qilly.co.za not found in auth.users. Please create it first in Authentication > Users';
  END IF;
END $$;

-- =====================================================
-- SECTION 3: CREATE SUPPLIERS TABLE (Run after Section 2)
-- =====================================================

CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  contact_person TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  operating_provinces TEXT[] DEFAULT '{}',
  delivery_provinces TEXT[] DEFAULT '{}',
  cipc_number TEXT,
  vat_number TEXT,
  bee_level TEXT,
  certifications TEXT[] DEFAULT '{}',
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECTION 4: CREATE CONTRACTORS TABLE (Run after Section 3)
-- =====================================================

CREATE TABLE IF NOT EXISTS contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  contact_person TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  operating_provinces TEXT[] DEFAULT '{}',
  cipc_number TEXT,
  vat_number TEXT,
  bee_level TEXT,
  nhbrc_number TEXT,
  certifications TEXT[] DEFAULT '{}',
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECTION 5: CREATE RLS POLICIES (Run after Section 4)
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Suppliers can view own data" ON suppliers;
DROP POLICY IF EXISTS "Admins can view all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Admins can update all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Suppliers can update own data" ON suppliers;
DROP POLICY IF EXISTS "Allow supplier signups" ON suppliers;

DROP POLICY IF EXISTS "Contractors can view own data" ON contractors;
DROP POLICY IF EXISTS "Admins can view all contractors" ON contractors;
DROP POLICY IF EXISTS "Admins can update all contractors" ON contractors;
DROP POLICY IF EXISTS "Contractors can update own data" ON contractors;
DROP POLICY IF EXISTS "Allow contractor signups" ON contractors;

DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
ON users FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admins can view all users"
ON users FOR SELECT TO authenticated
USING (role = 'admin');

-- Supplier policies
CREATE POLICY "Admins can view all suppliers"
ON suppliers FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Suppliers can view own data"
ON suppliers FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can update all suppliers"
ON suppliers FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Suppliers can update own data"
ON suppliers FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Allow supplier signups"
ON suppliers FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Contractor policies
CREATE POLICY "Admins can view all contractors"
ON contractors FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Contractors can view own data"
ON contractors FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can update all contractors"
ON contractors FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Contractors can update own data"
ON contractors FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Allow contractor signups"
ON contractors FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- =====================================================
-- SECTION 6: ADD TEST DATA (Run after Section 5)
-- =====================================================

-- Add test suppliers (only if table is empty)
INSERT INTO suppliers (user_id, company_name, email, phone, contact_person, status, operating_provinces, delivery_provinces, bee_level)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'admin@qilly.co.za'),
  'BuildMart Suppliers (Pty) Ltd',
  'buildmart@example.com',
  '+27 11 234 5678',
  'John Smith',
  'approved',
  ARRAY['GP', 'WC', 'KZN'],
  ARRAY['GP', 'WC', 'KZN', 'EC', 'FS'],
  'Level 2'
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE email = 'buildmart@example.com');

INSERT INTO suppliers (user_id, company_name, email, phone, contact_person, status, operating_provinces, delivery_provinces, bee_level)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'admin@qilly.co.za'),
  'Cape Concrete & Aggregates',
  'info@capeconcrete.co.za',
  '+27 21 555 8888',
  'Mary Johnson',
  'approved',
  ARRAY['WC', 'NC'],
  ARRAY['WC', 'NC', 'EC'],
  'Level 3'
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE email = 'info@capeconcrete.co.za');

INSERT INTO suppliers (user_id, company_name, email, phone, contact_person, status, operating_provinces, delivery_provinces, bee_level)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'admin@qilly.co.za'),
  'Durban Steel Supplies',
  'sales@durbansteel.co.za',
  '+27 31 789 4567',
  'Thabo Ndlovu',
  'pending',
  ARRAY['KZN'],
  ARRAY['KZN', 'EC', 'FS'],
  'Level 4'
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE email = 'sales@durbansteel.co.za');

-- Add test contractors (only if table is empty)
INSERT INTO contractors (user_id, company_name, email, phone, contact_person, status, operating_provinces, nhbrc_number, bee_level)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'admin@qilly.co.za'),
  'ABC Construction (Pty) Ltd',
  'abc@construction.co.za',
  '+27 11 987 6543',
  'Sarah Williams',
  'approved',
  ARRAY['GP', 'WC'],
  'NHBRC123456',
  'Level 1'
WHERE NOT EXISTS (SELECT 1 FROM contractors WHERE email = 'abc@construction.co.za');

INSERT INTO contractors (user_id, company_name, email, phone, contact_person, status, operating_provinces, nhbrc_number, bee_level)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'admin@qilly.co.za'),
  'Eastern Cape Builders',
  'info@ecbuilders.co.za',
  '+27 43 555 1234',
  'Peter Mbeki',
  'approved',
  ARRAY['EC', 'KZN'],
  'NHBRC789012',
  'Level 2'
WHERE NOT EXISTS (SELECT 1 FROM contractors WHERE email = 'info@ecbuilders.co.za');

INSERT INTO contractors (user_id, company_name, email, phone, contact_person, status, operating_provinces, nhbrc_number, bee_level)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'admin@qilly.co.za'),
  'Northern Projects',
  'projects@northern.co.za',
  '+27 12 333 9999',
  'Lisa van der Merwe',
  'pending',
  ARRAY['LP', 'MP'],
  'NHBRC345678',
  'Level 3'
WHERE NOT EXISTS (SELECT 1 FROM contractors WHERE email = 'projects@northern.co.za');

-- =====================================================
-- SECTION 7: VERIFY (Run after Section 6)
-- =====================================================

SELECT 'Users count:' as check_type, COUNT(*) as count FROM users;
SELECT 'Suppliers count:' as check_type, COUNT(*) as count FROM suppliers;
SELECT 'Contractors count:' as check_type, COUNT(*) as count FROM contractors;

SELECT 'Admin user:' as info, email, role FROM users WHERE email = 'admin@qilly.co.za';

SELECT 'Sample suppliers:' as info, company_name, status FROM suppliers ORDER BY created_at DESC LIMIT 3;
SELECT 'Sample contractors:' as info, company_name, status FROM contractors ORDER BY created_at DESC LIMIT 3;
