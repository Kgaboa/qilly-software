# 🗂️ SIT Database Setup & Testing Guide

## ✅ **GOOD NEWS: Environment is Working!**

The error pointing to `kcptusoevqapcvptlgkd` means **your SIT environment is correctly configured!**

The signup error is because the **SIT database doesn't have tables yet**.

---

## 📋 **Step-by-Step Fix**

### **Step 1: Setup SIT Database** ⚠️ CRITICAL

1. **Open Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql
   ```

2. **Click "New Query"**

3. **Copy the setup script:**
   - Open file: `C:\Users\Kgabo Sekhula\Onlinepricingsystem-main\COMPLETE_DATABASE_SETUP.sql`
   - Select ALL (Ctrl+A)
   - Copy (Ctrl+C)

4. **Paste into SQL Editor:**
   - Paste (Ctrl+V)
   - Click **"Run"** button (or Ctrl+Enter)
   - Wait ~15-30 seconds

5. **Verify tables created:**
   - Click **"Table Editor"** in left sidebar
   - You should see **8 tables**:
     ✅ users
     ✅ bills
     ✅ bill_items
     ✅ suppliers
     ✅ contractors ⬅️ **NEEDED FOR SIGNUP**
     ✅ subscriptions
     ✅ provinces
     ✅ municipalities

6. **Check RLS (Row Level Security):**
   - In Table Editor, click **"contractors"** table
   - Click **"Policies"** tab (top-right)
   - You should see policies like:
     - "Allow public to insert contractors"
     - "Allow users to view own contractor profile"
     - "Allow admins to view all contractors"

---

### **Step 2: Test Contractor Signup**

**Option A: Use Deployed SIT URL** (Recommended)

1. **Visit:** https://qilly-2ctfxlfcx-assure-tech-solution.vercel.app

2. **Open Console (F12)** before testing:
   - Go to Console tab
   - Should see: `🌍 Using environment from VITE_ENVIRONMENT: SIT`

3. **Click "Get Started" → "Contractor Signup"**

4. **Fill in test data:**
   ```
   Company Name: Test SIT Contractor Ltd
   Email: test-sit-contractor@example.com
   Contact Person: John Doe
   Phone: 0123456789
   Province: Gauteng
   City: Johannesburg
   Street Address: 123 Test Street
   Postal Code: 2000
   Project Types: Residential, Commercial
   Operating Provinces: Gauteng, Western Cape
   Years in Business: 5
   CIDB Grade: 1CE
   ```

5. **Select subscription tier** (e.g., Professional - R999/month)

6. **Submit form**

7. **Expected success message:**
   ```
   "Contractor account created successfully! Professional tier selected. Pending admin approval."
   ```

8. **Check Console for logs:**
   ```
   ✅ User account created: [uuid]
   ✅ Contractor record created successfully!
   ✅ Contractor ID: [uuid]
   ✅ Contractor Email: test-sit-contractor@example.com
   ✅ Contractor Status: pending
   ```

9. **Verify in SIT database:**
   - Go to: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/editor
   - Click **"contractors"** table
   - You should see your test contractor
   - **IMPORTANT:** Check the **"users"** table too (linked by user_id)

---

**Option B: Test Locally with SIT Database**

1. **Run in SIT mode:**
   ```bash
   cd "C:\Users\Kgabo Sekhula\Onlinepricingsystem-main"
   npm run dev:sit
   ```

2. **Visit:** http://localhost:5173

3. **Check console:** Should see `🔍 Using SIT environment`

4. **Follow same testing steps as Option A**

---

**Option C: Use URL Parameter**

1. **Visit your local dev:** http://localhost:5173?env=sit

2. **Or deployed URL:** https://qilly-2ctfxlfcx-assure-tech-solution.vercel.app?env=sit

3. **This forces SIT environment**

---

### **Step 3: Verify Data in Correct Database**

**Check SIT Database (kcptusoevqapcvptlgkd):**
1. https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/editor
2. Click **"contractors"** table
3. **Should see:** Your test contractor

**Check Development Database (zzdzrlglivtpawtitvgu):**
1. https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/editor
2. Click **"contractors"** table
3. **Should NOT see:** Your test contractor (if environment is working correctly)

---

## 🐛 **Troubleshooting the Signup Error**

### **Error 1: "relation 'contractors' does not exist"**

**Cause:** Tables not created in SIT database

**Fix:**
1. Run `COMPLETE_DATABASE_SETUP.sql` in SIT Supabase SQL Editor
2. Verify tables exist in Table Editor

---

### **Error 2: "new row violates row-level security policy"**

**Cause:** RLS policies prevent public inserts

**Fix:**
1. **Go to:** https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/editor
2. **Click:** "contractors" table → "Policies" tab
3. **Check:** Is there a policy called "Allow public to insert contractors"?
4. **If NO:** The SQL setup script should have created it. Re-run the setup script.

**Quick Fix (if needed):**
```sql
-- Run this in SQL Editor to allow public inserts:
DROP POLICY IF EXISTS "Allow public to insert contractors" ON contractors;

CREATE POLICY "Allow public to insert contractors"
ON contractors
FOR INSERT
TO anon
WITH CHECK (true);
```

---

### **Error 3: "duplicate key value violates unique constraint"**

**Cause:** Email already exists in database

**Fix:**
1. Use a different email address
2. OR delete the existing record:
   ```sql
   DELETE FROM contractors WHERE email = 'test-sit-contractor@example.com';
   ```

---

### **Error 4: "Failed to create user account"**

**Cause:** Supabase Auth not configured

**Fix:**
1. **Go to:** https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/auth/users
2. **Check:** Authentication settings
3. **Ensure:** Email auth is enabled
4. **Check:** Email confirmation is disabled for testing (or enable it)

---

## 📊 **How to Test with Different Environments**

### **Testing Workflow:**

```
Development (Local)
   ↓ Test locally
   ↓ npm run dev
   ↓ Uses: zzdzrlglivtpawtitvgu
   ↓
SIT (First Deployment)
   ↓ Test integration
   ↓ https://sit.qilly.co.za
   ↓ Uses: kcptusoevqapcvptlgkd
   ↓
UAT (Customer Preview)
   ↓ User acceptance testing
   ↓ https://uat.qilly.co.za
   ↓ Uses: [UAT database - not created yet]
   ↓
Preprod (Final Staging)
   ↓ Production-identical testing
   ↓ https://preprod.qilly.co.za
   ↓ Uses: [Preprod database - not created yet]
   ↓
Production (Live)
   ↓ Real customers
   ↓ https://qilly.co.za
   ↓ Uses: [Production database - not created yet]
```

---

## 🔍 **Console Debugging**

When testing, always check the browser console (F12) for these messages:

### **Environment Detection:**
```javascript
// Good - Using SIT:
🌍 Using environment from VITE_ENVIRONMENT: SIT

// Good - Using Development:
🔧 Using DEVELOPMENT environment

// Bad - Wrong environment:
🔧 Using DEVELOPMENT environment  // When you expected SIT
```

### **Signup Process:**
```javascript
// Step 1: Auth account created
✅ User account created: [uuid]

// Step 2: Contractor record created
✅ Contractor record created successfully!
✅ Contractor ID: [uuid]
✅ Contractor Email: test-sit-contractor@example.com
✅ Contractor Status: pending

// If error:
❌ Contractor insert error: [error details]
❌ Error details: { code: "42P01", message: "relation 'contractors' does not exist" }
```

---

## ✅ **Verification Checklist**

After running database setup:

- [ ] SIT database has 8 tables
- [ ] "contractors" table exists
- [ ] RLS policies are configured
- [ ] Console shows "Using SIT environment"
- [ ] Contractor signup succeeds
- [ ] Data appears in SIT database (kcptusoevqapcvptlgkd)
- [ ] Data DOES NOT appear in development database (zzdzrlglivtpawtitvgu)
- [ ] Admin Dashboard shows the new contractor
- [ ] Environment badge shows "SIT"

---

## 🎯 **Quick Reference**

### **SIT Database URLs:**
- Dashboard: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd
- Table Editor: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/editor
- SQL Editor: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql
- Auth Users: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/auth/users

### **SIT App URL:**
- Vercel: https://qilly-2ctfxlfcx-assure-tech-solution.vercel.app
- Custom Domain: https://sit.qilly.co.za (after DNS setup)

### **Local Testing:**
```bash
# Development database:
npm run dev

# SIT database:
npm run dev:sit

# UAT database:
npm run dev:uat

# Preprod database:
npm run dev:preprod
```

---

## 📞 **What to Check if Still Getting Errors**

1. **Check Console Logs:**
   - Open F12 → Console
   - Look for error messages
   - Copy the FULL error message

2. **Check Network Tab:**
   - F12 → Network
   - Filter: "Fetch/XHR"
   - Look for failed requests (red)
   - Click on failed request → Preview tab

3. **Check Supabase Logs:**
   - https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/logs
   - Look for recent errors

4. **Check Database Connection:**
   - Admin Dashboard → Settings → Developer Tools
   - Check "Database Connection Status"
   - Should show: ✅ Connected to SIT database

---

**Run the database setup script first, then test contractor signup!** 🚀
