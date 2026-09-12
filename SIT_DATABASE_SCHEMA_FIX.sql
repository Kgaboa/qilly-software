-- ================================================================
-- SIT DATABASE SCHEMA FIX
-- Run this in SIT Supabase SQL Editor
-- Project: kcptusoevqapcvptlgkd (SIT)
-- ================================================================

-- 1. ADD project_settings COLUMN TO bills TABLE
-- ================================================================
ALTER TABLE bills 
ADD COLUMN IF NOT EXISTS project_settings JSONB;

COMMENT ON COLUMN bills.project_settings IS 'Stores project configuration like province, municipality, CIDB grading, duration, etc.';

-- 2. VERIFY users TABLE EXISTS
-- ================================================================
-- Check if users table exists, create if missing
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  trial_used BOOLEAN DEFAULT false,
  paid_status BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'trial',
  boq_count INTEGER DEFAULT 0,
  is_operator BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);

-- 3. FIX RLS POLICIES FOR users TABLE
-- ================================================================
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- Allow authenticated users to insert their own record
CREATE POLICY "Enable insert for authenticated users" 
ON users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 4. FIX RLS POLICIES FOR bills TABLE
-- ================================================================
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own bills" ON bills;
DROP POLICY IF EXISTS "Users can insert own bills" ON bills;
DROP POLICY IF EXISTS "Users can update own bills" ON bills;
DROP POLICY IF EXISTS "Users can delete own bills" ON bills;

-- Enable RLS
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own bills
CREATE POLICY "Users can view own bills" 
ON bills FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own bills
CREATE POLICY "Users can insert own bills" 
ON bills FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own bills
CREATE POLICY "Users can update own bills" 
ON bills FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete their own bills
CREATE POLICY "Users can delete own bills" 
ON bills FOR DELETE 
USING (auth.uid() = user_id);

-- 5. FIX RLS POLICIES FOR bill_items TABLE
-- ================================================================
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own bill items" ON bill_items;
DROP POLICY IF EXISTS "Users can insert own bill items" ON bill_items;
DROP POLICY IF EXISTS "Users can update own bill items" ON bill_items;
DROP POLICY IF EXISTS "Users can delete own bill items" ON bill_items;

-- Enable RLS
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own bill items
CREATE POLICY "Users can view own bill items" 
ON bill_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM bills 
    WHERE bills.id = bill_items.bill_id 
    AND bills.user_id = auth.uid()
  )
);

-- Allow users to insert their own bill items
CREATE POLICY "Users can insert own bill items" 
ON bill_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM bills 
    WHERE bills.id = bill_items.bill_id 
    AND bills.user_id = auth.uid()
  )
);

-- Allow users to update their own bill items
CREATE POLICY "Users can update own bill items" 
ON bill_items FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM bills 
    WHERE bills.id = bill_items.bill_id 
    AND bills.user_id = auth.uid()
  )
);

-- Allow users to delete their own bill items
CREATE POLICY "Users can delete own bill items" 
ON bill_items FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM bills 
    WHERE bills.id = bill_items.bill_id 
    AND bills.user_id = auth.uid()
  )
);

-- 6. VERIFY TABLES EXIST
-- ================================================================
-- Check suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  province TEXT NOT NULL,
  category TEXT,
  api_enabled BOOLEAN DEFAULT false,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id TEXT REFERENCES suppliers(id),
  name TEXT NOT NULL,
  description TEXT,
  unit_price DECIMAL(10,2),
  unit TEXT,
  category TEXT,
  province TEXT,
  stock_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CREATE INDEXES FOR PERFORMANCE
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_created_at ON bills(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bill_items_bill_id ON bill_items(bill_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_province ON products(province);

-- 8. VERIFICATION QUERIES
-- ================================================================
-- Run these to verify the fix worked

-- Check bills table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bills' 
ORDER BY ordinal_position;

-- Check users table exists
SELECT COUNT(*) as user_count FROM users;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'bills', 'bill_items');

-- ================================================================
-- COMPLETION MESSAGE
-- ================================================================
SELECT 'SIT Database schema updated successfully! ✅' as status;
