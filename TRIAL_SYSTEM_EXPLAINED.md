# 🎯 How Qilly's Trial System Works

## 📊 Current Situation

Looking at `/src/imports/user-data-1.json`, **ALL users** have:
```json
{
  "trial_bills_remaining": 3,
  "is_premium": false,
  "subscription_tier": "FREE"
}
```

**This is CORRECT!** ✅

---

## 🔍 The Two Different Systems

### System 1: Demo/Trial Card vs Contractor Card

**What determines which card you see in the header?**

#### ✅ Contractor Card (Lines 423-475 in MainDashboard.tsx)
Shows when: `contractorData` exists (record found in `contractors` table)

```tsx
{contractorData && (
  <Card className="bg-white/10 border-white/30">
    {/* Shows company name, CIDB grade, provinces, projects */}
    <p>{contractorData.company_name}</p>
    <p>CIDB: {contractorData.cidb_grade}</p>
    <p>Operating Provinces: {contractorData.operating_provinces?.join(', ')}</p>
  </Card>
)}
```

**Displays:**
- ✅ Company name
- ✅ CIDB Grade
- ✅ Operating Provinces
- ✅ Annual Turnover (EME/QSE/Generic)
- ✅ Project Types
- ✅ Subscription Tier badge

#### ⚠️ Demo/Regular User Card (Lines 476-495)
Shows when: `user` exists BUT `contractorData` does NOT exist

```tsx
{user && !contractorData && (
  <div className="flex items-center gap-2">
    <User className="h-4 w-4 text-white/80" />
    <div className="text-right">
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>
    <Badge variant={user.trial_used ? "destructive" : "secondary"}>
      {user.trial_used ? 'Trial Used' : 'Free Trial'}
    </Badge>
  </div>
)}
```

**Displays:**
- ⚠️ Simple user name and email
- ⚠️ "Free Trial" or "Trial Used" badge
- ⚠️ No company info, CIDB grade, or provinces

---

### System 2: Trial Bills Countdown (NOT YET IMPLEMENTED FOR CONTRACTORS!)

**Where is `trial_bills_remaining` used?**

#### Current Implementation:

**Database Column:**
- Column: `trial_bills_remaining`
- Default: `3`
- Type: `integer`
- Purpose: Track how many bill pricings are remaining

**Frontend Logic (api.ts - Lines 200-214):**

```typescript
// Check trial/payment status BEFORE processing
if (!paidStatus && trialUsed) {
  throw new Error('Trial already used. Please upgrade to continue pricing BOQs.');
}

// If this is the first use and user is NOT paid, mark trial as used
if (!paidStatus && !trialUsed && userIndex !== -1) {
  users[userIndex].trial_used = true;  // ← Uses trial_used, NOT trial_bills_remaining!
  users[userIndex].boq_count = boqCount + 1;
  localStorage.setItem('demo_users', JSON.stringify(users));
  console.log('📋 Trial marked as used after first successful BOQ processing');
}
```

#### ⚠️ THE PROBLEM:

**Current trial logic uses `trial_used` (boolean) instead of `trial_bills_remaining` (integer)!**

| Field | Type | Current Use |
|-------|------|-------------|
| `trial_bills_remaining` | integer (3) | ❌ **NOT USED** - Stored in DB but ignored |
| `trial_used` | boolean | ✅ **USED** - After 1st BOQ, blocks all future BOQs |

**This means:**
1. ❌ Users can only price **1 BOQ**, not 3
2. ❌ No countdown from 3 → 2 → 1 → 0
3. ❌ `trial_bills_remaining` in database is never decremented

---

## 🚨 Why bone@gmail.com Shows Demo Card

### Database Check:

**In `public.users` table:**
```json
{
  "email": "bone@gmail.com",
  "role": "contractor",
  "trial_bills_remaining": 3,
  "company_name": null,
  "cidb_grade": null
}
```

**In `contractors` table:**
```sql
SELECT * FROM contractors WHERE email = 'bone@gmail.com';
-- Returns: EMPTY (no record found)
```

### The Logic Flow:

```typescript
// Step 1: MainDashboard checks contractors table FIRST
const { data: contractors } = await supabase
  .from('contractors')
  .select('*')
  .eq('email', 'bone@gmail.com');

// Step 2: No record found!
if (contractors && contractors.length > 0) {
  // ❌ NOT executed - contractors array is empty
  setUser({ ...contractor, userType: 'contractor' });
  setContractorData(contractor);
}

// Step 3: Falls back to public.users table
const { data: regularUsers } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'bone@gmail.com');

// Step 4: Found in public.users!
if (regularUsers && regularUsers.length > 0) {
  // ✅ Executed - user found with role='contractor'
  setUser({ 
    ...regularUser, 
    role: 'contractor',  // ← Has contractor role
    userType: 'operator' // ← But treated as operator!
  });
  // ❌ contractorData stays NULL
}

// Step 5: Render header
{contractorData && ( /* ❌ FALSE - not rendered */ )}
{user && !contractorData && ( /* ✅ TRUE - renders demo card */ )}
```

### Result:
- ✅ bone@gmail.com **IS** a contractor (has `role: "contractor"` in `public.users`)
- ❌ bone@gmail.com **DOESN'T HAVE** full contractor profile in `contractors` table
- ⚠️ Shows **demo card** instead of contractor card

---

## 💡 The Design Intent

Based on the code, here's what Qilly is SUPPOSED to do:

### For Regular Users (Operators):
1. ✅ Sign up → Get `trial_bills_remaining: 3`
2. ✅ Process 1st BOQ → Countdown to 2
3. ✅ Process 2nd BOQ → Countdown to 1
4. ✅ Process 3rd BOQ → Countdown to 0
5. ⚠️ Try 4th BOQ → **BLOCKED** - Show upgrade modal

### For Contractors:
1. ✅ Sign up → Create record in BOTH `public.users` AND `contractors` tables
2. ✅ Must have: Company name, CIDB grade, provinces, project types
3. ✅ Status: 'approved' (can be auto-approved or require admin approval)
4. ✅ Get `trial_bills_remaining: 3` (same as operators)
5. ✅ See contractor profile card in header
6. ✅ Default view: "Template Library" (not "Upload BOQ")

**But currently:**
- ❌ New contractors only get created in `public.users` with `role: "contractor"`
- ❌ No record created in `contractors` table
- ❌ Shows demo card instead of contractor card
- ❌ Trial uses boolean `trial_used` instead of counting down `trial_bills_remaining`

---

## 🔧 What's Broken

### Issue #1: Missing Contractor Records
**Problem:** bone@gmail.com has `role: "contractor"` but no record in `contractors` table

**Fix:** Create full contractor profile when user signs up as contractor

### Issue #2: Trial Countdown Not Working
**Problem:** Uses `trial_used` (boolean) instead of `trial_bills_remaining` (integer)

**Current behavior:**
- 1st BOQ: ✅ Allowed → Sets `trial_used = true`
- 2nd BOQ: ❌ **BLOCKED** → "Trial already used"

**Expected behavior:**
- 1st BOQ: ✅ Allowed → `trial_bills_remaining: 3 → 2`
- 2nd BOQ: ✅ Allowed → `trial_bills_remaining: 2 → 1`
- 3rd BOQ: ✅ Allowed → `trial_bills_remaining: 1 → 0`
- 4th BOQ: ❌ **BLOCKED** → "Upgrade to continue"

### Issue #3: No Trial UI Indicator
**Problem:** Users can't see how many trials they have left

**Missing:**
- ❌ "2 bills remaining" counter
- ❌ "Last free bill!" warning
- ❌ Progress bar showing 2/3 used

---

## ✅ Answers to Your Questions

### Q1: "Could it be that Qilly defaults all trial contractors to demo before demanding upgrade?"

**Answer:** No, it's not intentional. Here's what's happening:

1. ❌ **NOT a trial limitation** - It's a missing contractor record issue
2. ✅ **Trial system exists** - But uses wrong field (`trial_used` instead of `trial_bills_remaining`)
3. ⚠️ **Demo card shows** - Because contractor record doesn't exist in `contractors` table

### Q2: "I've never seen how Qilly counts down the trial before it asks for upgrade"

**Answer:** **That's because it doesn't countdown!** ⚠️

**Current implementation:**
```typescript
// In api.ts (Line 207)
if (!paidStatus && !trialUsed) {
  users[userIndex].trial_used = true; // ← Sets to TRUE after 1 BOQ
  // ❌ Does NOT decrement trial_bills_remaining
}

// Next BOQ attempt (Line 201)
if (!paidStatus && trialUsed) {
  throw new Error('Trial already used'); // ← Blocks immediately
}
```

**What it SHOULD do:**
```typescript
// First BOQ
if (trial_bills_remaining > 0) {
  trial_bills_remaining = trial_bills_remaining - 1; // 3 → 2
  // ✅ Show: "You have 2 free pricings remaining"
}

// Second BOQ
if (trial_bills_remaining > 0) {
  trial_bills_remaining = trial_bills_remaining - 1; // 2 → 1
  // ⚠️ Show: "This is your last free pricing!"
}

// Third BOQ
if (trial_bills_remaining > 0) {
  trial_bills_remaining = trial_bills_remaining - 1; // 1 → 0
  // ⚠️ Show: "Trial complete - Upgrade to continue"
}

// Fourth BOQ (BLOCKED)
if (trial_bills_remaining === 0 && !isPremium) {
  throw new Error('Trial complete - Please upgrade');
}
```

---

## 🎯 Summary

| What You See | Why It Happens | Is It Intentional? |
|--------------|----------------|-------------------|
| bone@gmail.com shows demo card | No record in `contractors` table | ❌ No - Missing contractor setup |
| All users have `trial_bills_remaining: 3` | Database default value | ✅ Yes - Correct! |
| Trial blocks after 1 BOQ | Uses `trial_used` boolean instead of countdown | ❌ No - Implementation incomplete |
| No trial countdown visible | UI doesn't show remaining count | ❌ No - Feature not implemented |

---

## 🔨 Fixes Needed

### Fix #1: Create Missing Contractor Records
Run `/FIX_MISSING_CONTRACTORS.sql` to create full contractor profiles

### Fix #2: Implement Trial Countdown
Update `api.ts` to decrement `trial_bills_remaining` instead of using `trial_used`

### Fix #3: Add Trial UI Indicators
Show "X bills remaining" in dashboard cards and header badge

### Fix #4: Sync Supabase with Trial Logic
Update database queries to track and decrement `trial_bills_remaining`

---

**Last Updated:** March 9, 2026  
**Environment:** DEV (zzdzrlglivtpawtitvgu)  
**Status:** Trial countdown NOT implemented - Only allows 1 BOQ instead of 3
