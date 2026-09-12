-- =====================================================
-- FIX ADMIN RLS PERMISSIONS FOR QILLY DEVELOPMENT DB
-- Database: zzdzrlglivtpawtitvgu
-- Purpose: Allow admin@qilly.co.za to view all suppliers and contractors
-- =====================================================

-- Step 1: Check if admin user exists and has correct role
-- Run this first to see the current state
SELECT 
  u.id,
  u.email,
  u.role,
  u.created_at
FROM users u
WHERE u.email = 'admin@qilly.co.za';

-- If admin user doesn't exist or doesn't have 'admin' role, run this:
-- (Get the user's auth.users ID from Supabase Auth dashboard first)

-- Step 2: Update admin user role (replace USER_ID with actual auth.users.id)
-- First, let's find the auth user ID:
SELECT 
  au.id as auth_user_id,
  au.email,
  au.created_at
FROM auth.users au
WHERE au.email = 'admin@qilly.co.za';

-- Once you have the auth_user_id, insert/update the users table:
-- INSERT INTO users (id, email, role, created_at)
-- VALUES ('AUTH_USER_ID_HERE', 'admin@qilly.co.za', 'admin', NOW())
-- ON CONFLICT (id) 
-- DO UPDATE SET role = 'admin';

-- Step 3: Check current RLS policies on suppliers table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('suppliers', 'contractors')
ORDER BY tablename, policyname;

-- Step 4: Drop existing restrictive policies (if they exist)
DROP POLICY IF EXISTS "Suppliers can view own data" ON suppliers;
DROP POLICY IF EXISTS "Users can view own supplier profile" ON suppliers;
DROP POLICY IF EXISTS "Contractors can view own data" ON contractors;
DROP POLICY IF EXISTS "Users can view own contractor profile" ON contractors;

-- Step 5: Create admin-friendly RLS policies

-- SUPPLIERS TABLE POLICIES
-- Allow admins to view all suppliers
CREATE POLICY "Admins can view all suppliers"
ON suppliers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow admins to update all suppliers
CREATE POLICY "Admins can update all suppliers"
ON suppliers
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow suppliers to view their own data
CREATE POLICY "Suppliers can view own data"
ON suppliers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow suppliers to update their own data
CREATE POLICY "Suppliers can update own data"
ON suppliers
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Allow new supplier signups (INSERT)
CREATE POLICY "Allow supplier signups"
ON suppliers
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- CONTRACTORS TABLE POLICIES
-- Allow admins to view all contractors
CREATE POLICY "Admins can view all contractors"
ON contractors
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow admins to update all contractors
CREATE POLICY "Admins can update all contractors"
ON contractors
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow contractors to view their own data
CREATE POLICY "Contractors can view own data"
ON contractors
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow contractors to update their own data
CREATE POLICY "Contractors can update own data"
ON contractors
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Allow new contractor signups (INSERT)
CREATE POLICY "Allow contractor signups"
ON contractors
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Step 6: Verify RLS is enabled
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- Step 7: Check if there's actually data in the tables
SELECT COUNT(*) as total_suppliers FROM suppliers;
SELECT COUNT(*) as total_contractors FROM contractors;

-- Step 8: Show sample data (if any exists)
SELECT 
  id,
  company_name,
  email,
  status,
  user_id,
  created_at
FROM suppliers
LIMIT 5;

SELECT 
  id,
  company_name,
  email,
  status,
  user_id,
  created_at
FROM contractors
LIMIT 5;

-- =====================================================
-- QUICK SUMMARY OF ACTIONS
-- =====================================================
-- 1. Find admin user's auth.users.id
-- 2. Insert/update users table with admin role
-- 3. Drop old restrictive policies
-- 4. Create new admin + user policies
-- 5. Verify data exists in tables
-- =====================================================
