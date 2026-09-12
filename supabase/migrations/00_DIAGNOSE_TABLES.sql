-- ========================================
-- DIAGNOSTIC SCRIPT: Check current table structure
-- ========================================
-- Run this FIRST to see what columns you already have

-- Check what columns exist in suppliers table
SELECT 
  'SUPPLIERS' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'suppliers'
ORDER BY ordinal_position;

-- Check what columns exist in contractors table
SELECT 
  'CONTRACTORS' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'contractors'
ORDER BY ordinal_position;

-- Check if tables exist at all
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('suppliers', 'contractors', 'popia_consent_log')
ORDER BY table_name;
