# 🔍 Diagnosis & Fixes for 4 Critical Issues

## Issue Summary

| # | Issue | Status | Root Cause |
|---|-------|--------|------------|
| 1 | View History doesn't record anything | ❌ Bug | Bills saved to Supabase but getBills() only reads sessionStorage |
| 2 | bone@gmail.com BOQ countdown not working | ⚠️ Partial | Trial decrement works in localStorage but may not sync properly |
| 3 | Which table stores BOQ trial counts? | ✅ Answered | `users` table, column `trial_bills_remaining` |
| 4 | Is upgrade automatic or manual? | ✅ Answered | Manual prompt → SubscriptionUpgradeModal |

---

## Issue 1: View History Not Recording ❌

### Current Behavior
- Bills ARE being saved to Supabase `bills` table (✅ Working)
- Bill items ARE being saved to `bill_items` table (✅ Working)
- BUT View History shows "No Bills Yet" (❌ Not working)

### Root Cause
**File:** `/src/app/components/BillHistory.tsx` (line 31)

```typescript
const fetchBills = async () => {
  try {
    const data = await api.getBills(accessToken);
    setBills(data.bills || []);
  }
}
```

**File:** `/src/utils/api.ts` (lines 427-432)

```typescript
getBills: (accessToken: string) => {
  if (isDemoMode(accessToken)) {
    const bills = JSON.parse(sessionStorage.getItem('demo_bills') || '[]');
    return Promise.resolve({ bills });
  }
  return apiRequest('/bills', { accessToken });
}
```

### Problem
`api.getBills()` returns data from `sessionStorage` in demo mode, but bills are saved to Supabase database. They never sync!

### Fix Strategy
**Option 1: Fetch directly from Supabase (RECOMMENDED)**
```typescript
// In BillHistory.tsx
const fetchBills = async () => {
  try {
    const supabase = getSupabaseClient(getCurrentEnvironment());
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: bills, error } = await supabase
        .from('bills')
        .select('*, bill_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error && bills) {
        setBills(bills);
      }
    }
  } catch (error) {
    console.error('Error fetching bills:', error);
  } finally {
    setIsLoading(false);
  }
};
```

**Option 2: Save to sessionStorage when saving to Supabase**
```typescript
// After line 312 in MainDashboard.tsx
console.log('✅ Bill saved to Supabase:', billRecord);

// ALSO save to sessionStorage for View History
try {
  const existingBills = JSON.parse(sessionStorage.getItem('demo_bills') || '[]');
  existingBills.push({
    id: billRecord.id,
    items: data.items,
    overallTotal: data.overallTotal,
    createdAt: new Date().toISOString(),
    status: 'processed'
  });
  sessionStorage.setItem('demo_bills', JSON.stringify(existingBills.slice(-10)));
} catch (e) {
  console.warn('Could not save to sessionStorage:', e);
}
```

---

## Issue 2: Trial Countdown Not Working ⚠️

### Current Behavior
- bone@gmail.com processes BOQs but count stays at "3 bills left"

### Where Trial Countdown Should Happen

**Table:** `users`  
**Column:** `trial_bills_remaining` (INTEGER, default: 3)

**Code Location 1:** `/src/utils/api.ts` (lines 359-383)
```typescript
// ✅ CRITICAL: Also update Supabase for real authenticated users
try {
  const supabaseClient = getSupabaseClient(getCurrentEnvironment());
  if (supabaseClient) {
    const { data: { user: authUser } } = await supabaseClient.auth.getUser();
    if (authUser && authUser.email === currentEmail) {
      console.log('🔄 Updating trial_bills_remaining in Supabase for:', authUser.email);
      const { error: updateError } = await supabaseClient
        .from('users')
        .update({ 
          trial_bills_remaining: trialBillsRemaining - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', authUser.id);
      
      if (updateError) {
        console.error('⚠️ Failed to update trial in Supabase:', updateError);
      } else {
        console.log('✅ Supabase trial_bills_remaining updated to:', trialBillsRemaining - 1);
      }
    }
  }
} catch (supabaseError) {
  console.warn('⚠️ Could not update Supabase trial (user may be in demo mode):', supabaseError);
}
```

### Diagnostic Steps

**Step 1: Check current value in database**
```sql
SELECT email, trial_bills_remaining, is_premium, subscription_tier, updated_at
FROM public.users
WHERE email = 'bone@gmail.com';
```

**Expected:**
- First BOQ: `trial_bills_remaining = 2`
- Second BOQ: `trial_bills_remaining = 1`
- Third BOQ: `trial_bills_remaining = 0`

**Step 2: Check browser console**
After processing a BOQ, you should see:
```
✅ Supabase trial_bills_remaining updated to: 2
```

**Step 3: Check RLS policies**
```sql
-- Check if user can UPDATE their own record
SELECT * FROM pg_policies 
WHERE tablename = 'users' 
  AND cmd = 'UPDATE';
```

### Possible Issues

**Issue A: RLS Blocking Updates**
```sql
-- Allow users to update their own trial_bills_remaining
CREATE POLICY "Users can update own trial count"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

**Issue B: User doesn't exist in users table**
Run the SQL script: `/QUICK_FIX_CONTRACTORS.sql` (already created)

**Issue C: Code not executing**
Check browser console for error messages when processing BOQ.

---

## Issue 3: Which Table Stores BOQ Trial Counts? ✅

### Answer: `users` table

**Schema:**
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'contractor',
  trial_bills_remaining INTEGER DEFAULT 3,  -- ✅ This column
  is_premium BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'FREE',
  subscription_status TEXT DEFAULT 'trial',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### How It Works

1. **New user signup:** `trial_bills_remaining = 3`
2. **Process 1st BOQ:** Decrement to `2`
3. **Process 2nd BOQ:** Decrement to `1`
4. **Process 3rd BOQ:** Decrement to `0`
5. **Try 4th BOQ:** ❌ Blocked (show upgrade modal)

### Check Your Data

```sql
-- View all users with their trial status
SELECT 
  email,
  role,
  trial_bills_remaining,
  is_premium,
  subscription_tier,
  subscription_status,
  created_at
FROM public.users
ORDER BY created_at DESC;
```

---

## Issue 4: Upgrade Flow - Automatic or Manual? ✅

### Answer: Manual Prompt

### How It Works

**Step 1: Trial Check**  
File: `/src/utils/api.ts` (lines 203-206)
```typescript
// ✅ NEW: Check trial_bills_remaining instead of trial_used
if (!paidStatus && trialBillsRemaining <= 0) {
  throw new Error('Trial complete. You have used all 3 free bill pricings. Please upgrade to continue.');
}
```

**Step 2: Show Upgrade UI**  
File: `/src/app/components/BillUpload.tsx` (lines 786-794)
```tsx
{user.trial_used && !user.paid_status && (
  <Card>
    <CardContent className=\"pt-6\">
      <div className=\"flex flex-col items-center justify-center py-12 text-center\">
        <h3 className=\"text-xl font-semibold mb-2\">Free Trial Used</h3>
        <p className=\"text-gray-600 mb-4\">
          You've used your free trial pricing. Upgrade to a paid account to continue pricing bills.
        </p>
        <Button onClick={() => setShowUpgradeModal(true)}>
          Upgrade to Paid Account
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

**Step 3: Upgrade Modal**  
File: `/src/app/components/payments/SubscriptionUpgradeModal.tsx`

Shows 3 payment options:
1. **EFT Payment** → Creates invoice → Admin verifies → Manual activation
2. **Stitch/PayFast** → Automatic payment → Manual activation by admin
3. **Contact Sales** → Creates request → Sales team follows up

### NOT Automatic

The upgrade process is **MANUAL** and requires:
1. User clicks "Upgrade to Paid Account"
2. User selects plan (Professional/Enterprise/Custom)
3. User selects payment method
4. Payment is processed (EFT/Card/Manual)
5. **Admin manually verifies payment** in Admin Panel
6. **Admin manually activates subscription**

### Making It Automatic

To make upgrades automatic, you would need:
```typescript
// After successful payment verification
const { error } = await supabase
  .from('users')
  .update({
    is_premium: true,
    subscription_tier: planType.toUpperCase(),
    subscription_status: 'active',
    trial_bills_remaining: null, // Unlimited bills
    updated_at: new Date().toISOString()
  })
  .eq('id', userId);
```

But currently, this is **NOT implemented**. Admins must do it manually.

---

## Quick Fixes to Run

### Fix 1: View History (Direct Supabase Fetch)

Create file: `/FIX_VIEW_HISTORY.md`

I'll create this fix in the next step.

### Fix 2: Check Trial Countdown

**Run this SQL:**
```sql
-- Check bone@gmail.com trial status
SELECT 
  email,
  trial_bills_remaining,
  is_premium,
  subscription_tier,
  updated_at
FROM public.users
WHERE email = 'bone@gmail.com';
```

**Then process a BOQ and check console:**
```
Look for: "✅ Supabase trial_bills_remaining updated to: X"
```

**If you don't see it:**
- RLS policy is blocking the update
- Run the RLS fix SQL below

### Fix 3: RLS Policy for Trial Updates

```sql
-- Allow users to update their own trial_bills_remaining
CREATE POLICY "Users can update own trial count"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

---

## Summary

| Issue | Table | Column | Fixed? |
|-------|-------|--------|--------|
| View History | `bills`, `bill_items` | all | ⏳ Need code fix |
| Trial Countdown | `users` | `trial_bills_remaining` | ⚠️ Check RLS |
| Trial Storage | `users` | `trial_bills_remaining` | ✅ Confirmed |
| Upgrade Flow | `users` | `is_premium`, `subscription_tier` | ✅ Manual process |

---

**Next Steps:**
1. I'll create the code fix for View History
2. You run SQL to check bone@gmail.com trial status
3. You check browser console during BOQ processing
4. If RLS is blocking, run the RLS policy fix

Ready to proceed?
