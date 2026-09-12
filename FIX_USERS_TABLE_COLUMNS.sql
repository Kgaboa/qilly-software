-- ============================================
-- FIX: Add Missing Columns to Users Table
-- ============================================
-- This fixes the error:
-- "Could not find the 'subscription_tier' column of 'users'"
--
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: Check current users table structure
-- ============================================
-- Run this first to see what columns you have:
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- ============================================
-- STEP 2: Add missing columns to users table
-- ============================================

-- Add subscription_tier column (if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_tier TEXT DEFAULT 'FREE';
    RAISE NOTICE '✅ Added subscription_tier column';
  ELSE
    RAISE NOTICE 'ℹ️  subscription_tier column already exists';
  END IF;
END $$;

-- Add full_name column (if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE users ADD COLUMN full_name TEXT;
    RAISE NOTICE '✅ Added full_name column';
  ELSE
    RAISE NOTICE 'ℹ️  full_name column already exists';
  END IF;
END $$;

-- Add company_name column (if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE users ADD COLUMN company_name TEXT;
    RAISE NOTICE '✅ Added company_name column';
  ELSE
    RAISE NOTICE 'ℹ️  company_name column already exists';
  END IF;
END $$;

-- Add cidb_grade column (if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'cidb_grade'
  ) THEN
    ALTER TABLE users ADD COLUMN cidb_grade TEXT;
    RAISE NOTICE '✅ Added cidb_grade column';
  ELSE
    RAISE NOTICE 'ℹ️  cidb_grade column already exists';
  END IF;
END $$;

-- Add contact_number column (if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'contact_number'
  ) THEN
    ALTER TABLE users ADD COLUMN contact_number TEXT;
    RAISE NOTICE '✅ Added contact_number column';
  ELSE
    RAISE NOTICE 'ℹ️  contact_number column already exists';
  END IF;
END $$;

-- Add phone column (if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone TEXT;
    RAISE NOTICE '✅ Added phone column';
  ELSE
    RAISE NOTICE 'ℹ️  phone column already exists';
  END IF;
END $$;

-- Add is_premium column (if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_premium'
  ) THEN
    ALTER TABLE users ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
    RAISE NOTICE '✅ Added is_premium column';
  ELSE
    RAISE NOTICE 'ℹ️  is_premium column already exists';
  END IF;
END $$;

-- Add trial_bills_remaining column (if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'trial_bills_remaining'
  ) THEN
    ALTER TABLE users ADD COLUMN trial_bills_remaining INTEGER DEFAULT 3;
    RAISE NOTICE '✅ Added trial_bills_remaining column';
  ELSE
    RAISE NOTICE 'ℹ️  trial_bills_remaining column already exists';
  END IF;
END $$;

-- Add subscription_expires_at column (if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'subscription_expires_at'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_expires_at TIMESTAMPTZ;
    RAISE NOTICE '✅ Added subscription_expires_at column';
  ELSE
    RAISE NOTICE 'ℹ️  subscription_expires_at column already exists';
  END IF;
END $$;

-- Add updated_at column (if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE users ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE '✅ Added updated_at column';
  ELSE
    RAISE NOTICE 'ℹ️  updated_at column already exists';
  END IF;
END $$;

-- ============================================
-- STEP 3: Fix users table primary key (if needed)
-- ============================================

-- Check if id column references auth.users
DO $$ 
BEGIN
  -- Drop existing primary key constraint if it exists and recreate it
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'users' 
    AND constraint_type = 'PRIMARY KEY'
  ) THEN
    RAISE NOTICE 'ℹ️  Primary key already exists on users table';
  ELSE
    ALTER TABLE users ADD PRIMARY KEY (id);
    RAISE NOTICE '✅ Added primary key to users table';
  END IF;

  -- Add foreign key reference to auth.users if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'users' 
    AND constraint_name LIKE '%users_id_fkey%'
  ) THEN
    -- Drop existing foreign key if it exists
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;
    
    -- Add foreign key reference to auth.users
    ALTER TABLE users ADD CONSTRAINT users_id_fkey 
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    
    RAISE NOTICE '✅ Added foreign key reference to auth.users';
  ELSE
    RAISE NOTICE 'ℹ️  Foreign key to auth.users already exists';
  END IF;
END $$;

-- ============================================
-- STEP 4: Create updated_at trigger (if missing)
-- ============================================

-- Create function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- Create trigger
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

RAISE NOTICE '✅ Created updated_at trigger';

-- ============================================
-- STEP 5: Verify the updated users table structure
-- ============================================

-- Show all columns in users table
SELECT 
  column_name, 
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- ============================================
-- STEP 6: Verify foreign key constraints
-- ============================================

SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'users' AND tc.constraint_type = 'FOREIGN KEY';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ USERS TABLE COLUMNS UPDATED SUCCESSFULLY!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Added/Verified Columns:';
  RAISE NOTICE '  ✅ subscription_tier (TEXT, default: FREE)';
  RAISE NOTICE '  ✅ full_name (TEXT)';
  RAISE NOTICE '  ✅ company_name (TEXT)';
  RAISE NOTICE '  ✅ cidb_grade (TEXT)';
  RAISE NOTICE '  ✅ contact_number (TEXT)';
  RAISE NOTICE '  ✅ phone (TEXT)';
  RAISE NOTICE '  ✅ is_premium (BOOLEAN, default: false)';
  RAISE NOTICE '  ✅ trial_bills_remaining (INTEGER, default: 3)';
  RAISE NOTICE '  ✅ subscription_expires_at (TIMESTAMPTZ)';
  RAISE NOTICE '  ✅ updated_at (TIMESTAMPTZ)';
  RAISE NOTICE '';
  RAISE NOTICE '🔗 Foreign Key:';
  RAISE NOTICE '  ✅ id → auth.users(id) ON DELETE CASCADE';
  RAISE NOTICE '';
  RAISE NOTICE '⚡ Triggers:';
  RAISE NOTICE '  ✅ update_users_updated_at (auto-update updated_at)';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Next Steps:';
  RAISE NOTICE '  1. Test contractor signup in your app';
  RAISE NOTICE '  2. Try uploading a BOQ';
  RAISE NOTICE '  3. Verify user record is created';
  RAISE NOTICE '  4. Check that bills save successfully';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Ready to test!';
  RAISE NOTICE '';
END $$;
