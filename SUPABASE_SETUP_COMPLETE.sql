-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your Qilly database is now ready to use.
-- 
-- Tables Created:
-- ✅ users - User accounts and profiles
-- ✅ bills - BOQ projects and bills  
-- ✅ bill_items - Line items in bills
-- ✅ suppliers - Supplier directory
-- ✅ supplier_products - Product catalog
-- ✅ subscriptions - Payment and subscription tracking
--
-- Next steps:
-- 1. Return to Qilly Admin Dashboard
-- 2. Click "Check Setup Status" to verify all tables
-- 3. Enable Email authentication in Supabase Dashboard
-- 4. Configure redirect URLs in Authentication settings
-- 5. Test the Database Inspector in Admin Dashboard
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: USERS
-- ============================================
CREATE TABLE users (
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

-- Policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- TABLE 2: BILLS
-- ============================================
CREATE TABLE bills (
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

-- Policies
CREATE POLICY "Users can view own bills" ON bills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bills" ON bills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bills" ON bills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bills" ON bills
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_bills_user_id ON bills(user_id);
CREATE INDEX idx_bills_created_at ON bills(created_at DESC);

-- ============================================
-- TABLE 3: BILL_ITEMS
-- ============================================
CREATE TABLE bill_items (
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

-- Policies
CREATE POLICY "Users can view own bill items" ON bill_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bills 
      WHERE bills.id = bill_items.bill_id 
      AND bills.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own bill items" ON bill_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM bills 
      WHERE bills.id = bill_items.bill_id 
      AND bills.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own bill items" ON bill_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM bills 
      WHERE bills.id = bill_items.bill_id 
      AND bills.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own bill items" ON bill_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM bills 
      WHERE bills.id = bill_items.bill_id 
      AND bills.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_bill_items_bill_id ON bill_items(bill_id);

-- ============================================
-- TABLE 4: SUPPLIERS
-- ============================================
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- Unique constraint for upsert operations
  category TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Policies (Public read access for active suppliers)
CREATE POLICY "Anyone can view active suppliers" ON suppliers
  FOR SELECT USING (is_active = TRUE);

-- Indexes
CREATE INDEX idx_suppliers_category ON suppliers(category);
CREATE INDEX idx_suppliers_active ON suppliers(is_active);

-- ============================================
-- TABLE 5: SUPPLIER_PRODUCTS
-- ============================================
CREATE TABLE supplier_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  product_code TEXT,
  description TEXT NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  category TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(supplier_id, product_code) -- Unique constraint for upsert operations
);

-- Enable Row Level Security
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;

-- Policies (Public read access for available products)
CREATE POLICY "Anyone can view available products" ON supplier_products
  FOR SELECT USING (is_available = TRUE);

-- Indexes
CREATE INDEX idx_supplier_products_supplier_id ON supplier_products(supplier_id);
CREATE INDEX idx_supplier_products_category ON supplier_products(category);

-- ============================================
-- TABLE 6: SUBSCRIPTIONS
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL, -- 'trial', 'starter', 'professional', 'enterprise'
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'paused'
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT, -- 'manual', 'eft', 'card', 'paypal'
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

-- Policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expires_at ON subscriptions(expires_at);

-- ============================================
-- FUNCTIONS (Optional but recommended)
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
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert Sample Suppliers
INSERT INTO suppliers (name, category, website, is_active) VALUES
  ('Buco', 'building_materials', 'https://www.buco.co.za', TRUE),
  ('Builders Warehouse', 'building_materials', 'https://www.builders.co.za', TRUE),
  ('Macsteel', 'steel_metal', 'https://www.macsteel.co.za', TRUE),
  ('Lafarge', 'concrete_aggregates', 'https://www.lafarge.co.za', TRUE),
  ('PPC', 'concrete_aggregates', 'https://www.ppc.co.za', TRUE),
  ('Raumix', 'concrete_aggregates', 'https://www.raumix.co.za', TRUE);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these SEPARATELY after setup to verify everything is correct
-- (Do NOT run these as part of the initial setup script)

/*
-- Check all tables exist
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check row counts
SELECT 
  'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'bills', COUNT(*) FROM bills
UNION ALL
SELECT 'bill_items', COUNT(*) FROM bill_items
UNION ALL
SELECT 'suppliers', COUNT(*) FROM suppliers
UNION ALL
SELECT 'supplier_products', COUNT(*) FROM supplier_products
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions;

-- Check RLS is enabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
*/