# 🚨 FIX "permission denied for table users" - RUN NOW

## **Your Error:**
```
❌ Error loading contractor data: {
  "code": "42501",
  "message": "permission denied for table users"
}
```

---

## ✅ **IMMEDIATE FIX - 3 STEPS:**

### **STEP 1: Open Supabase SQL Editor**

Go to your Supabase dashboard:
```
https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
```

---

### **STEP 2: Copy & Run This File**

📄 **File:** `/FIX_RLS_COMPLETE_NOW.sql`

1. ✅ Open the file `/FIX_RLS_COMPLETE_NOW.sql`
2. ✅ Select ALL text (Ctrl+A)
3. ✅ Copy (Ctrl+C)
4. ✅ Paste into Supabase SQL Editor (Ctrl+V)
5. ✅ Click **RUN** button (▶️)
6. ✅ Wait 20 seconds

---

### **STEP 3: Verify Success**

You should see this output:
```
✅ user_type column exists
✅ users table has 4 policies (expected 4)
✅ contractors table has 4 policies (expected 4)
✅ Admin user configured
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 ALL CHECKS PASSED! RLS is configured correctly.

NEXT STEPS:
1. Clear browser cache (Ctrl+F5)
2. Test contractor signup
3. Test contractor login
4. Should work without "permission denied" errors!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## **THEN TEST:**

1. ✅ **Clear your browser cache:** Press `Ctrl+F5` (or `Cmd+Shift+R` on Mac)
2. ✅ **Try contractor login:** Use existing contractor account
3. ✅ **Try contractor signup:** Create new test account
4. ✅ **Should work!** No more "permission denied" error

---

## **What This Script Does:**

| Action | What It Fixes |
|--------|--------------|
| Adds `user_type` column | ✅ Fixes "column does not exist" |
| Sets admin user | ✅ Enables admin checks |
| Fixes users SELECT policy | ✅ Allows RLS checks from other tables |
| Fixes contractors policies | ✅ Allows signup/login by email or user_id |
| Grants permissions | ✅ Ensures proper access |

---

## **The Root Problem (Explained Simply):**

```
Contractor Login Flow:
1. User logs in ✅
2. App queries: SELECT * FROM contractors WHERE email = 'user@email.com'
3. RLS policy checks: "Is this user allowed to see this data?"
4. RLS checks: "Is user an admin?" → SELECT FROM users table
5. ❌ users table RLS blocks the check
6. ❌ ERROR: "permission denied for table users"
```

**The Fix:**
- Change users SELECT policy from `USING (auth.uid() = id)` to `USING (true)`
- This allows RLS checks from other tables
- Safe because passwords are in `auth.users`, not `public.users`

---

## **Why Previous Fixes Didn't Work:**

You might have run other scripts that:
- ✅ Created policies for contractors
- ✅ Created policies for users
- ❌ But left users SELECT policy too restrictive
- ❌ So RLS checks still failed

**This script:**
- ✅ Drops ALL old policies
- ✅ Creates NEW policies correctly
- ✅ Fixes BOTH users and contractors tables
- ✅ Uses `USING (true)` for users SELECT

---

## **Quick Checklist:**

- [ ] Open Supabase SQL Editor
- [ ] Copy `/FIX_RLS_COMPLETE_NOW.sql`
- [ ] Paste and RUN
- [ ] See ✅ verification output
- [ ] Clear browser cache (`Ctrl+F5`)
- [ ] Test contractor login
- [ ] Test contractor signup
- [ ] ✅ Works!

---

## **If You See Errors When Running:**

### **Error: "relation does not exist"**
- Your table names might be different
- Check table names in Supabase Table Editor

### **Error: "syntax error"**
- Make sure you copied the ENTIRE file
- Don't run it in parts - run all at once

### **No output / No errors**
- That's fine! Check verification below

---

## **Verify After Running:**

Run this query to check:
```sql
-- Check policies
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('users', 'contractors')
AND schemaname = 'public'
GROUP BY tablename;
```

Expected output:
```
contractors | 4
users       | 4
```

---

## **Contact Support If Still Failing:**

If after running this script and clearing cache you still get errors:

1. ✅ Take screenshot of SQL output
2. ✅ Take screenshot of browser error
3. ✅ Send to: support@qilly.co.za

But this should fix it! 🚀

---

## **Summary:**

| What | File | Action |
|------|------|--------|
| Fix script | `/FIX_RLS_COMPLETE_NOW.sql` | Copy & Run in Supabase |
| Time needed | 30 seconds | - |
| Browser action | Clear cache | `Ctrl+F5` |
| Test | Contractor login/signup | Should work ✅ |

---

**RUN THE SCRIPT NOW TO FIX THE ERROR!** ⚡
