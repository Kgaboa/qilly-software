-- COMPLETE FIX: Add ALL missing columns to suppliers table
-- Created: 2026-03-05
-- Purpose: Add all columns that SupplierSignup component expects

-- Add ALL missing columns to suppliers table
ALTER TABLE suppliers
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

-- POPIA consent fields (if not already added)
ADD COLUMN IF NOT EXISTS popia_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS popia_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS popia_consent_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS terms_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS terms_consent_version TEXT DEFAULT '1.0';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_subscription_tier ON suppliers(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_suppliers_subscription_status ON suppliers(subscription_status);
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);

-- Add comments for documentation
COMMENT ON COLUMN suppliers.subscription_tier IS 'Subscription tier: free, basic, professional, enterprise';
COMMENT ON COLUMN suppliers.billing_cycle IS 'Billing cycle: monthly or annual';
COMMENT ON COLUMN suppliers.subscription_status IS 'Subscription status: active, trial, suspended, cancelled';
COMMENT ON COLUMN suppliers.popia_consent_given IS 'User consented to Privacy Policy (POPIA compliance)';
COMMENT ON COLUMN suppliers.terms_consent_given IS 'User consented to Terms of Service';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Suppliers table COMPLETELY updated with ALL missing columns';
  RAISE NOTICE '✅ Added business columns: bbbee_level, has_certification, years_in_business, product_categories';
  RAISE NOTICE '✅ Added subscription columns: subscription_tier, billing_cycle, subscription_status, etc.';
  RAISE NOTICE '✅ Added POPIA consent columns: popia_consent_given, terms_consent_given, etc.';
  RAISE NOTICE '✅ Indexes created for performance';
  RAISE NOTICE '✅ Suppliers table is now 100% ready!';
END $$;
