# 🚀 Quick Start Guide - Apply Both Fixes

## ⚡ 30-Second Setup

### Step 1: Run SQL Script (2 minutes)

1. Go to Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
   ```

2. Copy and paste the entire content of **`/QUICK_FIX_CONTRACTORS.sql`** ⭐

3. Click **Run** button

4. Wait for success message:
   ```
   ✅ ALL CONTRACTORS HAVE RECORDS
   ```

---

### Step 2: Hard Refresh Browser (5 seconds)

```
Windows: Ctrl + Shift + R
Mac:     Cmd + Shift + R
```

---

### Step 3: Test (2 minutes)

#### Test #1: Contractor Card

1. Login as: `bone@gmail.com`
2. Should see: **🏢 Contractor Card** (not demo card)
3. Should display:
   - Company: Bone Construction (Pty) Ltd
   - CIDB: Grade 4 GB
   - Provinces: GP

#### Test #2: Trial Countdown

1. Check header badge: `Free Trial (3 bills left)`
2. Process 1st BOQ → Badge: `Free Trial (2 bills left)`
3. Process 2nd BOQ → Badge: `Free Trial (1 bill left)`
4. Process 3rd BOQ → Badge: `Trial Used`
5. Try 4th BOQ → ❌ Blocked

---

## ✅ Success Indicators

### Contractor Card Shows:
- ✅ Company name
- ✅ CIDB grade
- ✅ Operating provinces
- ✅ Project types
- ✅ Annual turnover (EME/QSE/Generic)

### Trial Countdown Works:
- ✅ Badge shows "3 bills left"
- ✅ Decrements after each BOQ: 3 → 2 → 1 → 0
- ✅ Status card shows exact count
- ✅ Blocks at 0 with upgrade message

---

## 🐛 Troubleshooting

### Problem: Contractor card still not showing

**Solution 1:** Check if SQL script ran successfully
```sql
-- Run this query:
SELECT email, company_name, status 
FROM contractors 
WHERE email = 'bone@gmail.com';

-- Should return 1 row with company_name
```

**Solution 2:** Disable RLS temporarily
```sql
ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;
```

**Solution 3:** Hard refresh again
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

---

### Problem: Trial countdown not working

**Solution 1:** Check localStorage
```javascript
// Open browser console (F12)
const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
console.log('Users:', users);

// Should show trial_bills_remaining for your user
```

**Solution 2:** Clear demo data and re-login
```javascript
// Open browser console (F12)
localStorage.removeItem('demo_users');
sessionStorage.clear();

// Then re-login
```

---

### Problem: Badge shows old value

**Solution:** Logout and login again
```
1. Click Logout button
2. Login again with same credentials
3. Check badge shows correct value
```

---

## 📋 Affected Users

All these users will get contractor cards after running the fix:

| Email | Current | After Fix |
|-------|---------|-----------|
| bone@gmail.com | 👤 Demo | 🏢 Contractor |
| start@gmail.com | 👤 Demo | 🏢 Contractor |
| letstest@gmail.com | 👤 Demo | 🏢 Contractor |
| newtest@gmail.com | 👤 Demo | 🏢 Contractor |
| sqltest@gmail.com | 👤 Demo | 🏢 Contractor |
| weed@gmail.com | 👤 Demo | 🏢 Contractor |
| weeding@gmail.com | 👤 Demo | 🏢 Contractor |

---

## 🎯 Console Messages to Look For

### Successful Trial Countdown:
```
📋 Trial bill remaining: 2 after successful BOQ processing
📋 Trial bill remaining: 1 after successful BOQ processing
📋 Trial bill remaining: 0 after successful BOQ processing
```

### Successful Contractor Load:
```
✅ Contractor account detected: Bone Construction (Pty) Ltd
✅ Contractor data loaded from Supabase: {...}
```

### Trial Block Message:
```
❌ Trial complete. You have used all 3 free bill pricings. Please upgrade to continue.
```

---

## 🔥 One-Command Fix (Advanced)

If you have Supabase CLI installed:

```bash
# Navigate to project root
cd /path/to/qilly

# Run SQL script
supabase db execute -f FIX_ALL_MISSING_CONTRACTORS.sql
```

---

## 📞 Need Help?

### Check These Files:
1. `/FIXES_APPLIED_SUMMARY.md` - Complete fix details
2. `/TRIAL_SYSTEM_EXPLAINED.md` - How trial system works
3. `/CONTRACTOR_VS_DEMO_FLOW.md` - Visual flow diagrams
4. `/QUICK_ANSWER.md` - FAQ and troubleshooting

---

## 🎉 Ready for eTender Presentation!

Once both fixes are applied:
- ✅ All contractors see proper cards
- ✅ Trial countdown works correctly
- ✅ UI shows exact bill counts
- ✅ System blocks after 3 free bills
- ✅ Professional appearance for investors

**Estimated Setup Time:** < 5 minutes  
**Last Updated:** March 9, 2026