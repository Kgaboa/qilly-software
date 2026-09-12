-- ============================================
-- FIX: Row-Level Security Policy for Suppliers
-- ============================================
-- This script fixes the RLS issue that blocks supplier sync
-- Run this in Supabase SQL Editor

-- OPTION 1: Allow all operations for authenticated users (RECOMMENDED FOR DEVELOPMENT)
-- This allows admins to sync supplier data

-- Drop existing restrictive policy if it exists
DROP POLICY IF EXISTS "Anyone can view active suppliers" ON suppliers;

-- Create comprehensive policies for authenticated users
CREATE POLICY "Authenticated users can read suppliers" 
  ON suppliers FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert suppliers" 
  ON suppliers FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update suppliers" 
  ON suppliers FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete suppliers" 
  ON suppliers FOR DELETE 
  TO authenticated 
  USING (true);

-- Also fix supplier_products table
DROP POLICY IF EXISTS "Anyone can view available products" ON supplier_products;

CREATE POLICY "Authenticated users can read products" 
  ON supplier_products FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can insert products" 
  ON supplier_products FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
  ON supplier_products FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products" 
  ON supplier_products FOR DELETE 
  TO authenticated 
  USING (true);

-- ============================================
-- OPTION 2: Disable RLS Entirely (SIMPLER FOR DEVELOPMENT)
-- ============================================
-- Uncomment these lines if you want to disable RLS completely
-- WARNING: Only use this in development environments!

-- ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE supplier_products DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Verification Query
-- ============================================
-- Run this to check your policies:

-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('suppliers', 'supplier_products')
-- ORDER BY tablename, policyname;
