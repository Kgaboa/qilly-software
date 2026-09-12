# ⚡ QUICK FIX: 403 Error on DEV

## 🎯 30-Second Fix

1. **Go to DEV Supabase:**
   ```
   https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new
   ```

2. **Copy & paste this file:**
   ```
   /DISABLE_RLS_COMPLETE_V2.sql
   ```

3. **Click "Run"** (wait 5 seconds)

4. **Test:**
   - Open: https://dev-branch-m39f5ja09-assure-tech-solution.vercel.app/
   - Hard refresh: `Ctrl + Shift + R`
   - Upload bill
   - ✅ Should work!

---

## 📌 What's Wrong?

**Error:** 403 when saving bills  
**Cause:** RLS enabled on DEV Supabase  
**Fix:** Disable RLS on DEV project  

---

## ⚠️ Do This for ALL Environments

You have multiple Supabase projects:

- [ ] **DEV** - zzdzrlglivtpawtitvgu (fixing now)
- [ ] **SIT** - (find project ID and run fix)
- [ ] **PROD** - (find project ID and run fix BEFORE Tuesday!)

Each environment needs the fix separately!

---

## 🔍 Find Other Project IDs

**Vercel → Settings → Environment Variables**

Look for: `VITE_SUPABASE_URL`

Extract project ID from URL:
```
https://[PROJECT_ID].supabase.co
       ^^^^^^^^^^^^
```

---

**Time to fix:** 2 minutes  
**Priority:** 🔴 URGENT (Tuesday presentation)
