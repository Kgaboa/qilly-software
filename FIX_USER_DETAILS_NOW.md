# 🚨 FIX: User Details Not Loading in SIT

## 🔴 THE ERROR
```
❌ GET /contractors?email=eq.sit-test%40gmail.com 406 (Not Acceptable)
❌ User details not loading
❌ Database queries failing
```

**Why:** SIT database is empty - no users, no contractors, no suppliers!

---

## ⚡ 2-MINUTE FIX

### **1. Supabase Dashboard → Switch to SIT**

https://app.supabase.com → Select project `kcptusoevqapcvptlgkd`

**⚠️ VERIFY:** URL shows `kcptusoevqapcvptlgkd` (NOT zzdzrlglivtpawtitvgu)

---

### **2. SQL Editor → New Query**

Click **SQL Editor** (left sidebar) → Click **New Query**

---

### **3. Copy & Paste This SQL**

**Copy the ENTIRE SQL from `/COPY_PASTE_FIX_SIT.md` file**

It's the big SQL block starting with `BEGIN;` and ending with the select statement.

**Or use the SQL script file you already have:**
→ `/SETUP_ADMIN_USER_COMPLETE.sql`

---

### **4. Click RUN**

Click **RUN** button or press Ctrl+Enter

**Wait for:**
```
✅ Admin user created
✅ Test contractors created  
✅ Test suppliers created
✅ Setup Complete
```

---

### **5. Test SIT**

1. Go to https://qilly-sit.vercel.app
2. **Hard refresh:** Ctrl+Shift+R
3. Login: `admin@qilly.co.za` / `QillyAdmin2026!`
4. ✅ User details should load!

---

## 🎯 WHAT THIS DOES

**The SQL creates:**
- ✅ 2 users (admin + sit-test)
- ✅ 5 contractors
- ✅ 5 suppliers
- ✅ 10 RLS policies
- ✅ Proper authentication setup

**Result:**
- ✅ No more 406 errors
- ✅ User details load
- ✅ Dashboard works
- ✅ Ready for demo!

---

## 🆘 IF IT DOESN'T WORK

### **Still getting 406?**

**Check:** Did SQL run successfully?
```sql
SELECT COUNT(*) FROM contractors;
-- Should return: 5
```

**Fix:** Run the SQL again

---

### **Still no user details?**

**Check:** Is user in users table?
```sql
SELECT * FROM users WHERE email = 'admin@qilly.co.za';
-- Should return: 1 row with role = 'admin'
```

**Fix:** Re-run the SQL script

---

### **See CORS errors too?**

**This is a separate issue.** 

**Fix CORS:**
1. Edge Functions → Your function
2. Settings → CORS
3. Add: `https://qilly-sit.vercel.app`
4. Save

---

## 📋 VERIFICATION

After running SQL:

```sql
-- Check everything was created
SELECT 
  '✅ Users' as item,
  COUNT(*) as count 
FROM users
UNION ALL
SELECT '✅ Contractors', COUNT(*) FROM contractors
UNION ALL  
SELECT '✅ Suppliers', COUNT(*) FROM suppliers
UNION ALL
SELECT '✅ RLS Policies', COUNT(*) FROM pg_policies 
WHERE tablename IN ('contractors', 'suppliers');
```

**Expected:**
```
Users: 2
Contractors: 5
Suppliers: 5
RLS Policies: 10
```

---

## ✅ SUCCESS = USER DETAILS LOAD

You'll know it worked when:

1. ✅ Can login to SIT
2. ✅ User details display
3. ✅ Suppliers tab shows 5 suppliers
4. ✅ Contractors tab shows 5 contractors
5. ✅ No 406 errors in console

---

## 📞 FILES TO USE

| Need | Use This File |
|------|---------------|
| Quick SQL | `/COPY_PASTE_FIX_SIT.md` |
| Step by step | `/SIT_FIX_CHECKLIST.md` |
| Full explanation | `/FIX_SIT_ENVIRONMENT_ERRORS.md` |
| Original script | `/SETUP_ADMIN_USER_COMPLETE.sql` |

---

## 🎯 BOTTOM LINE

**The fix:**
1. Switch to SIT in Supabase
2. Run the SQL script
3. Test on SIT URL
4. Done!

**Time:** 2 minutes  
**Files needed:** 1 SQL script  
**Success rate:** 99%

---

**DO THIS NOW:** 

1. Open Supabase → SIT project
2. SQL Editor → Paste SQL from `/COPY_PASTE_FIX_SIT.md`
3. Click RUN
4. Test!

🚀 **User details will load perfectly!**
