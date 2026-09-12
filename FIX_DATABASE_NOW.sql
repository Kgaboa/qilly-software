-- QILLY DATABASE FIX - COPY AND PASTE THIS ENTIRE FILE
-- Drops broken tables and creates new ones with ALL columns

DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS contractors CASCADE;
DROP TABLE IF EXISTS popia_consent_log CASCADE;

CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  registration_number TEXT,
  vat_number TEXT,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  product_categories TEXT[] DEFAULT '{}',
  years_in_business INTEGER DEFAULT 0,
  bbbee_level TEXT,
  has_certification BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending',
  subscription_tier TEXT DEFAULT 'free',
  billing_cycle TEXT DEFAULT 'monthly',
  subscription_status TEXT DEFAULT 'active',
  subscription_start_date TIMESTAMPTZ DEFAULT NOW(),
  next_billing_date TIMESTAMPTZ,
  payment_method TEXT,
  popia_consent_given BOOLEAN DEFAULT FALSE,
  popia_consent_date TIMESTAMPTZ,
  popia_consent_version TEXT DEFAULT '1.0',
  terms_consent_given BOOLEAN DEFAULT FALSE,
  terms_consent_date TIMESTAMPTZ,
  terms_consent_version TEXT DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  cidb_registration_number TEXT,
  cidb_grade TEXT,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  project_types TEXT[] DEFAULT '{}',
  operating_provinces TEXT[] DEFAULT '{}',
  years_in_business INTEGER DEFAULT 0,
  annual_turnover NUMERIC DEFAULT 0,
  bbbee_level TEXT,
  has_certification BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending',
  subscription_tier TEXT DEFAULT 'professional',
  billing_cycle TEXT DEFAULT 'monthly',
  subscription_status TEXT DEFAULT 'active',
  subscription_start_date TIMESTAMPTZ DEFAULT NOW(),
  next_billing_date TIMESTAMPTZ,
  payment_method TEXT,
  popia_consent_given BOOLEAN DEFAULT FALSE,
  popia_consent_date TIMESTAMPTZ,
  popia_consent_version TEXT DEFAULT '1.0',
  terms_consent_given BOOLEAN DEFAULT FALSE,
  terms_consent_date TIMESTAMPTZ,
  terms_consent_version TEXT DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE popia_consent_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  policy_version TEXT DEFAULT '1.0',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX idx_suppliers_email ON suppliers(email);
CREATE INDEX idx_suppliers_status ON suppliers(status);
CREATE INDEX idx_suppliers_subscription_tier ON suppliers(subscription_tier);
CREATE INDEX idx_contractors_user_id ON contractors(user_id);
CREATE INDEX idx_contractors_email ON contractors(email);
CREATE INDEX idx_contractors_status ON contractors(status);
CREATE INDEX idx_contractors_subscription_tier ON contractors(subscription_tier);
CREATE INDEX idx_popia_consent_user_id ON popia_consent_log(user_id);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE popia_consent_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own supplier profile" ON suppliers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own supplier profile" ON suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own supplier profile" ON suppliers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own contractor profile" ON contractors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own contractor profile" ON contractors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contractor profile" ON contractors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own consent log" ON popia_consent_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own consent log" ON popia_consent_log FOR INSERT WITH CHECK (auth.uid() = user_id);
