# 🚨 STILL SHOWING DEMO@OPERATOR.COM - DIAGNOSIS & FIX

## **Problem:**
✅ SQL script ran successfully  
❌ contractor@gmail.com still shows as demo@operator.com  
❌ **HTTP 406 error still happening** (lines 2 and 35 in error log)

---

## **Root Cause:**

The error log shows:
```
GET .../contractors?select=*&email=eq.contractor%40gmail.com 406 (Not Acceptable)
```

This means the **RLS policy is blocking queries by email**.

### **Why This Happens:**

The code queries contractors table like this:
```typescript
.from('contractors')
.select('*')
.eq('email', user.email)  // ← Queries by EMAIL
```

But the RLS policy only allows:
```sql
USING (auth.uid() = user_id)  // ← Only checks user_id
```

So when the code filters by `email`, the RLS policy can't verify ownership and **blocks the query with HTTP 406**.

---

## **Diagnosis Steps:**

### **Step 1: Run Diagnostic Script**

**File:** `/DIAGNOSE_RLS_ISSUE.sql`

This will check:
- ✅ Is RLS enabled?
- ✅ Do policies exist?
- ✅ Does contractor record exist?
- ✅ Do user_id values match?
- ✅ What's the exact problem?

**How to run:**
1. Go to: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
2. Copy `/DIAGNOSE_RLS_ISSUE.sql`
3. Paste and Run
4. Read the **DIAGNOSTIC SUMMARY** at the bottom

---

## **Fix Options:**

### **Option 1: Update RLS Policy to Allow Email Queries (Recommended)**

**File:** `/FIX_CONTRACTOR_RLS_BY_EMAIL.sql`

This updates the SELECT policy to allow BOTH user_id AND email queries:

```sql
CREATE POLICY "Contractors can read own data"
ON public.contractors FOR SELECT TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
```

**How to apply:**
1. Go to: https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
2. Copy `/FIX_CONTRACTOR_RLS_BY_EMAIL.sql`
3. Paste and Run
4. Clear browser cache
5. Test login

---

### **Option 2: Update Code to Query by user_id Instead**

**File:** `/src/app/components/MainDashboard.tsx`

Change line 95-98 from:
```typescript
const { data: contractor, error } = await supabase
  .from('contractors')
  .select('*')
  .eq('email', user.email)  // ❌ Queries by email
  .single();
```

To:
```typescript
const { data: contractor, error } = await supabase
  .from('contractors')
  .select('*')
  .eq('user_id', user.id)  // ✅ Queries by user_id
  .single();
```

**Pros:** Works with existing RLS policy  
**Cons:** Requires code change

---

## **Recommended Fix (Choose One):**

### **🎯 Easiest: Option 1 (Update RLS Policy)**

Run this SQL:

```sql
-- Update contractors SELECT policy
DROP POLICY IF EXISTS "Contractors can read own data" ON public.contractors;

CREATE POLICY "Contractors can read own data"
ON public.contractors FOR SELECT TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
```

**Or use the file:** `/FIX_CONTRACTOR_RLS_BY_EMAIL.sql`

---

## **Why Did This Happen?**

The original SQL script (`/COMPLETE_RLS_FIX_ALL_TABLES.sql`) created policies correctly, but:

1. The policy checks: `auth.uid() = user_id` ✅
2. The code queries by: `email = 'contractor@gmail.com'` ❌
3. **Mismatch!** RLS can't verify the email query matches the user, so it blocks it with 406

---

## **Quick Test After Fix:**

1. **Clear browser cache:**
   - Ctrl+Shift+Delete
   - Select "Cached images and files"
   - Clear

2. **Hard refresh:**
   - Ctrl+F5

3. **Login:**
   - Email: contractor@gmail.com
   - Password: (your password)

4. **Expected:**
   - ✅ No HTTP 406 errors
   - ✅ Contractor dashboard loads
   - ✅ No demo@operator.com card

---

## **Troubleshooting:**

### **If still getting 406 error:**

Run diagnostic script:
```sql
-- Check if policy was updated
SELECT qual 
FROM pg_policies 
WHERE tablename = 'contractors' 
  AND policyname = 'Contractors can read own data';
```

**Expected qual:**
```
(auth.uid() = user_id) OR (email = (SELECT email FROM auth.users WHERE id = auth.uid()))
```

**If you see:**
```
auth.uid() = user_id
```

Then the policy **wasn't updated**. Run `/FIX_CONTRACTOR_RLS_BY_EMAIL.sql` again.

---

### **If user_id is NULL or mismatched:**

Run this fix:
```sql
UPDATE public.contractors c
SET user_id = au.id
FROM auth.users au
WHERE c.email = au.email
  AND c.email = 'contractor@gmail.com';
```

---

### **If contractor status is 'pending':**

Run this:
```sql
UPDATE public.contractors
SET status = 'approved'
WHERE email = 'contractor@gmail.com';
```

---

## **Complete Fix Script (All-in-One):**

If you want to fix everything at once:

```sql
-- 1. Update RLS policy to allow email queries
DROP POLICY IF EXISTS "Contractors can read own data" ON public.contractors;
CREATE POLICY "Contractors can read own data"
ON public.contractors FOR SELECT TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- 2. Fix user_id if needed
UPDATE public.contractors c
SET user_id = au.id
FROM auth.users au
WHERE c.email = au.email
  AND (c.user_id IS NULL OR c.user_id != au.id)
  AND c.email = 'contractor@gmail.com';

-- 3. Approve contractor
UPDATE public.contractors
SET status = 'approved'
WHERE email = 'contractor@gmail.com';

-- 4. Verify
SELECT 
  email,
  status,
  CASE WHEN user_id IS NOT NULL THEN '✅' ELSE '❌' END as user_id_check
FROM public.contractors
WHERE email = 'contractor@gmail.com';
```

---

## **Summary:**

| Step | Action | File |
|------|--------|------|
| 1️⃣ | **Diagnose** | Run `/DIAGNOSE_RLS_ISSUE.sql` |
| 2️⃣ | **Fix RLS** | Run `/FIX_CONTRACTOR_RLS_BY_EMAIL.sql` |
| 3️⃣ | **Clear cache** | Ctrl+Shift+Delete |
| 4️⃣ | **Test login** | contractor@gmail.com |

---

**The fix is simple: Update the RLS policy to allow email queries! Run `/FIX_CONTRACTOR_RLS_BY_EMAIL.sql` and you're done! 🎉**
