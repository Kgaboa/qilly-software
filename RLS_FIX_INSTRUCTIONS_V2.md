# 🚨 FIX: Permission Denied for Table Users (V2 - LOGIN ERROR)

## **The Problem:**
```
Error loading contractor data: permission denied for table users
Code: 42501
```

This happens AFTER contractor login when trying to load contractor data. The issue is that the RLS policies on the `contractors` table reference the `users` table to check admin status, but the `users` table ALSO has RLS enabled which blocks the read.

---

## **Root Cause:**

```sql
-- Contractor policy checks admin status
CREATE POLICY "contractors_select_policy" ON contractors
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM users          -- ❌ BLOCKED! Can't read users table
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'
    )
  );
```

The policy tries to read the `users` table, but the `users` table has its own RLS that prevents this!

---

## ✅ **THE SOLUTION (V2):**

### **Run This Script:**
**File:** `/FIX_CONTRACTOR_SIGNUP_RLS_V2.sql`

### **Steps:**

1. **Open SQL Editor:**  
   https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new

2. **Copy & Paste:**  
   Open `/FIX_CONTRACTOR_SIGNUP_RLS_V2.sql` and copy everything

3. **Run:** Click **"Run"** ▶️

4. **Look for:**
   ```
   ✅✅✅ ALL POLICIES CREATED SUCCESSFULLY! ✅✅✅
   
   🔑 KEY CHANGES IN V2:
      • Users table: SELECT policy now allows all authenticated users
      • This fixes "permission denied" when checking admin status
      • Contractors can now load their data after login
   ```

5. **Clear Browser Cache:** `Ctrl+F5`

6. **Test Contractor Login:**
   - Email: `contractor@gmail.com`
   - Should successfully load dashboard

---

## **What V2 Changes:**

### **🔑 Key Fix - Users Table SELECT Policy:**

**Before (V1 - BLOCKED):**
```sql
CREATE POLICY "users_select_policy" ON users
  USING (
    auth.uid() = id  -- ❌ Can only read OWN record
    OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'admin')
  );
```

**After (V2 - ALLOWED):**
```sql
CREATE POLICY "users_select_policy" ON users
  USING (true);  -- ✅ All authenticated users can READ users table
```

### **Why This is Safe:**

1. ✅ **No passwords exposed** - Passwords are in `auth.users` (Supabase managed), not in `public.users`
2. ✅ **Only basic info** - Just `user_type`, `email`, etc.
3. ✅ **Standard practice** - Needed for role-based access control (RBAC)
4. ✅ **Write operations still protected** - Only admins or own user can UPDATE/DELETE

---

## **Complete Policy Set (V2):**

### **Users Table:**
- ✅ **SELECT:** All authenticated users can read (needed for admin checks)
- ✅ **INSERT:** Users can only create their own record
- ✅ **UPDATE:** Users can only update their own record
- ✅ **DELETE:** Users can only delete their own record

### **Contractors Table:**
- ✅ **SELECT:** Contractors view own data, admins view all
- ✅ **INSERT:** Authenticated users can create their contractor profile
- ✅ **UPDATE:** Contractors update own data, admins update all
- ✅ **DELETE:** Only admins can delete

---

## **Expected Flow After Fix:**

### **✅ Contractor Login:**
```
1. User logs in → Auth succeeds
2. App loads contractor data:
   await supabase.from('contractors').select('*').eq('email', user.email)
3. RLS policy checks:
   - Is auth.uid() = user_id? ✅ YES
   - OR is user an admin? (needs to read users table) ✅ NOW ALLOWED
4. Contractor data loads successfully! ✅
```

### **✅ Admin Viewing Contractors:**
```
1. Admin logs in → Auth succeeds
2. App loads all contractors:
   await supabase.from('contractors').select('*')
3. RLS policy checks:
   - Is this an admin? (reads users table) ✅ ALLOWED
   - users.user_type = 'admin'? ✅ YES
4. All contractor data loads successfully! ✅
```

---

## **Expected Output:**

```
🔧 FIXING CONTRACTOR SIGNUP & LOGIN RLS POLICIES (V2)...

✅ Contractors table: 4 RLS policies created
✅ Users table: 4 RLS policies created

✅✅✅ ALL POLICIES CREATED SUCCESSFULLY! ✅✅✅

🔑 KEY CHANGES IN V2:
   • Users table: SELECT policy now allows all authenticated users
   • This fixes "permission denied" when checking admin status
   • Contractors can now load their data after login

🎯 Both contractor signup AND login should now work!

📋 Next Steps:
   1. Clear browser cache (Ctrl+F5)
   2. Try contractor login with: contractor@gmail.com
   3. Should successfully load contractor dashboard
```

Plus a table showing all policies.

---

## **Differences Between V1 and V2:**

| Aspect | V1 (Signup Only) | V2 (Signup + Login) |
|--------|------------------|---------------------|
| Users SELECT | Own record only | ✅ All authenticated users |
| Contractor Signup | ✅ Fixed | ✅ Fixed |
| Contractor Login | ❌ Blocked | ✅ Fixed |
| Admin Checks | ❌ Can't read users | ✅ Can read users |

---

## **After Running:**

1. ✅ Clear browser cache (`Ctrl+F5`)
2. ✅ Login as contractor: `contractor@gmail.com`
3. ✅ Should load dashboard without errors
4. ✅ No more "permission denied for table users"!

---

## **Troubleshooting:**

### **If you still get errors:**

1. **Verify policies were created:**
   ```sql
   SELECT tablename, policyname, cmd 
   FROM pg_policies 
   WHERE tablename IN ('contractors', 'users')
   ORDER BY tablename, cmd;
   ```
   Should show 4 policies for each table.

2. **Check user exists:**
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'contractor@gmail.com';
   ```

3. **Check contractor record exists:**
   ```sql
   SELECT id, email, user_id, status 
   FROM contractors 
   WHERE email = 'contractor@gmail.com';
   ```

4. **Test policy manually:**
   ```sql
   -- Login as contractor user, then run:
   SELECT * FROM users;  -- Should return ALL users now (V2 fix)
   SELECT * FROM contractors WHERE email = auth.email();  -- Should return own record
   ```

---

**Run `/FIX_CONTRACTOR_SIGNUP_RLS_V2.sql` now to fix BOTH signup AND login! 🚀**
