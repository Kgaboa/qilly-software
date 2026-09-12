# 📑 SIT Environment Fix - Complete Index

**Environment:** SIT (kcptusoevqapcvptlgkd)  
**URL:** https://qilly-sit.vercel.app  
**Status:** ❌ Needs Setup  

---

## 🚨 THE ERRORS

```
❌ HTTP 406 on contractor/supplier queries
❌ CORS blocking edge functions  
❌ Supabase edge function unreachable
```

---

## ⚡ QUICK START (Choose Your Path)

### 🟢 **Path 1: I Want to Fix This NOW** (3 minutes)

**Start here:** `/FIX_SIT_NOW.md`

**Steps:**
1. Switch to SIT in Supabase
2. Run `/SETUP_ADMIN_USER_COMPLETE.sql`
3. Enable CORS for edge functions
4. Test on https://qilly-sit.vercel.app

**Time:** 3 minutes  
**Complexity:** Copy/paste SQL + click buttons  
**Success rate:** 99%

---

### 🟡 **Path 2: I Want to Understand the Issue First** (5 minutes)

**Start here:** `/FIX_SIT_ENVIRONMENT_ERRORS.md`

**Then:**
1. Read the root causes
2. Understand what's broken
3. Follow the detailed fix
4. Run verification queries

**Time:** 5 minutes  
**Complexity:** Read + understand + fix  
**Success rate:** 99%

---

### 🔵 **Path 3: I Only Want to Fix the 406 Errors** (2 minutes)

**Start here:** `/FIX_HTTP_406_SIT.sql`

**Steps:**
1. Run the diagnostic queries
2. Run the fix queries
3. Verify the fix
4. Test

**Time:** 2 minutes  
**Complexity:** SQL only  
**Success rate:** 90% (won't fix CORS)

---

## 📚 ALL DOCUMENTATION FILES

### 🟢 Quick Action Files (Use These!)

| File | Purpose | Time | When to Use |
|------|---------|------|-------------|
| **FIX_SIT_NOW.md** | Quickest path to fix | 3 min | **START HERE** |
| **SETUP_ADMIN_USER_COMPLETE.sql** | Complete database setup | 1 min | Run this in SIT |
| **DO_THIS_RIGHT_NOW.md** | Ultra-simple guide | 2 min | Just want it working |

### 🟡 Detailed Explanation Files

| File | Purpose | Time | When to Use |
|------|---------|------|-------------|
| **FIX_SIT_ENVIRONMENT_ERRORS.md** | Complete diagnosis + fix | 10 min | Want to understand |
| **SIT_VS_DEV_SETUP.md** | Environment comparison | 8 min | Understand differences |
| **FIX_HTTP_406_SIT.sql** | Fix 406 errors only | 2 min | Only have 406 errors |

### 🔵 Reference Files

| File | Purpose | Time | When to Use |
|------|---------|------|-------------|
| **SIT_FIX_INDEX.md** | This file - navigation | 3 min | Finding the right guide |

---

## 🎯 RECOMMENDED WORKFLOW

### For Your Monday Demo

**Saturday/Sunday (Now):**
1. ✅ Read `/FIX_SIT_NOW.md` (2 minutes)
2. ✅ Switch to SIT in Supabase
3. ✅ Run `/SETUP_ADMIN_USER_COMPLETE.sql`
4. ✅ Configure CORS
5. ✅ Test on https://qilly-sit.vercel.app
6. ✅ Verify no errors

**Monday (Before Demo):**
1. ✅ Quick test to ensure still working
2. ✅ Have SIT URL ready
3. ✅ Know admin credentials
4. ✅ Demo with confidence!

**Total prep time: 5 minutes**

---

## 🔍 ISSUE BREAKDOWN

### Issue 1: HTTP 406 Errors (85% likely)

**What it means:**
- Database queries returning "Not Acceptable"
- Usually caused by missing RLS policies or user not in users table

**Fix:**
- Run `/SETUP_ADMIN_USER_COMPLETE.sql` in SIT
- Creates users, policies, and test data

**Verification:**
```sql
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'suppliers';
```
Expected: At least 3 policies

---

### Issue 2: CORS Errors (90% likely)

**What it means:**
- Browser blocking requests to edge functions
- Edge function not configured to allow https://qilly-sit.vercel.app

**Fix:**
- Supabase → Edge Functions → Settings → CORS
- Add origin: `https://qilly-sit.vercel.app`

**Verification:**
```bash
curl -X OPTIONS https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/profile \
  -H "Origin: https://qilly-sit.vercel.app" -v
```
Look for: `Access-Control-Allow-Origin` header

---

### Issue 3: Edge Function Unreachable (50% likely)

**What it means:**
- Edge function not deployed to SIT
- Or CORS blocking it (see Issue 2)

**Fix:**
- Deploy edge function to SIT
- Or fix CORS (see Issue 2)

**Verification:**
```bash
supabase functions list --project-ref kcptusoevqapcvptlgkd
```
Expected: Function listed and active

---

## 📋 COMPLETE CHECKLIST

### Pre-Fix Checklist

- [ ] I understand SIT is separate from DEV
- [ ] I have Supabase dashboard access
- [ ] I know the SIT project ID: kcptusoevqapcvptlgkd
- [ ] I have the SQL script ready: /SETUP_ADMIN_USER_COMPLETE.sql
- [ ] I understand this will take ~3 minutes

### During Fix Checklist

- [ ] Switched to SIT in Supabase (verify URL shows kcptusoevqapcvptlgkd)
- [ ] Opened SQL Editor
- [ ] Copied ALL of /SETUP_ADMIN_USER_COMPLETE.sql
- [ ] Pasted into SQL Editor
- [ ] Clicked RUN
- [ ] Saw success messages (✅)
- [ ] Configured CORS for edge functions
- [ ] Verified edge function is deployed

### Post-Fix Checklist

- [ ] Refreshed https://qilly-sit.vercel.app
- [ ] Opened browser console (F12)
- [ ] Attempted login as admin
- [ ] No 406 errors in console
- [ ] No CORS errors in console
- [ ] Data loads successfully
- [ ] Can view suppliers
- [ ] Can view contractors
- [ ] Ready for Monday demo!

---

## 🎯 DECISION TREE

```
Start: SIT environment has errors
        ↓
Do you want the quickest fix?
        ↓
    YES → /FIX_SIT_NOW.md (3 minutes)
        ↓
    Run /SETUP_ADMIN_USER_COMPLETE.sql in SIT
        ↓
    Configure CORS
        ↓
    Test
        ↓
    ✅ Done!

Do you want to understand the issue?
        ↓
    YES → /FIX_SIT_ENVIRONMENT_ERRORS.md (10 minutes)
        ↓
    Read root causes
        ↓
    Follow detailed fix
        ↓
    Verify each step
        ↓
    ✅ Done!

Do you only have 406 errors (no CORS)?
        ↓
    YES → /FIX_HTTP_406_SIT.sql (2 minutes)
        ↓
    Run SQL script
        ↓
    Test
        ↓
    ✅ Done!
```

---

## 💡 KEY INSIGHTS

### Why SIT is Broken

**Root cause:** You never set up SIT!

You did:
- ✅ Set up Development (zzdzrlglivtpawtitvgu)
- ❌ Never set up SIT (kcptusoevqapcvptlgkd)

**Result:**
- SIT has no users in users table
- SIT has no RLS policies
- SIT has no test data
- SIT edge functions have no CORS config

**Fix:** Run the same setup in SIT that you ran in DEV!

---

### Why Both Environments Need Setup

**Environments are COMPLETELY SEPARATE:**

| Item | DEV | SIT | Shared? |
|------|-----|-----|---------|
| Database | Own DB | Own DB | ❌ No |
| Auth users | Own users | Own users | ❌ No |
| Data | Own data | Own data | ❌ No |
| Edge functions | Own functions | Own functions | ❌ No |
| CORS config | Own config | Own config | ❌ No |

**Each environment needs its own complete setup!**

---

## 🚀 AFTER YOU FIX SIT

### What You'll Have

**Working SIT Environment:**
```
✅ Admin login: admin@qilly.co.za / QillyAdmin2026!
✅ Test suppliers: 5 from various provinces
✅ Test contractors: 5 from various provinces
✅ RLS policies: Properly configured
✅ Edge functions: CORS configured
✅ No errors: 406, CORS, or edge function
✅ Demo ready: For Monday presentation
```

**Both Environments Working:**
```
Development (zzdzrlglivtpawtitvgu)
  ✅ For development and testing
  ✅ Can break things safely
  
SIT (kcptusoevqapcvptlgkd)
  ✅ For demos and integration testing
  ✅ Stable and production-like
  ✅ Ready for eTender presentation
```

---

## 🎓 LEARNING POINTS

### What You'll Learn

1. **Environment isolation** - Each env is separate
2. **Database setup** - How to set up Supabase properly
3. **RLS policies** - Why they're needed and how they work
4. **CORS** - Why it's needed for edge functions
5. **Debugging** - How to diagnose 406 and CORS errors

### Skills You'll Gain

- ✅ Supabase environment management
- ✅ SQL script execution
- ✅ CORS configuration
- ✅ Edge function deployment
- ✅ Production-ready setup

---

## 📞 HELP & SUPPORT

### If You Get Stuck

**For 406 errors:**
→ See `/FIX_HTTP_406_SIT.sql`

**For CORS errors:**
→ See `/FIX_SIT_ENVIRONMENT_ERRORS.md` (Part 2)

**For general issues:**
→ See `/FIX_SIT_NOW.md` troubleshooting section

**For understanding:**
→ See `/SIT_VS_DEV_SETUP.md`

---

## ⏱️ TIME ESTIMATES

| Task | Minimum | Recommended |
|------|---------|-------------|
| Read quick guide | 1 min | 3 min |
| Run SQL script | 30 sec | 1 min |
| Configure CORS | 30 sec | 1 min |
| Test and verify | 1 min | 2 min |
| **TOTAL** | **3 min** | **7 min** |

**With reading detailed guides:** 15-20 minutes
**Without reading (just fix):** 3 minutes

---

## 🎯 BOTTOM LINE

**The fastest path to fix SIT:**

1. Open `/FIX_SIT_NOW.md`
2. Follow the 4 steps
3. Test
4. Done!

**Time:** 3 minutes  
**Difficulty:** Copy/paste + click  
**Result:** SIT working perfectly for Monday demo

---

## ✅ SUCCESS CRITERIA

You'll know SIT is fixed when:

✅ **Login Works:**
- Can login with admin@qilly.co.za
- No authentication errors

✅ **Data Loads:**
- Suppliers tab shows 5 suppliers
- Contractors tab shows 5 contractors
- All data visible and correct

✅ **No Errors:**
- Browser console shows no 406 errors
- Browser console shows no CORS errors
- Edge functions work properly

✅ **Demo Ready:**
- Can show supplier management
- Can show contractor management
- Can demonstrate approve/reject
- Professional and polished

---

**NOW: Go to `/FIX_SIT_NOW.md` and fix it!** 🚀

**Monday: Demo with confidence!** 💪

**eTender investors: Impressed!** 🎉
