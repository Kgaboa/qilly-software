# ⚡ PGRST205 Error - 2-Step Fix

## ❌ Error Message:
```
"Could not find the table 'public.contractors' in the schema cache"
Code: PGRST205
```

---

## ✅ THE FIX (2 Steps - Takes 2 Minutes)

### **STEP 1: Run SQL** (1 minute)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your Qilly project

2. **Open SQL Editor**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New Query"**

3. **Copy & Paste SQL**
   - Open file: **`/CONTRACTORS_QUICK_SETUP.sql`**
   - Copy ENTIRE file
   - Paste into SQL Editor

4. **Run the SQL**
   - Click **"Run"** button (or press F5)
   - Wait 5-10 seconds

5. **Check Success Messages**
   ```
   ✅ Table created in schema: public
   ✅ RLS policies created: 3
   ✅ Indexes created: 8
   ✅ CONTRACTORS TABLE CREATED SUCCESSFULLY!
   ```

---

### **STEP 2: Restart PostgREST** ⚡ CRITICAL! (30 seconds)

**This is the step most people miss!**

Without this, you'll STILL get PGRST205 error!

1. **Go to Settings**
   - Click **"Settings"** (gear icon) in left sidebar
   - Click **"API"** tab

2. **Restart Server**
   - Scroll down to **"PostgREST Server"** section
   - Click **"Restart Server"** button
   - (Some Supabase versions say "Reload Schema Cache")

3. **Wait**
   - Wait **30 seconds** for restart to complete
   - You'll see a loading spinner

4. **Verify Restart**
   - Server status should show: ✅ "Running"

---

### **STEP 3: Test Contractor Signup** (1 minute)

1. **Go to your Qilly app**
   - Open: http://localhost:5173 (or your deployed URL)

2. **Click "Register as Contractor"**

3. **Fill out the form:**
   - Company Name: `Test Construction Ltd`
   - Email: `test@example.com`
   - Contact Person: `John Doe`
   - Phone: `+27 11 123 4567`
   - **✅ Check at least 1 project type**
   - **✅ Check at least 1 operating province**
   - Password: `TestPass123!` (8+ characters)
   - Confirm Password: `TestPass123!`
   - **✅ Agree to Terms**

4. **Submit**
   - Click **"Submit Registration"**

5. **Expected Result:**
   ```
   ✅ Success!
   Contractor account created successfully!
   Professional tier selected.
   Pending admin approval.
   ```

---

## 🎯 If It STILL Doesn't Work...

### **Issue 1: PGRST205 error persists**

**Cause:** Schema cache didn't refresh

**Fix:**
```
1. Go back to Settings → API
2. Click "Restart Server" AGAIN
3. Wait 1 FULL MINUTE this time
4. Hard refresh your app (Ctrl+Shift+R)
5. Try signup again
```

---

### **Issue 2: Different error appears**

**Check browser console (F12):**

| Error | Fix |
|-------|-----|
| "User already registered" | Use different email |
| "Foreign key violation" | Auth signup failed - check console for auth error |
| "RLS policy violation" | Re-run Step 1 SQL |
| "Passwords do not match" | Check password fields match |

---

### **Issue 3: No error, but form doesn't submit**

**Check validation:**
```
☐ At least 1 project type selected?
☐ At least 1 operating province selected?
☐ Password 8+ characters?
☐ Passwords match?
☐ "Agree to Terms" checked?
```

---

## 🔍 Verify Setup (SQL Checks)

Run these in Supabase SQL Editor to verify:

```sql
-- Check 1: Table exists
SELECT * FROM contractors;
-- Expected: ✅ Query runs (empty result OK)

-- Check 2: RLS policies exist
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'contractors';
-- Expected: ✅ 3 rows (INSERT, SELECT, UPDATE)

-- Check 3: Can access via API
-- (Run this in browser console)
const { data, error } = await supabase.from('contractors').select('*');
console.log('Error:', error); // Should be null
console.log('Data:', data);   // Should be []
```

---

## 📋 Complete Checklist

```
☐ Step 1: Ran /CONTRACTORS_QUICK_SETUP.sql
☐ Step 2: Restarted PostgREST server
☐ Step 3: Waited 30 seconds
☐ Verified: SELECT * FROM contractors; works
☐ Verified: API can access table (no PGRST205)
☐ Tested: Contractor signup works
☐ Verified: New contractor in database
```

---

## 🚀 After Successful Setup

**Check the database:**

```sql
SELECT 
  id,
  company_name,
  email,
  status,
  subscription_tier,
  created_at
FROM contractors
ORDER BY created_at DESC;
```

You should see your test contractor! 🎉

**Next steps:**
1. ✅ Contractor signup works
2. ⏭️ Approve contractor (change status to 'approved')
3. ⏭️ Test contractor login
4. ⏭️ Test BOQ creation

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `/CONTRACTORS_QUICK_SETUP.sql` | ⚡ Run this in Step 1 |
| `/FIX_PGRST205_ERROR.md` | 📖 Detailed troubleshooting |
| `/SIGNUP_ERROR_QUICK_FIX.md` | 🔧 General signup errors |
| `/BACKEND_VISUAL_SUMMARY.md` | 📊 Complete architecture |

---

**Most Common Mistake:** Forgetting to restart PostgREST server after creating the table!

**Remember:** SQL creates table → But API needs restart to see it! 🔄
