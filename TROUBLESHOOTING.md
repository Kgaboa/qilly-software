# Troubleshooting Guide

## Error: "column u.role does not exist"

**Cause:** The script tried to query the role column before creating it.

**Solution:** Use `/SIMPLE_FIX.sql` instead - it's specifically designed to avoid this error.

---

## Error: "relation 'users' does not exist"

**Cause:** The users table hasn't been created yet.

**Solution:** The `/SIMPLE_FIX.sql` script creates it - just run the entire script.

---

## Error: "user admin@qilly.co.za not found in auth.users"

**Cause:** The admin user doesn't exist in Supabase Authentication.

**Solution:**
1. Go to: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/auth/users
2. Click **Add User** → **Create New User**
3. Email: `admin@qilly.co.za`
4. Password: `QillyAdmin2026!`
5. ✅ Check "Auto-confirm user"
6. Click **Create User**
7. Run `/SIMPLE_FIX.sql` again

---

## Error: "duplicate key value violates unique constraint"

**Cause:** Data already exists in the database.

**Good news:** This means the script already ran successfully! The error is expected when running it again.

**Solution:** This is not actually an error - your database is already set up. Just refresh Figma Make and test.

---

## Still Getting 0 Suppliers/Contractors After Running Script

### Check 1: Verify admin user exists
```sql
SELECT email, role FROM users WHERE email = 'admin@qilly.co.za';
```
**Expected:** Should return 1 row with role = 'admin'

### Check 2: Verify data exists
```sql
SELECT COUNT(*) FROM suppliers;
SELECT COUNT(*) FROM contractors;
```
**Expected:** Should return 3 for each

### Check 3: Verify RLS policies
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('suppliers', 'contractors');
```
**Expected:** Should show "Admins can view all suppliers" and "Admins can view all contractors"

### Check 4: Test direct query (as admin)
```sql
-- This should return suppliers if you're logged in as admin
SELECT * FROM suppliers;
```
**Expected:** Should return 3 suppliers

### Check 5: Clear browser cache
Sometimes the old session is cached:
1. Open browser console (F12)
2. Run:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```
3. Log in again with `admin@qilly.co.za` / `QillyAdmin2026!`

---

## Admin Can't Login

### Check if user is confirmed
```sql
SELECT email, confirmed_at FROM auth.users WHERE email = 'admin@qilly.co.za';
```

If `confirmed_at` is NULL:
1. Go to Authentication → Users
2. Find admin@qilly.co.za
3. Click the three dots → **Confirm Email**

---

## RLS Policy Issues

If you see "new row violates row-level security policy":

```sql
-- Temporarily disable RLS to test
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;

-- Test if data loads now
-- Then re-enable:
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
```

---

## Complete Reset (Nuclear Option)

If nothing works, here's how to start fresh:

```sql
-- WARNING: This deletes all data!
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS contractors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Now run /SIMPLE_FIX.sql
```

---

## Need More Help?

### Check these in order:
1. ✅ Admin user exists in auth.users
2. ✅ Admin user has role='admin' in users table
3. ✅ Suppliers and contractors tables exist
4. ✅ RLS policies exist
5. ✅ Test data exists (3 suppliers, 3 contractors)
6. ✅ Browser cache cleared
7. ✅ Logged in fresh

### Quick diagnostic query:
```sql
-- Run this to see everything at once
SELECT 'Auth user exists' as check, 
  CASE WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@qilly.co.za') 
    THEN '✅ YES' ELSE '❌ NO' END as result
UNION ALL
SELECT 'Has admin role',
  CASE WHEN EXISTS (SELECT 1 FROM users WHERE email = 'admin@qilly.co.za' AND role = 'admin')
    THEN '✅ YES' ELSE '❌ NO' END
UNION ALL
SELECT 'Suppliers exist',
  CASE WHEN (SELECT COUNT(*) FROM suppliers) > 0
    THEN '✅ YES (' || (SELECT COUNT(*) FROM suppliers) || ')' ELSE '❌ NO' END
UNION ALL
SELECT 'Contractors exist',
  CASE WHEN (SELECT COUNT(*) FROM contractors) > 0
    THEN '✅ YES (' || (SELECT COUNT(*) FROM contractors) || ')' ELSE '❌ NO' END;
```

All should show ✅ YES!
