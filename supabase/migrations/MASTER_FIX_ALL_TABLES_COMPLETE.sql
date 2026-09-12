-- ========================================
-- MASTER MIGRATION: FIX ALL TABLES (COMPLETE)
-- ========================================
-- Created: 2026-03-05
-- Purpose: Add ALL missing columns to suppliers AND contractors tables
-- Run this ONCE to fix EVERYTHING!

-- ========================================
-- 1. FIX SUPPLIERS TABLE
-- ========================================

ALTER TABLE suppliers
-- Status column (CRITICAL!)
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',

-- Business details
ADD COLUMN IF NOT EXISTS bbbee_level TEXT,
ADD COLUMN IF NOT EXISTS has_certification BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS years_in_business INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS product_categories TEXT[] DEFAULT '{}',

-- Subscription details
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_method TEXT,

-- POPIA consent fields
ADD COLUMN IF NOT EXISTS popia_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS popia_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS popia_consent_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS terms_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS terms_consent_version TEXT DEFAULT '1.0';

-- ========================================
-- 2. FIX CONTRACTORS TABLE
-- ========================================

ALTER TABLE contractors
-- Status column (CRITICAL!)
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',

-- Business details
ADD COLUMN IF NOT EXISTS bbbee_level TEXT,
ADD COLUMN IF NOT EXISTS has_certification BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS years_in_business INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS annual_turnover NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS project_types TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS operating_provinces TEXT[] DEFAULT '{}',

-- Subscription details
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'professional',
ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_method TEXT,

-- POPIA consent fields
ADD COLUMN IF NOT EXISTS popia_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS popia_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS popia_consent_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS terms_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS terms_consent_version TEXT DEFAULT '1.0';

-- ========================================
-- 3. ADD INDEXES FOR PERFORMANCE
-- ========================================

-- Suppliers indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_subscription_tier ON suppliers(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_suppliers_subscription_status ON suppliers(subscription_status);
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);

-- Contractors indexes
CREATE INDEX IF NOT EXISTS idx_contractors_status ON contractors(status);
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_tier ON contractors(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_status ON contractors(subscription_status);
CREATE INDEX IF NOT EXISTS idx_contractors_email ON contractors(email);
CREATE INDEX IF NOT EXISTS idx_contractors_user_id ON contractors(user_id);

-- ========================================
-- 4. ADD DOCUMENTATION COMMENTS
-- ========================================

-- Suppliers comments
COMMENT ON COLUMN suppliers.status IS 'Approval status: pending, approved, rejected, suspended';
COMMENT ON COLUMN suppliers.subscription_tier IS 'Subscription tier: free, basic, professional, enterprise';
COMMENT ON COLUMN suppliers.billing_cycle IS 'Billing cycle: monthly or annual';
COMMENT ON COLUMN suppliers.subscription_status IS 'Subscription status: active, trial, suspended, cancelled';
COMMENT ON COLUMN suppliers.popia_consent_given IS 'User consented to Privacy Policy (POPIA compliance)';
COMMENT ON COLUMN suppliers.terms_consent_given IS 'User consented to Terms of Service';

-- Contractors comments
COMMENT ON COLUMN contractors.status IS 'Approval status: pending, approved, rejected, suspended';
COMMENT ON COLUMN contractors.subscription_tier IS 'Subscription tier: starter, professional, enterprise';
COMMENT ON COLUMN contractors.billing_cycle IS 'Billing cycle: monthly or annual';
COMMENT ON COLUMN contractors.subscription_status IS 'Subscription status: active, trial, suspended, cancelled';
COMMENT ON COLUMN contractors.popia_consent_given IS 'User consented to Privacy Policy (POPIA compliance)';
COMMENT ON COLUMN contractors.terms_consent_given IS 'User consented to Terms of Service';

-- ========================================
-- 5. SUCCESS MESSAGE
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ MASTER MIGRATION COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'SUPPLIERS TABLE:';
  RAISE NOTICE '  ✅ Added status column (pending/approved/rejected)';
  RAISE NOTICE '  ✅ Added business columns (bbbee_level, has_certification, etc.)';
  RAISE NOTICE '  ✅ Added subscription columns (subscription_tier, billing_cycle, etc.)';
  RAISE NOTICE '  ✅ Added POPIA consent columns';
  RAISE NOTICE '  ✅ Added performance indexes';
  RAISE NOTICE '';
  RAISE NOTICE 'CONTRACTORS TABLE:';
  RAISE NOTICE '  ✅ Added status column (pending/approved/rejected)';
  RAISE NOTICE '  ✅ Added business columns (bbbee_level, has_certification, etc.)';
  RAISE NOTICE '  ✅ Added subscription columns (subscription_tier, billing_cycle, etc.)';
  RAISE NOTICE '  ✅ Added POPIA consent columns';
  RAISE NOTICE '  ✅ Added performance indexes';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ALL TABLES ARE NOW 100% READY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
END $$;
