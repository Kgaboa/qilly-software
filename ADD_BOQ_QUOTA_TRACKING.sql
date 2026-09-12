-- ============================================
-- ADD BOQ QUOTA TRACKING TO CONTRACTORS TABLE
-- ============================================
-- Purpose: Track monthly BOQ usage per contractor for subscription tier limits
-- Run this in Supabase SQL Editor
-- ============================================

-- Add boq_quota_used column (tracks current month usage)
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS boq_quota_used INTEGER DEFAULT 0;

-- Add boq_quota_reset_date column (last reset timestamp)
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS boq_quota_reset_date TIMESTAMPTZ DEFAULT NOW();

-- Add comments to columns
COMMENT ON COLUMN contractors.boq_quota_used IS 'Number of BOQs processed this month (resets monthly)';
COMMENT ON COLUMN contractors.boq_quota_reset_date IS 'Last date when BOQ quota was reset (monthly cycle)';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_contractors_quota_reset ON contractors(boq_quota_reset_date);

-- Initialize existing contractors with current timestamp
UPDATE contractors
SET boq_quota_reset_date = NOW()
WHERE boq_quota_reset_date IS NULL;

-- ============================================
-- CREATE FUNCTION TO RESET MONTHLY BOQ QUOTA
-- ============================================
-- This function should be called by a cron job monthly

CREATE OR REPLACE FUNCTION reset_monthly_boq_quota()
RETURNS void AS $$
BEGIN
  -- Reset quota for contractors whose reset date is more than 1 month ago
  UPDATE contractors
  SET 
    boq_quota_used = 0,
    boq_quota_reset_date = NOW()
  WHERE boq_quota_reset_date < NOW() - INTERVAL '1 month';
  
  RAISE NOTICE 'Monthly BOQ quota reset complete';
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION reset_monthly_boq_quota() IS 'Resets BOQ quota for all contractors monthly (call via cron job)';

-- ============================================
-- CREATE FUNCTION TO INCREMENT BOQ USAGE
-- ============================================
-- Call this when a BOQ is processed

CREATE OR REPLACE FUNCTION increment_boq_usage(contractor_email TEXT)
RETURNS void AS $$
BEGIN
  -- Check if quota needs reset (more than 1 month since last reset)
  UPDATE contractors
  SET 
    boq_quota_used = 0,
    boq_quota_reset_date = NOW()
  WHERE 
    email = contractor_email 
    AND boq_quota_reset_date < NOW() - INTERVAL '1 month';
  
  -- Increment usage
  UPDATE contractors
  SET boq_quota_used = boq_quota_used + 1
  WHERE email = contractor_email;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION increment_boq_usage(TEXT) IS 'Increments BOQ usage counter for a contractor';

-- ============================================
-- CREATE FUNCTION TO CHECK BOQ QUOTA
-- ============================================
-- Returns true if contractor can process more BOQs

CREATE OR REPLACE FUNCTION check_boq_quota(contractor_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier TEXT;
  v_used INTEGER;
  v_quota_limit INTEGER;
BEGIN
  -- Get contractor's tier and current usage
  SELECT subscription_tier, boq_quota_used
  INTO v_tier, v_used
  FROM contractors
  WHERE email = contractor_email;
  
  -- Determine quota limit based on tier (case-insensitive)
  v_quota_limit := CASE 
    WHEN UPPER(v_tier) = 'FREE' THEN NULL -- Unlimited training BOQs
    WHEN UPPER(v_tier) = 'PROFESSIONAL' THEN 10
    WHEN UPPER(v_tier) = 'ENTERPRISE' THEN 30
    WHEN UPPER(v_tier) = 'CUSTOM' THEN NULL -- Unlimited
    ELSE 0 -- Default: no access
  END;
  
  -- If quota is NULL (unlimited), return true
  IF v_quota_limit IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Otherwise, check if usage is below limit
  RETURN v_used < v_quota_limit;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_boq_quota(TEXT) IS 'Checks if contractor has remaining BOQ quota for current month';

-- ============================================
-- CREATE VIEW FOR QUOTA MONITORING
-- ============================================

CREATE OR REPLACE VIEW contractor_quota_status AS
SELECT 
  email,
  company_name,
  subscription_tier,
  boq_quota_used,
  CASE 
    WHEN UPPER(subscription_tier) = 'FREE' THEN NULL
    WHEN UPPER(subscription_tier) = 'PROFESSIONAL' THEN 10
    WHEN UPPER(subscription_tier) = 'ENTERPRISE' THEN 30
    WHEN UPPER(subscription_tier) = 'CUSTOM' THEN NULL
    ELSE 0
  END as boq_quota_limit,
  CASE 
    WHEN UPPER(subscription_tier) IN ('FREE', 'CUSTOM') THEN 'Unlimited'
    WHEN UPPER(subscription_tier) = 'PROFESSIONAL' AND boq_quota_used >= 10 THEN 'Quota Exceeded'
    WHEN UPPER(subscription_tier) = 'ENTERPRISE' AND boq_quota_used >= 30 THEN 'Quota Exceeded'
    WHEN UPPER(subscription_tier) = 'PROFESSIONAL' AND boq_quota_used >= 8 THEN 'Near Limit'
    WHEN UPPER(subscription_tier) = 'ENTERPRISE' AND boq_quota_used >= 25 THEN 'Near Limit'
    ELSE 'OK'
  END as quota_status,
  boq_quota_reset_date,
  NOW() - boq_quota_reset_date as days_since_reset
FROM contractors
WHERE status = 'approved';

COMMENT ON VIEW contractor_quota_status IS 'Displays current BOQ quota status for all approved contractors';

-- ============================================
-- SAMPLE QUERIES FOR MONITORING
-- ============================================

-- Check quota for a specific contractor
-- SELECT check_boq_quota('contractor@example.com');

-- View all contractor quota statuses
-- SELECT * FROM contractor_quota_status ORDER BY quota_status DESC, boq_quota_used DESC;

-- Manually reset quota for all contractors (admin use)
-- SELECT reset_monthly_boq_quota();

-- Manually increment usage for testing
-- SELECT increment_boq_usage('contractor@example.com');

-- Find contractors near or over quota
-- SELECT * FROM contractor_quota_status WHERE quota_status IN ('Near Limit', 'Quota Exceeded');

-- ============================================
-- CRON JOB SETUP (OPTIONAL - Supabase Pro)
-- ============================================
-- If you have Supabase Pro with pg_cron extension:

-- Enable pg_cron extension (run once)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule monthly quota reset (1st day of each month at midnight)
-- SELECT cron.schedule(
--   'monthly-boq-quota-reset',
--   '0 0 1 * *',
--   'SELECT reset_monthly_boq_quota();'
-- );

-- ============================================
-- MANUAL MONTHLY RESET (if no cron)
-- ============================================
-- If you don't have pg_cron, run this manually each month:
-- SELECT reset_monthly_boq_quota();

-- ============================================
-- SETUP COMPLETE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'BOQ quota tracking setup complete!';
  RAISE NOTICE 'Run: SELECT * FROM contractor_quota_status; to view quota statuses';
END $$;