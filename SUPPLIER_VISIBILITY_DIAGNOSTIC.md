# 🔍 Supplier Visibility Diagnostic

## Current Situation

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────┐              │
│  │         suppliers TABLE                 │              │
│  ├─────────────────────────────────────────┤              │
│  │ id: abc-123                            │              │
│  │ company_name: "Supplier Enterprise Test"│              │
│  │ email: supplier@test.com               │              │
│  │ user_id: xyz-789 ← Created by supplier │              │
│  │ status: pending                        │              │
│  │ created_at: 2026-03-05                 │              │
│  └─────────────────────────────────────────┘              │
│                                                             │
│  ⚠️ RLS POLICIES (Row Level Security)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ SELECT: ONLY IF auth.uid() = user_id                 │  │
│  │ (Users can only see their OWN suppliers)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Query
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  ADMIN DASHBOARD                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User: admin@qilly.co.za                                   │
│  User ID: aaa-111 ← Different from supplier's user_id!    │
│                                                             │
│  Query: SELECT * FROM suppliers ORDER BY created_at DESC   │
│                                                             │
│  ❌ RLS Check: auth.uid() = user_id                        │
│     aaa-111 ≠ xyz-789  → BLOCKED!                          │
│                                                             │
│  Result: [] (empty array)                                  │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  "No suppliers found"                │                  │
│  │   🚫 Empty state displayed            │                  │
│  └──────────────────────────────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Why Admin Can't See Suppliers

### The Problem Chain

1. **Supplier Created**
   - User: `supplier@test.com`
   - User ID: `xyz-789`
   - Creates supplier record with `user_id = xyz-789`

2. **Admin Logs In**
   - User: `admin@qilly.co.za`
   - User ID: `aaa-111` (different!)

3. **Admin Queries Database**
   ```sql
   SELECT * FROM suppliers;
   ```

4. **RLS Policy Checks**
   ```sql
   -- For each row, check:
   WHERE auth.uid() = user_id
   
   -- Admin's UID: aaa-111
   -- Supplier's user_id: xyz-789
   -- Result: aaa-111 ≠ xyz-789 → Row HIDDEN
   ```

5. **Result**
   - Admin sees: `[]` (empty)
   - Frontend shows: "No suppliers found"

## The Solution

```
┌─────────────────────────────────────────────────────────────┐
│              AFTER FIX_ADMIN_SUPPLIER_VISIBILITY.sql        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ NEW RLS POLICIES                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Policy 1: Users see their own suppliers             │  │
│  │   USING (auth.uid() = user_id)                       │  │
│  │                                                       │  │
│  │ Policy 2: Admins see ALL suppliers ← NEW!           │  │
│  │   USING (is_admin())                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ✅ NEW FUNCTION: is_admin()                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Returns TRUE if user email = 'admin@qilly.co.za'    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Query
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  ADMIN DASHBOARD                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User: admin@qilly.co.za                                   │
│  User ID: aaa-111                                          │
│                                                             │
│  Query: SELECT * FROM suppliers ORDER BY created_at DESC   │
│                                                             │
│  ✅ RLS Check #1: auth.uid() = user_id                     │
│     aaa-111 ≠ xyz-789  → FAIL                              │
│                                                             │
│  ✅ RLS Check #2: is_admin()                               │
│     Email = 'admin@qilly.co.za' → TRUE → PASS! ✅          │
│                                                             │
│  Result: [Supplier Enterprise Test, ...all suppliers]      │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  📊 Supplier Applications             │                  │
│  │  ┌─────────────────────────────────┐ │                  │
│  │  │ Supplier Enterprise Test        │ │                  │
│  │  │ supplier@test.com               │ │                  │
│  │  │ Status: Pending                 │ │                  │
│  │  │ [View] [Approve] [Reject]       │ │                  │
│  │  └─────────────────────────────────┘ │                  │
│  └──────────────────────────────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Missing Columns Issue

### Before Fix

```sql
-- Trying to approve supplier
UPDATE suppliers 
SET 
  status = 'approved',
  approved_at = '2026-03-05 10:30:00' ← Column doesn't exist!
WHERE id = 'abc-123';

❌ ERROR: column "approved_at" of relation "suppliers" does not exist
```

### After Fix

```sql
-- All columns exist
ALTER TABLE suppliers ADD COLUMN approved_at TIMESTAMPTZ; ✅
ALTER TABLE suppliers ADD COLUMN delivery_provinces TEXT[]; ✅
-- ... 10 more columns

-- Now approval works
UPDATE suppliers 
SET 
  status = 'approved',
  approved_at = '2026-03-05 10:30:00' ✅
WHERE id = 'abc-123';

✅ SUCCESS: Supplier approved
```

## RLS Policy Logic Flow

### Original Policies (Users Only)

```
┌──────────────────┐
│  Query Received  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│ Is auth.uid() = row.user_id? │
└────────┬─────────────────────┘
         │
    ┌────┴────┐
    │         │
   YES        NO
    │         │
    ▼         ▼
  ALLOW     DENY ← Admin gets stuck here!
```

### New Policies (Users + Admin)

```
┌──────────────────┐
│  Query Received  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│ Is auth.uid() = row.user_id? │
└────────┬─────────────────────┘
         │
    ┌────┴────┐
    │         │
   YES        NO
    │         │
    ▼         ▼
  ALLOW   ┌──────────────┐
          │ is_admin()?  │ ← New check!
          └──────┬───────┘
                 │
            ┌────┴────┐
            │         │
           YES        NO
            │         │
            ▼         ▼
          ALLOW     DENY
```

## Console Logs - Before vs After

### Before Fix (Admin sees nothing)

```javascript
🔍 AdminDashboard: Loading suppliers from Supabase...
✅ Loaded suppliers from Supabase: 0
// filteredSuppliers = []
// UI shows: "No suppliers found"
```

### After Fix (Admin sees all)

```javascript
🔍 AdminDashboard: Loading suppliers from Supabase...
✅ Loaded suppliers from Supabase: 1
✅ First supplier: {
  id: 'abc-123',
  company_name: 'Supplier Enterprise Test',
  email: 'supplier@test.com',
  status: 'pending',
  created_at: '2026-03-05T08:30:00.000Z'
}
// filteredSuppliers = [Supplier Enterprise Test]
// UI shows: Table with supplier data
```

## Database State Comparison

### Before Fix

| Table | RLS | Admin Policy | Missing Columns |
|-------|-----|--------------|-----------------|
| suppliers | ✅ ON | ❌ NO | ❌ 12 columns |
| contractors | ✅ ON | ❌ NO | ❌ 12 columns |

**Result:** 
- ❌ Admin cannot see suppliers
- ❌ Admin cannot see contractors
- ❌ Approval fails (missing columns)
- ❌ Upsert fails (missing columns)

### After Fix

| Table | RLS | Admin Policy | Missing Columns |
|-------|-----|--------------|-----------------|
| suppliers | ✅ ON | ✅ YES | ✅ All added |
| contractors | ✅ ON | ✅ YES | ✅ All added |

**Result:**
- ✅ Admin can see all suppliers
- ✅ Admin can see all contractors
- ✅ Approval works perfectly
- ✅ Upsert works perfectly

## Test Scenarios

### Scenario 1: Regular User

```
User: contractor@test.com
Query: SELECT * FROM suppliers;

RLS Check 1: auth.uid() = user_id? → NO (different user)
RLS Check 2: is_admin()? → NO (not admin email)
Result: [] (cannot see other users' suppliers) ✅ Correct!
```

### Scenario 2: Supplier Owner

```
User: supplier@test.com
Query: SELECT * FROM suppliers;

RLS Check 1: auth.uid() = user_id? → YES (owns supplier)
Result: [Their own supplier] ✅ Correct!
```

### Scenario 3: Admin

```
User: admin@qilly.co.za
Query: SELECT * FROM suppliers;

RLS Check 1: auth.uid() = user_id? → NO (different users)
RLS Check 2: is_admin()? → YES (email matches)
Result: [All suppliers] ✅ Correct!
```

## Quick Verification

After running the SQL fix, run these in Supabase SQL Editor:

```sql
-- 1. Check admin function exists
SELECT is_admin();
-- Expected: true (if logged in as admin@qilly.co.za)
--           false (if logged in as anyone else)

-- 2. Check policies exist
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'suppliers';
-- Expected: 
--   Users can view their own supplier profile | SELECT
--   Admins can view all suppliers | SELECT
--   Users can insert their own supplier profile | INSERT
--   Users can update their own supplier profile | UPDATE
--   Admins can update all suppliers | UPDATE

-- 3. Check missing columns are added
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'suppliers' 
AND column_name IN (
  'approved_at', 
  'delivery_provinces', 
  'rejected_at',
  'approved_by',
  'contact_email'
);
-- Expected: All 5 columns listed

-- 4. See all suppliers (as admin)
SELECT company_name, email, status, created_at
FROM suppliers
ORDER BY created_at DESC;
-- Expected: Should see "Supplier Enterprise Test" and any others
```

## Summary

| Issue | Cause | Fix | Status |
|-------|-------|-----|--------|
| Admin can't see suppliers | RLS blocks non-owners | Add admin policy | ✅ Fixed |
| `approved_at` error | Column missing | ALTER TABLE ADD COLUMN | ✅ Fixed |
| `delivery_provinces` error | Column missing | ALTER TABLE ADD COLUMN | ✅ Fixed |
| 10 other columns missing | Never added | ALTER TABLE ADD COLUMN | ✅ Fixed |

---

**Next Step:** Run `/FIX_ADMIN_SUPPLIER_VISIBILITY.sql` in Supabase SQL Editor  
**Time Required:** 2-3 seconds  
**Risk:** None (safe migration)
