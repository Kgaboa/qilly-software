# 🚨 QUICK FIX: RLS Error 42501

## ⚡ 3-Step Fix (Do This Now)

### Step 1: Open Supabase
Go to: **Supabase Dashboard → SQL Editor**

### Step 2: Copy & Run This SQL

```sql
-- Drop old policies
DROP POLICY IF EXISTS "contractors_insert_policy" ON contractors;
DROP POLICY IF EXISTS "contractors_select_policy" ON contractors;
DROP POLICY IF EXISTS "contractors_update_policy" ON contractors;
DROP POLICY IF EXISTS "contractors_delete_policy" ON contractors;

-- Create new policies (allows anon inserts)
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
```

### Step 3: Test Signup
Use a **NEW email** (not one you tried before)

---

## ✅ What This Does

- **Before:** RLS blocked anon users → signup failed
- **After:** RLS allows anon inserts → signup works!
- **Security:** Still validates user_id exists in auth.users

---

## 📁 More Help

- Full SQL: `/QUICK_FIX_RLS.sql`
- Guide: `/CONTRACTOR_SIGNUP_FIX_GUIDE.md`
- Summary: `/RLS_ERROR_SOLUTION_SUMMARY.md`

---

**Status:** ✅ Ready to fix  
**Time:** 2 minutes  
**Difficulty:** Copy/paste SQL
