# ✅ COMPLETE FIX: Supabase RLS Policy Errors

## 🔴 **Errors You're Experiencing:**

```
⚠️ User not found in users table. Creating record...
❌ Failed to create user record: {
  "code": "42501",
  "details": null,
  "hint": null,
  "message": "new row violates row-level security policy for table \"users\""
}
❌ Error saving bill to Supabase: {
  "code": "23503",
  "details": "Key is not present in table \"users\".",
  "hint": null,
  "message": "insert or update on table \"bills\" violates foreign key constraint \"bills_user_id_fkey\""
}
```

---

## 🎯 **Root Cause**

Your Supabase database has **Row-Level Security (RLS)** enabled, but the policies are either:
1. **Missing** - No policies exist to allow inserts
2. **Too restrictive** - Policies are blocking authenticated user operations
3. **Incorrect** - Policies don't properly check `auth.uid()`

---

## ✅ **THE FIX (3 Steps)**

### **STEP 1: Run the SQL Migration**

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy the entire contents of `/FIX_BILLS_USER_ID_ERROR.sql`**
   - This file is in your project root
   - Select all and copy (Ctrl+A, Ctrl+C)

4. **Paste into Supabase SQL Editor**
   - Paste the SQL code
   - Click "Run" button (or press Ctrl+Enter)

5. **Verify Success**
   - You should see a table of policies at the bottom
   - If you see errors, read them carefully and contact support

---

### **STEP 2: Verify Policies Were Created**

Run this query in the SQL Editor to verify:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('users', 'bills', 'project_settings')
ORDER BY tablename, policyname;
```

**Expected Result:** You should see policies like:
- `Allow authenticated users to insert own record` (users table)
- `Allow users to view own data` (users table)
- `Allow authenticated users to insert own bills` (bills table)
- etc.

---

### **STEP 3: Test the Application**

1. **Refresh your browser** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Sign in** to your application
3. **Upload a BOQ** or create a new bill
4. **Check the browser console** (F12 → Console tab)

**Expected logs:**
```
💾 Saving bill to Supabase with project settings...
✅ User exists in users table
✅ Bill saved to Supabase: { id: '...', user_id: '...', ... }
✅ Bill items saved to Supabase
```

**No longer expected:**
```
❌ Failed to create user record: ...  ⬅️ FIXED!
❌ Error saving bill to Supabase: ...  ⬅️ FIXED!
```

---

## 🔍 **What the SQL Fix Does**

### **For the USERS table:**
1. **Drops all existing conflicting policies**
2. **Creates new permissive policies:**
   - `Allow authenticated users to insert own record` - Lets users create their profile
   - `Allow users to view own data` - Lets users read their own profile
   - `Allow users to update own data` - Lets users update their profile

### **For the BILLS table:**
1. **Drops all existing conflicting policies**
2. **Creates new permissive policies:**
   - `Allow authenticated users to insert own bills` - Lets users create bills
   - `Allow users to view own bills` - Lets users view their bills
   - `Allow users to update own bills` - Lets users edit their bills
   - `Allow users to delete own bills` - Lets users delete their bills

### **For the PROJECT_SETTINGS table:**
1. **Drops all existing conflicting policies**
2. **Creates new permissive policies:**
   - Similar to bills table

---

## 🛡️ **Understanding RLS Policies**

### **What is `auth.uid()`?**
- Returns the UUID of the currently authenticated user
- Used to ensure users can only access their own data

### **Policy Structure:**
```sql
CREATE POLICY "Policy Name"
ON table_name
FOR INSERT  -- or SELECT, UPDATE, DELETE
TO authenticated  -- Only logged-in users
WITH CHECK (auth.uid() = user_id);  -- Check: user owns this record
```

### **Why Two Clauses?**
- `USING (...)` - For SELECT, UPDATE, DELETE (reading existing data)
- `WITH CHECK (...)` - For INSERT, UPDATE (writing new data)

---

## 🚨 **Troubleshooting**

### **If you still see error `42501` (RLS Policy Violation):**

**Check 1: Are you signed in?**
```sql
-- Run this in SQL Editor
SELECT auth.uid();
```
- If it returns `null`, you're not authenticated
- Sign in to your app first, then try again

**Check 2: Check if policies exist:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```
- If empty, the SQL migration didn't run properly
- Try running `/FIX_BILLS_USER_ID_ERROR.sql` again

**Check 3: Verify table structure:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';
```
- Make sure `id` column is `UUID` and references `auth.users(id)`

---

### **If you still see error `23503` (Foreign Key Constraint):**

**This means the user record doesn't exist in the `users` table.**

**Option A: Let the app create it automatically**
- The code now handles this
- Just refresh and try uploading again

**Option B: Manually create user record**
```sql
-- Get your user ID
SELECT id, email FROM auth.users;

-- Insert into users table (replace with your actual user ID)
INSERT INTO users (id, email, full_name, subscription_tier)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with actual UUID from above query
  'your-email@example.com',  -- Your email
  'Your Full Name',  -- Your name
  'FREE'
);
```

---

## 📊 **Updated Code Behavior**

### **Before the fix:**
```typescript
// ❌ Old code - No error handling
const { error } = await supabase
  .from('bills')
  .insert({ user_id: authUser.id, ... });

if (error) {
  console.error('Error:', error);  // Just logs, no guidance
}
```

### **After the fix:**
```typescript
// ✅ New code - Smart error handling
const { data: existingUser } = await supabase
  .from('users')
  .select('id')
  .eq('id', authUser.id)
  .single();

if (!existingUser) {
  // Create user if doesn't exist
  const { error: userCreateError } = await supabase
    .from('users')
    .insert({ id: authUser.id, email: authUser.email });
  
  if (userCreateError?.code === '42501') {
    toast.error('Database permissions error. Run FIX_BILLS_USER_ID_ERROR.sql');
    return; // Stop - can't proceed
  }
}

// Now safe to insert bill
const { error: billError } = await supabase
  .from('bills')
  .insert({ user_id: authUser.id, ... });

if (billError?.code === '23503') {
  toast.error('Foreign key error. Run FIX_BILLS_USER_ID_ERROR.sql');
} else if (billError?.code === '42501') {
  toast.error('RLS policy error. Run FIX_BILLS_USER_ID_ERROR.sql');
}
```

---

## ✅ **Verification Checklist**

Run through this checklist after applying the fix:

- [ ] SQL migration ran successfully in Supabase SQL Editor
- [ ] Policies are visible in `pg_policies` table
- [ ] Browser refreshed (hard refresh: Ctrl+Shift+R)
- [ ] Signed in to application
- [ ] Uploaded a test BOQ
- [ ] No RLS errors in console
- [ ] Bill saved successfully to Supabase
- [ ] Can view bill in History tab

---

## 📞 **Still Having Issues?**

If you're still experiencing errors after following all steps:

1. **Check your Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for authentication or database errors

2. **Verify your environment:**
   - Check `.env.local` has correct Supabase credentials
   - Confirm Supabase project is not paused/suspended

3. **Export and share:**
   - Export the error from browser console
   - Screenshot the Supabase policies table
   - Share in support ticket

---

## 🎯 **Summary**

✅ **What was fixed:**
- Created proper RLS policies for `users`, `bills`, and `project_settings` tables
- Added defensive user record creation in application code
- Improved error messages with actionable guidance

✅ **What you need to do:**
1. Run `/FIX_BILLS_USER_ID_ERROR.sql` in Supabase SQL Editor
2. Refresh your browser
3. Test by uploading a BOQ

✅ **Expected outcome:**
- Users can create their own records
- Bills save successfully without foreign key errors
- Clear error messages if something goes wrong

**All errors should now be resolved!** 🎉
