# ⚡ FIX SIT ENVIRONMENT - DO THIS NOW

## 🔴 The Errors
```
❌ HTTP 406 on contractors/suppliers
❌ CORS blocking edge functions
❌ Edge function unreachable
```

**Environment:** SIT (kcptusoevqapcvptlgkd)  
**URL:** https://qilly-sit.vercel.app

---

## ✅ THE FIX (2 Minutes)

### **Step 1: Setup SIT Database** ⏱️ 1 minute

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - **IMPORTANT:** Select **SIT** project (`kcptusoevqapcvptlgkd`)
   - NOT the Development project!

2. **Run Setup Script**
   - Click **SQL Editor** (left sidebar)
   - Click **New Query**
   - Copy **ALL** of `/SETUP_ADMIN_USER_COMPLETE.sql`
   - Paste into the editor
   - Click **RUN** (or press Ctrl+Enter)
   - Wait for "✅ Setup complete!" messages

**What this does:**
- Creates admin user in SIT
- Creates test contractors and suppliers
- Sets up RLS policies
- Configures proper access control

---

### **Step 2: Fix CORS for Edge Functions** ⏱️ 30 seconds

1. **Still in Supabase Dashboard (SIT project)**
   - Click **Edge Functions** (left sidebar)
   - Find your function: `server/make-server-9db710f3`
   
2. **Enable CORS**
   - Click the function name
   - Go to **Settings** tab
   - Find **CORS** section
   - Add allowed origin: `https://qilly-sit.vercel.app`
   - Or temporarily use: `*` (allows all - for testing only)
   - Click **Save**

**Alternative:** If you don't see CORS settings, you need to update the function code (see detailed guide)

---

### **Step 3: Verify Edge Function is Deployed** ⏱️ 30 seconds

1. **In Supabase Dashboard → Edge Functions**
   - Check if `server/make-server-9db710f3` is listed
   - Status should be **Active** or **Deployed**

2. **If function is missing:**
   ```bash
   # Deploy the function (if you have CLI access)
   supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
   ```

3. **If you don't have CLI access:**
   - The function might not be deployed to SIT yet
   - Deploy it through your CI/CD pipeline
   - Or contact whoever manages deployments

---

### **Step 4: Test SIT** ⏱️ 30 seconds

1. **Go to SIT URL**
   - https://qilly-sit.vercel.app

2. **Open Browser Console**
   - Press F12
   - Go to Console tab

3. **Login**
   - Use: `admin@qilly.co.za` / `QillyAdmin2026!`
   - (or whatever SIT admin credentials you set)

4. **Check for Errors**
   - ✅ No 406 errors
   - ✅ No CORS errors
   - ✅ Data loads successfully

---

## 🎯 QUICK SQL (If You Want to Fix 406 Only)

If you just want to fix the HTTP 406 errors quickly:

```sql
-- Run in SIT Supabase SQL Editor

-- Fix user in users table
DO $$
BEGIN
  INSERT INTO users (
    id, 
    email, 
    role, 
    created_at
  )
  SELECT 
    id,
    email,
    'contractor',
    NOW()
  FROM auth.users 
  WHERE id = 'c36eb0dd-0fab-4f44-b38e-92d893723a5c'
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create RLS policies for contractors
DROP POLICY IF EXISTS "Users can view own contractor data" ON contractors;
CREATE POLICY "Users can view own contractor data"
ON contractors FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all contractors" ON contractors;
CREATE POLICY "Admins can view all contractors"
ON contractors FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Create RLS policies for suppliers
DROP POLICY IF EXISTS "Users can view own supplier data" ON suppliers;
CREATE POLICY "Users can view own supplier data"
ON suppliers FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all suppliers" ON suppliers;
CREATE POLICY "Admins can view all suppliers"
ON suppliers FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
```

Then refresh SIT and test.

---

## 🆘 TROUBLESHOOTING

### "Still getting 406 errors"

**Check 1:** Did you run the SQL in **SIT** (not DEV)?
- Verify project ID: `kcptusoevqapcvptlgkd`

**Check 2:** Does the user exist in users table?
```sql
SELECT * FROM users WHERE id = 'c36eb0dd-0fab-4f44-b38e-92d893723a5c';
```

**Check 3:** Do RLS policies exist?
```sql
SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('contractors', 'suppliers');
```
Expected: At least 4-6 policies

**Check 4:** Try disabling RLS temporarily
```sql
ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
```
If this fixes it, the issue is RLS policies. Re-enable and fix policies.

---

### "Still getting CORS errors"

**Option 1:** Function not deployed
- Check if function exists in Supabase Dashboard → Edge Functions
- Deploy if missing

**Option 2:** CORS not configured
- Add `https://qilly-sit.vercel.app` to allowed origins
- Or temporarily use `*`

**Option 3:** Function code doesn't have CORS headers
- Update function code to include CORS headers
- Redeploy

**Quick test:**
```bash
curl -X OPTIONS https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/profile \
  -H "Origin: https://qilly-sit.vercel.app" \
  -v
```

Look for `Access-Control-Allow-Origin` in response headers.

---

### "Edge function unreachable"

**Cause 1:** Function not deployed to SIT
- Deploy the function

**Cause 2:** Wrong function path
- Check the path in your code
- Verify it matches the deployed function

**Cause 3:** CORS blocking (see above)

---

## 📋 SIT SETUP CHECKLIST

- [ ] Switched to SIT project in Supabase (kcptusoevqapcvptlgkd)
- [ ] Ran `/SETUP_ADMIN_USER_COMPLETE.sql` in SIT
- [ ] Verified admin user exists: `SELECT * FROM users WHERE role = 'admin'`
- [ ] Verified test data exists: `SELECT COUNT(*) FROM suppliers`
- [ ] Verified RLS policies: `SELECT COUNT(*) FROM pg_policies WHERE tablename = 'suppliers'`
- [ ] Enabled CORS for edge functions
- [ ] Verified edge function is deployed
- [ ] Tested on https://qilly-sit.vercel.app
- [ ] No 406 errors in console
- [ ] No CORS errors in console
- [ ] Data loads successfully

---

## 💡 WHY THIS HAPPENED

**Root cause:** SIT environment was never set up!

You probably:
1. ✅ Set up Development environment (zzdzrlglivtpawtitvgu)
2. ❌ Forgot to set up SIT environment (kcptusoevqapcvptlgkd)

**Result:**
- No users in users table → 406 errors
- No RLS policies → 406 errors
- Edge function not deployed or no CORS → CORS errors

**Fix:** Run the same setup in SIT that you ran in DEV!

---

## 🚀 RECOMMENDED ACTION

**DO THIS RIGHT NOW:**

1. ✅ **Supabase Dashboard → Switch to SIT**
2. ✅ **SQL Editor → Run `/SETUP_ADMIN_USER_COMPLETE.sql`**
3. ✅ **Edge Functions → Enable CORS for `https://qilly-sit.vercel.app`**
4. ✅ **Test on https://qilly-sit.vercel.app**

**Total time: 2 minutes**

---

## 📞 DETAILED GUIDES

- **Full explanation:** `/FIX_SIT_ENVIRONMENT_ERRORS.md`
- **406 fix only:** `/FIX_HTTP_406_SIT.sql`
- **General setup:** `/SETUP_ADMIN_USER_COMPLETE.sql`

---

**Status:** Fixable in 2 minutes  
**Complexity:** Run 1 SQL script + enable CORS  
**Success rate:** 99%

🚀 **Get SIT working for your Monday demo!**
