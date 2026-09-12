# 🔧 Fix PGRST205 Error - "Could not find the table 'public.contractors' in the schema cache"

## ❌ The Error:

```json
{
  "code": "PGRST205",
  "details": null,
  "hint": null,
  "message": "Could not find the table 'public.contractors' in the schema cache"
}
```

## 🎯 What This Means:

**PGRST205** is a PostgREST error code that means:
- The Supabase API cannot find the `contractors` table
- Either the table doesn't exist, OR
- The table exists but Supabase's API schema cache hasn't refreshed

---

## ✅ COMPLETE FIX (Follow ALL Steps)

### **Step 1: Create the contractors table**

Go to **Supabase Dashboard** → **SQL Editor** → **New Query**

Copy and paste this ENTIRE SQL script:

```sql
-- ============================================
-- CONTRACTORS TABLE - COMPLETE SETUP
-- ============================================

-- Step 1: Drop existing table if corrupted
DROP TABLE IF EXISTS contractors CASCADE;

-- Step 2: Create contractors table
CREATE TABLE contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Company Information
  company_name TEXT NOT NULL,
  cidb_registration_number TEXT,
  cidb_grade TEXT,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  
  -- Address
  street_address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  
  -- Business Details
  project_types TEXT[] DEFAULT '{}',
  operating_provinces TEXT[] DEFAULT '{}',
  years_in_business INTEGER DEFAULT 0,
  bbbee_level TEXT,
  has_certification BOOLEAN DEFAULT false,
  
  -- Status & Approval
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  approval_notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Subscription & Billing
  subscription_tier TEXT DEFAULT 'professional' CHECK (subscription_tier IN ('professional', 'enterprise', 'custom')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'suspended')),
  subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_billing_date TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_contractors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contractors_updated_at ON contractors;
CREATE TRIGGER contractors_updated_at
  BEFORE UPDATE ON contractors
  FOR EACH ROW
  EXECUTE FUNCTION update_contractors_updated_at();

-- Step 4: Enable RLS
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop old policies
DROP POLICY IF EXISTS "Users can create contractor profiles" ON contractors;
DROP POLICY IF EXISTS "Authenticated users can read contractors" ON contractors;
DROP POLICY IF EXISTS "Users can update own contractor profile" ON contractors;

-- Step 6: Create RLS policies
CREATE POLICY "Users can create contractor profiles" 
  ON contractors FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contractors" 
  ON contractors FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can update own contractor profile" 
  ON contractors FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 7: Create indexes
CREATE INDEX IF NOT EXISTS idx_contractors_user_id ON contractors(user_id);
CREATE INDEX IF NOT EXISTS idx_contractors_email ON contractors(email);
CREATE INDEX IF NOT EXISTS idx_contractors_status ON contractors(status);
CREATE INDEX IF NOT EXISTS idx_contractors_province ON contractors(province);
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_tier ON contractors(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_contractors_subscription_status ON contractors(subscription_status);
CREATE INDEX IF NOT EXISTS idx_contractors_operating_provinces ON contractors USING GIN (operating_provinces);
CREATE INDEX IF NOT EXISTS idx_contractors_project_types ON contractors USING GIN (project_types);

-- Step 8: Verify table was created
SELECT 
  table_schema,
  table_name,
  table_type
FROM information_schema.tables
WHERE table_name = 'contractors';

-- Step 9: Verify RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'contractors';

-- Step 10: Success message
DO $$
BEGIN
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ CONTRACTORS TABLE CREATED SUCCESSFULLY!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Table: public.contractors';
  RAISE NOTICE '✅ RLS: Enabled with 3 policies';
  RAISE NOTICE '✅ Indexes: 8 performance indexes';
  RAISE NOTICE '✅ Ready for contractor signups!';
END $$;
```

**Click "Run" (or press F5)**

You should see:
```
✅ Success. No rows returned
✅ CONTRACTORS TABLE CREATED SUCCESSFULLY!
```

---

### **Step 2: Reload Supabase Schema Cache** ⚡ CRITICAL!

After creating the table, you MUST reload the schema cache:

**Option A: Restart PostgREST (Recommended)**

1. Go to **Supabase Dashboard**
2. Click **Settings** (gear icon in left sidebar)
3. Click **API**
4. Scroll down to **"PostgREST Server"**
5. Click **"Restart Server"** or **"Reload Schema Cache"**
6. Wait 10-30 seconds

**Option B: Save API Settings (Alternative)**

1. Go to **Settings** → **API**
2. Make any small change (e.g., change "Max Rows" from 1000 to 1001)
3. Click **"Save"**
4. Change it back to 1000
5. Click **"Save"** again
6. This forces a schema reload

**Option C: Wait (Not Recommended)**

- Schema cache automatically refreshes every 5-10 minutes
- But you shouldn't wait - use Option A or B

---

### **Step 3: Verify Table is Accessible via API**

**Test Query in Supabase SQL Editor:**

```sql
-- This should work (direct SQL access)
SELECT * FROM contractors;
```

**Test via Supabase Client (in your app console):**

Open your browser console (F12) and run:

```javascript
// Test if API can see the table
const { data, error } = await supabase
  .from('contractors')
  .select('*')
  .limit(1);

console.log('Data:', data);
console.log('Error:', error);
```

**Expected Results:**
- ✅ **Data:** `[]` (empty array - table is accessible)
- ✅ **Error:** `null` (no error)

**If you still get PGRST205:**
- Schema cache hasn't refreshed yet
- Go back to Step 2 and restart PostgREST again
- Wait 30 seconds and try again

---

### **Step 4: Test Contractor Signup**

1. Go to your Qilly app
2. Click **"Register as Contractor"**
3. Fill out the form completely:
   - ✅ Company Name: "Test Construction Ltd"
   - ✅ Email: "test@example.com"
   - ✅ Contact Person: "John Doe"
   - ✅ Phone: "+27 11 123 4567"
   - ✅ Select at least 1 project type
   - ✅ Select at least 1 operating province
   - ✅ Password: "TestPass123!" (8+ chars)
   - ✅ Confirm Password: "TestPass123!"
   - ✅ Check "Agree to Terms"
4. Click **"Submit Registration"**

**Expected Result:**
```
✅ Success! Contractor account created successfully!
   Professional tier selected. Pending admin approval.
```

**Check the Database:**

```sql
SELECT 
  id,
  company_name,
  email,
  status,
  subscription_tier,
  created_at
FROM contractors
ORDER BY created_at DESC
LIMIT 5;
```

You should see your new contractor record! 🎉

---

## 🔍 Verification Checklist

Run these checks to confirm everything is working:

```sql
-- ✅ Check 1: Table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'contractors';
-- Expected: 1 row with "contractors"

-- ✅ Check 2: Table structure is correct
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contractors'
ORDER BY ordinal_position;
-- Expected: ~30 columns including user_id, company_name, etc.

-- ✅ Check 3: RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'contractors';
-- Expected: rowsecurity = true

-- ✅ Check 4: RLS policies exist
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'contractors';
-- Expected: 3 rows (INSERT, SELECT, UPDATE)

-- ✅ Check 5: Indexes exist
SELECT indexname
FROM pg_indexes
WHERE tablename = 'contractors';
-- Expected: 9+ indexes

-- ✅ Check 6: Can insert via API (test with authenticated user)
-- Run this in your app console:
const { data, error } = await supabase.auth.getUser();
console.log('Current user:', data.user?.id);
-- Should show user ID if logged in
```

---

## 🆘 If PGRST205 Error STILL Persists...

### **Troubleshooting Steps:**

#### **Issue 1: Schema cache not refreshing**

**Symptoms:** SQL queries work, but API calls fail with PGRST205

**Fix:**
1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Copy your **Project URL** (e.g., `https://abc123.supabase.co`)
3. Check if it's correct in your `.env` file
4. Click **"Restart Server"** under PostgREST section
5. Wait 1 full minute
6. Try signup again

#### **Issue 2: Wrong schema (not in 'public')**

**Symptoms:** Table exists but in wrong schema

**Check:**
```sql
SELECT schemaname, tablename
FROM pg_tables
WHERE tablename = 'contractors';
```

**Expected:** `schemaname = 'public'`

**If different schema:**
```sql
-- Move to public schema
ALTER TABLE your_schema.contractors SET SCHEMA public;
```

#### **Issue 3: API configuration issue**

**Check your Supabase client configuration:**

In `/src/utils/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Log to verify
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 20 chars):', supabaseAnonKey?.substring(0, 20));

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Verify `.env` file:**
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**After changing `.env`:**
- Stop dev server (Ctrl+C)
- Restart: `npm run dev`
- Clear browser cache (Ctrl+Shift+R)

#### **Issue 4: Supabase project paused**

**Check:**
1. Go to Supabase Dashboard
2. Look for yellow/red banner saying "Project paused"
3. Click "Resume project" if paused

#### **Issue 5: Network/CORS issue**

**Check browser console:**
- Look for CORS errors
- Look for network errors
- Check Network tab in DevTools

**Fix:**
- Verify Supabase URL is correct
- Check if Supabase is accessible: https://your-project-id.supabase.co/rest/v1/
- Should see: `{"message":"The server is running."}`

---

## 📋 Complete Setup Script (All-in-One)

If nothing else works, run this complete reset:

```sql
-- COMPLETE RESET & SETUP SCRIPT
-- WARNING: This deletes ALL contractor data!

BEGIN;

-- 1. Drop everything related to contractors
DROP TRIGGER IF EXISTS contractors_updated_at ON contractors CASCADE;
DROP FUNCTION IF EXISTS update_contractors_updated_at() CASCADE;
DROP TABLE IF EXISTS contractors CASCADE;

-- 2. Recreate table
CREATE TABLE contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  cidb_registration_number TEXT,
  cidb_grade TEXT,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  street_address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  project_types TEXT[] DEFAULT '{}',
  operating_provinces TEXT[] DEFAULT '{}',
  years_in_business INTEGER DEFAULT 0,
  bbbee_level TEXT,
  has_certification BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  approval_notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  subscription_tier TEXT DEFAULT 'professional' CHECK (subscription_tier IN ('professional', 'enterprise', 'custom')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'suspended')),
  subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_billing_date TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create trigger
CREATE OR REPLACE FUNCTION update_contractors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contractors_updated_at
  BEFORE UPDATE ON contractors
  FOR EACH ROW
  EXECUTE FUNCTION update_contractors_updated_at();

-- 4. Enable RLS
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- 5. Create policies
CREATE POLICY "Users can create contractor profiles" 
  ON contractors FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contractors" 
  ON contractors FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can update own contractor profile" 
  ON contractors FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Create indexes
CREATE INDEX idx_contractors_user_id ON contractors(user_id);
CREATE INDEX idx_contractors_email ON contractors(email);
CREATE INDEX idx_contractors_status ON contractors(status);
CREATE INDEX idx_contractors_province ON contractors(province);
CREATE INDEX idx_contractors_subscription_tier ON contractors(subscription_tier);
CREATE INDEX idx_contractors_subscription_status ON contractors(subscription_status);
CREATE INDEX idx_contractors_operating_provinces ON contractors USING GIN (operating_provinces);
CREATE INDEX idx_contractors_project_types ON contractors USING GIN (project_types);

COMMIT;

-- 7. Verify
SELECT 'Table created: ' || table_name as result
FROM information_schema.tables
WHERE table_name = 'contractors' AND table_schema = 'public';

SELECT 'Policies created: ' || count(*)::text as result
FROM pg_policies
WHERE tablename = 'contractors';

SELECT 'Indexes created: ' || count(*)::text as result
FROM pg_indexes
WHERE tablename = 'contractors';
```

**After running:**
1. ✅ Click "Run"
2. ✅ Go to **Settings** → **API** → **Restart Server**
3. ✅ Wait 30 seconds
4. ✅ Test signup again

---

## 🎯 Success Checklist

Your setup is complete when ALL of these are ✅:

```
☐ SQL query works: SELECT * FROM contractors;
☐ API query works: supabase.from('contractors').select('*')
☐ No PGRST205 error in browser console
☐ Contractor signup form submits successfully
☐ New contractor appears in contractors table
☐ User created in auth.users table
☐ Email confirmation sent (if enabled)
```

---

## 📞 Still Need Help?

If you're still getting PGRST205 after following ALL steps:

1. **Check Supabase service status:** https://status.supabase.com
2. **Verify project isn't paused** (common for free tier)
3. **Check Supabase logs:** Dashboard → Logs → PostgREST logs
4. **Try creating a different table** to test if API works at all:
   ```sql
   CREATE TABLE test_table (id UUID PRIMARY KEY);
   ALTER TABLE test_table ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "test" ON test_table FOR SELECT TO authenticated USING (true);
   ```
   Then test: `supabase.from('test_table').select('*')`

5. **Contact Supabase support** if the API fundamentally doesn't work

---

**99% of PGRST205 errors are fixed by:**
1. ✅ Running the SQL to create the table
2. ✅ Restarting PostgREST server
3. ✅ Waiting 30 seconds for cache to refresh

**Your contractor signup should work after following these steps!** 🚀
