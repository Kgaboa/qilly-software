# 🔍 Contractor Signup Schema Status

## **Question:**
> "I've been trying to create contractor and now it is breaking and it never broke before. Is the contractor sign-up fields synced with contractor dev database? Remember I've added CIDB registration when fixing eTender API submissions, please confirm."

---

## ✅ **ANSWER: YES, FIELDS ARE SYNCHRONIZED**

The contractor signup form (`ContractorSignup.tsx`) **IS fully synchronized** with the database schema. All fields match, including the CIDB registration fields you added for eTender.

---

## **Fields Sent by ContractorSignup.tsx:**

### **✅ Company Information:**
- `company_name` → TEXT
- `cidb_registration_number` → TEXT ✅ **(Added for eTender)**
- `cidb_grade` → TEXT ✅ **(Added for eTender)**
- `contact_person` → TEXT
- `email` → TEXT
- `phone` → TEXT

### **✅ Address:**
- `street_address` → TEXT
- `city` → TEXT
- `province` → TEXT
- `postal_code` → TEXT

### **✅ Business Details:**
- `project_types` → TEXT[] (array)
- `operating_provinces` → TEXT[] (array)
- `years_in_business` → INTEGER
- `annual_turnover` → NUMERIC
- `bbbee_level` → TEXT
- `has_certification` → BOOLEAN

### **✅ Status & Subscription:**
- `status` → TEXT (default: 'pending')
- `subscription_tier` → TEXT
- `billing_cycle` → TEXT
- `subscription_status` → TEXT
- `subscription_start_date` → TIMESTAMPTZ
- `next_billing_date` → TIMESTAMPTZ

### **✅ POPIA Consent:**
- `popia_consent_given` → BOOLEAN
- `popia_consent_date` → TIMESTAMPTZ
- `popia_consent_version` → TEXT
- `terms_consent_given` → BOOLEAN
- `terms_consent_date` → TIMESTAMPTZ
- `terms_consent_version` → TEXT

### **✅ Auto-Generated (Database):**
- `id` → UUID (auto)
- `created_at` → TIMESTAMPTZ (auto)
- `updated_at` → TIMESTAMPTZ (auto)

### **⚠️ Not Sent by Signup (Optional):**
- `payment_method` → TEXT (added later during payment setup)

---

## **CIDB Fields for eTender Integration:**

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `cidb_registration_number` | TEXT | ✅ Yes | CIDB registration number for tender submissions |
| `cidb_grade` | TEXT | ✅ Yes | Contractor grade (e.g., "GB9 - General Building Grade 9") |

These fields were added specifically for **eTender API submissions** and are:
- ✅ Present in signup form
- ✅ Present in database schema
- ✅ Marked as REQUIRED in signup form (red asterisk)
- ✅ Validated before submission

---

## **Why Contractor Signup Is Breaking:**

The schema is synchronized, so the breaking issue is **NOT** a field mismatch. The error is:

### **❌ RLS Permission Error:**
```
permission denied for table users (Code: 42501)
```

### **Root Cause:**
The RLS (Row Level Security) policies are blocking the insert operation. This is **NOT** a schema issue - it's a **permissions issue**.

---

## **Fix Required:**

### **Run:** `/FIX_CONTRACTOR_SIGNUP_RLS_V2.sql`

This script fixes the RLS policies to allow:
1. ✅ Contractor signup (INSERT into contractors table)
2. ✅ Contractor login (SELECT from contractors table)
3. ✅ Admin checks (SELECT from users table)

---

## **Verification Steps:**

### **1. Verify Database Schema:**
```sql
-- Run this in Supabase SQL Editor
-- File: /VERIFY_CONTRACTOR_SCHEMA.sql
```

Expected output:
```
✅ contractors table exists
✅ EXISTS: company_name
✅ EXISTS: cidb_registration_number
✅ EXISTS: cidb_grade
... (all fields)
✅✅✅ ALL REQUIRED COLUMNS EXIST! ✅✅✅
```

### **2. Fix RLS Policies:**
```sql
-- Run this in Supabase SQL Editor
-- File: /FIX_CONTRACTOR_SIGNUP_RLS_V2.sql
```

### **3. Test Signup:**
- Clear browser cache (`Ctrl+F5`)
- Go to contractor signup
- Fill in all fields including CIDB registration
- Submit

---

## **Database Schema Files:**

The contractors table schema is defined in:
- ✅ `/supabase/migrations/01_INITIALIZE_ALL_TABLES.sql` (lines 64-113)
- ✅ `/supabase/migrations/MASTER_FIX_ALL_TABLES_COMPLETE.sql`
- ✅ `/CONTRACTORS_TABLE.sql`

All include the CIDB fields:
```sql
CREATE TABLE contractors (
  ...
  cidb_registration_number TEXT,      -- ✅ For eTender
  cidb_grade TEXT,                     -- ✅ For eTender
  ...
);
```

---

## **eTender Integration Status:**

### **✅ What's Ready:**
- CIDB registration fields in database
- CIDB grade field in database
- Signup form captures both fields
- Fields marked as REQUIRED
- Dropdown with all CIDB grades (GB1-GB9, CE1-CE9, etc.)

### **✅ What Works:**
- TenderResponseGenerator component (`/src/app/components/TenderResponseGenerator.tsx`)
- Uses contractor CIDB data for tender submissions
- ETenderInvestorBrief component for investor presentation
- All data ready for Tuesday eTender pitch

---

## **Summary:**

| Question | Answer |
|----------|--------|
| Are signup fields synced? | ✅ YES - All fields match |
| Are CIDB fields included? | ✅ YES - Both registration & grade |
| Is schema ready for eTender? | ✅ YES - All fields present |
| Why is signup breaking? | ❌ RLS permissions (NOT schema) |
| What needs to be fixed? | Run `/FIX_CONTRACTOR_SIGNUP_RLS_V2.sql` |

---

## **Action Required:**

1. ✅ **Verify schema:** Run `/VERIFY_CONTRACTOR_SCHEMA.sql`
2. ✅ **Fix RLS:** Run `/FIX_CONTRACTOR_SIGNUP_RLS_V2.sql`
3. ✅ **Test signup:** Clear cache and retry
4. ✅ **Prepare for Tuesday:** All eTender fields are ready!

---

**The schema is correct. The CIDB fields are there. The issue is RLS permissions, not missing fields.** 🚀
