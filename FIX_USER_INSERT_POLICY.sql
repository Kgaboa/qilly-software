-- =====================================================
-- FIX USER INSERT POLICY
-- This allows authenticated users to insert their own
-- record into the users table during first login
-- =====================================================

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create a more permissive policy that allows authenticated users to insert their own record
CREATE POLICY "Users can insert own data"
ON users FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());

-- Also make sure the admin policy exists for viewing all users
DROP POLICY IF EXISTS "Admins can view all users" ON users;

CREATE POLICY "Admins can view all users"
ON users FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Allow users to view their own data
DROP POLICY IF EXISTS "Users can view own data" ON users;

CREATE POLICY "Users can view own data"
ON users FOR SELECT TO authenticated
USING (id = auth.uid());

-- Verify policies
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '✅ USER TABLE POLICIES UPDATED' as status;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;

SELECT 
  policyname,
  cmd as operation,
  CASE 
    WHEN policyname LIKE '%Admin%' THEN '👑 Admin'
    WHEN policyname LIKE '%own%' THEN '👤 Self'
    ELSE '🔧 Other'
  END as policy_type
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY cmd, policyname;

SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
SELECT '✅ Now try logging in as admin again!' as next_step;
SELECT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' as line;
