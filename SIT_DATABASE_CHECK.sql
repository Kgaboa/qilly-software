-- ============================================
-- SIT Database Health Check
-- ============================================
-- Run this in Supabase SQL Editor to verify database setup
-- https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql
-- ============================================

-- 1. Check if all required tables exist
SELECT 
  'Tables Check' as check_type,
  CASE 
    WHEN COUNT(*) >= 8 THEN '✅ PASS - All tables exist'
    ELSE '❌ FAIL - Missing tables. Run COMPLETE_DATABASE_SETUP.sql'
  END as status,
  COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN ('users', 'bills', 'bill_items', 'suppliers', 'contractors', 'subscriptions', 'provinces', 'municipalities');

-- 2. List all existing tables
SELECT 
  '📋 Existing Tables' as info,
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 3. Check contractors table structure
SELECT 
  '🔍 Contractors Table Columns' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'contractors'
ORDER BY ordinal_position;

-- 4. Check RLS policies on contractors table
SELECT 
  '🔒 RLS Policies' as info,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'contractors';

-- 5. Check if contractors table has RLS enabled
SELECT 
  'RLS Status' as check_type,
  relname as table_name,
  CASE 
    WHEN relrowsecurity THEN '✅ RLS Enabled'
    ELSE '⚠️ RLS Disabled'
  END as status
FROM pg_class
WHERE relname = 'contractors';

-- 6. Count existing contractors
SELECT 
  '📊 Data Check' as info,
  COUNT(*) as contractor_count,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count
FROM contractors;

-- 7. Check recent contractors (if any)
SELECT 
  '📋 Recent Contractors' as info,
  id,
  company_name,
  email,
  status,
  subscription_tier,
  created_at
FROM contractors
ORDER BY created_at DESC
LIMIT 5;

-- ============================================
-- EXPECTED RESULTS:
-- ============================================
-- ✅ Tables Check: PASS - All tables exist (8 tables)
-- ✅ RLS Status: RLS Enabled
-- ✅ RLS Policies: At least 3 policies on contractors table
-- ============================================

-- ============================================
-- IF ANY CHECK FAILS:
-- ============================================
-- 1. Run COMPLETE_DATABASE_SETUP.sql
-- 2. Re-run this check script
-- 3. If still failing, check Supabase logs
-- ============================================
