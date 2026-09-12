-- ================================================================
-- SIT DATABASE SCHEMA FIX - VERSION 2
-- Run this in SIT Supabase SQL Editor
-- Project: kcptusoevqapcvptlgkd (SIT)
-- ================================================================
-- This version checks existing schema before making changes
-- ================================================================

-- 1. ADD project_settings COLUMN TO bills TABLE
-- ================================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'bills' 
    AND column_name = 'project_settings'
  ) THEN
    ALTER TABLE bills ADD COLUMN project_settings JSONB;
    RAISE NOTICE '✅ Added project_settings column to bills table';
  ELSE
    RAISE NOTICE '⏭️  project_settings column already exists';
  END IF;
END $$;

COMMENT ON COLUMN bills.project_settings IS 'Stores project configuration like province, municipality, CIDB grading, duration, etc.';

-- 2. VERIFY users TABLE EXISTS
-- ================================================================
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
-- Enable RLS first
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts (if they exist)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;

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
-- Enable RLS
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own bills" ON bills;
DROP POLICY IF EXISTS "Users can insert own bills" ON bills;
DROP POLICY IF EXISTS "Users can update own bills" ON bills;
DROP POLICY IF EXISTS "Users can delete own bills" ON bills;

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
-- Enable RLS
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own bill items" ON bill_items;
DROP POLICY IF EXISTS "Users can insert own bill items" ON bill_items;
DROP POLICY IF EXISTS "Users can update own bill items" ON bill_items;
DROP POLICY IF EXISTS "Users can delete own bill items" ON bill_items;

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

-- 6. SKIP suppliers AND products TABLES
-- ================================================================
-- These tables already exist with the correct schema
-- We don't need to modify them

-- 7. CREATE INDEXES FOR PERFORMANCE
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_created_at ON bills(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bill_items_bill_id ON bill_items(bill_id);

-- 8. VERIFICATION QUERIES
-- ================================================================
-- Check bills table columns
SELECT 
  '📋 Bills Table Columns' as info,
  column_name, 
  data_type,
  CASE WHEN column_name = 'project_settings' THEN '✅ NEW' ELSE '' END as status
FROM information_schema.columns 
WHERE table_name = 'bills' 
ORDER BY ordinal_position;

-- Check users table exists
SELECT 
  '👥 Users Table' as info,
  COUNT(*) as user_count,
  '✅ Table exists' as status
FROM users;

-- Check RLS is enabled
SELECT 
  '🔒 RLS Status' as info,
  tablename, 
  CASE WHEN rowsecurity THEN '✅ Enabled' ELSE '❌ Disabled' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'bills', 'bill_items')
ORDER BY tablename;

-- Check policies exist
SELECT 
  '🔐 RLS Policies' as info,
  tablename,
  policyname,
  '✅ Active' as status
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('users', 'bills', 'bill_items')
ORDER BY tablename, policyname;

-- ================================================================
-- COMPLETION MESSAGE
-- ================================================================
SELECT '✅ SIT Database schema updated successfully!' as status;
