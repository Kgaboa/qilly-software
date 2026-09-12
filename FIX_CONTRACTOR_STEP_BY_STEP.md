# 🔧 Fix Contractor Signup - Step by Step

## ⚠️ ERROR YOU'RE SEEING:
```
ERROR: 42703: column users.user_type does not exist
```

---

## ✅ SOLUTION: Run These 4 Steps

Copy and paste each section ONE AT A TIME into Supabase SQL Editor.

---

## **STEP 1: Add user_type Column**

```sql
-- Add user_type column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'user';
```

**Expected:** ✅ Success (no errors)

---

## **STEP 2: Set Admin User**

```sql
-- Set admin@qilly.co.za as admin
INSERT INTO public.users (id, email, user_type)
SELECT 
  id, 
  email, 
  'admin'
FROM auth.users
WHERE email = 'admin@qilly.co.za'
ON CONFLICT (id) 
DO UPDATE SET user_type = 'admin';
```

**Expected:** ✅ 1 row inserted/updated

---

## **STEP 3: Drop Old Policies**

```sql
-- Drop all old RLS policies
DROP POLICY IF EXISTS "contractors_select_policy" ON public.contractors;
DROP POLICY IF EXISTS "contractors_insert_policy" ON public.contractors;
DROP POLICY IF EXISTS "contractors_update_policy" ON public.contractors;
DROP POLICY IF EXISTS "contractors_delete_policy" ON public.contractors;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;
DROP POLICY IF EXISTS "Contractors can view their own data" ON public.contractors;
DROP POLICY IF EXISTS "Admins have full access to contractors" ON public.contractors;
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.contractors;

-- Enable RLS
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

**Expected:** ✅ Multiple "DROP POLICY" messages

---

## **STEP 4: Create New Policies**

```sql
-- ========================================
-- USERS TABLE POLICIES
-- ========================================

-- SELECT: All authenticated users can read users table (needed for admin checks)
CREATE POLICY "users_select_policy" ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Users can only insert their own record
CREATE POLICY "users_insert_policy" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can only update their own record
CREATE POLICY "users_update_policy" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DELETE: Users can only delete their own record
CREATE POLICY "users_delete_policy" ON public.users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ========================================
-- CONTRACTORS TABLE POLICIES
-- ========================================

-- SELECT: Contractors can view their own data OR admins can view all
CREATE POLICY "contractors_select_policy" ON public.contractors
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'
    )
  );

-- INSERT: Authenticated users can insert their own contractor record
CREATE POLICY "contractors_insert_policy" ON public.contractors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Contractors can update their own data OR admins can update all
CREATE POLICY "contractors_update_policy" ON public.contractors
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'
    )
  );

-- DELETE: Only admins can delete contractors
CREATE POLICY "contractors_delete_policy" ON public.contractors
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'
    )
  );

-- ========================================
-- GRANT PERMISSIONS
-- ========================================

GRANT SELECT, INSERT, UPDATE ON public.contractors TO authenticated;
GRANT SELECT ON public.contractors TO anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
```

**Expected:** ✅ 8 policies created + grants

---

## **STEP 5: Verify**

```sql
-- Check user_type column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name = 'user_type';

-- Check policies created
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('contractors', 'users')
AND schemaname = 'public'
GROUP BY tablename;
```

**Expected:**
```
✅ user_type | text
✅ contractors | 4
✅ users | 4
```

---

## **STEP 6: Test**

1. Clear browser cache: `Ctrl+F5`
2. Go to contractor signup
3. Fill in all fields (including CIDB registration)
4. Submit
5. Should work! ✅

---

## **What We Fixed:**

| Issue | Before | After |
|-------|--------|-------|
| user_type column | ❌ Missing | ✅ Added |
| Admin user | ❌ Not set | ✅ Set |
| RLS policies | ❌ Reference missing column | ✅ Fixed |
| Contractor signup | ❌ Fails | ✅ Works |
| Contractor login | ❌ Fails | ✅ Works |

---

## **If It Still Fails:**

### **Check if column was added:**
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'user_type';
```

Should return 1 row.

### **Check policies:**
```sql
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'contractors';
```

Should return 4 rows.

---

## **Quick Reference:**

| Step | What It Does | Time |
|------|-------------|------|
| 1 | Add user_type column | 5 sec |
| 2 | Set admin user | 5 sec |
| 3 | Drop old policies | 10 sec |
| 4 | Create new policies | 15 sec |
| 5 | Verify | 5 sec |

**Total:** ~40 seconds

---

**This fixes the "column users.user_type does not exist" error!** 🚀
