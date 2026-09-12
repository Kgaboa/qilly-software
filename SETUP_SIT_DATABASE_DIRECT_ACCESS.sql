-- ============================================================================
-- SIT DATABASE SETUP - DIRECT SUPABASE CLIENT ACCESS
-- ============================================================================
-- Run this in SIT Supabase SQL Editor: 
-- https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql
--
-- This sets up SIT to work exactly like DEV (no edge functions needed)
-- ============================================================================

-- ============================================================================
-- 1. ENABLE EMAIL CONFIRMATIONS (OPTIONAL - For Production-like Testing)
-- ============================================================================
-- Uncomment if you want to test email confirmations in SIT
-- Otherwise, auto-confirm is enabled (like DEV)

-- ============================================================================
-- 2. CREATE USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'contractor' CHECK (role IN ('contractor', 'supplier', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'professional', 'enterprise')),
  trial_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- POPIA Compliance fields
  popia_consent_given BOOLEAN DEFAULT FALSE,
  popia_consent_date TIMESTAMP WITH TIME ZONE,
  popia_consent_version TEXT DEFAULT '1.0',
  data_processing_consent BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own data (for signup)
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 3. CREATE CONTRACTORS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  cidb_registration_number TEXT,
  cidb_grade TEXT,
  vat_number TEXT,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  physical_address TEXT,
  province TEXT,
  operating_provinces TEXT[],
  annual_turnover NUMERIC,
  bbbee_level TEXT,
  bbbee_certificate_url TEXT,
  approved BOOLEAN DEFAULT FALSE,
  approval_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;

-- Contractors can view their own profile
CREATE POLICY "Contractors can view own profile" ON public.contractors
  FOR SELECT USING (auth.uid() = user_id);

-- Contractors can update their own profile
CREATE POLICY "Contractors can update own profile" ON public.contractors
  FOR UPDATE USING (auth.uid() = user_id);

-- Contractors can insert their own profile
CREATE POLICY "Contractors can insert own profile" ON public.contractors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all contractors
CREATE POLICY "Admins can view all contractors" ON public.contractors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 4. CREATE SUPPLIERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  vat_number TEXT,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  physical_address TEXT,
  province TEXT,
  delivery_provinces TEXT[],
  categories TEXT[],
  bbbee_level TEXT,
  api_enabled BOOLEAN DEFAULT FALSE,
  api_key TEXT,
  catalog_url TEXT,
  approved BOOLEAN DEFAULT FALSE,
  approval_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Suppliers can view their own profile
CREATE POLICY "Suppliers can view own profile" ON public.suppliers
  FOR SELECT USING (auth.uid() = user_id);

-- Suppliers can update their own profile
CREATE POLICY "Suppliers can update own profile" ON public.suppliers
  FOR UPDATE USING (auth.uid() = user_id);

-- Suppliers can insert their own profile
CREATE POLICY "Suppliers can insert own profile" ON public.suppliers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Everyone can view approved suppliers (for contractor searches)
CREATE POLICY "Anyone can view approved suppliers" ON public.suppliers
  FOR SELECT USING (approved = TRUE);

-- Admins can view all suppliers
CREATE POLICY "Admins can manage all suppliers" ON public.suppliers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 5. CREATE PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  unit TEXT,
  base_price NUMERIC NOT NULL,
  province TEXT,
  stock_status TEXT DEFAULT 'in_stock',
  lead_time_days INTEGER,
  minimum_order_quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone can view products from approved suppliers
CREATE POLICY "Anyone can view products from approved suppliers" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE id = supplier_id AND approved = TRUE
    )
  );

-- Suppliers can manage their own products
CREATE POLICY "Suppliers can manage own products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE id = supplier_id AND user_id = auth.uid()
    )
  );

-- Admins can manage all products
CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 6. CREATE BILLS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES public.contractors(id) ON DELETE SET NULL,
  project_name TEXT,
  project_settings JSONB,
  items JSONB NOT NULL,
  overall_total NUMERIC,
  status TEXT DEFAULT 'processed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- Users can view their own bills
CREATE POLICY "Users can view own bills" ON public.bills
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create bills
CREATE POLICY "Users can create bills" ON public.bills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own bills
CREATE POLICY "Users can update own bills" ON public.bills
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all bills
CREATE POLICY "Admins can view all bills" ON public.bills
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 7. CREATE SUPPLIER BRANCHES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.supplier_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  coordinates POINT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.supplier_branches ENABLE ROW LEVEL SECURITY;

-- Everyone can view branches of approved suppliers
CREATE POLICY "Anyone can view branches of approved suppliers" ON public.supplier_branches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE id = supplier_id AND approved = TRUE
    )
  );

-- Suppliers can manage their own branches
CREATE POLICY "Suppliers can manage own branches" ON public.supplier_branches
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE id = supplier_id AND user_id = auth.uid()
    )
  );

-- ============================================================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_contractors_user_id ON public.contractors(user_id);
CREATE INDEX IF NOT EXISTS idx_contractors_approved ON public.contractors(approved);
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_approved ON public.suppliers(approved);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_province ON public.products(province);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON public.bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_contractor_id ON public.bills(contractor_id);
CREATE INDEX IF NOT EXISTS idx_supplier_branches_supplier_id ON public.supplier_branches(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_branches_province ON public.supplier_branches(province);

-- ============================================================================
-- 9. CREATE UPDATED_AT TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON public.contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON public.bills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_branches_updated_at BEFORE UPDATE ON public.supplier_branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. CREATE ADMIN USER (admin@qilly.co.za / QillyAdmin2026!)
-- ============================================================================
-- NOTE: Run this separately in Supabase Auth section or via signup flow
-- This is just a placeholder for documentation

-- ============================================================================
-- 11. SEED DEMO DATA (OPTIONAL)
-- ============================================================================
-- Insert demo supplier (for testing)
DO $$
DECLARE
  demo_supplier_id UUID;
BEGIN
  -- Only insert if no suppliers exist
  IF NOT EXISTS (SELECT 1 FROM public.suppliers) THEN
    -- Insert demo supplier (will need a real user_id from auth.users)
    -- This is a placeholder - you'll need to create a supplier user first
    INSERT INTO public.suppliers (
      id,
      company_name,
      email,
      phone,
      province,
      delivery_provinces,
      categories,
      approved
    ) VALUES (
      gen_random_uuid(),
      'Demo Building Supplies',
      'demo@supplier.com',
      '+27 11 123 4567',
      'GP',
      ARRAY['GP', 'WC', 'KZN'],
      ARRAY['Cement', 'Bricks', 'Sand', 'Steel'],
      TRUE
    ) RETURNING id INTO demo_supplier_id;
    
    -- Insert demo products
    INSERT INTO public.products (supplier_id, name, category, unit, base_price, province, stock_status) VALUES
      (demo_supplier_id, 'Cement 50kg', 'Cement', 'bag', 89.99, 'GP', 'in_stock'),
      (demo_supplier_id, 'Clay Brick', 'Bricks', 'unit', 2.50, 'GP', 'in_stock'),
      (demo_supplier_id, 'Building Sand', 'Sand', 'm3', 450.00, 'GP', 'in_stock'),
      (demo_supplier_id, 'Steel Rod 12mm', 'Steel', 'm', 75.00, 'GP', 'in_stock');
    
    RAISE NOTICE 'Demo supplier and products created successfully!';
  ELSE
    RAISE NOTICE 'Suppliers already exist - skipping demo data insertion';
  END IF;
END $$;

-- ============================================================================
-- 12. VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify setup

-- Check tables exist
SELECT 
  'users' as table_name, 
  COUNT(*) as row_count 
FROM public.users
UNION ALL
SELECT 'contractors', COUNT(*) FROM public.contractors
UNION ALL
SELECT 'suppliers', COUNT(*) FROM public.suppliers
UNION ALL
SELECT 'products', COUNT(*) FROM public.products
UNION ALL
SELECT 'bills', COUNT(*) FROM public.bills
UNION ALL
SELECT 'supplier_branches', COUNT(*) FROM public.supplier_branches;

-- Check RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'contractors', 'suppliers', 'products', 'bills', 'supplier_branches')
ORDER BY tablename;

-- Check policies exist
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
SELECT '✅ SIT Database setup complete! You can now use direct Supabase client access.' AS status;
