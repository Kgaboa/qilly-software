-- ================================================
-- QILLY QUICK FIX - COPY & PASTE THIS ENTIRE FILE
-- ================================================
-- Time: 2 minutes | Fixes: ALL missing column errors
-- For: Monday eTender presentation prep

-- Add ALL missing columns to suppliers table
ALTER TABLE suppliers
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS bbbee_level TEXT,
ADD COLUMN IF NOT EXISTS has_certification BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS years_in_business INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS product_categories TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS popia_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS popia_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS popia_consent_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS terms_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS terms_consent_version TEXT DEFAULT '1.0';

-- Add ALL missing columns to contractors table
ALTER TABLE contractors
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS bbbee_level TEXT,
ADD COLUMN IF NOT EXISTS has_certification BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS years_in_business INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS annual_turnover NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS project_types TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS operating_provinces TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'professional',
ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS popia_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS popia_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS popia_consent_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS terms_consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_consent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS terms_consent_version TEXT DEFAULT '1.0';

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_subscription_tier ON suppliers(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_contractors_status ON contractors(status);
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_tier ON contractors(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_contractors_email ON contractors(email);
CREATE INDEX IF NOT EXISTS idx_contractors_user_id ON contractors(user_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ QILLY DATABASE FIXED!';
  RAISE NOTICE '✅ Suppliers: 17 columns added';
  RAISE NOTICE '✅ Contractors: 19 columns added';
  RAISE NOTICE '✅ Indexes: Created';
  RAISE NOTICE '✅ Ready for Monday!';
END $$;
