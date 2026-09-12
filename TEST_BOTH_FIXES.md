# 🧪 Test Both Fixes - Step by Step Guide

## 🎯 What We Fixed

1. ✅ **Trial Countdown** - Now updates Supabase database (not just localStorage)
2. ✅ **Contractor Card** - SQL script to create missing contractor records

---

## 📋 Testing Instructions

### Part 1: Fix Contractor Card Issue

#### Step 1: Run Diagnostic

```
1. Go to: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
2. Copy and paste: /DIAGNOSE_CONTRACTOR_ISSUE.sql
3. Click: Run
4. Check results for each step
```

**What to look for:**
```
Step 2: Check contractors table
→ If EMPTY ❌ = bone@gmail.com has no contractor record
→ If shows data ✅ = Record exists (RLS might be blocking)

Step 4: Count users vs contractors  
→ missing_contractor_records = 7 ❌ = Need to run fix script
→ missing_contractor_records = 0 ✅ = All contractors have records
```

#### Step 2: Run Fix Script (if needed)

```
1. Copy and paste: /FIX_ALL_MISSING_CONTRACTORS.sql
2. Click: Run
3. Wait for success message
```

**Expected Output:**
```
✅ ALL CONTRACTORS HAVE RECORDS
total_contractor_users: 8
total_contractor_records: 8
missing_records: 0
```

#### Step 3: Verify Contractor Data

```sql
-- Run this to verify bone@gmail.com now has contractor record:
SELECT 
  email,
  company_name,
  cidb_grade,
  operating_provinces,
  project_types,
  status
FROM contractors
WHERE email = 'bone@gmail.com';
```

**Expected Result:**
```
email: bone@gmail.com
company_name: Bone Construction (Pty) Ltd
cidb_grade: Grade 4 GB
operating_provinces: {GP}
project_types: {General Building, Road Construction, Housing Development}
status: approved
```

---

### Part 2: Test Trial Countdown

#### Step 1: Logout and Login

```
1. Click "Logout" button
2. Login as: bone@gmail.com
3. Hard refresh: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
```

#### Step 2: Check Initial State

**Header Badge Should Show:**
```
✅ Contractor Card (not demo card!)
   - Company: Bone Construction (Pty) Ltd
   - CIDB: Grade 4 GB
   - Provinces: GP
```

**If you still see demo card:**
1. Open browser console (F12)
2. Check for errors
3. Run: `SELECT * FROM contractors WHERE email = 'bone@gmail.com'` in Supabase
4. If data exists but card doesn't show → RLS is blocking

**Fix RLS blocking:**
```sql
ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;
```

#### Step 3: Check Trial Counter

**For regular users (not contractors), check:**

**Header badge:**
```
Free Trial (3 bills left)  ← Initial state
```

**Status card:**
```
Status: Free Trial
3 free bills remaining
```

#### Step 4: Process First BOQ

```
1. Upload a BOQ or use template
2. Click "Price BOQ"
3. Wait for processing
```

**Watch console for:**
```
📋 Trial bill remaining: 2 after successful BOQ processing
🔄 Updating trial_bills_remaining in Supabase for: bone@gmail.com
✅ Supabase trial_bills_remaining updated to: 2
```

**After processing:**
- Header badge: `Free Trial (2 bills left)` ✅
- Status card: `2 free bills remaining` ✅

#### Step 5: Process Second BOQ

```
1. Upload another BOQ
2. Click "Price BOQ"
3. Wait for processing
```

**Console should show:**
```
📋 Trial bill remaining: 1 after successful BOQ processing
✅ Supabase trial_bills_remaining updated to: 1
```

**After processing:**
- Header badge: `Free Trial (1 bill left)` ✅
- Status card: `1 free bill remaining` ⚠️ (Warning: last bill!)

#### Step 6: Process Third BOQ

```
1. Upload another BOQ
2. Click "Price BOQ"
3. Wait for processing
```

**Console should show:**
```
📋 Trial bill remaining: 0 after successful BOQ processing
✅ Supabase trial_bills_remaining updated to: 0
```

**After processing:**
- Header badge: `Trial Used` ✅
- Status card: `Trial complete - Upgrade to continue` ⚠️

#### Step 7: Try Fourth BOQ (Should Be Blocked!)

```
1. Upload another BOQ
2. Click "Price BOQ"
```

**Expected:**
```
❌ Error toast appears:
"Trial complete. You have used all 3 free bill pricings. Please upgrade to continue."
```

---

## ✅ Success Checklist

### Contractor Card Fix:
- [ ] bone@gmail.com shows contractor card (not demo card)
- [ ] Company name displays: "Bone Construction (Pty) Ltd"
- [ ] CIDB grade shows: "Grade 4 GB"
- [ ] Operating provinces show: "GP"
- [ ] Project types show: "General Building, Road Construction, Housing Development"

### Trial Countdown Fix:
- [ ] Initial state shows: "Free Trial (3 bills left)"
- [ ] After 1st BOQ: "Free Trial (2 bills left)"
- [ ] After 2nd BOQ: "Free Trial (1 bill left)"
- [ ] After 3rd BOQ: "Trial Used"
- [ ] 4th BOQ attempt is blocked with error message
- [ ] Console shows Supabase update messages
- [ ] Database value decrements (verify in Supabase dashboard)

---

## 🔍 Troubleshooting

### Issue: Contractor card still not showing

**Diagnostic:**
```javascript
// Open browser console (F12)
const { data: { user } } = await supabase.auth.getUser();
console.log('Auth user:', user);

const { data: contractors } = await supabase
  .from('contractors')
  .select('*')
  .eq('email', user.email);
console.log('Contractors:', contractors);
```

**If contractors array is empty:**
1. Check if SQL script ran successfully
2. Verify data exists: `SELECT * FROM contractors WHERE email = 'bone@gmail.com'`
3. If data exists but query returns empty → RLS is blocking
4. Disable RLS: `ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;`

---

### Issue: Trial counter not decrementing

**Diagnostic:**
```javascript
// Check localStorage
const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
console.log('Local users:', users);

// Check Supabase
const { data } = await supabase
  .from('users')
  .select('email, trial_bills_remaining')
  .eq('email', 'bone@gmail.com');
console.log('Supabase trial:', data);
```

**If localStorage shows decrement but Supabase doesn't:**
1. Check console for Supabase update errors
2. Verify `updated_at` column exists in `users` table
3. Check RLS policies on `users` table

**Fix:**
```sql
-- Add updated_at column if missing
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Check RLS
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';

-- If RLS is blocking updates, add policy:
CREATE POLICY "Users can update own record"
  ON public.users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
```

---

### Issue: Badge shows old value

**Fix:**
```
1. Logout
2. Clear browser cache
3. Hard refresh (Ctrl + Shift + R)
4. Login again
5. Check badge value
```

---

### Issue: Console shows "Could not update Supabase trial"

**This means:**
- User is in demo mode (no real Supabase auth)
- OR RLS is blocking the update
- OR `users` table doesn't exist

**Check:**
```sql
-- Verify users table exists
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';

-- Check RLS policies
SELECT * FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users';
```

---

## 📊 Database Verification

### Check Trial Value in Database:

```sql
-- Real-time check
SELECT 
  email,
  trial_bills_remaining,
  is_premium,
  updated_at
FROM public.users
WHERE email = 'bone@gmail.com';
```

**Expected progression:**
```
Initial:   trial_bills_remaining = 3
After 1st: trial_bills_remaining = 2
After 2nd: trial_bills_remaining = 1
After 3rd: trial_bills_remaining = 0
```

### Check Contractor Record:

```sql
SELECT 
  email,
  company_name,
  cidb_grade,
  status,
  operating_provinces,
  project_types
FROM contractors
WHERE email = 'bone@gmail.com';
```

**Expected:**
```
email: bone@gmail.com
company_name: Bone Construction (Pty) Ltd
cidb_grade: Grade 4 GB
status: approved
operating_provinces: {GP}
project_types: {General Building, Road Construction, Housing Development}
```

---

## 🎯 Quick Test Commands

### Test in Browser Console:

```javascript
// Check if user is authenticated
const { data: { user } } = await supabase.auth.getUser();
console.log('Authenticated as:', user?.email);

// Check contractor record
const { data: contractors } = await supabase
  .from('contractors')
  .select('*')
  .eq('email', user?.email);
console.log('Contractor data:', contractors);

// Check trial remaining
const { data: userData } = await supabase
  .from('users')
  .select('email, trial_bills_remaining')
  .eq('email', user?.email);
console.log('Trial remaining:', userData);

// Update trial manually (for testing)
const { error } = await supabase
  .from('users')
  .update({ trial_bills_remaining: 3 })
  .eq('email', user?.email);
console.log('Reset trial:', error ? 'Failed' : 'Success');
```

---

## 🎉 Expected Final State

**After all fixes:**

```
Login as bone@gmail.com
  ↓
✅ Contractor card shows with:
   - Company: Bone Construction (Pty) Ltd
   - CIDB: Grade 4 GB
   - Provinces: GP
   - Projects: General Building, Road Construction, Housing Development
  ↓
✅ Process 3 BOQs successfully
   - 1st BOQ → Header: "Free Trial (2 bills left)"
   - 2nd BOQ → Header: "Free Trial (1 bill left)"
   - 3rd BOQ → Header: "Trial Used"
  ↓
✅ 4th BOQ blocked with upgrade message
  ↓
✅ Database shows trial_bills_remaining = 0
```

---

**Last Updated:** March 9, 2026  
**Status:** Both fixes applied - Ready to test!  
**Time to complete:** < 10 minutes
