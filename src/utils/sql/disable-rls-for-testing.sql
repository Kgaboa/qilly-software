-- =====================================================
-- DISABLE RLS FOR TESTING (DEVELOPMENT ONLY)
-- =====================================================
-- Use this ONLY in development if you're having RLS issues
-- DO NOT use in production!
-- =====================================================

-- Temporarily disable RLS on all tables
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE bills DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('organizations', 'team_members', 'bills');

-- Expected result: rowsecurity = false for all tables

-- =====================================================
-- TO RE-ENABLE RLS LATER
-- =====================================================
/*
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
*/
