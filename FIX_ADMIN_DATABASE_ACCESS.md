# Fix Admin Database Access - March 5, 2026

## Problem
Your app is connected to the correct development database `zzdzrlglivtpawtitvgu`, but `admin@qilly.co.za` is getting **0 suppliers** and **0 contractors** even though the database connection works.

## Root Cause
The `users` table doesn't have a `role` column, which means the database schema isn't fully set up yet. This is preventing the admin user from being properly configured.

## ✅ COMPLETE FIX - Run This One Script

### Step 1: Access Supabase SQL Editor
1. Go to https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Complete Setup Script

**IMPORTANT: Before running the script, make sure the admin user exists in Authentication:**

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Check if `admin@qilly.co.za` exists
3. If NOT, create it:
   - Click **Add User** → **Create New User**
   - Email: `admin@qilly.co.za`
   - Password: `QillyAdmin2026!`
   - Auto-confirm user: **YES**
   - Click **Create User**

### Step 3: Copy and Run the Complete Setup

Open `/COMPLETE_DATABASE_SETUP.sql` and copy the ENTIRE contents into Supabase SQL Editor, then click **Run**.

This script will:
- ✅ Add `role` column to `users` table (if missing)
- ✅ Create `suppliers` and `contractors` tables (if missing)
- ✅ Set up all RLS policies for admin access
- ✅ Create admin user with 'admin' role
- ✅ Add 3 test suppliers and 3 test contractors
- ✅ Verify everything is working

### Step 4: Verify Results

After running the script, you should see output like:
```
NOTICE: Admin user created/updated with ID: xxx-xxx-xxx
NOTICE: Added 3 test suppliers
NOTICE: Added 3 test contractors

Users Table: 1
Suppliers Table: 3
Contractors Table: 3
Admin User: admin@qilly.co.za | admin
```

### Step 5: Test in Figma Make

1. Refresh your Figma Make preview
2. Log in as `admin@qilly.co.za` / `QillyAdmin2026!`
3. Go to Admin Dashboard
4. Check the console - you should see:
   ```
   ✅ Loaded suppliers from Supabase: 1
   ✅ Loaded contractors from Supabase: 1
   ```

## Quick Diagnostic Checklist

Run these queries to diagnose the issue:

```sql
-- 1. Does admin user exist in auth?
SELECT email FROM auth.users WHERE email = 'admin@qilly.co.za';

-- 2. Does admin have correct role in users table?
SELECT email, role FROM users WHERE email = 'admin@qilly.co.za';

-- 3. Are there any suppliers in the database?
SELECT COUNT(*) FROM suppliers;

-- 4. Can the current policies see anything?
SELECT COUNT(*) FROM suppliers WHERE TRUE;

-- 5. What RLS policies exist?
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('suppliers', 'contractors');
```

## Expected Results After Fix

✅ Admin user has `role = 'admin'` in users table
✅ RLS policies allow admins to SELECT all rows
✅ At least 1 test supplier and contractor exist
✅ Admin dashboard shows the data

## Common Issues

### Issue: "Users table doesn't exist"
**Fix**: Run the complete database setup from `/COMPLETE_DATABASE_SETUP.sql`

### Issue: "Policy already exists"
**Fix**: Drop the policy first with `DROP POLICY IF EXISTS "policy_name" ON table_name;`

### Issue: "Still getting 0 results"
**Fix**: Clear browser localStorage and log in again:
```javascript
// Run in browser console
localStorage.clear();
location.reload();
```

## For Monday's Demo

Once this is fixed, you'll want to add realistic mock suppliers/contractors for the investor presentation. Let me know if you need help with that!
