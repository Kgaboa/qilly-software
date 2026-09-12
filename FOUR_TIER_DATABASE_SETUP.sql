-- =====================================================
-- FOUR-TIER PAYMENT SYSTEM - DATABASE SETUP
-- =====================================================
-- Run this in your Supabase SQL Editor (Development first, then SIT)
-- Estimated time: 2 minutes

-- =====================================================
-- STEP 1: Add columns to contractors table
-- =====================================================

-- Add selected_tier column (FREE, PROFESSIONAL, ENTERPRISE, CUSTOM)
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS selected_tier TEXT DEFAULT 'FREE' 
CHECK (selected_tier IN ('FREE', 'PROFESSIONAL', 'ENTERPRISE', 'CUSTOM'));

-- Add payment_status column
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'not_required' 
CHECK (payment_status IN ('not_required', 'pending', 'verified', 'failed'));

-- Add payment_verified boolean
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT false;

-- Add payment_method column
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_method TEXT 
CHECK (payment_method IN ('manual', 'payfast', 'stitch', 'none', NULL));

-- Add payment timestamps
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ;

-- Add payment_verified_by (admin user ID who verified)
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_verified_by UUID REFERENCES auth.users(id);

-- Add BOQ tracking for Professional tier limits
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS boq_count INTEGER DEFAULT 0;

-- Add BOQ limit (NULL = unlimited, 10 for Professional)
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS boq_limit INTEGER DEFAULT NULL;

-- Add monthly reset date for Professional tier
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS monthly_boq_reset_date TIMESTAMPTZ;

-- Add payment notes for admin
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_notes TEXT;

-- =====================================================
-- STEP 2: Update existing contractors
-- =====================================================

-- Set all existing contractors to FREE tier with verified payment
UPDATE contractors 
SET 
  selected_tier = 'FREE',
  subscription_tier = 'FREE',
  payment_status = 'not_required',
  payment_verified = true,
  boq_limit = NULL  -- Unlimited for FREE tier
WHERE selected_tier IS NULL;

-- =====================================================
-- STEP 3: Create payment_approvals audit table
-- =====================================================

CREATE TABLE IF NOT EXISTS payment_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES auth.users(id),
  payment_method TEXT,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'verified', 'failed')),
  amount DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_approvals_contractor_id 
ON payment_approvals(contractor_id);

CREATE INDEX IF NOT EXISTS idx_payment_approvals_approved_by 
ON payment_approvals(approved_by);

-- =====================================================
-- STEP 4: Enable RLS on payment_approvals
-- =====================================================

ALTER TABLE payment_approvals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all payment approvals" ON payment_approvals;
DROP POLICY IF EXISTS "Admins can manage payment approvals" ON payment_approvals;

-- Admins can view all payment approvals
CREATE POLICY "Admins can view all payment approvals"
ON payment_approvals FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Admins can insert/update payment approvals
CREATE POLICY "Admins can manage payment approvals"
ON payment_approvals FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- =====================================================
-- STEP 5: Create helper functions
-- =====================================================

-- Function to get tier pricing
CREATE OR REPLACE FUNCTION get_tier_price(tier_name TEXT)
RETURNS DECIMAL(10, 2) AS $$
BEGIN
  CASE tier_name
    WHEN 'FREE' THEN RETURN 0.00;
    WHEN 'PROFESSIONAL' THEN RETURN 2999.00;
    WHEN 'ENTERPRISE' THEN RETURN 8999.00;
    WHEN 'CUSTOM' THEN RETURN 0.00; -- Custom pricing
    ELSE RETURN 0.00;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check if contractor can login
CREATE OR REPLACE FUNCTION can_contractor_login(contractor_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  contractor_record RECORD;
BEGIN
  SELECT status, selected_tier, payment_verified
  INTO contractor_record
  FROM contractors
  WHERE id = contractor_id;
  
  -- Not approved by admin
  IF contractor_record.status != 'approved' THEN
    RETURN false;
  END IF;
  
  -- FREE tier: only needs contractor approval
  IF contractor_record.selected_tier = 'FREE' THEN
    RETURN true;
  END IF;
  
  -- Paid tiers: needs both contractor approval and payment verification
  RETURN contractor_record.payment_verified = true;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 6: Verification queries
-- =====================================================

-- Check contractors table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'contractors'
  AND column_name IN (
    'selected_tier', 
    'payment_status', 
    'payment_verified', 
    'payment_method',
    'boq_count',
    'boq_limit'
  )
ORDER BY column_name;

-- Check payment_approvals table
SELECT COUNT(*) as payment_approvals_table_exists
FROM information_schema.tables
WHERE table_name = 'payment_approvals';

-- Check existing contractors
SELECT 
  email,
  company_name,
  selected_tier,
  payment_status,
  payment_verified,
  status,
  created_at
FROM contractors
ORDER BY created_at DESC
LIMIT 10;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('contractors', 'payment_approvals')
ORDER BY tablename, policyname;

-- =====================================================
-- DIAGNOSTIC QUERIES (Run after setup)
-- =====================================================

-- Count contractors by tier
SELECT 
  selected_tier,
  COUNT(*) as count,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
  COUNT(CASE WHEN payment_verified = true THEN 1 END) as payment_verified
FROM contractors
GROUP BY selected_tier;

-- Find contractors pending payment verification
SELECT 
  company_name,
  email,
  selected_tier,
  status,
  payment_status,
  payment_verified,
  created_at
FROM contractors
WHERE status = 'approved' 
  AND selected_tier != 'FREE'
  AND payment_verified = false
ORDER BY created_at DESC;

-- Check payment approval history
SELECT 
  pa.id,
  c.company_name,
  c.email,
  c.selected_tier,
  pa.payment_method,
  pa.payment_status,
  pa.amount,
  pa.notes,
  u.email as approved_by_email,
  pa.created_at
FROM payment_approvals pa
JOIN contractors c ON c.id = pa.contractor_id
LEFT JOIN users u ON u.id = pa.approved_by
ORDER BY pa.created_at DESC
LIMIT 20;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Four-tier payment system database setup complete!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Summary:';
  RAISE NOTICE '  - Added payment columns to contractors table';
  RAISE NOTICE '  - Created payment_approvals audit table';
  RAISE NOTICE '  - Set up RLS policies';
  RAISE NOTICE '  - Created helper functions';
  RAISE NOTICE '  - Updated existing contractors to FREE tier';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Next steps:';
  RAISE NOTICE '  1. Update ContractorSignup.tsx with tier selection';
  RAISE NOTICE '  2. Update AdminDashboard.tsx with payment approval';
  RAISE NOTICE '  3. Update login logic to check payment verification';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Ready for four-tier implementation!';
END $$;
