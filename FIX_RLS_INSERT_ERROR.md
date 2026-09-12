# 🔧 IMMEDIATE FIX - RLS INSERT Error

## ❌ The Error You're Seeing

```
⚠️ User not found in users table. Creating record...
❌ Failed to create user record: {
  "code": "42501",
  "details": null,
  "hint": null,
  "message": "new row violates row-level security policy for table \"users\""
}
```

## 🎯 Root Cause

**Problem:** RLS (Row Level Security) is blocking INSERT operations on the `users` table.

**Why:** There's no RLS policy allowing authenticated users to INSERT their own record when they first login.

**When it happens:** 
- User authenticates successfully (email/password correct)
- System checks if user exists in `public.users` table
- User doesn't exist (only exists in `auth.users`)
- System tries to INSERT a new record
- RLS blocks it → Error code 42501

## ✅ The Fix (2 Minutes)

### Run Updated SQL Script

**File:** `/FIX_RLS_POLICIES.sql` (ALREADY UPDATED)

**Go to:**
```
https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
```

**Steps:**
1. Open `/FIX_RLS_POLICIES.sql` 
2. Copy **ALL** content
3. Paste into Supabase SQL Editor
4. Click **RUN**

**Expected output:**
```
✅ RLS policies created successfully!

Next steps:
1. Hard refresh your browser (Ctrl+Shift+R)
2. Login as bone@gmail.com
3. Process a BOQ
4. Check console for: "✅ Supabase trial_bills_remaining updated to: X"
5. Run CHECK_TRIAL_COUNTDOWN.sql to verify
```

## 🔍 What the Fix Does

The updated script now creates **7 policies** (previously 6):

### NEW: Policy 3 - Users Can Insert Own Record

```sql
CREATE POLICY "Users can create own record"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);
```

**What it does:**
- Allows authenticated users to INSERT a row where `id = auth.uid()`
- Solves the "new row violates row-level security policy" error
- Happens automatically during first login

### All 7 Policies Created:

| # | Policy | Table | Command | Purpose |
|---|--------|-------|---------|---------|
| 1 | Users can update own trial count | `users` | UPDATE | Trial countdown |
| 2 | Users can view own record | `users` | SELECT | Dashboard data |
| 3 | **Users can create own record** | `users` | **INSERT** | **First login** ✅ NEW |
| 4 | Users can view own bills | `bills` | SELECT | View history |
| 5 | Users can create own bills | `bills` | INSERT | Save BOQs |
| 6 | Users can view own bill items | `bill_items` | SELECT | View details |
| 7 | Users can create own bill items | `bill_items` | INSERT | Save items |

## 🧪 Test After Running SQL

### Step 1: Hard Refresh
```
Ctrl + Shift + R
```

### Step 2: Login
```
Email: bone@gmail.com
Password: (your password)
```

### Step 3: Check Console (F12)

**Expected (NO errors):**
```
✅ User record created successfully
✅ Loading contractor profile...
✅ Contractor profile loaded
```

**NOT this (error fixed):**
```
❌ Failed to create user record: {
  "code": "42501",
  ...
}
```

### Step 4: Verify User Record Created

Run this SQL in Supabase:
```sql
SELECT 
  id,
  email,
  full_name,
  role,
  trial_bills_remaining,
  created_at
FROM public.users
WHERE email = 'bone@gmail.com';
```

**Expected:**
- Should return 1 row
- `trial_bills_remaining = 3`
- `role = 'contractor'`

## 🔄 How It Works Now

### Before Fix ❌

1. User logs in → Auth succeeds
2. System checks `public.users` table
3. User not found → Try to INSERT
4. RLS blocks INSERT → **ERROR 42501**
5. User stuck, can't proceed

### After Fix ✅

1. User logs in → Auth succeeds
2. System checks `public.users` table
3. User not found → Try to INSERT
4. **RLS allows INSERT** (Policy 3) → Success ✅
5. User record created with:
   - `id = auth.uid()`
   - `email = auth.user.email`
   - `trial_bills_remaining = 3`
6. Dashboard loads normally

## 🚨 If Still Getting Errors

### Error: "42501" persists after running SQL

**Check RLS is enabled:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';
```

**Expected:**
```
tablename | rowsecurity
----------|------------
users     | t           ✅ (t = true)
```

**If `rowsecurity = f` (false):**
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

---

### Error: Policy already exists

**This is OK!** The script uses `DROP POLICY IF EXISTS` so it's safe to run multiple times.

Just ignore warnings like:
```
NOTICE: policy "Users can create own record" does not exist, skipping
```

---

### Error: Still can't create user

**Temporary workaround (DEMO ONLY - NOT PRODUCTION):**

Disable RLS temporarily to test:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

Then re-enable after testing:
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

---

## ✅ Success Checklist

After running `/FIX_RLS_POLICIES.sql`:

- [ ] SQL shows: "✅ RLS policies created successfully!"
- [ ] Verify shows 7+ policies for `users` table
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Login as bone@gmail.com
- [ ] **NO error 42501** ✅
- [ ] Console: "✅ User record created successfully"
- [ ] Dashboard loads with contractor card
- [ ] Badge shows: "Free Trial (3 bills left)"
- [ ] Can process BOQ without errors

---

## 📊 Summary

**Error:** `new row violates row-level security policy for table "users"`

**Cause:** Missing INSERT policy on `users` table

**Fix:** Run updated `/FIX_RLS_POLICIES.sql` (includes Policy 3)

**Test:** Login → Should work without errors

**Result:** Users can now create their own record during first login ✅

---

**Ready to test!** Run the SQL script now and the error will be fixed. 🚀
