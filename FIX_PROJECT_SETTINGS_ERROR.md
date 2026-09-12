# 🚨 CRITICAL: Fix "project_settings" Table Does Not Exist Error

## ⚡ THE PROBLEM

You're getting this error:
```
Error: Failed to run sql query: ERROR: 42P01: relation "project_settings" does not exist
```

**OR potentially this error:**
```
Error: Failed to run sql query: ERROR: 42P01: relation "contractors" does not exist
```

**Why?** The `FIX_BILLS_USER_ID_ERROR.sql` file tries to create RLS policies for the `project_settings` and `contractors` tables, but these tables don't exist yet in your Supabase database.

## ✅ THE SOLUTION

### Option 1: Run the Complete Database Setup (RECOMMENDED)

Use the new comprehensive setup file that includes ALL tables:

**File:** `/COMPLETE_DATABASE_SETUP.sql`

This file creates:
- ✅ users table
- ✅ bills table
- ✅ bill_items table
- ✅ **project_settings table** ← Was missing!
- ✅ **contractors table** ← Was missing!
- ✅ suppliers table
- ✅ supplier_products table
- ✅ subscriptions table

**Plus:**
- All RLS policies (30 total)
- All indexes
- All triggers
- All utility functions

### How to Run It:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your Qilly project

2. **Go to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New Query"

3. **Copy and Run the Script**
   - Open `/COMPLETE_DATABASE_SETUP.sql`
   - Copy ALL contents
   - Paste into Supabase SQL Editor
   - Click "Run" (or press Ctrl+Enter)

4. **Verify Success**
   - Scroll to the bottom of the results
   - You should see 2 verification queries showing:
     - All 8 tables created
     - All 30 RLS policies created

---

## 📊 What's Different from Before?

### Old Setup Files:
- `SUPABASE_SETUP_FIXED.sql` - Had 6 tables (missing project_settings)
- `FIX_BILLS_USER_ID_ERROR.sql` - Tried to add project_settings but needs table creation first

### New Complete Setup:
- `COMPLETE_DATABASE_SETUP.sql` - Has ALL 8 tables + comprehensive RLS policies

---

## 🔍 What Does the project_settings Table Do?

The `project_settings` table stores all project configuration data:

```sql
project_settings:
  - id (UUID)
  - user_id (UUID) → Links to users table
  - project_type (TEXT) → "single_dwelling", "multi_unit", etc.
  - house_type (TEXT) → "1_bed", "2_bed", "3_bed", etc.
  - num_units (INTEGER) → Number of units in project
  - project_location (TEXT) → City/town name
  - province (TEXT) → SA province
  - municipality (TEXT) → Municipality name
  - settings_data (JSONB) → Additional settings
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

This table is critical for:
- Storing contractor project settings
- Calculating compliance costs
- Regional price optimization
- Migrating from localStorage to database

---

## 🎯 Why This Error Happened

1. The initial Supabase setup created 6 tables (users, bills, bill_items, suppliers, supplier_products, subscriptions)
2. Later, the code was updated to use `project_settings` table for storing project configuration
3. The RLS policy file (`FIX_BILLS_USER_ID_ERROR.sql`) was created to add policies for this new table
4. But the table itself was never created in the database
5. So when you try to run the RLS policy script, it fails because it's trying to add policies to a non-existent table

---

## ⚙️ Alternative: Manual Step-by-Step

If you prefer to create just the project_settings table without running the entire setup:

```sql
-- 1. Create the table
CREATE TABLE IF NOT EXISTS project_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_type TEXT,
  house_type TEXT,
  num_units INTEGER,
  project_location TEXT,
  province TEXT,
  municipality TEXT,
  settings_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE project_settings ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
CREATE POLICY "Allow authenticated users to insert own settings"
ON project_settings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to view own settings"
ON project_settings FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update own settings"
ON project_settings FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own settings"
ON project_settings FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 4. Create index
CREATE INDEX IF NOT EXISTS idx_project_settings_user_id ON project_settings(user_id);

-- 5. Create trigger
CREATE TRIGGER update_project_settings_updated_at
  BEFORE UPDATE ON project_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Grant permissions
GRANT ALL ON project_settings TO authenticated;
```

---

## 🧪 Testing After Setup

After running the setup script:

1. **Test Contractor Signup**
   - Go to your Qilly app
   - Click "Contractor Login"
   - Create a new account
   - Complete the 2-step registration
   - Verify no database errors

2. **Test Project Settings**
   - Select a project type
   - Choose province and municipality
   - Verify settings are saved
   - Check they persist after page refresh

3. **Test BOQ Upload**
   - Upload a BOQ template or file
   - Verify it processes correctly
   - Check that bill is saved to database

4. **Verify in Database Inspector**
   - Go to Admin Dashboard
   - Click "Database Inspector" tab
   - Check that project_settings table exists
   - Verify data is being stored

---

## 📝 Summary

**Problem:** `project_settings` table doesn't exist  
**Solution:** Run `/COMPLETE_DATABASE_SETUP.sql` in Supabase SQL Editor  
**Result:** All 8 tables created with proper RLS policies  
**Time:** ~2 minutes to run  
**Safe:** Can be run multiple times without issues  

---

## 🆘 Still Having Issues?

If you still see errors after running the complete setup:

1. Check that you're using the correct Supabase project (Dev vs Prod)
2. Verify you have the correct permissions in Supabase
3. Check the SQL Editor output for any specific error messages
4. Try running the verification queries at the bottom of the setup script

The verification queries will show you exactly which tables and policies exist, helping diagnose any remaining issues.