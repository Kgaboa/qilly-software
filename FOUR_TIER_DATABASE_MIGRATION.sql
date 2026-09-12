-- ================================================================
-- QILLY: FOUR-TIER SYSTEM WITH TWO-STEP APPROVAL
-- Database Migration Script
-- ================================================================
-- Run this in Supabase SQL Editor BEFORE deploying the new code
-- ================================================================

-- Step 1: Add payment approval fields to contractors table
-- ================================================================

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS payment_approved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_approved_by TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT, -- 'manual', 'stitch', 'payfast', null
ADD COLUMN IF NOT EXISTS payment_reference TEXT, -- For tracking payment references
ADD COLUMN IF NOT EXISTS monthly_boq_limit INTEGER, -- 10 for Professional, null for others
ADD COLUMN IF NOT EXISTS boqs_generated_this_month INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_month_start TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Add comments for documentation
-- ================================================================

COMMENT ON COLUMN contractors.payment_approved IS 'TRUE if admin has verified payment for paid tiers. Always NULL for FREE tier.';
COMMENT ON COLUMN contractors.payment_approved_at IS 'Timestamp when admin approved payment';
COMMENT ON COLUMN contractors.payment_approved_by IS 'Admin user ID who approved payment';
COMMENT ON COLUMN contractors.payment_method IS 'Payment method: manual, stitch, payfast, or null for FREE tier';
COMMENT ON COLUMN contractors.payment_reference IS 'Payment reference number for tracking';
COMMENT ON COLUMN contractors.monthly_boq_limit IS '10 for Professional tier, null for unlimited tiers';
COMMENT ON COLUMN contractors.boqs_generated_this_month IS 'Counter for BOQs generated in current month';
COMMENT ON COLUMN contractors.current_month_start IS 'Start date of current billing month';

-- Step 3: Set payment_approved to TRUE for existing FREE tier contractors
-- ================================================================
-- FREE tier doesn't need payment approval, so mark as approved automatically

UPDATE contractors 
SET payment_approved = TRUE,
    payment_approved_at = NOW(),
    payment_method = 'free'
WHERE subscription_tier IN ('FREE', 'free_trial', 'free');

-- Step 4: Set monthly_boq_limit based on tier
-- ================================================================

UPDATE contractors 
SET monthly_boq_limit = CASE 
    WHEN subscription_tier = 'professional' THEN 10
    WHEN subscription_tier = 'PROFESSIONAL' THEN 10
    WHEN subscription_tier = 'enterprise' THEN 30
    WHEN subscription_tier = 'ENTERPRISE' THEN 30
    ELSE NULL -- FREE, CUSTOM have no limit (unlimited)
END;

-- Step 5: Create index for faster payment approval queries
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_contractors_payment_status 
ON contractors(status, payment_approved, subscription_tier);

-- Step 6: Add tier pricing to a new pricing_tiers table (for reference)
-- ================================================================

CREATE TABLE IF NOT EXISTS pricing_tiers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_annual DECIMAL(10,2),
    boq_limit INTEGER, -- NULL means unlimited
    features JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert tier definitions
INSERT INTO pricing_tiers (id, name, display_name, price_monthly, price_annual, boq_limit, features)
VALUES 
(
    'FREE',
    'free',
    'Free',
    0.00,
    0.00,
    NULL, -- Unlimited BOQs
    '{
        "boqs": "Unlimited",
        "training": true,
        "support": "Email support",
        "etender": false,
        "collusion": false,
        "description": "All features with free training"
    }'::jsonb
),
(
    'PROFESSIONAL',
    'professional',
    'Professional',
    2999.00,
    35988.00, -- 12 months with discount
    10, -- 10 BOQs per month
    '{
        "boqs": "10 per month",
        "training": false,
        "support": "Limited email support",
        "etender": false,
        "collusion": false,
        "description": "Perfect for small contractors"
    }'::jsonb
),
(
    'ENTERPRISE',
    'enterprise',
    'Enterprise',
    8999.00,
    107988.00, -- 12 months with discount
    30, -- 30 BOQs per month
    '{
        "boqs": "30 per month",
        "training": true,
        "support": "24h email support",
        "etender": true,
        "collusion": true,
        "description": "Full features with eTender integration"
    }'::jsonb
),
(
    'CUSTOM',
    'custom',
    'Custom',
    0.00, -- Custom pricing
    0.00,
    NULL, -- Unlimited BOQs
    '{
        "boqs": "Unlimited",
        "training": true,
        "support": "24h call & email support",
        "etender": true,
        "collusion": true,
        "description": "Everything Qilly can offer"
    }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    price_monthly = EXCLUDED.price_monthly,
    price_annual = EXCLUDED.price_annual,
    boq_limit = EXCLUDED.boq_limit,
    features = EXCLUDED.features,
    updated_at = NOW();

-- Step 7: Add RLS policies for pricing_tiers
-- ================================================================

ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read pricing tiers
CREATE POLICY "Anyone can view pricing tiers"
ON pricing_tiers FOR SELECT
TO authenticated
USING (true);

-- Step 8: Verify migration
-- ================================================================

-- Check new columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'contractors'
AND column_name IN ('payment_approved', 'payment_approved_at', 'payment_approved_by', 'monthly_boq_limit', 'boqs_generated_this_month')
ORDER BY column_name;

-- Check pricing tiers
SELECT * FROM pricing_tiers ORDER BY price_monthly;

-- Check contractor payment status
SELECT 
    company_name,
    subscription_tier,
    status,
    payment_approved,
    monthly_boq_limit,
    boqs_generated_this_month
FROM contractors
ORDER BY created_at DESC
LIMIT 10;

-- ================================================================
-- MIGRATION COMPLETE ✅
-- ================================================================

-- Next steps:
-- 1. Deploy updated frontend code
-- 2. Test contractor sign-up with tier selection
-- 3. Test admin two-step approval (contractor → payment)
-- 4. Test login restrictions for unpaid contractors
-- ================================================================