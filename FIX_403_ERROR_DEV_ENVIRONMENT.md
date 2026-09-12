# 🚨 URGENT FIX: 403 Error on DEV Environment

## ❌ Error
```
Failed to load resource: the server responded with a status of 403 ()
❌ Error saving bill to Supabase: Object
```

**Environment:** DEV (zzdzrlglivtpawtitvgu.supabase.co)  
**URL:** https://dev-branch-m39f5ja09-assure-tech-solution.vercel.app/

---

## 🔍 Root Cause

You have **MULTIPLE Supabase projects** (one for each environment), but the RLS disable script was only run on ONE project.

### Your Environments:
- 🟢 **Local/Main** - Unknown status
- 🔴 **DEV** (zzdzrlglivtpawtitvgu) - RLS ENABLED (causing 403 error)
- 🟡 **SIT** - Unknown status  
- 🟡 **PROD** - Unknown status

**The 403 error means:** RLS policies are blocking the bill INSERT operation on the DEV Supabase project.

---

## ✅ Solution (2 Minutes Per Environment)

### Step 1: Find Your Supabase Project URLs

Check your environment variables in Vercel:

| Environment | Supabase URL | Project ID |
|-------------|--------------|------------|
| DEV | zzdzrlglivtpawtitvgu.supabase.co | zzdzrlglivtpawtitvgu |
| SIT | (check Vercel env vars) | (extract from URL) |
| PROD | (check Vercel env vars) | (extract from URL) |

### Step 2: Run RLS Fix on DEV (NOW)

1. **Open DEV Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/**zzdzrlglivtpawtitvgu**/sql/new

2. **Copy the fix script:**
   - Open `/DISABLE_RLS_COMPLETE_V2.sql` in your project
   - Copy the ENTIRE file contents

3. **Run the script:**
   - Paste into the SQL Editor
   - Click **"Run"**
   - Wait for green checkmarks (about 5 seconds)

4. **Verify:**
   - Open: https://dev-branch-m39f5ja09-assure-tech-solution.vercel.app/
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Upload a bill
   - Should work ✅ No more 403 errors

### Step 3: Run RLS Fix on SIT (If Needed)

1. Find your SIT Supabase project ID from Vercel environment variables
2. Go to: https://supabase.com/dashboard/project/**YOUR_SIT_PROJECT_ID**/sql/new
3. Run `/DISABLE_RLS_COMPLETE_V2.sql`
4. Test: Upload bill on SIT environment

### Step 4: Run RLS Fix on PROD (Before Tuesday!)

⚠️ **IMPORTANT:** Run this on PROD environment BEFORE the investor presentation!

1. Find your PROD Supabase project ID
2. Go to: https://supabase.com/dashboard/project/**YOUR_PROD_PROJECT_ID**/sql/new
3. Run `/DISABLE_RLS_COMPLETE_V2.sql`
4. Test: Upload bill on PROD environment

---

## 🔍 How to Find Your Supabase Project IDs

### Method 1: Check Vercel Environment Variables

1. Go to: https://vercel.com/assure-tech-solution/qilly/settings/environment-variables
2. Look for variables like:
   - `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`
   - Example: `https://zzdzrlglivtpawtitvgu.supabase.co`
   - Project ID is: `zzdzrlglivtpawtitvgu` (the subdomain)

### Method 2: Check Browser Console

1. Open your app in the browser
2. Open DevTools (F12)
3. Look for Supabase API calls in Network tab
4. The URL will show: `https://[PROJECT_ID].supabase.co/...`

### Method 3: Check Your Code

Look in:
- `/src/utils/supabase.ts`
- `/src/utils/environment.ts`
- Environment variable files

---

## 📋 Checklist: Fix All Environments

Before Tuesday presentation, ensure you've run the fix on ALL environments:

- [ ] **DEV** (zzdzrlglivtpawtitvgu) - Run `/DISABLE_RLS_COMPLETE_V2.sql`
- [ ] **SIT** (find project ID) - Run `/DISABLE_RLS_COMPLETE_V2.sql`
- [ ] **PROD** (find project ID) - Run `/DISABLE_RLS_COMPLETE_V2.sql`
- [ ] **Test each environment** - Upload a bill and verify no 403 errors

---

## 🧪 Testing After Fix

For each environment:

1. **Clear browser cache**
   - Hard refresh: `Ctrl + Shift + R`

2. **Test bill upload:**
   - Login
   - Upload a sample BOQ
   - Verify bill saves successfully
   - Check console - should see: ✅ Bill saved successfully

3. **Expected results:**
   - ✅ No 403 errors
   - ✅ No "permission denied" errors
   - ✅ Bill appears in history
   - ✅ Can view priced bill

---

## ⚠️ Important Notes

### Demo Mode vs Supabase Mode

The error only occurs when saving to Supabase. Your pricing engine works fine (as shown in the logs), but the **database save** fails due to RLS.

### Why This Happened

- Each environment (DEV/SIT/PROD) has a **separate Supabase project**
- RLS settings are **per-project**, not global
- Fixing RLS on one project doesn't affect others
- You must run the fix script on **EACH project**

### Production Considerations

⚠️ **For Tuesday presentation:**
- Disable RLS on PROD for demo purposes
- After the presentation, re-enable RLS with proper policies
- See `/ENABLE_RLS_AFTER_TESTING.sql` for production-ready policies

---

## 🆘 Still Getting 403 Errors After Fix?

### Check 1: Verify RLS is Disabled

Run this query in your Supabase SQL Editor:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'bills', 'bill_items', 'contractors', 'suppliers')
ORDER BY tablename;
```

**Expected result:** All tables should show `rowsecurity = false`

### Check 2: Check Permissions

Run this query:

```sql
SELECT table_name, grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' 
  AND table_name = 'bills'
  AND grantee IN ('authenticated', 'anon', 'service_role')
ORDER BY table_name, grantee;
```

**Expected result:** Should show `INSERT`, `SELECT`, `UPDATE`, `DELETE` for all grantees

### Check 3: Clear Browser Cache

- Clear all site data
- Hard refresh the page
- Try uploading again

### Check 4: Check Environment Variables

Verify Vercel environment variables point to the correct Supabase project:

```
VITE_SUPABASE_URL=https://zzdzrlglivtpawtitvgu.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## ✅ Summary

**Problem:** 403 error when saving bills on DEV environment  
**Cause:** RLS enabled on DEV Supabase project  
**Fix:** Run `/DISABLE_RLS_COMPLETE_V2.sql` on **EACH Supabase project** (DEV, SIT, PROD)  
**Time:** 2 minutes per environment  
**Priority:** 🔴 HIGH - Fix before Tuesday presentation  

---

**Last Updated:** March 9, 2026  
**Affected URL:** https://dev-branch-m39f5ja09-assure-tech-solution.vercel.app/  
**Supabase Project:** zzdzrlglivtpawtitvgu
