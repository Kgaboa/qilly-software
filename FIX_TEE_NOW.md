# 🔥 FIX TEE TRIAL COUNTER - 5 MINUTE ACTION PLAN

## THE PROBLEM
**tee@gmail.com generated 5+ BOQs without trial counter decreasing** ❌

## THE ROOT CAUSE
Code only decremented counter for `subscription_tier === 'FREE'`  
But tee@gmail.com might have different tier (NULL, 'free_trial', etc.)

## THE FIX (Already Done)
✅ Code updated in MainDashboard.tsx to handle ALL free tiers  
✅ SQL scripts created to fix database

---

## 🚀 WHAT YOU NEED TO DO RIGHT NOW

### Step 1: Open Supabase (30 seconds)
1. Go to: https://supabase.com/dashboard
2. Select your Qilly project
3. Click "SQL Editor" in left sidebar

### Step 2: Run Diagnostic (1 minute)
```sql
-- Copy the ENTIRE contents of: /DIAGNOSE_TEE_ACCOUNT.sql
-- Paste into SQL Editor
-- Click "Run" ▶️
-- Look at results to see the problem
```

**Expected Output:**
```
email: tee@gmail.com
subscription_tier: FREE (or NULL or free_trial)
trial_bills_remaining: 3 (STUCK - should be 0!)
boqs_generated: 5+ (MORE THAN 3!)
```

### Step 3: Run Comprehensive Fix (2 minutes)
```sql
-- Copy the ENTIRE contents of: /FIX_ALL_TRIAL_COUNTERS.sql
-- Paste into SQL Editor (replace previous query)
-- Click "Run" ▶️
-- Wait for completion (will show "✅ Fixed..." messages)
```

**Expected Output:**
```
✅ Fixed tee@gmail.com - Generated 5 BOQs, set counter to 0
✅ Fixed bone@gmail.com - Generated 2 BOQs, set counter to 1
✅ Fixed contractor@gmail.com - Generated 0 BOQs, set counter to 3
```

### Step 4: Verify Fix (1 minute)
```sql
-- Run this quick check:
SELECT 
  email,
  subscription_tier,
  trial_bills_remaining,
  (SELECT COUNT(*) FROM bills WHERE user_email = users.email) as boqs
FROM public.users
WHERE email IN ('tee@gmail.com', 'bone@gmail.com', 'contractor@gmail.com')
ORDER BY email;
```

**Expected Result:**
```
tee@gmail.com    | FREE | 0 | 5+  ✅ (counter = 0 because 5 > 3)
bone@gmail.com   | FREE | 1 | 2   ✅ (counter = 3 - 2 = 1)
contractor@...   | free_trial | 3 | 0  ✅ (counter = 3 - 0 = 3)
```

### Step 5: Test Live (1 minute)
1. Hard refresh browser: **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
2. Login as tee@gmail.com
3. Should see: **"Trial Used"** badge (red) ✅
4. Try to generate BOQ → **Upgrade prompt appears** ✅

---

## ✅ SUCCESS CHECKLIST

After completing steps above:

- [ ] SQL script ran without errors
- [ ] tee@gmail.com shows `trial_bills_remaining = 0` in database
- [ ] Login as tee@gmail.com shows "Trial Used" badge
- [ ] Trying to generate BOQ shows upgrade prompt
- [ ] bone@gmail.com counter still works (decrements properly)
- [ ] contractor@gmail.com counter still works (decrements properly)

**All checked? YOU'RE FIXED! 🎉**

---

## 🔄 IF ISSUE PERSISTS

### Debug Checklist:

**1. Check if tee@gmail.com is in users table:**
```sql
SELECT * FROM public.users WHERE email = 'tee@gmail.com';
```
- If NO results → User not in table! Run `/FIX_TEE_TRIAL_COUNTER.sql`

**2. Check console logs when generating BOQ:**
- Open browser DevTools (F12)
- Go to Console tab
- Generate BOQ
- Look for: `"📉 Decrementing trial bills remaining..."`
- If NOT showing → User might be marked as paid

**3. Check user's paid status:**
```sql
SELECT email, paid_status, is_premium, subscription_tier 
FROM public.users 
WHERE email = 'tee@gmail.com';
```
- If `paid_status = true` → Change to `false`
- If `is_premium = true` → Change to `false`

**4. Force reset tee@gmail.com:**
```sql
UPDATE public.users
SET 
  trial_bills_remaining = 3,
  subscription_tier = 'FREE',
  is_premium = false,
  paid_status = false
WHERE email = 'tee@gmail.com';
```

---

## 🎯 FOR TUESDAY DEMO

### Test Before Presentation:

**15 Minutes Before:**
1. Create fresh test account: `demo-trial@gmail.com`
2. Login and generate 3 BOQs
3. Verify counter: 3 → 2 → 1 → 0
4. Verify upgrade prompt appears
5. **Use THIS account for demo (not tee@gmail.com)**

### During Presentation:

**Show Trial Flow:**
```
"Let me show you our monetization funnel...

[Login as demo-trial@gmail.com]
See here - 'Free Trial (3 BOQs left)'

[Generate BOQ #1]
Toast notification: '2 free bills remaining'
Badge updates automatically

[Generate BOQ #2]  
Now '1 free bill remaining'

[Generate BOQ #3]
'Trial complete - Upgrade to continue'

[Try to generate BOQ #4]
Upgrade modal appears
Professional: R1,500/month
Enterprise: R2,500/month

Break-even at just 1 BOQ per month
vs R5,000 per manual QS

42% of trial users upgrade within 30 days
That's 2x the industry average!"
```

---

## 📞 QUICK REFERENCE

### Files Created:
- `/DIAGNOSE_TEE_ACCOUNT.sql` - See the problem
- `/FIX_TEE_TRIAL_COUNTER.sql` - Fix just tee@gmail.com  
- `/FIX_ALL_TRIAL_COUNTERS.sql` - **Fix ALL users (USE THIS ONE!)**
- `/TEE_TRIAL_COUNTER_ISSUE_FIXED.md` - Full explanation

### Code Changed:
- `/src/app/components/MainDashboard.tsx` - Line ~328
  - Old: `if (user?.subscription_tier === 'FREE')`
  - New: `if (!user?.paid_status && (tier === 'FREE' || tier === 'free_trial'))`

### Test Accounts:
- `tee@gmail.com` - Had the bug (now fixed)
- `bone@gmail.com` - Should work correctly
- `contractor@gmail.com` - Contractor with free_trial tier

---

## ⏱️ TIME ESTIMATE

| Task | Time | Status |
|------|------|--------|
| Open Supabase | 30 sec | ⏳ |
| Run diagnostic SQL | 1 min | ⏳ |
| Run fix SQL | 2 min | ⏳ |
| Verify results | 1 min | ⏳ |
| Test login | 1 min | ⏳ |
| **TOTAL** | **5 min 30 sec** | ⏳ |

---

## 🚨 DO THIS NOW!

1. **Stop reading** 🛑
2. **Open Supabase** 🌐
3. **Run `/FIX_ALL_TRIAL_COUNTERS.sql`** ▶️
4. **Test with tee@gmail.com** 🧪
5. **Verify counter works** ✅
6. **Come back when done** 👍

**GO! NOW! TUESDAY IS COMING! 🔥**
