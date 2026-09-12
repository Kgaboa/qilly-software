# ⚡ 30-SECOND FIX: start@gmail.com Showing Demo Card

## 🎯 The Fix

**Problem:** start@gmail.com shows "demo" card instead of operator dashboard  
**Cause:** User not in `public.users` table  
**Fix:** Create the missing user record

---

## 📝 Copy & Paste This SQL

**Go to:** https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu/sql/new

**Run this:**

```sql
-- Create missing user record for start@gmail.com
INSERT INTO public.users (id, email, full_name, role, subscription_tier, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', au.email) as full_name,
  'operator' as role,
  'FREE' as subscription_tier,
  NOW() as created_at
FROM auth.users au
WHERE au.email = 'start@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = au.id)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- Verify it worked
SELECT id, email, full_name, role, subscription_tier 
FROM public.users 
WHERE email = 'start@gmail.com';
```

---

## ✅ Test

1. Hard refresh: `Ctrl + Shift + R`
2. Login as start@gmail.com
3. Should see operator dashboard ✅
4. No more demo card ✅

---

## 📊 Status

- ✅ **kgabo123@gmail.com** (Cestasoft) - Already works
- ❌ **start@gmail.com** - Needs fix (run SQL above)

---

**Time:** 30 seconds  
**Priority:** 🟡 Medium (demo card still allows testing, but looks unprofessional)
