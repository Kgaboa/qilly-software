-- =====================================================
-- COPY ALL OF THIS AND PASTE IN SIT SUPABASE
-- =====================================================
-- 1. Go to: https://app.supabase.com
-- 2. Select project: kcptusoevqapcvptlgkd (SIT)
-- 3. Click: SQL Editor → New Query
-- 4. Paste this entire file
-- 5. Click: RUN
-- =====================================================

BEGIN;

-- Step 1: Enable RLS on tables
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies (clean slate)
DROP POLICY IF EXISTS "Users can view own contractor data" ON contractors;
DROP POLICY IF EXISTS "Users can insert own contractor data" ON contractors;
DROP POLICY IF EXISTS "Users can update own contractor data" ON contractors;
DROP POLICY IF EXISTS "Admins can view all contractors" ON contractors;
DROP POLICY IF EXISTS "Public read access for approved contractors" ON contractors;

DROP POLICY IF EXISTS "Users can view own supplier data" ON suppliers;
DROP POLICY IF EXISTS "Users can insert own supplier data" ON suppliers;
DROP POLICY IF EXISTS "Users can update own supplier data" ON suppliers;
DROP POLICY IF EXISTS "Admins can view all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Public read access for approved suppliers" ON suppliers;

-- Step 3: Create RLS policies for contractors
CREATE POLICY "Users can view own contractor data"
ON contractors FOR SELECT TO authenticated
USING (
  user_id = auth.uid() 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can insert own contractor data"
ON contractors FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can update own contractor data"
ON contractors FOR UPDATE TO authenticated
USING (
  user_id = auth.uid() 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Admins can view all contractors"
ON contractors FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Step 4: Create RLS policies for suppliers
CREATE POLICY "Users can view own supplier data"
ON suppliers FOR SELECT TO authenticated
USING (
  user_id = auth.uid() 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can insert own supplier data"
ON suppliers FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can update own supplier data"
ON suppliers FOR UPDATE TO authenticated
USING (
  user_id = auth.uid() 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Admins can view all suppliers"
ON suppliers FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Step 5: Create users in users table from auth.users
INSERT INTO users (id, email, role, created_at)
SELECT 
  id,
  email,
  CASE 
    WHEN email = 'admin@qilly.co.za' THEN 'admin'
    WHEN email = 'builders@gmail.com' THEN 'contractor'
    ELSE 'contractor'
  END as role,
  NOW()
FROM auth.users
WHERE email IN ('admin@qilly.co.za', 'builders@gmail.com', '7dd06dfd-368e-453e-9101-7a4cffae22a6')
   OR id = '7dd06dfd-368e-453e-9101-7a4cffae22a6'
ON CONFLICT (id) DO UPDATE SET 
  role = EXCLUDED.role,
  email = EXCLUDED.email;

-- Step 6: Create user for the current logged in user (ID from error log)
INSERT INTO users (id, email, role, created_at)
SELECT 
  '7dd06dfd-368e-453e-9101-7a4cffae22a6'::uuid,
  COALESCE(
    (SELECT email FROM auth.users WHERE id = '7dd06dfd-368e-453e-9101-7a4cffae22a6'),
    'builders@gmail.com'
  ),
  'contractor',
  NOW()
ON CONFLICT (id) DO UPDATE SET 
  email = COALESCE(users.email, EXCLUDED.email),
  role = 'contractor';

-- Step 7: Create contractor for this user
INSERT INTO contractors (
  user_id, 
  email, 
  company_name, 
  contact_person, 
  phone, 
  province, 
  municipality, 
  cidb_grading, 
  status, 
  created_at
)
VALUES (
  '7dd06dfd-368e-453e-9101-7a4cffae22a6'::uuid,
  'builders@gmail.com',
  'Builders Company',
  'John Builder',
  '0821234567',
  'GP',
  'City of Johannesburg',
  'GB4',
  'approved',
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  status = 'approved';

-- Step 8: Create supplier for this user
INSERT INTO suppliers (
  user_id, 
  email, 
  company_name, 
  contact_person, 
  phone, 
  province, 
  materials_supplied, 
  status, 
  created_at
)
VALUES (
  '7dd06dfd-368e-453e-9101-7a4cffae22a6'::uuid,
  'builders@gmail.com',
  'Builders Supply Co',
  'John Builder',
  '0821234567',
  'GP',
  ARRAY['Cement', 'Sand', 'Aggregate'],
  'approved',
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  status = 'approved';

-- Step 9: Add test data (more contractors and suppliers)
INSERT INTO contractors (user_id, email, company_name, contact_person, phone, province, municipality, cidb_grading, status, created_at)
SELECT 
  '7dd06dfd-368e-453e-9101-7a4cffae22a6'::uuid,
  'contractor' || n || '@example.com',
  'Test Contractor ' || n,
  'Person ' || n,
  '082123456' || n,
  CASE n % 5
    WHEN 0 THEN 'GP'
    WHEN 1 THEN 'WC'
    WHEN 2 THEN 'KZN'
    WHEN 3 THEN 'EC'
    ELSE 'MP'
  END,
  'Test Municipality',
  'GB' || ((n % 5) + 3),
  CASE n % 3
    WHEN 0 THEN 'approved'
    WHEN 1 THEN 'pending'
    ELSE 'rejected'
  END,
  NOW()
FROM generate_series(1, 10) n
ON CONFLICT (email) DO NOTHING;

INSERT INTO suppliers (user_id, email, company_name, contact_person, phone, province, materials_supplied, status, created_at)
SELECT 
  '7dd06dfd-368e-453e-9101-7a4cffae22a6'::uuid,
  'supplier' || n || '@example.com',
  'Test Supplier ' || n,
  'Supplier Person ' || n,
  '083123456' || n,
  CASE n % 5
    WHEN 0 THEN 'GP'
    WHEN 1 THEN 'WC'
    WHEN 2 THEN 'KZN'
    WHEN 3 THEN 'EC'
    ELSE 'MP'
  END,
  ARRAY['Cement', 'Sand'],
  CASE n % 3
    WHEN 0 THEN 'approved'
    WHEN 1 THEN 'pending'
    ELSE 'rejected'
  END,
  NOW()
FROM generate_series(1, 10) n
ON CONFLICT (email) DO NOTHING;

COMMIT;

-- Show results
SELECT '✅ SETUP COMPLETE!' as status;

SELECT 
  'Users in users table' as check,
  COUNT(*) as count
FROM users
UNION ALL
SELECT 
  'Contractors in database',
  COUNT(*)
FROM contractors
UNION ALL
SELECT 
  'Suppliers in database',
  COUNT(*)
FROM suppliers
UNION ALL
SELECT 
  'RLS Policies created',
  COUNT(*)
FROM pg_policies
WHERE tablename IN ('contractors', 'suppliers');

-- Show the specific user
SELECT 
  '👤 YOUR USER' as info,
  u.email,
  u.role,
  (SELECT COUNT(*) FROM contractors WHERE user_id = u.id) as contractor_profiles,
  (SELECT COUNT(*) FROM suppliers WHERE user_id = u.id) as supplier_profiles
FROM users u
WHERE u.id = '7dd06dfd-368e-453e-9101-7a4cffae22a6';
