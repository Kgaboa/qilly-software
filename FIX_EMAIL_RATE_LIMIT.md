# 🔧 Fix "email rate limit exceeded" Error

## ❌ The Error:

```
AuthApiError: email rate limit exceeded
```

---

## 🎯 What This Means:

Supabase limits the number of signup attempts with the same email address to prevent abuse and spam. 

**Rate Limits:**
- **Same email:** Max 3-5 signup attempts per hour
- **Same IP address:** Max 10-30 signups per hour
- **Protection:** Prevents spam, fake accounts, and brute force attacks

---

## ✅ SOLUTIONS

### **Solution 1: Wait (Recommended for Production)**

**Simply wait 1 hour, then try again with the same email.**

The rate limit automatically resets after:
- ⏰ **60 minutes** for email-based limits
- ⏰ **15-60 minutes** for IP-based limits

---

### **Solution 2: Use a Different Email (Quick Testing)**

**For testing purposes, use a new email address:**

```
Previous attempt: test@example.com
New attempt:      test2@example.com
```

**Tip for testing:** Use email aliases:
- Gmail: `yourname+test1@gmail.com`, `yourname+test2@gmail.com`
- Outlook: `yourname+test1@outlook.com`
- These are treated as different emails by Supabase but go to same inbox!

---

### **Solution 3: Delete Previous Auth User (If Testing)**

If you're just testing and want to reuse the same email:

**Steps:**

1. **Go to Supabase Dashboard**
   - Navigate to: **Authentication** → **Users**

2. **Find the user**
   - Search for email: `test@example.com`
   - You'll see the user(s) with that email

3. **Delete the user**
   - Click the **"..."** menu next to the user
   - Click **"Delete User"**
   - Confirm deletion

4. **Wait 5 minutes**
   - Supabase may still cache the email for a few minutes
   - After 5 minutes, try signup again

**⚠️ WARNING:** Only do this for test accounts! Never delete real users!

---

### **Solution 4: Increase Rate Limits (For Production - Paid Plans)**

If you're on a paid Supabase plan:

1. **Go to Settings** → **Auth** → **Rate Limits**
2. Increase the limits:
   - Email signup limit: Default 5/hour → Increase to 10/hour
   - IP signup limit: Default 30/hour → Increase to 100/hour
3. Click **"Save"**

**Note:** This is only available on paid plans.

---

### **Solution 5: Disable Email Confirmation (Testing Only)**

**⚠️ ONLY FOR LOCAL DEVELOPMENT/TESTING!**

If you're testing locally and keep hitting rate limits:

1. **Go to Supabase Dashboard**
2. **Settings** → **Authentication**
3. Scroll to **"Email Auth"** section
4. Toggle **"Enable email confirmations"** to **OFF**
5. Click **"Save"**

This allows signups without email verification, which can help during testing.

**⚠️ IMPORTANT:** Turn this back ON for production! Email confirmation is a security feature.

---

## 🔍 How to Check Rate Limit Status

### **Check in Supabase Logs:**

1. Go to **Supabase Dashboard** → **Logs** → **Auth Logs**
2. Filter by email or time
3. Look for entries like:
   ```
   "message": "Signup rate limit exceeded for email"
   "email": "test@example.com"
   "retry_after": 3600 (seconds)
   ```

### **Check in Browser Console:**

```javascript
// After getting the error, check:
console.error('Rate limit error:', error);
// Look for "retry_after" or "rate_limit_exceeded"
```

---

## 🎯 Best Practices for Development

### **During Development:**

1. **Use email aliases** for testing:
   ```
   test+1@example.com
   test+2@example.com
   test+3@example.com
   ```

2. **Keep track of test emails** in a file:
   ```
   test_emails.txt:
   - test+contractor1@gmail.com (used for contractor signup test)
   - test+contractor2@gmail.com (used for RLS policy test)
   ```

3. **Clean up test users regularly**:
   - Delete test users after testing
   - Prevents clutter in auth.users table

4. **Use automated email services** for testing:
   - Mailinator.com (free, public)
   - Mailtrap.io (free tier available)
   - Guerrilla Mail (temporary emails)

### **For Production:**

1. **Keep email confirmations enabled**
2. **Monitor rate limit errors** in logs
3. **Adjust limits** based on legitimate user behavior
4. **Implement frontend feedback**:
   ```javascript
   if (error.message.includes('rate limit')) {
     toast.error('Too many signup attempts. Please try again in 1 hour.');
   }
   ```

---

## 🔧 Fix the Current Error

Since you're getting the rate limit error RIGHT NOW:

### **Quick Fix (Choose One):**

**Option A: Use Different Email**
```
1. Change email in signup form
2. Use: test2@example.com (or any new email)
3. Submit signup again
4. Should work! ✅
```

**Option B: Delete Previous User**
```
1. Supabase Dashboard → Authentication → Users
2. Find user with email that's rate limited
3. Delete user
4. Wait 5 minutes
5. Try signup with same email again
```

**Option C: Wait**
```
1. Set timer for 1 hour
2. Get coffee ☕
3. Come back and try again
4. Should work! ✅
```

---

## 🚀 Complete Signup Fix Workflow

**You have TWO errors to fix:**

### **Error 1: RLS Policy Violation (42501)**

✅ **Fixed by:**
```sql
-- Run this in Supabase SQL Editor:
/FIX_RLS_COMPLETE.sql
```

### **Error 2: Email Rate Limit**

✅ **Fixed by:**
```
Option 1: Use different email (test2@example.com)
Option 2: Delete test user from Auth
Option 3: Wait 1 hour
```

### **Complete Fix Steps:**

```
1. ✅ Run /FIX_RLS_COMPLETE.sql in Supabase
   └─ Fixes RLS policy violation

2. ✅ Use different email OR wait 1 hour
   └─ Fixes rate limit error

3. ✅ Test contractor signup
   └─ Should work now!
```

---

## 📋 Verification After Fix

After running the RLS fix and avoiding rate limits:

```sql
-- 1. Verify RLS policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'contractors';

-- Expected: 3 rows
-- • contractors_insert_policy (INSERT)
-- • contractors_select_policy (SELECT)  
-- • contractors_update_policy (UPDATE)

-- 2. Try signup with NEW email
-- (Not the rate-limited one!)

-- 3. Check if contractor was created:
SELECT 
  company_name, 
  email, 
  status, 
  created_at
FROM contractors
ORDER BY created_at DESC
LIMIT 1;

-- Expected: Your new contractor record!
```

---

## ✅ Success Checklist

```
☐ Ran /FIX_RLS_COMPLETE.sql
☐ Verified RLS policies exist (3 policies)
☐ Used different email OR waited 1 hour
☐ Tested contractor signup
☐ No RLS error (42501)
☐ No rate limit error
☐ Contractor appears in database
☐ Success! ✅
```

---

## 🆘 If Still Failing

### **Still getting RLS error?**
- Check: `SELECT * FROM pg_policies WHERE tablename = 'contractors';`
- Should see 3 policies
- If not, re-run `/FIX_RLS_COMPLETE.sql`

### **Still getting rate limit?**
- You MUST wait the full hour OR use different email
- No workaround for this (it's a security feature)
- Check when last attempt was in Auth logs

### **Getting different error?**
- Check browser console (F12)
- Look for specific error message
- Refer to other troubleshooting guides:
  - `/FIX_PGRST205_ERROR.md` (table not found)
  - `/FIX_CONTRACTOR_ERROR.md` (foreign key)
  - `/SIGNUP_ERROR_QUICK_FIX.md` (general errors)

---

## 📞 Quick Reference

| Error | Fix |
|-------|-----|
| RLS violation (42501) | Run `/FIX_RLS_COMPLETE.sql` |
| Email rate limit | Use different email OR wait 1 hour |
| PGRST205 | Run `/CONTRACTORS_QUICK_SETUP.sql` + restart PostgREST |
| Foreign key | Check `/FIX_CONTRACTOR_ERROR.md` |

---

**The rate limit is a good thing - it protects your app from abuse!** 🛡️

**Just use a different email for now, and the signup will work!** ✅
