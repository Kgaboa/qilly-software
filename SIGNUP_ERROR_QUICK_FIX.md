# 🔧 Signup Error - Quick Fix Guide

## ❌ Error: "An error occurred during signup"

### **Most Likely Cause: Missing contractors table**

---

## ✅ **3-STEP FIX**

### **Step 1: Create the contractors table**

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the entire contents of: **`/CONTRACTORS_TABLE_SIMPLE.sql`**
4. Click **"Run"** (or press F5)
5. You should see: ✅ "Success. No rows returned"

---

### **Step 2: Verify the table was created**

Run this query in SQL Editor:

```sql
SELECT * FROM contractors;
```

Expected result: 
- ✅ Query runs successfully (even if empty)
- ❌ If you get "relation 'contractors' does not exist" → Step 1 failed, try again

---

### **Step 3: Test contractor signup again**

1. Go back to your Qilly app
2. Click **"Register as Contractor"**
3. Fill out the registration form:
   - ✅ Select at least 1 project type
   - ✅ Select at least 1 operating province
   - ✅ Password must be 8+ characters
   - ✅ Passwords must match
   - ✅ Agree to terms
4. Click **"Submit Registration"**
5. Should now work! ✅

---

## 🔍 **If it STILL doesn't work...**

### **Check the browser console for errors:**

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try signup again
4. Look for error messages

### **Common Additional Errors:**

#### **Error: "User already registered"**
**Fix:** Email already exists. Use a different email OR delete the existing user:
- Go to Supabase → Authentication → Users
- Find the user, click "..." → Delete

#### **Error: "Foreign key constraint violation"**
**Fix:** The auth.signUp() failed. Check:
```javascript
// In ContractorSignup.tsx line 161-173
console.log('Auth error:', authError);
```
Common causes:
- Email already exists
- Password too short (Supabase requires 6+ chars, but we enforce 8+)
- Network connection issue

#### **Error: "Row-Level Security policy violation"**
**Fix:** RLS policies not set correctly. Re-run `/CONTRACTORS_TABLE_SIMPLE.sql`

---

## 📋 **Full Troubleshooting Checklist**

```
☐ contractors table exists (SELECT * FROM contractors works)
☐ RLS policies exist (SELECT policyname FROM pg_policies WHERE tablename='contractors')
☐ Environment variables set:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
☐ Supabase project not paused
☐ Internet connection working
☐ Email not already registered
☐ Form validation passing:
   - Password 8+ characters
   - Passwords match
   - At least 1 project type selected
   - At least 1 operating province selected
   - Terms agreed to
```

---

## 🆘 **Still Stuck?**

### **Gather this info and ask for help:**

1. **Error message from browser console** (F12 → Console)
2. **Screenshot of the error**
3. **Output of this SQL query:**
```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'contractors';

-- Check RLS policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'contractors';

-- Check existing contractors
SELECT id, company_name, email, status 
FROM contractors 
LIMIT 5;
```

4. **Confirm environment variables are set** (don't share the actual values!)
```javascript
console.log('URL set?', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Key set?', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

---

## 📚 **Related Documentation:**

- **Complete Error Guide:** `/FIX_CONTRACTOR_ERROR.md`
- **Visual Setup Guide:** `/CONTRACTOR_SETUP_VISUAL_GUIDE.md`
- **Backend Architecture:** `/BACKEND_VISUAL_SUMMARY.md`
- **SQL Setup File:** `/CONTRACTORS_TABLE_SIMPLE.sql`

---

**Most signups fail because the contractors table doesn't exist. Running `/CONTRACTORS_TABLE_SIMPLE.sql` fixes 90% of signup issues!** ✅
