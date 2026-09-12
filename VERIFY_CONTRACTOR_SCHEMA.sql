-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- QILLY: VERIFY CONTRACTOR SCHEMA MATCHES SIGNUP FORM
-- Purpose: Check if database schema has all fields that ContractorSignup sends
-- Created: 2026-03-09 for eTender investor presentation prep
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO $$
DECLARE
  missing_columns TEXT[] := '{}';
  column_name TEXT;
  required_columns TEXT[] := ARRAY[
    'id',
    'user_id',
    'company_name',
    'cidb_registration_number',
    'cidb_grade',
    'contact_person',
    'email',
    'phone',
    'street_address',
    'city',
    'province',
    'postal_code',
    'project_types',
    'operating_provinces',
    'years_in_business',
    'annual_turnover',
    'bbbee_level',
    'has_certification',
    'status',
    'subscription_tier',
    'billing_cycle',
    'subscription_status',
    'subscription_start_date',
    'next_billing_date',
    'payment_method',
    'popia_consent_given',
    'popia_consent_date',
    'popia_consent_version',
    'terms_consent_given',
    'terms_consent_date',
    'terms_consent_version',
    'created_at',
    'updated_at'
  ];
BEGIN
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '🔍 VERIFYING CONTRACTORS TABLE SCHEMA';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  
  -- Check if table exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contractors') THEN
    RAISE NOTICE '❌ CRITICAL: contractors table does NOT exist!';
    RAISE NOTICE '   Run /supabase/migrations/01_INITIALIZE_ALL_TABLES.sql first';
    RETURN;
  END IF;
  
  RAISE NOTICE '✅ contractors table exists';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Checking required columns...';
  RAISE NOTICE '';
  
  -- Check each required column
  FOREACH column_name IN ARRAY required_columns
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'contractors' 
      AND column_name = column_name
    ) THEN
      missing_columns := array_append(missing_columns, column_name);
      RAISE NOTICE '❌ MISSING: %', column_name;
    ELSE
      RAISE NOTICE '✅ EXISTS:  %', column_name;
    END IF;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  
  -- Summary
  IF array_length(missing_columns, 1) IS NULL THEN
    RAISE NOTICE '✅✅✅ ALL REQUIRED COLUMNS EXIST! ✅✅✅';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Contractor signup schema is SYNCHRONIZED';
    RAISE NOTICE '🎯 All ContractorSignup.tsx fields match database';
    RAISE NOTICE '🎯 eTender investor presentation ready!';
  ELSE
    RAISE NOTICE '❌ MISSING % COLUMNS:', array_length(missing_columns, 1);
    RAISE NOTICE '   %', array_to_string(missing_columns, ', ');
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ ACTION REQUIRED:';
    RAISE NOTICE '   Run: /supabase/migrations/MASTER_FIX_ALL_TABLES_COMPLETE.sql';
  END IF;
  
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

-- Show full column details
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'contractors'
ORDER BY ordinal_position;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- FIELDS SENT BY ContractorSignup.tsx (lines 417-447):
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ✅ user_id                     - UUID from auth.users
-- ✅ company_name                - TEXT
-- ✅ cidb_registration_number    - TEXT (added for eTender API submissions)
-- ✅ cidb_grade                  - TEXT (added for eTender API submissions)
-- ✅ contact_person              - TEXT
-- ✅ email                       - TEXT
-- ✅ phone                       - TEXT
-- ✅ street_address              - TEXT
-- ✅ city                        - TEXT
-- ✅ province                    - TEXT
-- ✅ postal_code                 - TEXT
-- ✅ project_types               - TEXT[] (array)
-- ✅ operating_provinces         - TEXT[] (array)
-- ✅ years_in_business           - INTEGER
-- ✅ annual_turnover             - NUMERIC
-- ✅ bbbee_level                 - TEXT
-- ✅ has_certification           - BOOLEAN
-- ✅ status                      - TEXT (default: 'pending')
-- ✅ subscription_tier           - TEXT
-- ✅ billing_cycle               - TEXT
-- ✅ subscription_status         - TEXT
-- ✅ subscription_start_date     - TIMESTAMPTZ
-- ✅ next_billing_date           - TIMESTAMPTZ
-- ✅ popia_consent_given         - BOOLEAN
-- ✅ popia_consent_date          - TIMESTAMPTZ
-- ✅ popia_consent_version       - TEXT
-- ✅ terms_consent_given         - BOOLEAN
-- ✅ terms_consent_date          - TIMESTAMPTZ
-- ✅ terms_consent_version       - TEXT
-- 
-- NOTE: payment_method is NOT sent by signup (added later)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
