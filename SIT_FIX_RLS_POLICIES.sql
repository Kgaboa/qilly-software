-- ============================================
-- FIX RLS POLICIES FOR CONTRACTOR SIGNUP
-- ============================================
-- Run this if you get "row-level security policy" errors during signup
-- https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql
-- ============================================

-- 1. Check current policies on contractors table
SELECT 
  '📋 Current Policies' as info,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'contractors';

-- 2. Drop and recreate the INSERT policy to ensure it works
-- This allows anonymous users (not logged in) to insert contractors
DROP POLICY IF EXISTS "Allow public to insert contractors" ON contractors;
DROP POLICY IF EXISTS "Allow anon to insert contractors" ON contractors;
DROP POLICY IF EXISTS "Enable insert for anon users" ON contractors;

CREATE POLICY "Allow anon to insert contractors"
ON contractors
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. Drop and recreate the SELECT policy for users to view their own profile
DROP POLICY IF EXISTS "Allow users to view own contractor profile" ON contractors;
DROP POLICY IF EXISTS "Users can view own profile" ON contractors;

CREATE POLICY "Users can view own profile"
ON contractors
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4. Drop and recreate admin policy to view all contractors
DROP POLICY IF EXISTS "Allow admins to view all contractors" ON contractors;
DROP POLICY IF EXISTS "Admins can view all contractors" ON contractors;

CREATE POLICY "Admins can view all contractors"
ON contractors
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.subscription_tier IN ('ADMIN', 'SUPERADMIN')
  )
);

-- 5. Ensure RLS is enabled on contractors table
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- 6. Also check users table policies
-- Users table needs to allow inserts during signup
DROP POLICY IF EXISTS "Allow public user creation" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

CREATE POLICY "Users can insert own profile"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 7. Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
  '✅ Policies Updated' as status,
  COUNT(*) as total_policies,
  COUNT(CASE WHEN cmd = 'INSERT' THEN 1 END) as insert_policies,
  COUNT(CASE WHEN cmd = 'SELECT' THEN 1 END) as select_policies
FROM pg_policies
WHERE tablename IN ('contractors', 'users');

SELECT 
  '📊 Tables with RLS' as info,
  relname as table_name,
  CASE 
    WHEN relrowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status
FROM pg_class
WHERE relname IN ('contractors', 'users');

-- ============================================
-- AFTER RUNNING THIS:
-- ============================================
-- 1. Clear browser cache (Ctrl+Shift+R)
-- 2. Try contractor signup again
-- 3. Should work now!
-- ============================================
