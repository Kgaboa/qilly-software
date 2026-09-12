# 🚨 FIX: "subscription_tier column not found" Error

## ❌ THE ERROR YOU'RE SEEING:

```
Could not find the 'subscription_tier' column of 'users' in the schema cache
insert or update on table "bills" violates foreign key constraint "bills_user_id_fkey"
```

## ⚡ THE CAUSE:

Your `users` table is **missing required columns** that the app expects. This prevents user records from being created, which then causes the foreign key error when trying to save bills.

---

## ✅ THE FIX (2 OPTIONS)

### Option 1: Add Missing Columns to Existing Table (RECOMMENDED)

**Use this if you already have data in your users table that you want to keep.**

#### Steps:
1. **Open Supabase SQL Editor**
   - Go to https://supabase.com/dashboard
   - Select your Qilly project
   - Click "SQL Editor" → "+ New Query"

2. **Run the Column Fix Script**
   - Open file: **`/FIX_USERS_TABLE_COLUMNS.sql`**
   - Copy EVERYTHING (Ctrl+A, Ctrl+C)
   - Paste into SQL Editor (Ctrl+V)
   - Click "Run" (or Ctrl+Enter)
   - Wait ~5 seconds

3. **Verify Success**
   - Scroll through the output
   - You should see "✅ Added..." messages for each column
   - Check the final table structure query shows all columns

---

### Option 2: Complete Fresh Setup

**Use this if you don't have any important data yet and want a clean start.**

#### Steps:
1. **Drop existing tables** (⚠️ WARNING: This deletes all data!)
   ```sql
   DROP TABLE IF EXISTS bill_items CASCADE;
   DROP TABLE IF EXISTS bills CASCADE;
   DROP TABLE IF EXISTS project_settings CASCADE;
   DROP TABLE IF EXISTS subscriptions CASCADE;
   DROP TABLE IF EXISTS users CASCADE;
   ```

2. **Run Complete Setup**
   - Open file: **`/COMPLETE_DATABASE_SETUP.sql`**
   - Copy EVERYTHING and paste in SQL Editor
   - Click "Run"

---

## 📊 WHAT GETS ADDED

The fix adds these columns to your `users` table:

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| subscription_tier | TEXT | 'FREE' | User's subscription level |
| full_name | TEXT | NULL | User's full name |
| company_name | TEXT | NULL | Company name |
| cidb_grade | TEXT | NULL | CIDB grade for contractors |
| contact_number | TEXT | NULL | Contact phone number |
| phone | TEXT | NULL | Alternative phone field |
| is_premium | BOOLEAN | FALSE | Premium status flag |
| trial_bills_remaining | INTEGER | 3 | Free trial BOQs remaining |
| subscription_expires_at | TIMESTAMPTZ | NULL | Subscription expiry date |
| updated_at | TIMESTAMPTZ | NOW() | Last update timestamp |

**Plus:**
- ✅ Foreign key to `auth.users(id)`
- ✅ Automated `updated_at` trigger
- ✅ Proper constraints and defaults

---

## 🧪 TEST IT WORKED

After running the fix:

1. **Test Contractor Signup**
   ```
   → Go to your Qilly app
   → Click "Contractor Login"
   → Sign up with NEW email
   → Complete registration
   → Should work without errors ✅
   ```

2. **Test BOQ Upload**
   ```
   → Login as contractor
   → Upload a BOQ file
   → Process pricing
   → Should save successfully ✅
   ```

3. **Verify in Database**
   ```sql
   -- Run this in SQL Editor
   SELECT 
     id, 
     email, 
     subscription_tier, 
     trial_bills_remaining,
     created_at
   FROM users
   ORDER BY created_at DESC
   LIMIT 5;
   ```
   - Should show your user with subscription_tier = 'FREE' ✅

---

## 🔍 WHY THIS HAPPENED

1. Your database was initially set up with a basic `users` table
2. The app was updated to use additional user fields (subscription_tier, etc.)
3. But the database table structure wasn't updated to match
4. So when the app tried to insert a user with `subscription_tier`, it failed
5. This prevented user creation, which then caused the foreign key error on bills

---

## 📝 WHAT IF IT STILL FAILS?

### Check 1: Verify columns exist
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY column_name;
```
Should show: `cidb_grade`, `company_name`, `contact_number`, `created_at`, `email`, `full_name`, `id`, `is_premium`, `phone`, `subscription_expires_at`, `subscription_tier`, `trial_bills_remaining`, `updated_at`

### Check 2: Verify foreign key exists
```sql
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'users';
```
Should show a FOREIGN KEY constraint to auth.users

### Check 3: Clear Supabase cache
Sometimes Supabase caches the old schema. Try:
1. Go to Supabase Dashboard → Settings → API
2. Click "Restart API server" (this refreshes the schema cache)
3. Wait 30 seconds
4. Try your app again

---

## 🚀 AFTER THE FIX

Once the columns are added, your app should:
- ✅ Create user records successfully
- ✅ Save contractor signups without errors
- ✅ Store BOQ uploads to database
- ✅ Track subscription tiers and trial usage
- ✅ Link bills to users via foreign key

---

## 📚 RELATED FILES

**Use for this specific error:**
- `/FIX_USERS_TABLE_COLUMNS.sql` ← **RUN THIS**

**Use for missing tables (project_settings, contractors):**
- `/COMPLETE_DATABASE_SETUP.sql`
- `/START_HERE_FIX_DATABASE.md`

**Use for navigation:**
- `/DATABASE_SETUP_INDEX.md`

---

## ✅ SUCCESS CHECKLIST

- [ ] Ran `/FIX_USERS_TABLE_COLUMNS.sql` in Supabase SQL Editor
- [ ] Saw "✅ Added..." messages for each column
- [ ] Verified all columns exist with SELECT query
- [ ] Tested contractor signup (no errors)
- [ ] Tested BOQ upload (saves to database)
- [ ] Verified user record created in database
- [ ] No more "subscription_tier" errors
- [ ] No more foreign key constraint errors

---

**🎯 This should fix the immediate errors. Run `/FIX_USERS_TABLE_COLUMNS.sql` now!**
