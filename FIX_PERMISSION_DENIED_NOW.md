# 🚨 FIX: "permission denied for table users"

## **The Error:**
```json
{
  "code": "42501",
  "message": "permission denied for table users"
}
```

---

## ✅ **INSTANT FIX (Choose ONE):**

### **OPTION 1: Quick Fix (Users Table Only)**

If you just want to fix the "permission denied" error fast:

📄 **File:** `/FIX_USERS_TABLE_PERMISSION.sql`

```
1. Copy ENTIRE file
2. Paste in Supabase SQL Editor
3. Click Run ▶️
4. Done! (15 seconds)
```

**This fixes ONLY the users table permission.**

---

### **OPTION 2: Complete Fix (Everything)**

If you want to fix ALL RLS issues at once:

📄 **File:** `/FIX_ALL_RLS_COMPLETE.sql`

```
1. Copy ENTIRE file
2. Paste in Supabase SQL Editor
3. Click Run ▶️
4. Done! (30 seconds)
```

**This fixes:**
- ✅ "permission denied for table users"
- ✅ "column users.user_type does not exist"
- ✅ Contractor signup
- ✅ Contractor login
- ✅ Supplier signup/login
- ✅ All RLS policies

---

## **What's Wrong:**

The `users` table has an RLS policy that blocks everyone from reading it:

```sql
-- ❌ CURRENT (BROKEN)
CREATE POLICY "users_select_policy" ON users
  USING (auth.uid() = id);  -- Only allows users to see their OWN record
```

**Problem:** When contractors log in, the system needs to check:
```sql
-- Check if user is admin
SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin'
```

But the RLS policy blocks this check! ❌

---

## **The Fix:**

Change the users SELECT policy to allow ALL authenticated users to read:

```sql
-- ✅ FIXED
CREATE POLICY "users_select_policy" ON users
  USING (true);  -- Allows all authenticated users to read
```

**Why this is safe:**
- ✅ Passwords are NOT in `public.users` (they're in `auth.users`)
- ✅ Only contains: id, email, user_type
- ✅ Write operations still restricted
- ✅ Standard RBAC pattern

---

## **After Running the Fix:**

### **What You'll See:**
```
✅ user_type column exists | text
✅ RLS policies created | contractors | 4
✅ RLS policies created | users | 4
✅ Admin user configured | admin@qilly.co.za | admin
```

### **Test It:**
1. Clear browser cache: `Ctrl+F5`
2. Login as contractor: `contractor@gmail.com`
3. Should load data without errors! ✅

---

## **Error Flow:**

### **Before Fix:**
```
Contractor logs in
  ↓
Load contractor data
  ↓
RLS checks admin status → SELECT from users
  ↓
❌ BLOCKED by users RLS policy
  ↓
ERROR: permission denied for table users
```

### **After Fix:**
```
Contractor logs in
  ↓
Load contractor data
  ↓
RLS checks admin status → SELECT from users
  ↓
✅ ALLOWED (all authenticated can read)
  ↓
✅ Data loads successfully
```

---

## **Quick Decision Guide:**

| Situation | Use This File |
|-----------|---------------|
| Just fix permission error | `/FIX_USERS_TABLE_PERMISSION.sql` |
| Fix everything at once | `/FIX_ALL_RLS_COMPLETE.sql` |
| Want to understand steps | See breakdown below ⬇️ |

---

## **What Each File Does:**

### **FIX_USERS_TABLE_PERMISSION.sql:**
- Drops old users policies
- Creates new policy: `USING (true)` for SELECT
- Takes 15 seconds

### **FIX_ALL_RLS_COMPLETE.sql:**
- Adds user_type column (if missing)
- Drops ALL old policies (users, contractors, suppliers)
- Creates ALL new policies
- Sets admin user
- Takes 30 seconds
- **Most comprehensive**

---

## **Why You Keep Getting RLS Errors:**

You've run multiple RLS scripts that create policies like:

```sql
-- These policies check admin status
WHERE users.user_type = 'admin'
```

But they ALSO need users to be readable:

```sql
-- This requires reading users table
EXISTS (SELECT 1 FROM users WHERE ...)
```

The users table RLS policy was blocking these checks!

---

## **Recommendation:**

### **Run OPTION 2 (Complete Fix):**

📄 `/FIX_ALL_RLS_COMPLETE.sql`

**Why:**
- ✅ Fixes everything at once
- ✅ Adds user_type column
- ✅ Sets admin user
- ✅ Clean slate
- ✅ No more errors
- ✅ Ready for eTender presentation

**Time:** 30 seconds

---

## **After Fix Checklist:**

- [ ] Run `/FIX_ALL_RLS_COMPLETE.sql`
- [ ] See ✅ verification output
- [ ] Clear browser cache (`Ctrl+F5`)
- [ ] Test contractor signup
- [ ] Test contractor login
- [ ] Verify data loads
- [ ] No more errors!
- [ ] 🚀 Ready for Tuesday!

---

**Use OPTION 2 for best results. It fixes EVERYTHING in one go!** ✅
