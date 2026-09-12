-- ========================================
-- VERIFY QILLY SETUP - RUN THIS TO CHECK EVERYTHING
-- ========================================

-- Check 1: Does admin user exist?
SELECT '========================================' as separator;
SELECT 'CHECK 1: Admin User' as check_name;
SELECT '========================================' as separator;

SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Admin user EXISTS'
    ELSE '❌ Admin user DOES NOT EXIST - Create in Dashboard!'
  END as status,
  COUNT(*) as user_count
FROM auth.users
WHERE email = 'admin@qilly.co.za';

-- Show admin user details if exists
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'admin@qilly.co.za';

-- Check 2: Do admin policies exist?
SELECT '========================================' as separator;
SELECT 'CHECK 2: Admin Policies' as check_name;
SELECT '========================================' as separator;

SELECT 
  tablename,
  policyname,
  cmd as permission_type
FROM pg_policies
WHERE tablename IN ('suppliers', 'contractors', 'popia_consent_log')
AND policyname LIKE '%Admin%'
ORDER BY tablename, cmd;

SELECT 
  CASE 
    WHEN COUNT(*) >= 6 THEN '✅ Admin policies exist (at least 6 found)'
    ELSE '⚠️ Only ' || COUNT(*) || ' admin policies found (should be 6+)'
  END as status
FROM pg_policies
WHERE tablename IN ('suppliers', 'contractors', 'popia_consent_log')
AND policyname LIKE '%Admin%';

-- Check 3: Do suppliers exist?
SELECT '========================================' as separator;
SELECT 'CHECK 3: Suppliers' as check_name;
SELECT '========================================' as separator;

SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ ' || COUNT(*) || ' supplier(s) registered'
    ELSE '❌ No suppliers found'
  END as status
FROM suppliers;

-- Show suppliers
SELECT 
  id, 
  company_name, 
  email, 
  status, 
  created_at
FROM suppliers
ORDER BY created_at DESC
LIMIT 10;

-- Check 4: Do contractors exist?
SELECT '========================================' as separator;
SELECT 'CHECK 4: Contractors' as check_name;
SELECT '========================================' as separator;

SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ ' || COUNT(*) || ' contractor(s) registered'
    ELSE 'ℹ️ No contractors yet'
  END as status
FROM contractors;

-- Show contractors
SELECT 
  id, 
  company_name, 
  email, 
  status, 
  created_at
FROM contractors
ORDER BY created_at DESC
LIMIT 10;

-- Check 5: Column counts
SELECT '========================================' as separator;
SELECT 'CHECK 5: Table Columns' as check_name;
SELECT '========================================' as separator;

SELECT 
  'suppliers' as table_name,
  COUNT(*) as column_count,
  CASE 
    WHEN COUNT(*) >= 31 THEN '✅ All columns present'
    ELSE '❌ Missing columns! Should be 31, found ' || COUNT(*)
  END as status
FROM information_schema.columns
WHERE table_name = 'suppliers';

SELECT 
  'contractors' as table_name,
  COUNT(*) as column_count,
  CASE 
    WHEN COUNT(*) >= 33 THEN '✅ All columns present'
    ELSE '❌ Missing columns! Should be 33, found ' || COUNT(*)
  END as status
FROM information_schema.columns
WHERE table_name = 'contractors';

-- Check 6: POPIA consent logs
SELECT '========================================' as separator;
SELECT 'CHECK 6: POPIA Consent Logs' as check_name;
SELECT '========================================' as separator;

SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ ' || COUNT(*) || ' consent log(s) recorded'
    ELSE 'ℹ️ No consent logs yet'
  END as status
FROM popia_consent_log;

-- Summary
SELECT '========================================' as separator;
SELECT 'SUMMARY' as section;
SELECT '========================================' as separator;

SELECT 
  '✅ Tables created' as item,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'suppliers') THEN 'YES' ELSE 'NO' END as status
UNION ALL
SELECT 
  '✅ Admin policies exist' as item,
  CASE WHEN COUNT(*) >= 6 THEN 'YES' ELSE 'NO' END as status
FROM pg_policies WHERE policyname LIKE '%Admin%'
UNION ALL
SELECT 
  '✅ Admin user exists' as item,
  CASE WHEN COUNT(*) > 0 THEN 'YES' ELSE 'NO - CREATE IN DASHBOARD!' END as status
FROM auth.users WHERE email = 'admin@qilly.co.za'
UNION ALL
SELECT 
  '✅ Suppliers registered' as item,
  CASE WHEN COUNT(*) > 0 THEN 'YES (' || COUNT(*) || ')' ELSE 'NO' END as status
FROM suppliers;

-- Final status
SELECT '========================================' as separator;
SELECT 'NEXT STEPS' as section;
SELECT '========================================' as separator;

SELECT 
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@qilly.co.za')
    THEN '❌ CREATE ADMIN USER in Supabase Dashboard (Authentication → Users → Add User)'
    WHEN NOT EXISTS (SELECT 1 FROM suppliers)
    THEN 'ℹ️ Test supplier signup at http://localhost:5173'
    WHEN EXISTS (SELECT 1 FROM suppliers WHERE status = 'pending')
    THEN '✅ Login as admin and APPROVE pending suppliers!'
    ELSE '✅ ALL SETUP COMPLETE! System ready for Monday! 🚀'
  END as next_action;
