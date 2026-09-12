-- ============================================
-- QILLY SUPABASE SETUP - FIXED VERSION
-- ============================================
-- This script safely creates only the missing tables
-- and handles existing tables without errors.
--
-- Tables to be created/verified:
-- ✅ users - User accounts and profiles
-- ✅ bills - BOQ projects and bills  
-- ✅ bill_items - Line items in bills
-- ✅ suppliers - Supplier directory (NEW)
-- ✅ supplier_products - Product catalog (NEW)
-- ✅ subscriptions - Payment and subscription tracking
--
-- Next steps after running:
-- 1. Return to Qilly Admin Dashboard
-- 2. Click "Check Setup Status" to verify all tables
-- 3. Test the Supplier API tab
-- 4. Test the Pay Gateway tab
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: USERS (SAFE - SKIP IF EXISTS)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trial_bills_remaining INTEGER DEFAULT 3,
  is_premium BOOLEAN DEFAULT FALSE,
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  full_name TEXT,
  company_name TEXT,
  phone TEXT
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view own data'
  ) THEN
    CREATE POLICY "Users can view own data" ON users
      FOR SELECT USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data" ON users
      FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- ============================================
-- TABLE 2: BILLS (SAFE - SKIP IF EXISTS)
-- ============================================
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  bill_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'draft',
  total_cost DECIMAL(12, 2),
  currency TEXT DEFAULT 'ZAR',
  notes TEXT,
  uploaded_via TEXT DEFAULT 'manual'
);

-- Enable Row Level Security
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bills' AND policyname = 'Users can view own bills'
  ) THEN
    CREATE POLICY "Users can view own bills" ON bills
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bills' AND policyname = 'Users can insert own bills'
  ) THEN
    CREATE POLICY "Users can insert own bills" ON bills
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bills' AND policyname = 'Users can update own bills'
  ) THEN
    CREATE POLICY "Users can update own bills" ON bills
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bills' AND policyname = 'Users can delete own bills'
  ) THEN
    CREATE POLICY "Users can delete own bills" ON bills
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_created_at ON bills(created_at DESC);

-- ============================================
-- TABLE 3: BILL_ITEMS (SAFE - SKIP IF EXISTS)
-- ============================================
CREATE TABLE IF NOT EXISTS bill_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  item_number TEXT,
  description TEXT NOT NULL,
  unit TEXT NOT NULL,
  quantity DECIMAL(12, 3) NOT NULL,
  unit_price DECIMAL(12, 2),
  total_price DECIMAL(12, 2),
  supplier_name TEXT,
  supplier_id TEXT,
  category TEXT,
  notes TEXT,
  formula TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bill_items' AND policyname = 'Users can view own bill items'
  ) THEN
    CREATE POLICY "Users can view own bill items" ON bill_items
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM bills 
          WHERE bills.id = bill_items.bill_id 
          AND bills.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bill_items' AND policyname = 'Users can insert own bill items'
  ) THEN
    CREATE POLICY "Users can insert own bill items" ON bill_items
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM bills 
          WHERE bills.id = bill_items.bill_id 
          AND bills.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bill_items' AND policyname = 'Users can update own bill items'
  ) THEN
    CREATE POLICY "Users can update own bill items" ON bill_items
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM bills 
          WHERE bills.id = bill_items.bill_id 
          AND bills.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bill_items' AND policyname = 'Users can delete own bill items'
  ) THEN
    CREATE POLICY "Users can delete own bill items" ON bill_items
      FOR DELETE USING (
        EXISTS (
          SELECT 1 FROM bills 
          WHERE bills.id = bill_items.bill_id 
          AND bills.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_bill_items_bill_id ON bill_items(bill_id);

-- ============================================
-- TABLE 4: SUPPLIERS (NEW - CRITICAL FOR SUPPLIER API)
-- ============================================
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  logo_url TEXT,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Drop old restrictive policy if it exists
  DROP POLICY IF EXISTS "Anyone can view active suppliers" ON suppliers;
  
  -- Create comprehensive policies for authenticated users
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Authenticated users can read suppliers'
  ) THEN
    CREATE POLICY "Authenticated users can read suppliers" 
      ON suppliers FOR SELECT 
      TO authenticated 
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Authenticated users can insert suppliers'
  ) THEN
    CREATE POLICY "Authenticated users can insert suppliers" 
      ON suppliers FOR INSERT 
      TO authenticated 
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Authenticated users can update suppliers'
  ) THEN
    CREATE POLICY "Authenticated users can update suppliers" 
      ON suppliers FOR UPDATE 
      TO authenticated 
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Authenticated users can delete suppliers'
  ) THEN
    CREATE POLICY "Authenticated users can delete suppliers" 
      ON suppliers FOR DELETE 
      TO authenticated 
      USING (true);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_suppliers_category ON suppliers(category);
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON suppliers(is_active);

-- ============================================
-- TABLE 5: SUPPLIER_PRODUCTS (NEW - CRITICAL FOR SUPPLIER API)
-- ============================================
CREATE TABLE IF NOT EXISTS supplier_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  product_code TEXT,
  description TEXT NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  category TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(supplier_id, product_code)
);

-- Enable Row Level Security
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Drop old restrictive policy if it exists
  DROP POLICY IF EXISTS "Anyone can view available products" ON supplier_products;
  
  -- Create comprehensive policies for authenticated users
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'supplier_products' AND policyname = 'Authenticated users can read products'
  ) THEN
    CREATE POLICY "Authenticated users can read products" 
      ON supplier_products FOR SELECT 
      TO authenticated 
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'supplier_products' AND policyname = 'Authenticated users can insert products'
  ) THEN
    CREATE POLICY "Authenticated users can insert products" 
      ON supplier_products FOR INSERT 
      TO authenticated 
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'supplier_products' AND policyname = 'Authenticated users can update products'
  ) THEN
    CREATE POLICY "Authenticated users can update products" 
      ON supplier_products FOR UPDATE 
      TO authenticated 
      USING (true)
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'supplier_products' AND policyname = 'Authenticated users can delete products'
  ) THEN
    CREATE POLICY "Authenticated users can delete products" 
      ON supplier_products FOR DELETE 
      TO authenticated 
      USING (true);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier_id ON supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_category ON supplier_products(category);

-- ============================================
-- TABLE 6: SUBSCRIPTIONS (SAFE - SKIP IF EXISTS)
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  payment_reference TEXT,
  amount_paid DECIMAL(12, 2),
  currency TEXT DEFAULT 'ZAR',
  auto_renew BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can view own subscriptions'
  ) THEN
    CREATE POLICY "Users can view own subscriptions" ON subscriptions
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can insert own subscriptions'
  ) THEN
    CREATE POLICY "Users can insert own subscriptions" ON subscriptions
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can update own subscriptions'
  ) THEN
    CREATE POLICY "Users can update own subscriptions" ON subscriptions
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);

-- ============================================
-- FUNCTIONS (SAFE - REPLACE IF EXISTS)
-- ============================================

-- Function: Decrement Trial Bills
CREATE OR REPLACE FUNCTION decrement_trial_bills(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  remaining INTEGER;
BEGIN
  UPDATE users 
  SET trial_bills_remaining = trial_bills_remaining - 1
  WHERE id = user_uuid
  AND trial_bills_remaining > 0
  RETURNING trial_bills_remaining INTO remaining;
  
  RETURN remaining;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check User Can Create Bill
CREATE OR REPLACE FUNCTION can_create_bill(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_premium BOOLEAN;
  trials_left INTEGER;
BEGIN
  SELECT users.is_premium, users.trial_bills_remaining
  INTO is_premium, trials_left
  FROM users
  WHERE id = user_uuid;
  
  RETURN (is_premium = TRUE) OR (trials_left > 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE DATA (SAFE - INSERT ONLY IF NOT EXISTS)
-- ============================================

-- Insert Sample Suppliers (with conflict handling)
INSERT INTO suppliers (name, category, website, is_active) VALUES
  ('Buco', 'building_materials', 'https://www.buco.co.za', TRUE),
  ('Builders Warehouse', 'building_materials', 'https://www.builders.co.za', TRUE),
  ('Macsteel', 'steel_metal', 'https://www.macsteel.co.za', TRUE),
  ('Lafarge', 'concrete_aggregates', 'https://www.lafarge.co.za', TRUE),
  ('PPC', 'concrete_aggregates', 'https://www.ppc.co.za', TRUE),
  ('Raumix', 'concrete_aggregates', 'https://www.raumix.co.za', TRUE)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- ✅ SETUP COMPLETE!
-- ============================================
-- All tables have been created or verified.
-- 
-- Next steps:
-- 1. Return to Qilly Admin Dashboard
-- 2. Click "Check Setup Status" - should show all 6 tables ✅
-- 3. Go to "Supplier API" tab - should now work without errors
-- 4. Go to "Pay Gateway" tab - test payment integrations
-- 5. Check "Database Inspector" - verify suppliers are populated
-- ============================================