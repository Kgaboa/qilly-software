# ⚡ Quick Answer: Why bone@gmail.com Shows Demo Card

## 🎯 Direct Answer to Your Question

> "Could it be that Qilly defaults all trial contractors to demo before demanding upgrade?"

### ❌ **NO - It's not about the trial system!**

The demo card appears because:

1. ✅ bone@gmail.com **EXISTS** in `public.users` with `role: "contractor"`
2. ❌ bone@gmail.com **MISSING** from `contractors` table (no full profile)
3. ⚠️ System shows **demo card** when `contractorData = null`

---

## 📊 The Simple Rule

```
┌─────────────────────────────────────────────────────┐
│  IF email found in `contractors` table:             │
│     → Show CONTRACTOR CARD 🏢                       │
│                                                     │
│  ELSE:                                              │
│     → Show DEMO CARD 👤                             │
└─────────────────────────────────────────────────────┘
```

**It's NOT checking:**
- ❌ `trial_bills_remaining` (that's separate)
- ❌ `subscription_tier` (that's separate)
- ❌ `role` column in public.users (ignored)

**It's ONLY checking:**
- ✅ Does email exist in `contractors` table? YES/NO

---

## 🔍 Trial System (Separate Issue)

> "I've never seen how Qilly counts down the trial before it asks for upgrade"

### That's because **it doesn't count down!** ⚠️

#### Current Behavior (BROKEN):
```
User signs up → trial_bills_remaining = 3
1st BOQ      → trial_used = true ❌ (blocks all future BOQs)
2nd BOQ      → ❌ BLOCKED "Trial already used"
3rd BOQ      → ❌ BLOCKED "Trial already used"
```

#### Expected Behavior (NOT IMPLEMENTED):
```
User signs up → trial_bills_remaining = 3
1st BOQ      → trial_bills_remaining = 2 ✅ "2 bills remaining"
2nd BOQ      → trial_bills_remaining = 1 ✅ "1 bill remaining"
3rd BOQ      → trial_bills_remaining = 0 ✅ "Trial complete"
4th BOQ      → ❌ BLOCKED "Upgrade to continue"
```

### The Problem:

The code uses `trial_used` (boolean) instead of `trial_bills_remaining` (integer):

```typescript
// Current implementation (api.ts line 207)
if (!paidStatus && !trialUsed) {
  users[userIndex].trial_used = true; // ← Sets to TRUE after 1st BOQ
  // ❌ Never decrements trial_bills_remaining!
}
```

---

## 🚨 Two Separate Issues

### Issue #1: Demo Card Instead of Contractor Card
- **Cause:** No record in `contractors` table
- **Affects:** bone@gmail.com, start@gmail.com, and 6 other contractors
- **Fix:** Create contractor records with company info, CIDB grade, provinces
- **Related to trial?** ❌ **NO** - Completely separate

### Issue #2: Trial Countdown Doesn't Work
- **Cause:** Uses `trial_used` boolean instead of `trial_bills_remaining` integer
- **Affects:** ALL users (operators and contractors)
- **Fix:** Update `api.ts` to decrement `trial_bills_remaining`
- **Related to demo card?** ❌ **NO** - Completely separate

---

## ✅ Quick Fix for bone@gmail.com

### Step 1: Go to Supabase SQL Editor
```
https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
```

### Step 2: Run This Query
```sql
-- Check if bone@gmail.com exists in contractors table
SELECT * FROM contractors WHERE email = 'bone@gmail.com';

-- If empty, create the contractor record
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
  project_types
)
SELECT 
  u.id,
  u.email,
  'Bone Construction',       -- ← Change this
  'Bone User',               -- ← Change this
  'CIDB/2024/BONE',          -- ← Change this
  'Grade 4 GB',              -- ← Change this
  'approved',
  'FREE',
  0,
  ARRAY['GP']::text[],
  ARRAY['General Building']::text[]
FROM public.users u
WHERE u.email = 'bone@gmail.com';
```

### Step 3: Hard Refresh Browser
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### Step 4: Login as bone@gmail.com

**Before:**
```
👤 Demo Card
   Name: bone@gmail.com
   Badge: "Free Trial"
```

**After:**
```
🏢 Contractor Card
   Company: Bone Construction
   CIDB: Grade 4 GB
   Provinces: GP
   Projects: General Building
```

---

## 📋 Summary

| Your Question | Answer |
|---------------|--------|
| **Why demo card?** | Missing from `contractors` table (not trial-related) |
| **Is it trial limitation?** | ❌ No - Separate issue |
| **Why never seen countdown?** | ⚠️ Feature not implemented (uses boolean instead of counter) |
| **All users have trial=3?** | ✅ Yes - Correct! (but countdown doesn't work) |
| **How to fix?** | Create contractor records in `contractors` table |

---

## 🎯 Bottom Line

**Two COMPLETELY SEPARATE issues:**

1. **Demo Card** = Missing contractor profile (nothing to do with trial)
2. **No Countdown** = Trial system uses wrong field (affects everyone)

**bone@gmail.com is NOT in demo mode because of trial limits.**  
**bone@gmail.com is in demo mode because it's not in the contractors table.**

---

**Files to Read:**
- `/TRIAL_SYSTEM_EXPLAINED.md` - Full trial system details
- `/CONTRACTOR_VS_DEMO_FLOW.md` - Visual flow diagrams
- `/FIX_MISSING_CONTRACTORS.sql` - SQL fix scripts
- `/QUICK_FIX_APPROVE_ALL_CONTRACTORS.sql` - 30-second fix

---

**Last Updated:** March 9, 2026  
**TL;DR:** Not a trial issue - Just missing contractor records!
