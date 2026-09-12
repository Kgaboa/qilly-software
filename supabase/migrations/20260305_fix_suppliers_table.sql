-- Fix suppliers table: Add missing columns
-- Created: 2026-03-05
-- Purpose: Add missing columns that SupplierSignup component expects

-- Add missing columns to suppliers table if they don't exist
ALTER TABLE suppliers
ADD COLUMN IF NOT EXISTS bbbee_level TEXT,
ADD COLUMN IF NOT EXISTS has_certification BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS years_in_business INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS product_categories TEXT[] DEFAULT '{}';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_subscription_tier ON suppliers(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Suppliers table updated with missing columns';
  RAISE NOTICE '✅ Added: bbbee_level, has_certification, years_in_business, product_categories';
  RAISE NOTICE '✅ Indexes created for performance';
END $$;
