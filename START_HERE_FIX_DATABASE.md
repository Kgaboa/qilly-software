# 🚀 FIX DATABASE ERROR - START HERE

## ❌ Error You're Seeing:
```
ERROR: 42P01: relation "project_settings" does not exist
```

**OR this error:**
```
ERROR: 42P01: relation "contractors" does not exist
```

## ✅ Fix in 3 Steps (2 minutes):

---

### STEP 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your **Qilly** project
3. Click **"SQL Editor"** in left sidebar
4. Click **"+ New Query"**

---

### STEP 2: Run the Complete Setup Script

1. Open this file: `/COMPLETE_DATABASE_SETUP.sql`
2. **Copy ALL contents** (Ctrl+A, then Ctrl+C)
3. **Paste into Supabase SQL Editor** (Ctrl+V)
4. Click **"Run"** button (or press Ctrl+Enter)
5. Wait ~10 seconds for completion

---

### STEP 3: Verify Success

**You should see at the bottom:**

✅ **8 tables listed:**
- users
- bills
- bill_items
- **project_settings** ← Was missing!
- **contractors** ← Was missing!
- suppliers
- supplier_products
- subscriptions

✅ **30 RLS policies listed:**
- 3 policies for users
- 4 policies for bills
- 4 policies for bill_items
- 4 policies for project_settings
- 4 policies for contractors
- 4 policies for suppliers
- 4 policies for supplier_products
- 3 policies for subscriptions

---

## ✅ That's It! 

### Now Test Your App:

1. **Test Contractor Signup**
   - Go to your Qilly app
   - Create new contractor account
   - No more RLS errors!

2. **Test BOQ Upload**
   - Upload a BOQ file
   - Process pricing
   - Should work perfectly

3. **Test Project Settings**
   - Select project type
   - Choose province/municipality
   - Settings now save to database!

---

## 🎯 What This Fixed:

| Before | After |
|--------|-------|
| ❌ 6 tables only | ✅ 8 tables (added project_settings and contractors) |
| ❌ RLS errors on signup | ✅ Smooth contractor registration |
| ❌ Settings lost on refresh | ✅ Settings persist in database |
| ❌ Bills not saving | ✅ Bills save successfully |
| ❌ Fragmented setup scripts | ✅ One complete setup script |

---

## 📚 Files Reference:

**Use This:** 
- `/COMPLETE_DATABASE_SETUP.sql` ← **RUN THIS ONE!**

**Ignore These (Obsolete):**
- ~~`SUPABASE_SETUP_FIXED.sql`~~ (missing project_settings)
- ~~`FIX_BILLS_USER_ID_ERROR.sql`~~ (needs project_settings to exist first)

**Read This For Details:**
- `/FIX_PROJECT_SETTINGS_ERROR.md` (full explanation)

---

## 🆘 Still Having Issues?

Run this verification query in Supabase SQL Editor:

```sql
-- Check if project_settings table exists
SELECT EXISTS (
  SELECT FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename = 'project_settings'
) as project_settings_exists;

-- Check if contractors table exists
SELECT EXISTS (
  SELECT FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename = 'contractors'
) as contractors_exists;
```

**Should return:** 
- `project_settings_exists: true`
- `contractors_exists: true`

If it returns `false`, the table wasn't created. Try running the complete setup script again.

---

## 💡 Why This Happened:

Your database had 6 tables initially, but the app code was updated to use a 7th table (`project_settings`) for storing project configuration. The RLS policy script tried to secure this table, but since the table didn't exist, it failed with "relation does not exist".

The new complete setup script creates ALL 7 tables + ALL 26 policies in one go!