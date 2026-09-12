-- ============================================
-- 🚀 QUICK FIX - RUN THIS NOW IN SUPABASE
-- ============================================
-- Fixes: "new row violates row-level security policy"
-- Copy and paste this entire file into Supabase SQL Editor
-- ============================================

-- Drop all existing contractor policies
DROP POLICY IF EXISTS "contractors_insert_policy" ON contractors;
DROP POLICY IF EXISTS "contractors_select_policy" ON contractors;
DROP POLICY IF EXISTS "contractors_update_policy" ON contractors;
DROP POLICY IF EXISTS "contractors_delete_policy" ON contractors;
DROP POLICY IF EXISTS "Users can create contractor profiles" ON contractors;
DROP POLICY IF EXISTS "Authenticated users can read contractors" ON contractors;
DROP POLICY IF EXISTS "Users can update own contractor profile" ON contractors;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON contractors;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON contractors;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON contractors;

-- Create NEW policies that allow signup to work
CREATE POLICY "contractors_insert_policy"
  ON contractors FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = contractors.user_id)
  );

CREATE POLICY "contractors_select_policy"
  ON contractors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "contractors_update_policy"
  ON contractors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "contractors_delete_policy"
  ON contractors FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON contractors TO anon;
GRANT ALL ON contractors TO authenticated;

-- Verify (should show 4 policies)
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'contractors' ORDER BY cmd;

-- Success!
SELECT '✅ RLS POLICIES FIXED! Try contractor signup now.' as status;
