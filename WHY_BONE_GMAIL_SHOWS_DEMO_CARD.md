# 🔍 WHY bone@gmail.com Shows Demo Card (Not Contractor Profile)

## 📊 What the Logs Tell Us

```
🔍 Loading user profile for: bone@gmail.com
✅ Regular user account detected: bone@gmail.com     ← Found in public.users
🔍 Loading contractor data for email: bone@gmail.com
ℹ️  No contractor record found for this user        ← NOT found in contractors
```

**vs**

```
🔍 Loading user profile for: kgabo123@gmail.com
✅ Contractor account detected: Cestasoft contactor  ← Found in contractors
📋 Contractor record found: {...}
```

## 🚨 The Problem

The system is **NOT finding bone@gmail.com** in the `contractors` table.

## 🔍 Possible Causes (Most Likely First)

### 1. ✅ **RLS (Row Level Security) is Enabled** ⭐ MOST LIKELY

**Symptom:** Query runs but returns empty array  
**Cause:** RLS policies block the query from seeing contractor records  
**Fix:** Run `/DISABLE_RLS_COMPLETE_V2.sql` on DEV environment

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'contractors';

-- If rowsecurity = true, RLS is blocking queries!
```

### 2. ⚠️ **Contractor Record Doesn't Exist**

**Symptom:** bone@gmail.com exists in `auth.users` and `public.users` but NOT in `contractors`  
**Cause:** Contractor record was never created or was deleted  
**Fix:** Create the contractor record manually

```sql
-- Check if record exists
SELECT * FROM contractors WHERE email = 'bone@gmail.com';

-- If empty, create the record (see FIX_MISSING_CONTRACTORS.sql)
```

### 3. ⚠️ **Email Mismatch**

**Symptom:** Contractor exists but email doesn't match exactly  
**Cause:** Capitalization, spaces, or typos  
**Fix:** Check for case-sensitive issues

```sql
-- Case-insensitive search
SELECT * FROM contractors WHERE LOWER(email) = 'bone@gmail.com';

-- Search for partial match
SELECT * FROM contractors WHERE email LIKE '%bone%';
```

### 4. ⚠️ **Status is Not 'approved'**

**Symptom:** Contractor exists but `status = 'pending'` or NULL  
**Cause:** When you added 18 CIDB grades, maybe the status was reset?  
**Fix:** Update status to 'approved'

```sql
-- Check status
SELECT email, status FROM contractors WHERE email = 'bone@gmail.com';

-- If status is not 'approved', update it
UPDATE contractors 
SET status = 'approved', updated_at = NOW()
WHERE email = 'bone@gmail.com';
```

---

## ⚡ Quick Fix (30 Seconds)

### Step 1: Go to Supabase SQL Editor

```
https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
```

### Step 2: Run Diagnostic Query

```sql
-- Find bone@gmail.com in all tables
SELECT 
  'contractors' as source_table,
  email,
  status,
  cidb_grade,
  company_name
FROM contractors
WHERE email = 'bone@gmail.com'

UNION ALL

SELECT 
  'public.users' as source_table,
  email,
  role as status,
  NULL as cidb_grade,
  full_name as company_name
FROM public.users
WHERE email = 'bone@gmail.com';
```

### Step 3: Interpret Results

**If contractors table is EMPTY:**
- ❌ Contractor record doesn't exist → Create it
- ❌ RLS is blocking the query → Run `/DISABLE_RLS_COMPLETE_V2.sql`

**If contractors table returns a row:**
- ✅ Record exists!
- Check `status` column:
  - If NOT 'approved' → Update to 'approved'
  - If NULL → Update to 'approved'

---

## 🔧 Fix Script

### Fix #1: Disable RLS (RECOMMENDED - Try This First)

```sql
-- Run the complete disable script
-- File: /DISABLE_RLS_COMPLETE_V2.sql

-- Quick version:
ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE bills DISABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items DISABLE ROW LEVEL SECURITY;

-- Grant all permissions
GRANT ALL ON contractors TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.users TO postgres, anon, authenticated, service_role;
```

### Fix #2: Approve All Pending Contractors

```sql
-- Update all contractors to 'approved' status
UPDATE contractors
SET status = 'approved', updated_at = NOW()
WHERE status IS NULL OR status != 'approved';

-- Verify
SELECT email, company_name, status, cidb_grade
FROM contractors
ORDER BY created_at DESC;
```

### Fix #3: Create Missing Contractor Record

```sql
-- If bone@gmail.com doesn't exist in contractors table
INSERT INTO contractors (
  user_id,
  email,
  company_name,
  contact_person,
  cidb_registration_number,
  cidb_grade,
  status,
  subscription_tier,
  annual_turnover,
  operating_provinces,
  project_types
)
SELECT 
  au.id,
  au.email,
  'Bone Construction',  -- Change this
  'Bone User',          -- Change this
  'CIDB/2024/BONE123',  -- Change this
  'Grade 4 GB',         -- Change this
  'approved',
  'FREE',
  0,
  ARRAY['GP']::text[],
  ARRAY['General Building']::text[]
FROM auth.users au
WHERE au.email = 'bone@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM contractors c WHERE c.email = au.email);
```

---

## 🧪 Test After Fix

### Step 1: Hard Refresh

```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### Step 2: Login as bone@gmail.com

**Expected Console Logs:**
```
✅ Contractor account detected: [Company Name]
📋 Contractor record found: {...}
✅ Contractor data loaded from Supabase: {...}
```

**Expected Result:**
```
✅ See contractor card in header (not demo card)
✅ See company name, CIDB grade, provinces
✅ Default view is "Template Library"
```

---

## 📋 Checklist

Run these queries on **DEV Supabase** (zzdzrlglivtpawtitvgu):

- [ ] Check if RLS is enabled on `contractors` table
- [ ] Check if bone@gmail.com exists in `contractors` table
- [ ] Check status of bone@gmail.com contractor record
- [ ] Disable RLS if enabled
- [ ] Update status to 'approved' if needed
- [ ] Create contractor record if missing
- [ ] Hard refresh browser
- [ ] Test login as bone@gmail.com
- [ ] Verify contractor card appears (not demo card)

---

## 🎯 Answer to Your Question

> "Is it because we've added all these 18 CIDB grades?"

**Possibly YES!** When you added the 18 CIDB grades, you might have:

1. ✅ **Migrated the contractors table** → Some records lost
2. ✅ **Updated CIDB grade values** → Validation broke
3. ✅ **Reset status column** → All contractors set to 'pending'
4. ✅ **Enabled RLS** → Access blocked

**Most likely:** The contractor records exist but either:
- RLS is blocking access
- Status is not 'approved'

**Solution:** Run `/DISABLE_RLS_COMPLETE_V2.sql` and update all contractor statuses to 'approved'

---

**Last Updated:** March 9, 2026  
**Environment:** DEV (zzdzrlglivtpawtitvgu)  
**Affected Users:** bone@gmail.com and other new contractors
