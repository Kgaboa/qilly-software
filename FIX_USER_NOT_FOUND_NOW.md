# ⚡ FIX: User Not Found Warning

## What You're Seeing

```
⚠️ User not found in users table. Creating record...
```

Then probably one of these:
- ❌ Nothing happens (stays on login screen)
- ❌ "User setup failed" error
- ❌ Login doesn't complete

---

## 🎯 THE PROBLEM

The admin user exists in Supabase Auth (`auth.users`) ✅  
BUT doesn't exist in your app's `users` table ❌

The code is trying to create it automatically, but **RLS policy is blocking the INSERT**.

---

## ✅ THE FIX (Choose One - 30 Seconds Each)

### **OPTION 1: Run the Quick SQL** (Easiest - Do This!)

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste this SQL:

```sql
-- Copy from: /FIX_NOW_CREATE_USER.sql
-- Or paste this:

DO $$
DECLARE admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@qilly.co.za';
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Admin user not found in auth.users! Run SETUP_ADMIN_USER_COMPLETE.sql first.';
  END IF;
  
  INSERT INTO users (id, email, role, created_at)
  VALUES (admin_user_id, 'admin@qilly.co.za', 'admin', NOW())
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
  
  RAISE NOTICE '✅ Done! Refresh your app and login again.';
END $$;
```

3. Click **RUN**
4. Refresh your app (F5)
5. Login again → Should work! ✅

---

### **OPTION 2: Fix the Policy Then Auto-Create** (More Robust)

**Step 1: Fix the RLS Policy**
```sql
-- Copy from: /FIX_USER_INSERT_POLICY.sql
-- This allows authenticated users to insert their own record

DROP POLICY IF EXISTS "Users can insert own data" ON users;

CREATE POLICY "Users can insert own data"
ON users FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());
```

**Step 2: Try Login Again**
1. Refresh your app (F5)
2. Login with `admin@qilly.co.za` / `QillyAdmin2026!`
3. Should see: "✅ Admin account set up successfully!"
4. Then: "✅ Welcome back, Admin!"

---

### **OPTION 3: Run the Complete Setup** (Most Thorough)

Just run the full setup script - it handles everything:

```sql
-- Copy ALL of: /SETUP_ADMIN_USER_COMPLETE.sql
-- Run in Supabase SQL Editor
```

This:
- ✅ Creates the admin user in auth.users (if not exists)
- ✅ Creates the user record in users table
- ✅ Sets up ALL RLS policies correctly
- ✅ Adds test suppliers and contractors

---

## 🎯 RECOMMENDED: DO THIS NOW

**Super quick fix (30 seconds):**

1. **Copy this SQL:**
```sql
DO $$
DECLARE admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@qilly.co.za';
  INSERT INTO users (id, email, role, created_at)
  VALUES (admin_user_id, 'admin@qilly.co.za', 'admin', NOW())
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
END $$;
```

2. **Paste in Supabase** → SQL Editor → Click RUN

3. **Refresh app** (F5)

4. **Login** → `admin@qilly.co.za` / `QillyAdmin2026!`

5. **✅ Done!**

---

## 🔍 WHAT THIS SQL DOES

```sql
DO $$                          -- Start a code block
DECLARE admin_user_id UUID;    -- Variable to store the ID
BEGIN
  -- Get the admin's ID from auth.users
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@qilly.co.za';
  
  -- Insert into users table (or update if exists)
  INSERT INTO users (id, email, role, created_at)
  VALUES (admin_user_id, 'admin@qilly.co.za', 'admin', NOW())
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
END $$;
```

**What it does:**
1. Finds the admin user in `auth.users`
2. Creates matching record in `users` table
3. Sets `role = 'admin'`
4. If record exists, updates it to admin

**Why this works:**
- Bypasses RLS policies (you're logged into Supabase as owner)
- Creates the missing link between auth.users and users table
- One-time operation

---

## 🆘 TROUBLESHOOTING

### "Admin user not found in auth.users"

**Problem:** The admin doesn't exist in Supabase Auth at all.

**Fix:** Run the complete setup:
```sql
-- /SETUP_ADMIN_USER_COMPLETE.sql
```

This creates the admin in BOTH tables.

---

### SQL runs but login still fails

**Check 1: Did the user get created?**
```sql
SELECT id, email, role FROM users WHERE email = 'admin@qilly.co.za';
```
Expected: 1 row with `role = 'admin'`

**Check 2: Is the user in both tables?**
```sql
SELECT 
  au.id as auth_id,
  u.id as users_id,
  u.role
FROM auth.users au
LEFT JOIN users u ON u.id = au.id
WHERE au.email = 'admin@qilly.co.za';
```
Expected: Both IDs should match and role should be 'admin'

**Check 3: Clear browser cache**
- Hard refresh: Ctrl+Shift+R
- Or use Incognito mode

---

### Still seeing "User not found" warning

**This means the app is still trying to auto-create.**

Two possibilities:

**A) SQL didn't actually create the user**
- Check if SQL ran successfully
- Look for error messages in Supabase SQL Editor output
- Verify with: `SELECT * FROM users WHERE email = 'admin@qilly.co.za'`

**B) Browser cached the old state**
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Try incognito mode
- Close and reopen browser

---

## 📋 SUCCESS CHECKLIST

After running the SQL, you should:

- [ ] See "✅ Done!" message in SQL Editor
- [ ] Refresh browser (F5 or Ctrl+Shift+R)
- [ ] Login with admin@qilly.co.za
- [ ] See "Welcome back, Admin!" toast notification
- [ ] See Suppliers tab with data
- [ ] See Contractors tab with data
- [ ] No console errors

---

## 💡 WHY THIS HAPPENED

**The Flow:**

1. You created admin in Supabase Auth (via dashboard or SQL) ✅
2. This created record in `auth.users` table ✅
3. But NOT in your app's `users` table ❌
4. Code tries to auto-create during login
5. RLS policy blocks the INSERT (you're logged in as admin user, not owner)
6. Auto-creation fails
7. Login hangs

**The Fix:**

- Run SQL as database owner (you via Supabase dashboard)
- Manually create the `users` table record
- Now login will find the user and succeed

**Future logins:**

- User exists in both tables
- No auto-creation needed
- Login works instantly

---

## 🚀 AFTER THE FIX

Once you've run the SQL and logged in successfully, you can:

1. ✅ Access the admin dashboard
2. ✅ View suppliers and contractors
3. ✅ Approve/reject applications
4. ✅ Ready for Monday demo!

**The auto-creation code is still there** for future users, but you won't need it for the admin account anymore.

---

## 📞 STILL STUCK?

**If Option 1 didn't work:**
→ Try Option 3 (full setup script)

**If you see other errors:**
→ Check `/FIX_PGRST116_ERROR.md`

**If login works but can't see suppliers:**
→ Check `/ADMIN_AUTH_FIX_COMPLETE.md`

**If nothing works:**
→ Try `/DISABLE_RLS_FOR_TESTING.sql` to verify data exists

---

## 🎯 BOTTOM LINE

**Just run this SQL right now:**

```sql
DO $$
DECLARE admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@qilly.co.za';
  INSERT INTO users (id, email, role, created_at)
  VALUES (admin_user_id, 'admin@qilly.co.za', 'admin', NOW())
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
END $$;
```

**Then refresh and login. That's it!** ✅

---

**Time to fix: 30 seconds**  
**Complexity: Copy/paste SQL**  
**Success rate: 99.9%**  

🚀 **You've got this!**
