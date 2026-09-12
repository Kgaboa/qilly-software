# New Contractor Flow: FREE Tier + Free Training

## 🎯 Goal
Update the sign-up flow for NEW contractors only. Leave existing data untouched.

---

## ✅ What We'll Do:

1. ✅ Update ContractorSignup.tsx → New contractors get "FREE tier with Training"
2. ✅ Update MainDashboard.tsx → Show tier badge (not trial counter) for new contractors
3. ✅ Update AdminDashboard.tsx → Approval message mentions training
4. ✅ Keep backward compatibility for existing trial users
5. ✅ Create test contractor accounts

---

## ❌ What We WON'T Do:

- ❌ Run database cleanup SQL (leave existing data as-is)
- ❌ Remove trial logic completely (keep for backward compatibility)
- ❌ Break existing contractor accounts
- ❌ Change payment components

---

## 🔧 Code Changes Required:

### Change 1: ContractorSignup.tsx
**Update the "Free Trial" banner to "Free Training"**

### Change 2: MainDashboard.tsx
**Show tier badge for contractors instead of trial counter**

### Change 3: AdminDashboard.tsx
**Update approval message**

---

## 🧪 Test Plan:

1. Create new contractor: **test-contractor-1@gmail.com**
   - Should see "FREE tier with training" message
   - No trial countdown
   - Clean, professional experience

2. Existing contractors (like tee@gmail.com):
   - Keep working as before
   - No disruption

3. For Tuesday demo:
   - Use test-contractor-1@gmail.com
   - Show clean FREE tier experience
   - Highlight free training value

---

## 📝 New Test Contractor Details:

**Email:** test-contractor-tuesday@gmail.com  
**Password:** Qilly2026!  
**Company:** Demo Construction (Pty) Ltd  
**Tier:** FREE with Free Training  
**Status:** Will show clean tier badge, no trial counter

---

Ready to implement? This is a minimal, safe change!
