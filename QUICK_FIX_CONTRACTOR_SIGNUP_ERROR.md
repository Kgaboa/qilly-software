# 🚨 Quick Fix: Contractor Signup Error

## ✅ **Good News First!**

The error pointing to `kcptusoevqapcvptlgkd` means:
- ✅ Environment configuration is working
- ✅ App is using SIT database correctly
- ❌ SIT database just needs tables created

---

## 🔧 **2-Minute Fix**

### **Step 1: Open Supabase SQL Editor**

🔗 **Direct Link:** https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql

Click **"New Query"**

---

### **Step 2: Copy & Run Setup Script**

1. **Open local file:**
   ```
   C:\Users\Kgabo Sekhula\Onlinepricingsystem-main\COMPLETE_DATABASE_SETUP.sql
   ```

2. **Select ALL** (Ctrl+A)

3. **Copy** (Ctrl+C)

4. **Paste into SQL Editor** (Ctrl+V)

5. **Click "Run"** (or Ctrl+Enter)

6. **Wait ~20 seconds**

---

### **Step 3: Verify Tables Created**

1. **Click "Table Editor"** (left sidebar)

2. **Check you see these 8 tables:**
   - ✅ users
   - ✅ bills
   - ✅ bill_items
   - ✅ suppliers
   - ✅ **contractors** ⬅️ This is critical!
   - ✅ subscriptions
   - ✅ provinces
   - ✅ municipalities

---

### **Step 4: Test Signup Again**

1. **Visit:** https://qilly-2ctfxlfcx-assure-tech-solution.vercel.app

2. **Click:** "Get Started" → "Contractor Signup"

3. **Fill test data:**
   ```
   Company: Test SIT Company
   Email: test-contractor-sit@example.com
   Contact Person: John Doe
   Phone: 0123456789
   Province: Gauteng
   City: Johannesburg
   ```

4. **Submit**

5. **Expected:** ✅ "Contractor account created successfully!"

---

## 🔍 **Still Getting Errors?**

### **Run Database Check Script:**

1. **Go to:** https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/sql

2. **New Query**

3. **Copy & paste this:**
   ```
   File: C:\Users\Kgabo Sekhula\Onlinepricingsystem-main\SIT_DATABASE_CHECK.sql
   ```

4. **Run it**

5. **Check results:**
   - ✅ Tables Check: Should say "PASS - All tables exist"
   - ✅ RLS Status: Should say "RLS Enabled"
   - ✅ RLS Policies: Should show at least 3 policies

---

## 📞 **Common Error Messages**

### **Error: "relation 'contractors' does not exist"**
- **Cause:** Table not created
- **Fix:** Run COMPLETE_DATABASE_SETUP.sql

### **Error: "new row violates row-level security policy"**
- **Cause:** RLS policy missing
- **Fix:** Run COMPLETE_DATABASE_SETUP.sql (it includes RLS policies)

### **Error: "duplicate key value violates unique constraint"**
- **Cause:** Email already used
- **Fix:** Use different email or delete old record:
  ```sql
  DELETE FROM contractors WHERE email = 'your-email@example.com';
  ```

---

## 🎯 **Summary**

**Problem:** Signup error pointing to kcptusoevqapcvptlgkd  
**Root Cause:** SIT database has no tables  
**Solution:** Run COMPLETE_DATABASE_SETUP.sql once  
**Time:** 2 minutes  

---

## 📋 **After Setup, Verify:**

- [ ] 8 tables exist in SIT database
- [ ] Contractor signup succeeds
- [ ] Data appears in SIT database
- [ ] Console shows "Using SIT environment"

---

**Just run the SQL setup script once and you're good to go!** 🚀
