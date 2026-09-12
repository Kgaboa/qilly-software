-- ============================================
-- SIMPLE FIX: Disable RLS for Development
-- ============================================
-- This is the EASIEST solution for development environments
-- Run this in Supabase SQL Editor

-- Disable RLS on suppliers table
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;

-- Disable RLS on supplier_products table
ALTER TABLE supplier_products DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Verification
-- ============================================
-- Check if RLS is disabled (should return 'f' for both)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('suppliers', 'supplier_products');

-- ============================================
-- SUCCESS!
-- ============================================
-- After running this:
-- 1. RLS is disabled on both tables
-- 2. Supplier sync will work without authentication
-- 3. Perfect for development/testing
-- 
-- IMPORTANT: For production, re-enable RLS with proper policies!
-- ============================================
