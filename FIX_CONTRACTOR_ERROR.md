# 🔧 Fix Contractor Foreign Key Error

## ❌ **The Error You're Getting:**

```
ERROR: 23503: insert or update on table "contractors" violates foreign key constraint "contractors_user_id_fkey"
DETAIL: Key (user_id)=(c994bec4-52af-4547-b11a-e464c74da3b4) is not present in table "users".
```

## 🎯 **Why This Happens:**

The `contractors` table has a foreign key constraint:
```sql
user_id UUID REFERENCES auth.users(id)
```

This means every contractor MUST have a corresponding user in the `auth.users` table.

When you try to insert a contractor with `gen_random_uuid()` as the `user_id`, that UUID doesn't exist in `auth.users`, so PostgreSQL rejects it.

---

## ✅ **SOLUTION: 2-Step Process**

### **Option 1: Use the Simple SQL (Recommended)**

1. **Run the SIMPLE SQL first:**
   - Use file: `/CONTRACTORS_TABLE_SIMPLE.sql`
   - This creates the table WITHOUT demo data
   - No errors!

2. **Create demo user manually:**
   
   **Go to Supabase Dashboard:**
   - Navigate to: **Authentication → Users**
   - Click **"Add User"** or **"Invite"**
   
   **Fill in the form:**
   ```
   Email: contractor@demo.com
   Password: DemoContractor123!
   ✅ Auto Confirm User: YES (check this!)
   ```
   
   - Click **"Create User"**
   - **COPY the User ID** (e.g., `c994bec4-52af-4547-b11a-e464c74da3b4`)

3. **Link contractor profile to user:**
   
   Run this SQL in Supabase SQL Editor:
   
   ```sql
   INSERT INTO contractors (
     user_id,
     company_name,
     cidb_registration_number,
     cidb_grade,
     contact_person,
     email,
     phone,
     street_address,
     city,
     province,
     postal_code,
     project_types,
     operating_provinces,
     years_in_business,
     bbbee_level,
     has_certification,
     status,
     subscription_tier,
     billing_cycle,
     subscription_status,
     subscription_start_date,
     next_billing_date
   )
   VALUES (
     'c994bec4-52af-4547-b11a-e464c74da3b4', -- ⚠️ REPLACE with YOUR user ID
     'ABC Construction (Pty) Ltd',
     'CIDB/CR2023/12345',
     'Grade 9 CE',
     'Thabo Mokoena',
     'contractor@demo.com',
     '+27 11 123 4567',
     '123 Construction Avenue',
     'Johannesburg',
     'Gauteng',
     '2001',
     ARRAY['Road Construction', 'Housing Development', 'Infrastructure'],
     ARRAY['Gauteng', 'Mpumalanga', 'Limpopo'],
     15,
     'Level 2',
     true,
     'approved',
     'enterprise',
     'annual',
     'active',
     NOW(),
     NOW() + INTERVAL '1 year'
   );
   ```

---

## 🎬 **Quick Step-by-Step Guide**

### **Step 1: Run Simple SQL**
```bash
# Copy contents of /CONTRACTORS_TABLE_SIMPLE.sql
# Paste into Supabase SQL Editor
# Click "Run"
```

✅ **Result:** Table created, no errors!

---

### **Step 2: Create Auth User (Supabase Dashboard)**

1. Open Supabase Dashboard
2. Go to **Authentication** → **Users**
3. Click **"Add User"**
4. Fill in:
   - Email: `contractor@demo.com`
   - Password: `DemoContractor123!`
   - ✅ Check: **"Auto Confirm User"**
5. Click **"Create User"**
6. **COPY THE USER ID** (looks like: `abc12345-1234-1234-1234-123456789abc`)

---

### **Step 3: Insert Contractor Profile**

In Supabase SQL Editor, run:

```sql
INSERT INTO contractors (
  user_id,
  company_name,
  cidb_registration_number,
  cidb_grade,
  contact_person,
  email,
  phone,
  street_address,
  city,
  province,
  postal_code,
  project_types,
  operating_provinces,
  years_in_business,
  bbbee_level,
  has_certification,
  status,
  subscription_tier,
  billing_cycle,
  subscription_status,
  subscription_start_date,
  next_billing_date
)
VALUES (
  'PASTE_YOUR_USER_ID_HERE', -- ⚠️ Replace this
  'ABC Construction (Pty) Ltd',
  'CIDB/CR2023/12345',
  'Grade 9 CE',
  'Thabo Mokoena',
  'contractor@demo.com',
  '+27 11 123 4567',
  '123 Construction Avenue',
  'Johannesburg',
  'Gauteng',
  '2001',
  ARRAY['Road Construction', 'Housing Development', 'Infrastructure'],
  ARRAY['Gauteng', 'Mpumalanga', 'Limpopo'],
  15,
  'Level 2',
  true,
  'approved',
  'enterprise',
  'annual',
  'active',
  NOW(),
  NOW() + INTERVAL '1 year'
);
```

✅ **Result:** Demo contractor created successfully!

---

### **Step 4: Verify**

```sql
-- Check if contractor was created
SELECT 
  c.id,
  c.company_name,
  c.email,
  c.status,
  c.subscription_tier,
  u.email as auth_email,
  u.id as auth_user_id
FROM contractors c
JOIN auth.users u ON c.user_id = u.id
WHERE c.email = 'contractor@demo.com';
```

You should see:
```
✅ 1 row returned
✅ company_name: ABC Construction (Pty) Ltd
✅ status: approved
✅ auth_email: contractor@demo.com
```

---

## 🧪 **Testing Login**

Now you can test the contractor login:

```
Email: contractor@demo.com
Password: DemoContractor123!
```

This should:
1. ✅ Authenticate via Supabase Auth
2. ✅ Load contractor profile from `contractors` table
3. ✅ Show contractor dashboard with BOQ templates

---

## 📊 **What Files to Use:**

| File | Purpose | When to Use |
|------|---------|-------------|
| `/CONTRACTORS_TABLE_SIMPLE.sql` | ✅ Creates table only | **Use this first!** |
| `/CONTRACTORS_TABLE_FIXED.sql` | Attempts auto user creation | Use if you want to try automatic setup |
| `/CONTRACTORS_TABLE.sql` | ❌ Original (has the error) | Don't use this |

---

## 🔑 **Key Concept:**

**Authentication Flow:**
```
auth.users (Supabase Auth)
    ↓ (user_id foreign key)
contractors (Your business data)
```

You MUST have a user in `auth.users` BEFORE creating a contractor profile.

**That's why manual creation works best for demo data!**

---

## 🚀 **Next Steps After Setup:**

1. ✅ Table created
2. ✅ Demo user created
3. ✅ Demo contractor linked
4. 🎯 Test login: `contractor@demo.com` / `DemoContractor123!`
5. 🎯 Test BOQ template selection
6. 🎯 Test BOQ generation flow

---

## ❓ **Troubleshooting:**

### **"User already exists" error when creating auth user**
→ That's fine! Just use the existing user's ID in Step 3.

### **"Email already exists" error when inserting contractor**
→ Contractor profile already exists. Check with:
```sql
SELECT * FROM contractors WHERE email = 'contractor@demo.com';
```

### **"Permission denied" error**
→ Make sure you're running SQL as service role (not anon key).
→ In Supabase SQL Editor, you should have full permissions.

---

## ✅ **Summary:**

**The Fix:**
1. Create `auth.users` entry FIRST (via Dashboard UI)
2. Get the user ID
3. Create `contractors` entry with that user ID

**Why the original SQL failed:**
- Tried to create contractor with random UUID
- That UUID didn't exist in `auth.users`
- Foreign key constraint blocked it

**Now you know! 🎉**

---

**Use `/CONTRACTORS_TABLE_SIMPLE.sql` and follow the manual steps above.** ✅
