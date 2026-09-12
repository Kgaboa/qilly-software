-- ==========================================
-- FIX: RLS Policy Errors for Users and Bills
-- ==========================================
-- This fixes the following errors:
-- 1. "new row violates row-level security policy for table 'users'"
-- 2. "insert or update on table 'bills' violates foreign key constraint 'bills_user_id_fkey'"
--
-- Run this in your Supabase SQL Editor
-- ==========================================

-- ==========================================
-- STEP 1: Drop existing problematic policies
-- ==========================================

-- Drop existing users table policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable read access for own user" ON users;
DROP POLICY IF EXISTS "Enable update for own user" ON users;

-- Drop existing bills table policies
DROP POLICY IF EXISTS "Users can view own bills" ON bills;
DROP POLICY IF EXISTS "Users can insert own bills" ON bills;
DROP POLICY IF EXISTS "Users can update own bills" ON bills;
DROP POLICY IF EXISTS "Users can delete own bills" ON bills;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON bills;
DROP POLICY IF EXISTS "Enable read access for own bills" ON bills;
DROP POLICY IF EXISTS "Enable update for own bills" ON bills;
DROP POLICY IF EXISTS "Enable delete for own bills" ON bills;

-- Drop existing project_settings policies
DROP POLICY IF EXISTS "Users can view own project settings" ON project_settings;
DROP POLICY IF EXISTS "Users can insert own project settings" ON project_settings;
DROP POLICY IF EXISTS "Users can update own project settings" ON project_settings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON project_settings;
DROP POLICY IF EXISTS "Enable read access for own settings" ON project_settings;
DROP POLICY IF EXISTS "Enable update for own settings" ON project_settings;

-- ==========================================
-- STEP 2: Ensure tables exist with correct structure
-- ==========================================

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  cidb_grade TEXT,
  contact_number TEXT,
  subscription_tier TEXT DEFAULT 'FREE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bills table if not exists
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  bill_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create project_settings table if not exists
CREATE TABLE IF NOT EXISTS project_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_type TEXT,
  house_type TEXT,
  num_units INTEGER,
  project_location TEXT,
  province TEXT,
  municipality TEXT,
  settings_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- STEP 3: Enable RLS on all tables
-- ==========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_settings ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- STEP 4: Create PERMISSIVE policies for USERS table
-- ==========================================

-- Allow authenticated users to INSERT their own user record
CREATE POLICY "Allow authenticated users to insert own record"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to SELECT their own data
CREATE POLICY "Allow users to view own data"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to UPDATE their own data
CREATE POLICY "Allow users to update own data"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ==========================================
-- STEP 5: Create PERMISSIVE policies for BILLS table
-- ==========================================

-- Allow authenticated users to INSERT their own bills
CREATE POLICY "Allow authenticated users to insert own bills"
ON bills
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to SELECT their own bills
CREATE POLICY "Allow users to view own bills"
ON bills
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to UPDATE their own bills
CREATE POLICY "Allow users to update own bills"
ON bills
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to DELETE their own bills
CREATE POLICY "Allow users to delete own bills"
ON bills
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ==========================================
-- STEP 6: Create PERMISSIVE policies for PROJECT_SETTINGS table
-- ==========================================

-- Allow authenticated users to INSERT their own settings
CREATE POLICY "Allow authenticated users to insert own settings"
ON project_settings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to SELECT their own settings
CREATE POLICY "Allow users to view own settings"
ON project_settings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to UPDATE their own settings
CREATE POLICY "Allow users to update own settings"
ON project_settings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to DELETE their own settings
CREATE POLICY "Allow users to delete own settings"
ON project_settings
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ==========================================
-- STEP 7: Create indexes for performance
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_project_settings_user_id ON project_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==========================================
-- STEP 8: Create updated_at trigger function
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_bills_updated_at ON bills;
DROP TRIGGER IF EXISTS update_project_settings_updated_at ON project_settings;

-- Create triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bills_updated_at
  BEFORE UPDATE ON bills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_settings_updated_at
  BEFORE UPDATE ON project_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- STEP 9: Grant necessary permissions
-- ==========================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON users TO authenticated;
GRANT ALL ON bills TO authenticated;
GRANT ALL ON project_settings TO authenticated;

-- ==========================================
-- VERIFICATION QUERY
-- ==========================================
-- Run this to verify policies are created:

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('users', 'bills', 'project_settings')
ORDER BY tablename, policyname;

-- ==========================================
-- SUCCESS MESSAGE
-- ==========================================
-- If you see policies listed above, the fix was successful!
-- Test by:
-- 1. Sign in to your app
-- 2. Try uploading a BOQ
-- 3. Check that no RLS errors appear
-- ==========================================
