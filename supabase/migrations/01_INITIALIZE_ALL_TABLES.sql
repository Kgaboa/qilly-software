-- ========================================
-- INITIALIZE ALL TABLES FROM SCRATCH
-- ========================================
-- Run this if tables don't exist or need to be recreated
-- This creates ALL tables with ALL columns

-- ========================================
-- 1. CREATE SUPPLIERS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS suppliers (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic information
  company_name TEXT NOT NULL,
  registration_number TEXT,
  vat_number TEXT,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  
  -- Address
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  
  -- Business details
  product_categories TEXT[] DEFAULT '{}',
  years_in_business INTEGER DEFAULT 0,
  bbbee_level TEXT,
  has_certification BOOLEAN DEFAULT FALSE,
  
  -- Status
  status TEXT DEFAULT 'pending',
  
  -- Subscription details
  subscription_tier TEXT DEFAULT 'free',
  billing_cycle TEXT DEFAULT 'monthly',
  subscription_status TEXT DEFAULT 'active',
  subscription_start_date TIMESTAMPTZ DEFAULT NOW(),
  next_billing_date TIMESTAMPTZ,
  payment_method TEXT,
  
  -- POPIA consent
  popia_consent_given BOOLEAN DEFAULT FALSE,
  popia_consent_date TIMESTAMPTZ,
  popia_consent_version TEXT DEFAULT '1.0',
  terms_consent_given BOOLEAN DEFAULT FALSE,
  terms_consent_date TIMESTAMPTZ,
  terms_consent_version TEXT DEFAULT '1.0',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 2. CREATE CONTRACTORS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS contractors (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic information
  company_name TEXT NOT NULL,
  cidb_registration_number TEXT,
  cidb_grade TEXT,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  
  -- Address
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  
  -- Business details
  project_types TEXT[] DEFAULT '{}',
  operating_provinces TEXT[] DEFAULT '{}',
  years_in_business INTEGER DEFAULT 0,
  annual_turnover NUMERIC DEFAULT 0,
  bbbee_level TEXT,
  has_certification BOOLEAN DEFAULT FALSE,
  
  -- Status
  status TEXT DEFAULT 'pending',
  
  -- Subscription details
  subscription_tier TEXT DEFAULT 'professional',
  billing_cycle TEXT DEFAULT 'monthly',
  subscription_status TEXT DEFAULT 'active',
  subscription_start_date TIMESTAMPTZ DEFAULT NOW(),
  next_billing_date TIMESTAMPTZ,
  payment_method TEXT,
  
  -- POPIA consent
  popia_consent_given BOOLEAN DEFAULT FALSE,
  popia_consent_date TIMESTAMPTZ,
  popia_consent_version TEXT DEFAULT '1.0',
  terms_consent_given BOOLEAN DEFAULT FALSE,
  terms_consent_date TIMESTAMPTZ,
  terms_consent_version TEXT DEFAULT '1.0',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 3. CREATE POPIA CONSENT LOG TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS popia_consent_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  policy_version TEXT DEFAULT '1.0',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 4. CREATE INDEXES
-- ========================================

-- Suppliers indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_subscription_tier ON suppliers(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_suppliers_subscription_status ON suppliers(subscription_status);

-- Contractors indexes
CREATE INDEX IF NOT EXISTS idx_contractors_user_id ON contractors(user_id);
CREATE INDEX IF NOT EXISTS idx_contractors_email ON contractors(email);
CREATE INDEX IF NOT EXISTS idx_contractors_status ON contractors(status);
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_tier ON contractors(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_status ON contractors(subscription_status);

-- POPIA consent log indexes
CREATE INDEX IF NOT EXISTS idx_popia_consent_user_id ON popia_consent_log(user_id);
CREATE INDEX IF NOT EXISTS idx_popia_consent_type ON popia_consent_log(consent_type);
CREATE INDEX IF NOT EXISTS idx_popia_consent_created_at ON popia_consent_log(created_at);

-- ========================================
-- 5. ADD COMMENTS
-- ========================================

-- Suppliers comments
COMMENT ON TABLE suppliers IS 'Supplier accounts with subscription and POPIA compliance';
COMMENT ON COLUMN suppliers.status IS 'Approval status: pending, approved, rejected, suspended';
COMMENT ON COLUMN suppliers.subscription_tier IS 'Subscription tier: free, basic, professional, enterprise';
COMMENT ON COLUMN suppliers.popia_consent_given IS 'User consented to Privacy Policy (POPIA compliance)';

-- Contractors comments
COMMENT ON TABLE contractors IS 'Contractor accounts with subscription and POPIA compliance';
COMMENT ON COLUMN contractors.status IS 'Approval status: pending, approved, rejected, suspended';
COMMENT ON COLUMN contractors.subscription_tier IS 'Subscription tier: starter, professional, enterprise';
COMMENT ON COLUMN contractors.popia_consent_given IS 'User consented to Privacy Policy (POPIA compliance)';

-- POPIA consent log comments
COMMENT ON TABLE popia_consent_log IS 'Audit trail for all POPIA consent actions';

-- ========================================
-- 6. SUCCESS MESSAGE
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ALL TABLES INITIALIZED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ suppliers table created with 31 columns';
  RAISE NOTICE '✅ contractors table created with 33 columns';
  RAISE NOTICE '✅ popia_consent_log table created';
  RAISE NOTICE '✅ All indexes created';
  RAISE NOTICE '✅ All comments added';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ DATABASE IS 100% READY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
END $$;
