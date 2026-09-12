-- =====================================================
-- FIX EXISTING TABLES - Add missing columns
-- =====================================================

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 1: Add missing columns to suppliers table
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
-- PART 2: Add missing columns to contractors table
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
-- PART 3: Now add test data
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
-- PART 4: Verify
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT '✅ SUPPLIERS' as status, COUNT(*) as count FROM suppliers;
SELECT '✅ CONTRACTORS' as status, COUNT(*) as count FROM contractors;

SELECT 'Sample Suppliers:' as info;
SELECT company_name, email, status, bee_level FROM suppliers LIMIT 5;

SELECT 'Sample Contractors:' as info;
SELECT company_name, email, status, bee_level, nhbrc_number FROM contractors LIMIT 5;
