# 🚨 FIX: Permission Denied for Table Users

## **The Problem:**
```
Error: permission denied for table users
Code: 42501
```

This happens when a contractor tries to sign up. The RLS (Row Level Security) policies are blocking the insert operation.

---

## ✅ **THE SOLUTION:**

### **Run This Script:**
**File:** `/FIX_CONTRACTOR_SIGNUP_RLS.sql`

### **Steps:**

1. **Open SQL Editor:**  
   https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new

2. **Copy & Paste:**  
   Open `/FIX_CONTRACTOR_SIGNUP_RLS.sql` and copy everything

3. **Run:** Click **"Run"** ▶️

4. **Look for:**
   ```
   ✅✅✅ ALL POLICIES CREATED SUCCESSFULLY! ✅✅✅
   ```

5. **Clear Browser Cache:** `Ctrl+F5`

6. **Test Contractor Signup**

---

## **What This Script Does:**

### **1. Fixes Contractors Table RLS:**
- ✅ **SELECT:** Contractors can view own data, admins view all
- ✅ **INSERT:** Authenticated users can create their contractor record
- ✅ **UPDATE:** Contractors can update own data, admins update all
- ✅ **DELETE:** Only admins can delete

### **2. Fixes Users Table RLS:**
- ✅ **SELECT:** Users can view own data, admins view all
- ✅ **INSERT:** Authenticated users can create their user record
- ✅ **UPDATE:** Users can update own data, admins update all
- ✅ **DELETE:** Only admins can delete

### **3. Grants Permissions:**
- ✅ `authenticated` role: SELECT, INSERT, UPDATE
- ✅ `anon` role: SELECT (read-only)

---

## **Why This Happens:**

The error occurs because:
1. ✅ User signs up with `supabase.auth.signUp()` → Creates auth user
2. ❌ App tries to insert into `contractors` table
3. ❌ RLS policy blocks insert because policies were too restrictive
4. ❌ Error: "permission denied"

**After Fix:**
1. ✅ User signs up with `supabase.auth.signUp()` → Creates auth user
2. ✅ App inserts into `contractors` table
3. ✅ RLS policy allows insert because `auth.uid() = user_id`
4. ✅ Success!

---

## **Expected Output:**

```
🔧 FIXING CONTRACTOR SIGNUP RLS POLICIES...

✅ Contractors table: 4 RLS policies created
✅ Users table: 4 RLS policies created

✅✅✅ ALL POLICIES CREATED SUCCESSFULLY! ✅✅✅

🎯 Contractor signup should now work!

📋 Next Steps:
   1. Clear browser cache
   2. Try contractor signup again
   3. Should successfully create contractor account
```

Plus a table showing all policies created.

---

## **After Running:**

1. ✅ Clear browser cache (`Ctrl+F5`)
2. ✅ Go to contractor signup page
3. ✅ Fill in form and submit
4. ✅ Should successfully create account
5. ✅ No more "permission denied" errors!

---

## **Troubleshooting:**

### **If you still get errors:**

1. **Check auth user exists:**
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   ```

2. **Check RLS policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename IN ('contractors', 'users');
   ```

3. **Check permissions:**
   ```sql
   SELECT grantee, privilege_type 
   FROM information_schema.role_table_grants 
   WHERE table_name IN ('contractors', 'users');
   ```

---

**Run `/FIX_CONTRACTOR_SIGNUP_RLS.sql` now to fix the RLS permissions! 🚀**
