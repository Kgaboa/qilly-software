-- ========================================
-- FIX ADMIN SUPPLIER VISIBILITY
-- ========================================
-- This fixes two critical issues:
-- 1. Missing columns (approved_at, delivery_provinces, etc.)
-- 2. Admin cannot see suppliers/contractors due to RLS policies
--
-- INSTRUCTIONS:
-- 1. Open Supabase SQL Editor
-- 2. Copy and paste this ENTIRE file
-- 3. Click "RUN" to execute
-- ========================================

-- ========================================
-- STEP 1: ADD ALL MISSING COLUMNS
-- ========================================

-- Approval/rejection timestamps
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS approved_by TEXT;

ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS rejected_by TEXT;

ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Additional contact fields
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS contact_email TEXT;

ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Company details
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS website TEXT;

ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Status fields
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Geographic coverage - THIS IS THE CRITICAL MISSING COLUMN
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS delivery_provinces TEXT[] DEFAULT '{}';

-- Additional address fields (street_address and city should already exist from FIX_DATABASE_NOW.sql)
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Same for contractors
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS approved_by TEXT;

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS rejected_by TEXT;

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS contact_email TEXT;

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS website TEXT;

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- ========================================
-- STEP 2: CREATE ADMIN CHECK FUNCTION
-- ========================================

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user's email is admin@qilly.co.za
  RETURN (
    SELECT email = 'admin@qilly.co.za'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STEP 3: ADD ADMIN RLS POLICIES
-- ========================================

-- Drop existing policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Admins can view all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Admins can update all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Admins can view all contractors" ON contractors;
DROP POLICY IF EXISTS "Admins can update all contractors" ON contractors;

-- Create new admin policies for suppliers
CREATE POLICY "Admins can view all suppliers" 
  ON suppliers 
  FOR SELECT 
  USING (is_admin());

CREATE POLICY "Admins can update all suppliers" 
  ON suppliers 
  FOR UPDATE 
  USING (is_admin());

-- Create new admin policies for contractors
CREATE POLICY "Admins can view all contractors" 
  ON contractors 
  FOR SELECT 
  USING (is_admin());

CREATE POLICY "Admins can update all contractors" 
  ON contractors 
  FOR UPDATE 
  USING (is_admin());

-- ========================================
-- STEP 4: SYNC DUPLICATE FIELDS
-- ========================================

-- Copy email/phone to contact_email/contact_phone if not set
UPDATE suppliers 
SET contact_email = email 
WHERE contact_email IS NULL;

UPDATE suppliers 
SET contact_phone = phone 
WHERE contact_phone IS NULL;

UPDATE contractors 
SET contact_email = email 
WHERE contact_email IS NULL;

UPDATE contractors 
SET contact_phone = phone 
WHERE contact_phone IS NULL;

-- ========================================
-- STEP 5: UPDATE EXISTING RECORDS
-- ========================================

-- Set approved_at for existing approved suppliers
UPDATE suppliers 
SET approved_at = COALESCE(updated_at, created_at)
WHERE status = 'approved' AND approved_at IS NULL;

-- Set rejected_at for existing rejected suppliers
UPDATE suppliers 
SET rejected_at = COALESCE(updated_at, created_at)
WHERE status = 'rejected' AND rejected_at IS NULL;

-- Set is_active based on status
UPDATE suppliers 
SET is_active = (status = 'approved')
WHERE is_active IS NULL;

-- Same for contractors
UPDATE contractors 
SET approved_at = COALESCE(updated_at, created_at)
WHERE status = 'approved' AND approved_at IS NULL;

UPDATE contractors 
SET rejected_at = COALESCE(updated_at, created_at)
WHERE status = 'rejected' AND rejected_at IS NULL;

UPDATE contractors 
SET is_active = (status = 'approved')
WHERE is_active IS NULL;

-- ========================================
-- STEP 6: CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_suppliers_approved_at 
ON suppliers(approved_at) WHERE approved_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_suppliers_rejected_at 
ON suppliers(rejected_at) WHERE rejected_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_suppliers_is_active 
ON suppliers(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_suppliers_delivery_provinces 
ON suppliers USING GIN(delivery_provinces);

CREATE INDEX IF NOT EXISTS idx_contractors_approved_at 
ON contractors(approved_at) WHERE approved_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_contractors_rejected_at 
ON contractors(rejected_at) WHERE rejected_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_contractors_is_active 
ON contractors(is_active) WHERE is_active = TRUE;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Show all suppliers (should now work for admin@qilly.co.za)
SELECT 
  id,
  company_name,
  email,
  status,
  is_active,
  delivery_provinces,
  approved_at,
  created_at
FROM suppliers
ORDER BY created_at DESC;

-- Count by status
SELECT 
  status,
  COUNT(*) as count
FROM suppliers
GROUP BY status
ORDER BY status;

-- Check if admin function works
SELECT 
  'Current user is admin: ' || is_admin()::text as admin_status,
  current_user as database_user,
  (SELECT email FROM auth.users WHERE id = auth.uid()) as user_email;

-- Success message
SELECT '✅ SUCCESS: Admin can now view all suppliers and contractors!' as result;
SELECT 'All missing columns have been added.' as step1;
SELECT 'Admin RLS policies are active.' as step2;
SELECT 'Try logging in as admin@qilly.co.za to see all suppliers.' as next_step;
