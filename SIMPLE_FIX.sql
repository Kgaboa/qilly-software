-- =====================================================
-- SIMPLE FIX - Copy and paste this entire script
-- =====================================================

-- 1. Create users table with role column
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert admin user
INSERT INTO users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users 
WHERE email = 'admin@qilly.co.za'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 3. Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  company_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  contact_person TEXT,
  status TEXT DEFAULT 'pending',
  operating_provinces TEXT[],
  delivery_provinces TEXT[],
  bee_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create contractors table
CREATE TABLE IF NOT EXISTS contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  company_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  contact_person TEXT,
  status TEXT DEFAULT 'pending',
  operating_provinces TEXT[],
  nhbrc_number TEXT,
  bee_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- 6. Drop old policies if they exist
DROP POLICY IF EXISTS "Admins can view all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Admins can view all contractors" ON contractors;

-- 7. Create admin policies
CREATE POLICY "Admins can view all suppliers"
ON suppliers FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

CREATE POLICY "Admins can view all contractors"
ON contractors FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- 8. Add test data
INSERT INTO suppliers (user_id, company_name, email, phone, contact_person, status, operating_provinces, delivery_provinces, bee_level)
SELECT 
  id, 'BuildMart Suppliers (Pty) Ltd', 'buildmart@example.com', '+27 11 234 5678', 'John Smith', 
  'approved', ARRAY['GP','WC','KZN'], ARRAY['GP','WC','KZN','EC'], 'Level 2'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM suppliers WHERE email = 'buildmart@example.com');

INSERT INTO suppliers (user_id, company_name, email, phone, contact_person, status, operating_provinces, delivery_provinces, bee_level)
SELECT 
  id, 'Cape Concrete & Aggregates', 'info@capeconcrete.co.za', '+27 21 555 8888', 'Mary Johnson',
  'approved', ARRAY['WC','NC'], ARRAY['WC','NC','EC'], 'Level 3'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM suppliers WHERE email = 'info@capeconcrete.co.za');

INSERT INTO suppliers (user_id, company_name, email, phone, contact_person, status, operating_provinces, delivery_provinces, bee_level)
SELECT 
  id, 'Durban Steel Supplies', 'sales@durbansteel.co.za', '+27 31 789 4567', 'Thabo Ndlovu',
  'pending', ARRAY['KZN'], ARRAY['KZN','EC','FS'], 'Level 4'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM suppliers WHERE email = 'sales@durbansteel.co.za');

INSERT INTO contractors (user_id, company_name, email, phone, contact_person, status, operating_provinces, nhbrc_number, bee_level)
SELECT 
  id, 'ABC Construction (Pty) Ltd', 'abc@construction.co.za', '+27 11 987 6543', 'Sarah Williams',
  'approved', ARRAY['GP','WC'], 'NHBRC123456', 'Level 1'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM contractors WHERE email = 'abc@construction.co.za');

INSERT INTO contractors (user_id, company_name, email, phone, contact_person, status, operating_provinces, nhbrc_number, bee_level)
SELECT 
  id, 'Eastern Cape Builders', 'info@ecbuilders.co.za', '+27 43 555 1234', 'Peter Mbeki',
  'approved', ARRAY['EC','KZN'], 'NHBRC789012', 'Level 2'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM contractors WHERE email = 'info@ecbuilders.co.za');

INSERT INTO contractors (user_id, company_name, email, phone, contact_person, status, operating_provinces, nhbrc_number, bee_level)
SELECT 
  id, 'Northern Projects', 'projects@northern.co.za', '+27 12 333 9999', 'Lisa van der Merwe',
  'pending', ARRAY['LP','MP'], 'NHBRC345678', 'Level 3'
FROM auth.users WHERE email = 'admin@qilly.co.za'
AND NOT EXISTS (SELECT 1 FROM contractors WHERE email = 'projects@northern.co.za');

-- 9. Verify
SELECT 'RESULTS:' as status;
SELECT COUNT(*) as users_count FROM users;
SELECT COUNT(*) as suppliers_count FROM suppliers;
SELECT COUNT(*) as contractors_count FROM contractors;
SELECT email, role FROM users WHERE email = 'admin@qilly.co.za';
