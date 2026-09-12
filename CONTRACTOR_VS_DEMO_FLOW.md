# 🔀 Contractor Card vs Demo Card - Complete Flow Diagram

## 📊 What Determines Which Card You See?

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER LOGS IN TO QILLY                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Check `contractors` table                              │
│  SELECT * FROM contractors WHERE email = 'user@gmail.com'       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        ┌───────────────┐       ┌──────────────┐
        │  FOUND ✅     │       │  NOT FOUND ❌ │
        │  (has record) │       │  (empty)      │
        └───────┬───────┘       └──────┬───────┘
                │                      │
                ▼                      ▼
┌─────────────────────────┐   ┌───────────────────────────────┐
│ Set contractorData = {} │   │ Step 2: Check public.users    │
│ Set userType='contractor'│   │ SELECT * FROM users           │
└───────┬─────────────────┘   │ WHERE email = 'user@gmail.com'│
        │                     └────────────┬──────────────────┘
        │                                  │
        │                      ┌───────────┴───────────┐
        │                      │                       │
        │                      ▼                       ▼
        │              ┌──────────────┐       ┌────────────────┐
        │              │  FOUND ✅    │       │  NOT FOUND ❌  │
        │              │  (has record)│       │  (shouldn't    │
        │              └──────┬───────┘       │   happen)      │
        │                     │               └────────────────┘
        │                     ▼
        │             ┌──────────────────┐
        │             │ Set user = {}    │
        │             │ userType='operator'│
        │             │ contractorData=null│
        │             └──────┬───────────┘
        │                    │
        ▼                    ▼
┌──────────────────────────────────────────────────────────────┐
│                    RENDER HEADER                              │
└───────────────────────────┬──────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
    ┌───────────────────────┐   ┌──────────────────────┐
    │ contractorData EXISTS │   │ contractorData = NULL│
    │ (from contractors     │   │ (not in contractors  │
    │  table)               │   │  table)              │
    └───────┬───────────────┘   └──────┬───────────────┘
            │                          │
            ▼                          ▼
┌─────────────────────────┐   ┌────────────────────────┐
│ 🏢 CONTRACTOR CARD      │   │ 👤 DEMO/REGULAR CARD   │
│ ─────────────────────   │   │ ──────────────────     │
│ ✅ Company Name         │   │ ⚠️ User Name           │
│ ✅ Email                │   │ ⚠️ Email               │
│ ✅ CIDB Grade           │   │ ❌ No CIDB             │
│ ✅ Operating Provinces  │   │ ❌ No Provinces        │
│ ✅ Annual Turnover      │   │ ❌ No Turnover         │
│ ✅ Project Types        │   │ ❌ No Projects         │
│ ✅ Subscription Tier    │   │ ⚠️ "Free Trial" badge  │
│    Badge                │   │                        │
│                         │   │                        │
│ 📁 Default View:        │   │ 📁 Default View:       │
│    Template Library     │   │    Upload BOQ          │
└─────────────────────────┘   └────────────────────────┘
```

---

## 📋 Real Examples from Your Database

### Example 1: kgabo123@gmail.com (WORKS ✅)

```
┌─────────────────────────────────────────────────────┐
│ Email: kgabo123@gmail.com                           │
└─────────────────────────────────────────────────────┘

Step 1: Check contractors table
┌─────────────────────────────────────────────────────┐
│ SELECT * FROM contractors                           │
│ WHERE email = 'kgabo123@gmail.com'                  │
└──────────────────────┬──────────────────────────────┘
                       ▼
        ✅ FOUND! (status = 'approved')
┌─────────────────────────────────────────────────────┐
│ {                                                   │
│   id: '225b7dc5-43ed-4d2d-a2c5-569ecde3fbc5'       │
│   email: 'kgabo123@gmail.com'                      │
│   company_name: 'Cestasoft contactor'              │
│   cidb_grade: 'Grade 6 CE'                         │
│   operating_provinces: ['GP', 'WC']                │
│   project_types: ['Road Construction', 'Housing']  │
│   status: 'approved' ✅                             │
│ }                                                   │
└──────────────────────┬──────────────────────────────┘
                       ▼
        Sets: contractorData = {...}
              userType = 'contractor'

                       ▼
┌─────────────────────────────────────────────────────┐
│           🏢 SHOWS CONTRACTOR CARD                  │
│                                                     │
│  Company: Cestasoft contactor                      │
│  CIDB: Grade 6 CE                                  │
│  Provinces: GP, WC                                 │
│  Projects: Road Construction, Housing              │
└─────────────────────────────────────────────────────┘

Console Log:
✅ Contractor account detected: Cestasoft contactor
✅ Contractor data loaded from Supabase: {...}
```

---

### Example 2: bone@gmail.com (BROKEN ❌)

```
┌─────────────────────────────────────────────────────┐
│ Email: bone@gmail.com                               │
└─────────────────────────────────────────────────────┘

Step 1: Check contractors table
┌─────────────────────────────────────────────────────┐
│ SELECT * FROM contractors                           │
│ WHERE email = 'bone@gmail.com'                      │
└──────────────────────┬──────────────────────────────┘
                       ▼
        ❌ NOT FOUND! (empty array)
        (No record in contractors table)

                       ▼
Step 2: Check public.users table
┌─────────────────────────────────────────────────────┐
│ SELECT * FROM users                                 │
│ WHERE email = 'bone@gmail.com'                      │
└──────────────────────┬──────────────────────────────┘
                       ▼
        ✅ FOUND!
┌─────────────────────────────────────────────────────┐
│ {                                                   │
│   id: '21ab9897-fb1e-48b6-b483-e3d1563c5fea'       │
│   email: 'bone@gmail.com'                          │
│   role: 'contractor' ⚠️ (says contractor!)         │
│   trial_bills_remaining: 3                         │
│   company_name: null ❌                             │
│   cidb_grade: null ❌                               │
│ }                                                   │
└──────────────────────┬──────────────────────────────┘
                       ▼
        Sets: user = {...}
              userType = 'operator' ⚠️
              contractorData = NULL ❌

                       ▼
┌─────────────────────────────────────────────────────┐
│           👤 SHOWS DEMO CARD (NOT CONTRACTOR!)      │
│                                                     │
│  Name: bone@gmail.com                              │
│  Email: bone@gmail.com                             │
│  Badge: "Free Trial" ⚠️                             │
│                                                     │
│  ❌ No company info                                 │
│  ❌ No CIDB grade                                   │
│  ❌ No provinces                                    │
└─────────────────────────────────────────────────────┘

Console Log:
✅ Regular user account detected: bone@gmail.com
ℹ️  No contractor record found for this user (not a contractor account)
```

---

## 🔍 Why Does This Happen?

### The Two Tables System:

```
┌───────────────────────────────────────────────────────────────┐
│                      DATABASE STRUCTURE                       │
└───────────────────────────────────────────────────────────────┘

Table 1: public.users (ALL USERS)
┌────────────┬──────────────┬───────┬────────────────────────┐
│ email      │ role         │ trial │ company_name           │
├────────────┼──────────────┼───────┼────────────────────────┤
│ bone@      │ contractor   │   3   │ null ❌                │
│ kgabo123@  │ user         │   3   │ Cestasoft contactor    │
│ start@     │ contractor   │   3   │ null ❌                │
│ admin@     │ admin        │   3   │ null                   │
└────────────┴──────────────┴───────┴────────────────────────┘
        │
        │ role = 'contractor' means "wants to be contractor"
        │ BUT needs full profile in contractors table!
        │
        ▼

Table 2: contractors (FULL CONTRACTOR PROFILES ONLY)
┌────────────┬────────────────┬────────┬─────────┬────────────┐
│ email      │ company_name   │ cidb   │ status  │ provinces  │
├────────────┼────────────────┼────────┼─────────┼────────────┤
│ kgabo123@  │ Cestasoft      │ Gr 6 CE│ approved│ GP, WC     │
└────────────┴────────────────┴────────┴─────────┴────────────┘
                              ▲
                              │
                    bone@ NOT HERE! ❌
                    start@ NOT HERE! ❌
```

---

## 💡 The Rule

```
IF (email found in `contractors` table):
    → Show CONTRACTOR CARD 🏢
    → Display: Company, CIDB, Provinces, Projects
    → Default view: Template Library

ELSE IF (email found in `public.users` table):
    → Show DEMO/REGULAR CARD 👤
    → Display: Name, Email, "Free Trial" badge
    → Default view: Upload BOQ

ELSE:
    → Auto-create user record
    → Show DEMO/REGULAR CARD 👤
```

---

## ✅ How to Fix bone@gmail.com

### Option 1: Quick SQL Fix

```sql
-- Create full contractor record for bone@gmail.com
INSERT INTO contractors (
  user_id,
  email,
  company_name,
  contact_person,
  cidb_registration_number,
  cidb_grade,
  status,
  subscription_tier,
  annual_turnover,
  operating_provinces,
  project_types,
  created_at
)
SELECT 
  u.id,
  u.email,
  'Bone Construction (Pty) Ltd',  -- Replace with real company name
  'Bone User',                     -- Replace with real name
  'CIDB/2024/BONE123',             -- Replace with real CIDB number
  'Grade 4 GB',                    -- Replace with real grade
  'approved',
  'FREE',
  0,
  ARRAY['GP']::text[],
  ARRAY['General Building']::text[],
  NOW()
FROM public.users u
WHERE u.email = 'bone@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM contractors c WHERE c.email = u.email
  );

-- Verify
SELECT 
  email,
  company_name,
  cidb_grade,
  operating_provinces,
  status
FROM contractors
WHERE email = 'bone@gmail.com';
```

### Option 2: Bulk Fix All Missing Contractors

```sql
-- Find all users with role='contractor' but no contractor record
SELECT 
  u.email,
  u.role,
  u.company_name as users_company,
  c.company_name as contractors_company,
  CASE 
    WHEN c.id IS NULL THEN '❌ Missing contractor record'
    ELSE '✅ Has contractor record'
  END as status
FROM public.users u
LEFT JOIN contractors c ON c.email = u.email
WHERE u.role = 'contractor'
ORDER BY u.created_at DESC;

-- Create contractor records for all missing
-- (Customize with real data first!)
```

---

## 🎯 Expected Behavior After Fix

### Before Fix:
```
Login as bone@gmail.com
  ↓
✅ Regular user account detected: bone@gmail.com
ℹ️  No contractor record found
  ↓
👤 Shows DEMO CARD
  - Name: bone@gmail.com
  - Badge: "Free Trial"
```

### After Fix:
```
Login as bone@gmail.com
  ↓
✅ Contractor account detected: Bone Construction (Pty) Ltd
📋 Contractor record found: {...}
✅ Contractor data loaded from Supabase
  ↓
🏢 Shows CONTRACTOR CARD
  - Company: Bone Construction (Pty) Ltd
  - CIDB: Grade 4 GB
  - Provinces: GP
  - Projects: General Building
  - Default View: Template Library ✅
```

---

## 📊 All Affected Users

Based on `/src/imports/user-data-1.json`:

| Email | Role in public.users | In contractors table? | Shows Card |
|-------|---------------------|----------------------|------------|
| bone@gmail.com | contractor | ❌ No | 👤 Demo |
| start@gmail.com | contractor | ❌ No | 👤 Demo |
| letstest@gmail.com | contractor | ❌ No | 👤 Demo |
| newtest@gmail.com | contractor | ❌ No | 👤 Demo |
| sqltest@gmail.com | contractor | ❌ No | 👤 Demo |
| weed@gmail.com | contractor | ❌ No | 👤 Demo |
| weeding@gmail.com | contractor | ❌ No | 👤 Demo |
| kgabo123@gmail.com | user | ✅ **YES** | 🏢 **Contractor** ✅ |

**All these contractors are showing demo cards because they're missing from the contractors table!**

---

**Last Updated:** March 9, 2026  
**Root Cause:** Missing contractor records in `contractors` table  
**Solution:** Run `/FIX_MISSING_CONTRACTORS.sql` or create records manually
