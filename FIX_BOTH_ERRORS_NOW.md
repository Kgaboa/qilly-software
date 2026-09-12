# ⚡ Fix BOTH Signup Errors RIGHT NOW

## ❌ Current Errors:

### **Error 1: RLS Policy Violation**
```json
{
  "code": "42501",
  "message": "new row violates row-level security policy for table \"contractors\""
}
```

### **Error 2: Email Rate Limit**
```
AuthApiError: email rate limit exceeded
```

---

## ✅ COMPLETE FIX (3 Minutes)

### **STEP 1: Fix RLS Policy** (1 minute)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your Qilly project

2. **Open SQL Editor**
   - Click **"SQL Editor"** (left sidebar)
   - Click **"New Query"**

3. **Run the RLS fix**
   - Copy entire file: **`/FIX_RLS_COMPLETE.sql`**
   - Paste into SQL Editor
   - Click **"Run"** (or F5)

4. **Verify success**
   ```
   ✅ RLS POLICIES COMPLETELY FIXED!
   ✅ INSERT: contractors_insert_policy
   ✅ SELECT: contractors_select_policy
   ✅ UPDATE: contractors_update_policy
   ```

---

### **STEP 2: Avoid Rate Limit** (30 seconds)

**You have 3 options:**

#### **Option A: Use Different Email** ⚡ FASTEST

```
1. Open contractor signup form
2. Change email to: test2@example.com
   (Or any email you haven't used yet)
3. Fill out rest of form
4. Submit
5. Done! ✅
```

#### **Option B: Delete Test User** (1 minute)

```
1. Supabase Dashboard → Authentication → Users
2. Find user with rate-limited email
3. Click "..." → Delete User
4. Wait 5 minutes
5. Try signup again with same email
```

#### **Option C: Wait** ⏰

```
1. Wait 60 minutes (1 hour)
2. Try signup again
3. Rate limit will have reset
```

**Recommendation:** Use **Option A** (different email) for fastest fix!

---

### **STEP 3: Test Contractor Signup** (1 minute)

1. **Open your Qilly app**
   - http://localhost:5173 (or your URL)

2. **Click "Register as Contractor"**

3. **Fill out form** (Use NEW email if you chose Option A):
   - ✅ Company Name: "Test Construction Ltd"
   - ✅ Email: **"test2@example.com"** ← Different email!
   - ✅ Contact Person: "John Doe"
   - ✅ Phone: "+27 11 123 4567"
   - ✅ **Select at least 1 project type**
   - ✅ **Select at least 1 operating province**
   - ✅ Password: "TestPass123!" (8+ chars)
   - ✅ Confirm Password: "TestPass123!"
   - ✅ **Check "Agree to Terms"**

4. **Submit**

5. **Expected result:**
   ```
   ✅ Success!
   Contractor account created successfully!
   Professional tier selected.
   Pending admin approval.
   ```

---

## 🔍 Verify It Worked

**Check the database:**

```sql
-- In Supabase SQL Editor, run:
SELECT 
  id,
  company_name,
  email,
  status,
  subscription_tier,
  created_at
FROM contractors
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:** You should see your new contractor! 🎉

---

## 🎯 What Each Error Meant

### **Error 42501 - RLS Violation**

**Problem:**
- Row-Level Security (RLS) policy was blocking the INSERT
- The policy required `auth.uid() = user_id`
- But the check wasn't configured correctly

**How we fixed it:**
- Recreated RLS policies with correct syntax
- `contractors_insert_policy` now properly checks `auth.uid() = user_id`
- This allows signups where the authenticated user's ID matches the user_id being inserted

### **Email Rate Limit Error**

**Problem:**
- You tried to signup multiple times with same email
- Supabase blocks this to prevent spam/abuse
- Limit: 3-5 attempts per hour per email

**How we fixed it:**
- Use a different email (quickest)
- OR delete the test user
- OR wait 1 hour

---

## 📋 Complete Checklist

```
STEP 1: FIX RLS
☐ Ran /FIX_RLS_COMPLETE.sql in Supabase
☐ Saw success message
☐ Verified 3 policies created

STEP 2: AVOID RATE LIMIT
☐ Used different email (test2@example.com)
☐ OR deleted test user from Auth
☐ OR waited 1 hour

STEP 3: TEST SIGNUP
☐ Filled out contractor form
☐ Used NEW email (not rate-limited one)
☐ Selected project types & provinces
☐ Submitted form
☐ Saw success message
☐ Contractor in database ✅

✅ ALL DONE!
```

---

## 🚀 Quick Command Reference

**Fix RLS:**
```bash
File: /FIX_RLS_COMPLETE.sql
Run in: Supabase SQL Editor
Time: 1 minute
```

**Avoid Rate Limit:**
```bash
Option: Use test2@example.com
Time: 0 seconds (instant)
```

**Verify:**
```sql
SELECT * FROM contractors ORDER BY created_at DESC LIMIT 1;
```

---

## 🆘 Troubleshooting

### **Still getting 42501 RLS error?**

**Check if policies exist:**
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'contractors';
```

**Expected:** 3 rows
- `contractors_insert_policy`
- `contractors_select_policy`
- `contractors_update_policy`

**If missing:** Re-run `/FIX_RLS_COMPLETE.sql`

---

### **Still getting rate limit error?**

**Checklist:**
```
☐ Used a COMPLETELY different email?
  ❌ test@example.com → test@example.com (SAME - won't work)
  ✅ test@example.com → test2@example.com (DIFFERENT - will work)

☐ If deleted user, waited 5 minutes?
  ⏰ Wait full 5 minutes after deletion

☐ If waiting, waited full 60 minutes?
  ⏰ Can't skip this - must wait full hour
```

---

### **Getting a NEW error?**

**Check browser console (F12):**
- Look for the error message
- Copy the error code
- Search in documentation:
  - `PGRST205` → `/FIX_PGRST205_ERROR.md`
  - `23503` → `/FIX_CONTRACTOR_ERROR.md` (foreign key)
  - `42501` → You're reading this! (RLS)

---

## 💡 Pro Tips

### **For Testing:**

Use Gmail aliases to create unlimited test emails:
```
yourname+test1@gmail.com
yourname+test2@gmail.com
yourname+test3@gmail.com
yourname+contractor1@gmail.com
```

All go to same inbox (`yourname@gmail.com`) but Supabase treats them as different!

### **For Production:**

1. ✅ Keep rate limits (they protect your app)
2. ✅ Show user-friendly error messages
3. ✅ Monitor Auth logs for suspicious activity
4. ✅ Clean up test users before launch

---

## 🎉 Success!

**After following these steps:**
- ✅ RLS policies are correct
- ✅ Rate limit avoided
- ✅ Contractor signup works
- ✅ Contractor in database
- ✅ Ready to continue development!

**Next steps:**
1. Approve contractor (change status to 'approved')
2. Test contractor login
3. Test BOQ template selection
4. Test BOQ generation

---

## 📚 Related Documentation

| Issue | File |
|-------|------|
| RLS error (42501) | `/FIX_RLS_COMPLETE.sql` |
| Email rate limit | `/FIX_EMAIL_RATE_LIMIT.md` |
| Table not found (PGRST205) | `/FIX_PGRST205_QUICK_GUIDE.md` |
| General signup errors | `/SIGNUP_ERROR_QUICK_FIX.md` |
| Complete backend | `/BACKEND_VISUAL_SUMMARY.md` |

---

**Both errors fixed! Just run the SQL and use a different email!** 🚀

**Total time: 3 minutes** ⏰
