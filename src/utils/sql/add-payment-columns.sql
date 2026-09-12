-- =====================================================
-- ADD PAYMENT COLUMNS TO CONTRACTORS TABLE
-- =====================================================
-- Run this in Supabase SQL Editor to fix PGRST204 error
-- This adds missing payment-related columns
-- =====================================================

-- Add missing payment columns if they don't exist
DO $$ 
BEGIN
  -- last_payment_date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'last_payment_date'
  ) THEN
    ALTER TABLE contractors ADD COLUMN last_payment_date TIMESTAMPTZ;
  END IF;

  -- next_billing_date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'next_billing_date'
  ) THEN
    ALTER TABLE contractors ADD COLUMN next_billing_date TIMESTAMPTZ;
  END IF;

  -- payment_method
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE contractors ADD COLUMN payment_method TEXT;
  END IF;

  -- subscription_cycle
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'subscription_cycle'
  ) THEN
    ALTER TABLE contractors ADD COLUMN subscription_cycle TEXT DEFAULT 'monthly';
  END IF;

  -- subscription_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE contractors ADD COLUMN subscription_status TEXT DEFAULT 'trial';
  END IF;

  -- paid_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'paid_status'
  ) THEN
    ALTER TABLE contractors ADD COLUMN paid_status BOOLEAN DEFAULT false;
  END IF;

  -- boq_count
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'boq_count'
  ) THEN
    ALTER TABLE contractors ADD COLUMN boq_count INTEGER DEFAULT 0;
  END IF;

  -- boq_limit
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'boq_limit'
  ) THEN
    ALTER TABLE contractors ADD COLUMN boq_limit INTEGER DEFAULT 999999;
  END IF;

  -- company_name
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE contractors ADD COLUMN company_name TEXT;
  END IF;

  -- contact_person
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'contact_person'
  ) THEN
    ALTER TABLE contractors ADD COLUMN contact_person TEXT;
  END IF;

  -- phone
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'phone'
  ) THEN
    ALTER TABLE contractors ADD COLUMN phone TEXT;
  END IF;

  -- cidb_grade
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'cidb_grade'
  ) THEN
    ALTER TABLE contractors ADD COLUMN cidb_grade TEXT;
  END IF;

  -- created_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE contractors ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  -- updated_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contractors' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE contractors ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

END $$;

-- Create indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_tier ON contractors(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_status ON contractors(subscription_status);
CREATE INDEX IF NOT EXISTS idx_contractors_paid_status ON contractors(paid_status);
CREATE INDEX IF NOT EXISTS idx_contractors_next_billing_date ON contractors(next_billing_date);

-- Add constraint to ensure valid payment methods
DO $$ 
BEGIN
  -- First, clean up any invalid payment_method values
  UPDATE contractors 
  SET payment_method = NULL 
  WHERE payment_method IS NOT NULL 
    AND payment_method NOT IN ('eft', 'card', 'payfast', 'stitch');

  -- Now add the constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'contractors_payment_method_check'
  ) THEN
    ALTER TABLE contractors ADD CONSTRAINT contractors_payment_method_check 
    CHECK (payment_method IS NULL OR payment_method IN ('eft', 'card', 'payfast', 'stitch'));
  END IF;
END $$;

-- Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contractors'
  AND column_name IN (
    'last_payment_date',
    'next_billing_date',
    'payment_method',
    'subscription_cycle',
    'subscription_status',
    'paid_status',
    'boq_count',
    'boq_limit',
    'company_name',
    'contact_person',
    'phone',
    'cidb_grade'
  )
ORDER BY column_name;

-- Expected: 12 rows showing all columns exist