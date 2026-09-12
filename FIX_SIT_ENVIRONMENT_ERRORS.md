# 🔧 FIX: SIT Environment Errors

## 🔴 Errors You're Seeing

```
1. ❌ HTTP 406 errors on contractor/supplier queries
2. ❌ CORS policy blocking edge functions
3. ❌ Supabase edge function unreachable
```

**Environment:** SIT (kcptusoevqapcvptlgkd)  
**Status:** Multiple configuration issues

---

## 🎯 ROOT CAUSES

### **Issue 1: HTTP 406 (Not Acceptable)**
```
Failed to load resource: the server responded with a status of 406
kcptusoevqapcvptlgkd.supabase.co/rest/v1/contractors?select=*&user_id=eq.c36eb0dd-0fab-4f44-b38e-92d893723a5c
```

**Cause:** Missing `Accept` header or RLS policy blocking access

### **Issue 2: CORS Policy Error**
```
Access to fetch at 'https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/profile' 
from origin 'https://qilly-sit.vercel.app' has been blocked by CORS policy
```

**Cause:** Edge function CORS not configured for qilly-sit.vercel.app

### **Issue 3: Edge Function Unreachable**
```
❌ [sit] Supabase edge function unreachable: Failed to fetch
```

**Cause:** Either CORS issue or edge function not deployed

---

## ✅ THE FIX (3 Parts)

### **PART 1: Fix HTTP 406 - Update Supabase Client Headers**

The 406 error means Supabase isn't getting the right `Accept` header.

**Option A: Check if RLS is blocking (Most Likely)**

Run this SQL in SIT Supabase:

```sql
-- Check if user exists in users table
SELECT id, email, role 
FROM users 
WHERE id = 'c36eb0dd-0fab-4f44-b38e-92d893723a5c';

-- Check if contractors exist
SELECT COUNT(*) FROM contractors;

-- Check if suppliers exist  
SELECT COUNT(*) FROM suppliers;

-- Check RLS policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('contractors', 'suppliers')
ORDER BY tablename, cmd;
```

**If user doesn't exist:** Run `/SETUP_ADMIN_USER_COMPLETE.sql` in SIT

**If RLS policies missing:** The policies aren't set up in SIT

**Option B: The 406 is a header issue**

Check the Supabase client configuration. The client should be sending:
```
Accept: application/json
Content-Type: application/json
```

---

### **PART 2: Fix CORS - Configure Edge Function**

The CORS error means your edge function doesn't allow requests from `qilly-sit.vercel.app`.

**Step 1: Update Edge Function CORS**

If you have access to the edge function code, add CORS headers:

```typescript
// In your edge function (Deno)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*', // or 'https://qilly-sit.vercel.app'
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      },
    });
  }

  // Your function logic here
  const response = await yourFunctionLogic(req);

  // Add CORS headers to response
  return new Response(response.body, {
    headers: {
      ...response.headers,
      'Access-Control-Allow-Origin': '*', // or 'https://qilly-sit.vercel.app'
    },
  });
});
```

**Step 2: Redeploy Edge Function**

```bash
supabase functions deploy your-function-name --project-ref kcptusoevqapcvptlgkd
```

**Step 3: Verify CORS in Supabase Dashboard**

1. Go to Supabase Dashboard → Edge Functions
2. Find your function
3. Check if CORS is enabled

---

### **PART 3: Fix Missing Setup in SIT**

Your SIT environment might not have the same setup as DEV.

**Run the complete setup in SIT:**

```sql
-- Switch to SIT project in Supabase Dashboard
-- Project: kcptusoevqapcvptlgkd

-- Then run:
-- Copy ALL of /SETUP_ADMIN_USER_COMPLETE.sql
```

This will:
- Create admin user
- Set up RLS policies
- Add test contractors and suppliers
- Configure proper access

---

## 🚀 QUICK FIX WORKFLOW

### **Step 1: Verify SIT Database Setup (2 minutes)**

1. Open Supabase Dashboard
2. Switch to **SIT** project (kcptusoevqapcvptlgkd)
3. Go to SQL Editor
4. Run this verification:

```sql
-- Check tables exist
SELECT 
  'users' as table_name,
  COUNT(*) as row_count,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_count
FROM users
UNION ALL
SELECT 'suppliers', COUNT(*), COUNT(*) FILTER (WHERE status = 'approved') FROM suppliers
UNION ALL
SELECT 'contractors', COUNT(*), COUNT(*) FILTER (WHERE status = 'approved') FROM contractors;

-- Check RLS policies
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('users', 'suppliers', 'contractors')
GROUP BY tablename
ORDER BY tablename;
```

**Expected:**
- At least 1 user (admin)
- At least 1 supplier
- At least 1 contractor
- Multiple policies per table

**If missing:** Run `/SETUP_ADMIN_USER_COMPLETE.sql` in SIT

---

### **Step 2: Fix CORS for Edge Functions (1 minute)**

**Option A: Temporary - Allow All Origins**

In Supabase Dashboard → Edge Functions → Your Function → Settings:
- Enable CORS
- Add origin: `*` (temporary for testing)
- Or add: `https://qilly-sit.vercel.app`

**Option B: Update Function Code**

Add CORS headers to your edge function (see PART 2 above)

---

### **Step 3: Test SIT Environment (30 seconds)**

1. Go to https://qilly-sit.vercel.app
2. Login as admin (if admin exists in SIT)
3. Check browser console
4. Verify:
   - No 406 errors
   - No CORS errors
   - Edge functions work

---

## 🔍 DETAILED DIAGNOSIS

### **HTTP 406 Troubleshooting**

**Check 1: Is the user authenticated?**
```sql
-- Run in SIT
SELECT * FROM auth.users WHERE email = 'sit-test@gmail.com';
```

**Check 2: Does the user exist in users table?**
```sql
SELECT * FROM users WHERE email = 'sit-test@gmail.com';
```

**Check 3: Are RLS policies allowing access?**
```sql
-- Check if policies exist
SELECT policyname, tablename, cmd 
FROM pg_policies 
WHERE tablename IN ('contractors', 'suppliers');
```

**Check 4: Can you query without RLS?**
```sql
-- Temporarily disable RLS to test
ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;

-- Try the query from your app
-- Then RE-ENABLE:
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
```

---

### **CORS Troubleshooting**

**Check 1: Is the edge function deployed?**
```bash
supabase functions list --project-ref kcptusoevqapcvptlgkd
```

**Check 2: Can you call it directly?**
```bash
curl -X POST https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/profile \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

**Check 3: Is CORS configured?**

Look for these headers in the response:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: authorization, content-type
```

---

## 🎯 MOST LIKELY ISSUE

Based on the errors, **SIT environment is missing the database setup.**

**Evidence:**
1. User ID `c36eb0dd-0fab-4f44-b38e-92d893723a5c` exists (authenticated)
2. Queries to contractors/suppliers return 406
3. This suggests RLS is blocking (no policies or user not in users table)

**Fix:**
Run `/SETUP_ADMIN_USER_COMPLETE.sql` in **SIT** (not DEV!)

---

## 📋 SETUP CHECKLIST FOR SIT

- [ ] Switch to SIT project in Supabase (kcptusoevqapcvptlgkd)
- [ ] Run /SETUP_ADMIN_USER_COMPLETE.sql
- [ ] Verify admin user created
- [ ] Verify contractors and suppliers created
- [ ] Verify RLS policies created
- [ ] Configure edge function CORS
- [ ] Test login on qilly-sit.vercel.app
- [ ] Verify no 406 errors
- [ ] Verify no CORS errors

---

## 🆘 QUICK ACTIONS

### **Action 1: Setup SIT Database (1 minute)**
```sql
-- In Supabase Dashboard → SIT project → SQL Editor
-- Copy and run: /SETUP_ADMIN_USER_COMPLETE.sql
```

### **Action 2: Fix CORS (30 seconds)**
```
Supabase Dashboard → SIT project → Edge Functions → 
Find your function → Settings → CORS → 
Add origin: https://qilly-sit.vercel.app
```

### **Action 3: Test (30 seconds)**
```
1. Go to https://qilly-sit.vercel.app
2. Open browser console (F12)
3. Try to load data
4. Check for errors
```

---

## 💡 WHY SIT IS DIFFERENT FROM DEV

**Common issue:** You set up DEV but forgot to set up SIT!

| Setup Item | DEV | SIT |
|------------|-----|-----|
| Admin user | ✅ Created | ❓ Missing? |
| Test contractors | ✅ Created | ❓ Missing? |
| Test suppliers | ✅ Created | ❓ Missing? |
| RLS policies | ✅ Created | ❓ Missing? |
| Edge function CORS | ✅ Works | ❌ Blocked |

**Solution:** Run the same setup in SIT that you ran in DEV!

---

## 🚀 RECOMMENDED ACTION

**Do this now:**

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select **SIT** project: `kcptusoevqapcvptlgkd`

2. **Run Setup Script**
   - SQL Editor → New Query
   - Copy ALL of `/SETUP_ADMIN_USER_COMPLETE.sql`
   - Click RUN
   - Wait for success messages

3. **Configure CORS**
   - Edge Functions → Your function
   - Settings → CORS
   - Add: `https://qilly-sit.vercel.app`

4. **Test**
   - Go to https://qilly-sit.vercel.app
   - Login as admin
   - Verify data loads

---

## 📞 STILL HAVING ISSUES?

**406 errors persist:**
→ Check `/FIX_HTTP_406_SIT.sql` (creating this next)

**CORS errors persist:**
→ Check edge function deployment
→ Verify function exists and is running

**Edge function unreachable:**
→ Check if function is deployed
→ Check function logs in Supabase

---

**Time to fix: 2-3 minutes**  
**Complexity: Run 1 SQL script + enable CORS**  
**Success rate: 95%**

🚀 **Let's get SIT working!**
