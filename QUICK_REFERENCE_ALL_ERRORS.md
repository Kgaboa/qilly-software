# 🚨 Quick Error Reference - One Page

## 📋 Error Decision Tree

```
Got an error during contractor signup?
│
├─ Error says "email rate limit exceeded"
│  └─ ⚡ SOLUTION: Use different email
│     📁 File: /FIX_EMAIL_RATE_LIMIT_NOW.md
│     ⏱️ Time: Instant
│     ✅ Action: Try signup with contractor-test-123@example.com
│
├─ Error code "42501" or "row-level security"
│  └─ ⚡ SOLUTION: Fix RLS policy
│     📁 File: /FIX_42501_NOW.md
│     ⏱️ Time: 2 minutes
│     ✅ Action: Run /QUICK_FIX_RLS.sql in Supabase
│
├─ Error code "PGRST205" or "table not found"
│  └─ ⚡ SOLUTION: Create table
│     📁 File: /FIX_PGRST205_QUICK_GUIDE.md
│     ⏱️ Time: 3 minutes
│     ✅ Action: Run /CONTRACTORS_QUICK_SETUP.sql + restart API
│
└─ Other error
   └─ 📖 Check: /ERROR_FIXES_INDEX.md
```

---

## 🔥 Top 3 Errors & Instant Fixes

### 1️⃣ Email Rate Limit Exceeded
```
Error: "AuthApiError: email rate limit exceeded"
```

**⚡ Fix (Instant):**
- Use different email: `contractor-test-999@example.com`
- OR wait 60 minutes
- OR delete user from Supabase Auth

**Why it happens:**
- Too many signup attempts with same email
- Supabase security feature (3-5 attempts/hour)

---

### 2️⃣ RLS Policy Violation (42501)
```
Error: {
  "code": "42501",
  "message": "new row violates row-level security policy"
}
```

**⚡ Fix (2 minutes):**
1. Open Supabase → SQL Editor
2. Run `/QUICK_FIX_RLS.sql`
3. Test with NEW email

**Why it happens:**
- RLS policy too strict
- Doesn't allow anon users to insert

---

### 3️⃣ Table Not Found (PGRST205)
```
Error: {
  "code": "PGRST205",
  "message": "Could not find table 'public.contractors'"
}
```

**⚡ Fix (3 minutes):**
1. Open Supabase → SQL Editor
2. Run `/CONTRACTORS_QUICK_SETUP.sql`
3. Go to Settings → API → Restart Server
4. Wait 30 seconds
5. Test signup

**Why it happens:**
- Table doesn't exist yet
- Or API cache not updated

---

## 📁 All Fix Files at a Glance

| Error | Quick Fix File | Detailed File | Time |
|-------|---------------|---------------|------|
| Email rate limit | `/FIX_EMAIL_RATE_LIMIT_NOW.md` | `/FIX_EMAIL_RATE_LIMIT.md` | Instant |
| RLS 42501 | `/FIX_42501_NOW.md` | `/CONTRACTOR_SIGNUP_FIX_GUIDE.md` | 2 min |
| Table PGRST205 | `/FIX_PGRST205_QUICK_GUIDE.md` | `/CONTRACTORS_QUICK_SETUP.sql` | 3 min |

---

## ✅ Success Checklist

After fixing errors:

- [ ] Error code: **Email rate limit**
  - [ ] Used different email
  - [ ] Signup succeeded
  
- [ ] Error code: **42501**
  - [ ] Ran `/QUICK_FIX_RLS.sql`
  - [ ] 4 policies exist
  - [ ] Signup succeeded
  
- [ ] Error code: **PGRST205**
  - [ ] Ran `/CONTRACTORS_QUICK_SETUP.sql`
  - [ ] Restarted API
  - [ ] Table exists
  - [ ] Signup succeeded

---

## 🎯 Current Status (For You Right Now)

**Your Error:**
```
AuthApiError: email rate limit exceeded
```

**What To Do NOW:**

1. **Open your signup form**
2. **Change email to:** `contractor-qilly-test@example.com` (or any NEW email)
3. **Fill form and submit**
4. **Should work!** ✅

**Alternative:**
- Go to Supabase → Authentication → Users
- Delete the user with your old email
- Wait 5 minutes
- Try again with same email

---

## 💡 Pro Tips

### Gmail + Trick
All these go to **same inbox**:
- `yourname+test1@gmail.com`
- `yourname+test2@gmail.com`
- `yourname+contractor@gmail.com`

But Supabase sees them as **different emails**!

### Quick Test Emails
- `contractor-test-001@example.com`
- `contractor-test-002@example.com`
- `qilly-contractor-123@test.com`

### Don't Do This
- ❌ Keep retrying with same email (hits rate limit)
- ❌ Wait hours when you can use different email
- ❌ Skip reading error message

### Do This
- ✅ Read the actual error message
- ✅ Use NEW email for each test
- ✅ Check Supabase logs if confused
- ✅ Follow the fix guides exactly

---

## 🆘 Emergency Contact Sheet

| If... | Then... |
|-------|---------|
| **Still getting errors** | Check `/ERROR_FIXES_INDEX.md` |
| **Multiple errors** | Fix them in order: PGRST205 → 42501 → Rate limit |
| **Need SQL help** | All SQL files end with `.sql` |
| **Need explanation** | Files with "VISUAL" or "GUIDE" in name |
| **Need quick fix** | Files with "NOW" in name |
| **Need full details** | `/BACKEND_VISUAL_SUMMARY.md` |

---

## 🔄 Common Error Flow & Fixes

```
First signup attempt:
❌ PGRST205 (table not found)
   ↓ Fix: Run CONTRACTORS_QUICK_SETUP.sql
   ↓
Second attempt:
❌ 42501 (RLS policy)
   ↓ Fix: Run QUICK_FIX_RLS.sql
   ↓
Third attempt (same email):
❌ Email rate limit
   ↓ Fix: Use different email
   ↓
Fourth attempt:
✅ SUCCESS! 🎉
```

---

## 📊 Files Summary

**Created today: 11 new files!**

1. `/FIX_EMAIL_RATE_LIMIT_NOW.md` ⭐ **Use this now!**
2. `/FIX_42501_NOW.md`
3. `/QUICK_FIX_RLS.sql`
4. `/RLS_ERROR_SOLUTION_SUMMARY.md`
5. `/RLS_ERROR_VISUAL_EXPLANATION.md`
6. `/CONTRACTOR_SIGNUP_FIX_GUIDE.md`
7. `/FIX_CONTRACTOR_RLS_FINAL.sql`
8. `/README_FIX_RLS_ERROR.md`
9. `/CHECKLIST_FIX_RLS.md`
10. `/ERROR_FIXES_INDEX.md` (updated)
11. `/QUICK_REFERENCE_ALL_ERRORS.md` (this file)

**Plus updated:**
- `/BACKEND_VISUAL_SUMMARY.md`

---

**Quick action for you RIGHT NOW:**

👉 **Use email:** `qilly-contractor-feb21@test.com`  
👉 **Try signup again**  
👉 **Should work!** ✅

---

**Last Updated:** 2026-02-21  
**Status:** All fixes ready  
**Your next action:** Change email and retry signup
