-- COMPLETE FIX: Add ALL missing columns to contractors table
-- Created: 2026-03-05
-- Purpose: Add all columns that ContractorSignup component expects

-- Add ALL missing columns to contractors table
ALTER TABLE contractors
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

-- POPIA consent fields (if not already added)
ADD COLUMN IF NOT EXISTS popia_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS popia_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS popia_consent_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS terms_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS terms_consent_version TEXT DEFAULT '1.0';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_contractors_status ON contractors(status);
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_tier ON contractors(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_status ON contractors(subscription_status);
CREATE INDEX IF NOT EXISTS idx_contractors_email ON contractors(email);
CREATE INDEX IF NOT EXISTS idx_contractors_user_id ON contractors(user_id);

-- Add comments for documentation
COMMENT ON COLUMN contractors.subscription_tier IS 'Subscription tier: starter, professional, enterprise';
COMMENT ON COLUMN contractors.billing_cycle IS 'Billing cycle: monthly or annual';
COMMENT ON COLUMN contractors.subscription_status IS 'Subscription status: active, trial, suspended, cancelled';
COMMENT ON COLUMN contractors.popia_consent_given IS 'User consented to Privacy Policy (POPIA compliance)';
COMMENT ON COLUMN contractors.terms_consent_given IS 'User consented to Terms of Service';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Contractors table COMPLETELY updated with ALL missing columns';
  RAISE NOTICE '✅ Added business columns: bbbee_level, has_certification, years_in_business, annual_turnover, etc.';
  RAISE NOTICE '✅ Added subscription columns: subscription_tier, billing_cycle, subscription_status, etc.';
  RAISE NOTICE '✅ Added POPIA consent columns: popia_consent_given, terms_consent_given, etc.';
  RAISE NOTICE '✅ Indexes created for performance';
  RAISE NOTICE '✅ Contractors table is now 100% ready!';
END $$;
