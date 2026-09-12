# 🚨 FIX: CORS Error for start@gmail.com (Demo Card Showing)

## ❌ Problem

**User:** start@gmail.com  
**Issue:** Seeing "demo" card instead of operator dashboard  
**Error:** CORS policy blocking profile fetch from Edge Function

```
Access to fetch at 'https://zzdzrlglivtpawtitvgu.supabase.co/functions/v1/server/make-server-9db710f3/profile' 
has been blocked by CORS policy
```

## ✅ Working User (For Comparison)

**User:** kgabo123@gmail.com (Cestasoft contractor)  
**Status:** ✅ Works perfectly - loads contractor data from Supabase

---

## 🔍 Root Cause

The Edge Function `/make-server-9db710f3/profile` is either:
1. ❌ Not deployed to DEV environment
2. ❌ Missing CORS headers in response
3. ❌ Returning non-200 status for OPTIONS request

When the profile fetch fails, the app falls back to "demo mode" which shows the demo card.

---

## ✅ Solution Options

### Option 1: Quick Fix - Bypass Edge Function (RECOMMENDED FOR TUESDAY)

Since you're short on time before Tuesday's presentation, the quickest fix is to **fetch user data directly from Supabase** instead of using the Edge Function.

#### Step 1: Check Current Auth Approach

Open `/src/utils/api.ts` and check if it's using the Edge Function or direct Supabase access.

#### Step 2: Use Direct Supabase Access

The system should already be using direct Supabase access (based on your background notes about using Supabase client SDK with RLS policies). If start@gmail.com is still showing demo mode, it means:

**The user record doesn't exist in the `public.users` table!**

#### Step 3: Create Missing User Record

Run this SQL in your **DEV Supabase** (zzdzrlglivtpawtitvgu):

```sql
-- Check if start@gmail.com exists in auth.users
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'start@gmail.com';

-- If the user exists in auth.users but not in public.users, create the record
INSERT INTO public.users (id, email, full_name, role, subscription_tier, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', au.email) as full_name,
  'operator' as role,
  'FREE' as subscription_tier,
  NOW() as created_at
FROM auth.users au
WHERE au.email = 'start@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = au.id)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- Verify the user was created
SELECT * FROM public.users WHERE email = 'start@gmail.com';
```

#### Step 4: Test

1. Hard refresh DEV site: `Ctrl + Shift + R`
2. Login as start@gmail.com
3. Should see operator dashboard ✅ (not demo card)

---

### Option 2: Fix Edge Function CORS (For Later)

This is the proper long-term fix, but takes more time.

#### Step 1: Verify Edge Function Deployment

Check if the Edge Function is deployed to DEV:

```bash
# List all Edge Functions in DEV project
supabase functions list --project-ref zzdzrlglivtpawtitvgu
```

#### Step 2: Deploy Edge Function to DEV

If not deployed:

```bash
# Deploy to DEV environment
supabase functions deploy server --project-ref zzdzrlglivtpawtitvgu
```

#### Step 3: Update Edge Function with Better CORS

The Edge Function already has CORS configured, but we need to ensure it returns proper headers:

**File:** `/supabase/functions/server/index.ts`

The CORS middleware is already there (lines 26-36), but we need to ensure the OPTIONS handler explicitly returns CORS headers:

```typescript
// Get user profile route
app.options("/make-server-9db710f3/profile", (c) => {
  // Explicitly set CORS headers for OPTIONS request
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
      'Access-Control-Max-Age': '600',
    },
  });
});
```

Then redeploy:

```bash
supabase functions deploy server --project-ref zzdzrlglivtpawtitvgu
```

---

## 🎯 Recommended Approach for Tuesday

**Use Option 1 (Quick Fix)** because:

1. ✅ Takes 30 seconds to fix
2. ✅ No code deployment needed
3. ✅ Direct database access is faster than Edge Function
4. ✅ You're already using direct Supabase access for contractors (kgabo123@gmail.com works!)

**After Tuesday, implement Option 2** for a more robust solution.

---

## 📋 Quick Checklist

Run this on **DEV Supabase** (zzdzrlglivtpawtitvgu):

- [ ] Check if start@gmail.com exists in `auth.users`
- [ ] Check if start@gmail.com exists in `public.users`
- [ ] If missing from `public.users`, run the INSERT query above
- [ ] Hard refresh browser
- [ ] Test login as start@gmail.com
- [ ] Should see operator dashboard (not demo card)

---

## 🧪 Testing

### Test Case 1: start@gmail.com

**Before fix:**
```
❌ CORS error in console
❌ Shows "demo" card
❌ Cannot access operator features
```

**After fix:**
```
✅ No CORS errors
✅ Shows operator dashboard
✅ Can upload BOQs
✅ Full access to features
```

### Test Case 2: kgabo123@gmail.com (Contractor)

**Current status:**
```
✅ Already working
✅ Loads contractor data from Supabase
✅ Shows Cestasoft contractor card
```

**Should remain working after fix:**
```
✅ Still loads contractor data
✅ Still shows contractor dashboard
```

---

## 🔍 Debugging

### Check 1: Is user in auth.users?

```sql
SELECT id, email, created_at, email_confirmed_at
FROM auth.users 
WHERE email = 'start@gmail.com';
```

**Expected:** Should return 1 row with user data

### Check 2: Is user in public.users?

```sql
SELECT id, email, full_name, role, subscription_tier
FROM public.users 
WHERE email = 'start@gmail.com';
```

**Expected:** Should return 1 row with user data  
**If empty:** User record is missing - run the INSERT query

### Check 3: Check browser console

After login, check for:
- ❌ CORS errors → Edge Function issue
- ❌ "No user found" → Missing from public.users
- ✅ "User loaded" → Working correctly

---

## 💡 Why This Happens

### For Contractors (kgabo123@gmail.com - Works ✅)

1. User logs in
2. System checks `contractors` table
3. Finds contractor record
4. Shows contractor dashboard ✅

### For Operators (start@gmail.com - Fails ❌)

1. User logs in
2. System tries to fetch profile from Edge Function OR public.users
3. Edge Function fails (CORS) OR user not in public.users
4. System falls back to demo mode
5. Shows demo card ❌

**The fix:** Ensure start@gmail.com exists in `public.users` table

---

## ✅ Summary

**Problem:** start@gmail.com showing demo card due to CORS error  
**Quick Fix:** Create user record in public.users table (30 seconds)  
**Long-term Fix:** Fix Edge Function CORS (after Tuesday)  
**Priority:** 🔴 HIGH - Fix before Tuesday presentation  

**SQL to run on DEV (zzdzrlglivtpawtitvgu):**
```sql
INSERT INTO public.users (id, email, full_name, role, subscription_tier, created_at)
SELECT 
  au.id, au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', au.email),
  'operator', 'FREE', NOW()
FROM auth.users au
WHERE au.email = 'start@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = au.id)
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, updated_at = NOW();
```

---

**Last Updated:** March 9, 2026  
**Environment:** DEV (zzdzrlglivtpawtitvgu)  
**Affected User:** start@gmail.com
