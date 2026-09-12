-- =====================================================
-- QILLY COMPLETE DATABASE SETUP - DEVELOPMENT
-- Database: zzdzrlglivtpawtitvgu
-- Date: March 5, 2026
-- =====================================================

-- Step 1: Check if users table exists and what columns it has
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Step 2: Create or update users table with role column
-- First, let's see if the table exists
DO $$ 
BEGIN
  -- Check if role column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    -- Add role column if it doesn't exist
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
    
    -- Add constraint to ensure valid roles
    ALTER TABLE users 
    ADD CONSTRAINT users_role_check 
    CHECK (role IN ('admin', 'supplier', 'contractor', 'user'));
  END IF;
END $$;

-- If users table doesn't exist at all, create it
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'supplier', 'contractor', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 4: Create users table policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

CREATE POLICY "Users can view own data"
ON users FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admins can view all users"
ON users FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- Step 5: Create or update suppliers table
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

-- Step 6: Enable RLS on suppliers
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop old supplier policies
DROP POLICY IF EXISTS "Suppliers can view own data" ON suppliers;
DROP POLICY IF EXISTS "Admins can view all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Admins can update all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Allow supplier signups" ON suppliers;

-- Step 8: Create supplier policies
CREATE POLICY "Suppliers can view own data"
ON suppliers FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all suppliers"
ON suppliers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update all suppliers"
ON suppliers FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Suppliers can update own data"
ON suppliers FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Allow supplier signups"
ON suppliers FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Step 9: Create or update contractors table
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

-- Step 10: Enable RLS on contractors
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- Step 11: Drop old contractor policies
DROP POLICY IF EXISTS "Contractors can view own data" ON contractors;
DROP POLICY IF EXISTS "Admins can view all contractors" ON contractors;
DROP POLICY IF EXISTS "Admins can update all contractors" ON contractors;
DROP POLICY IF EXISTS "Allow contractor signups" ON contractors;

-- Step 12: Create contractor policies
CREATE POLICY "Contractors can view own data"
ON contractors FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all contractors"
ON contractors FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update all contractors"
ON contractors FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Contractors can update own data"
ON contractors FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Allow contractor signups"
ON contractors FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Step 13: Set admin user role
-- First get the auth user ID
DO $$
DECLARE
  admin_auth_id UUID;
BEGIN
  -- Find the auth.users ID for admin@qilly.co.za
  SELECT id INTO admin_auth_id 
  FROM auth.users 
  WHERE email = 'admin@qilly.co.za';
  
  IF admin_auth_id IS NOT NULL THEN
    -- Insert or update the admin user
    INSERT INTO users (id, email, role, created_at)
    VALUES (admin_auth_id, 'admin@qilly.co.za', 'admin', NOW())
    ON CONFLICT (id) 
    DO UPDATE SET role = 'admin', email = 'admin@qilly.co.za';
    
    RAISE NOTICE 'Admin user created/updated with ID: %', admin_auth_id;
  ELSE
    RAISE NOTICE 'Admin user not found in auth.users. Please create the user first in Supabase Authentication.';
  END IF;
END $$;

-- Step 14: Add sample test data (only if tables are empty)
DO $$
DECLARE
  admin_auth_id UUID;
  supplier_count INT;
  contractor_count INT;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_auth_id 
  FROM auth.users 
  WHERE email = 'admin@qilly.co.za';
  
  -- Check if suppliers table is empty
  SELECT COUNT(*) INTO supplier_count FROM suppliers;
  
  IF supplier_count = 0 AND admin_auth_id IS NOT NULL THEN
    -- Add test suppliers
    INSERT INTO suppliers (
      user_id, company_name, email, phone, contact_person, 
      status, operating_provinces, delivery_provinces, bee_level
    ) VALUES 
    (
      admin_auth_id, 
      'BuildMart Suppliers (Pty) Ltd', 
      'buildmart@example.com',
      '+27 11 234 5678',
      'John Smith',
      'approved',
      ARRAY['GP', 'WC', 'KZN'],
      ARRAY['GP', 'WC', 'KZN', 'EC', 'FS'],
      'Level 2'
    ),
    (
      admin_auth_id,
      'Cape Concrete & Aggregates',
      'info@capeconcrete.co.za',
      '+27 21 555 8888',
      'Mary Johnson',
      'approved',
      ARRAY['WC', 'NC'],
      ARRAY['WC', 'NC', 'EC'],
      'Level 3'
    ),
    (
      admin_auth_id,
      'Durban Steel Supplies',
      'sales@durbansteel.co.za',
      '+27 31 789 4567',
      'Thabo Ndlovu',
      'pending',
      ARRAY['KZN'],
      ARRAY['KZN', 'EC', 'FS'],
      'Level 4'
    );
    
    RAISE NOTICE 'Added 3 test suppliers';
  END IF;
  
  -- Check if contractors table is empty
  SELECT COUNT(*) INTO contractor_count FROM contractors;
  
  IF contractor_count = 0 AND admin_auth_id IS NOT NULL THEN
    -- Add test contractors
    INSERT INTO contractors (
      user_id, company_name, email, phone, contact_person,
      status, operating_provinces, nhbrc_number, bee_level
    ) VALUES 
    (
      admin_auth_id,
      'ABC Construction (Pty) Ltd',
      'abc@construction.co.za',
      '+27 11 987 6543',
      'Sarah Williams',
      'approved',
      ARRAY['GP', 'WC'],
      'NHBRC123456',
      'Level 1'
    ),
    (
      admin_auth_id,
      'Eastern Cape Builders',
      'info@ecbuilders.co.za',
      '+27 43 555 1234',
      'Peter Mbeki',
      'approved',
      ARRAY['EC', 'KZN'],
      'NHBRC789012',
      'Level 2'
    ),
    (
      admin_auth_id,
      'Northern Projects',
      'projects@northern.co.za',
      '+27 12 333 9999',
      'Lisa van der Merwe',
      'pending',
      ARRAY['LP', 'MP'],
      'NHBRC345678',
      'Level 3'
    );
    
    RAISE NOTICE 'Added 3 test contractors';
  END IF;
END $$;

-- Step 15: Verify everything is set up correctly
SELECT '=== VERIFICATION RESULTS ===' as status;

SELECT 'Users Table:' as check_name, COUNT(*) as count FROM users;
SELECT 'Suppliers Table:' as check_name, COUNT(*) as count FROM suppliers;
SELECT 'Contractors Table:' as check_name, COUNT(*) as count FROM contractors;

SELECT 'Admin User:' as check_name, email, role 
FROM users 
WHERE email = 'admin@qilly.co.za';

SELECT 'Supplier Policies:' as check_name, COUNT(*) as count 
FROM pg_policies 
WHERE tablename = 'suppliers';

SELECT 'Contractor Policies:' as check_name, COUNT(*) as count 
FROM pg_policies 
WHERE tablename = 'contractors';

-- Show sample data
SELECT 'Sample Suppliers:' as data_type;
SELECT company_name, email, status FROM suppliers LIMIT 3;

SELECT 'Sample Contractors:' as data_type;
SELECT company_name, email, status FROM contractors LIMIT 3;
