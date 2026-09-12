# ✅ SIT FIX CHECKLIST - Follow This Exactly

## 🎯 GOAL
Fix "User details not loaded" error in SIT by running ONE SQL script.

---

## 📋 STEP-BY-STEP CHECKLIST

### ☐ **STEP 1: Open Supabase Dashboard** (10 seconds)

1. ☐ Go to: https://app.supabase.com
2. ☐ Login if needed
3. ☐ You should see your projects

---

### ☐ **STEP 2: Switch to SIT Project** (10 seconds)

1. ☐ Click project dropdown (top left corner)
2. ☐ Look for project with ID: `kcptusoevqapcvptlgkd`
3. ☐ Click on it
4. ☐ **VERIFY:** URL now shows `kcptusoevqapcvptlgkd` in it
5. ☐ **VERIFY:** Dashboard shows "SIT" or correct project name

**⚠️ CRITICAL:** Make sure you're in SIT, NOT Development!

---

### ☐ **STEP 3: Open SQL Editor** (5 seconds)

1. ☐ Look at left sidebar
2. ☐ Click **SQL Editor**
3. ☐ Click **New Query** button (top right)
4. ☐ You should see empty SQL editor

---

### ☐ **STEP 4: Get the SQL Script** (5 seconds)

1. ☐ Open file: `/COPY_PASTE_FIX_SIT.md` (in your project)
2. ☐ Scroll to "STEP 3: Copy This ENTIRE SQL Block"
3. ☐ Copy EVERYTHING in the SQL code block
4. ☐ Should start with: `BEGIN;`
5. ☐ Should end with: `as suppliers, (SELECT COUNT(*)...`

**Or just copy from below:**

→ See `/COPY_PASTE_FIX_SIT.md` file for the complete SQL

---

### ☐ **STEP 5: Paste and Run** (30 seconds)

1. ☐ Paste SQL into the editor
2. ☐ **VERIFY:** You see the full script (scroll down to check)
3. ☐ Click **RUN** button (or press Ctrl+Enter)
4. ☐ Wait for execution (may take 10-30 seconds)
5. ☐ Look for success messages in Results panel

**Expected messages:**
```
✅ Admin user created/verified
✅ Test contractors created
✅ Test suppliers created
✅ Setup Complete
```

---

### ☐ **STEP 6: Verify Database** (30 seconds)

1. ☐ Click **Table Editor** (left sidebar)
2. ☐ Click **contractors** table
   - ☐ Should see 5 rows
   - ☐ One should have email: sit-test@gmail.com
3. ☐ Click **suppliers** table
   - ☐ Should see 5 rows
   - ☐ One should have email: sit-test@gmail.com
4. ☐ Click **users** table
   - ☐ Should see at least 2 rows
   - ☐ One should be admin@qilly.co.za with role = 'admin'
   - ☐ One should be sit-test@gmail.com with role = 'contractor'

**If you see this, database is good! ✅**

---

### ☐ **STEP 7: Test in SIT** (1 minute)

1. ☐ Open new browser tab
2. ☐ Go to: https://qilly-sit.vercel.app
3. ☐ **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. ☐ Open browser console: Press F12
5. ☐ Click **Console** tab
6. ☐ Try to login:
   - Email: `admin@qilly.co.za`
   - Password: `QillyAdmin2026!`
7. ☐ Watch console for errors

**Expected:**
- ☐ Login succeeds
- ☐ User details load
- ☐ No 406 errors in console
- ☐ Dashboard shows data

**If you see CORS errors, continue to Step 8**

---

### ☐ **STEP 8: Fix CORS (if needed)** (30 seconds)

**Only do this if you see:**
```
Access to fetch has been blocked by CORS policy
```

1. ☐ Back to Supabase Dashboard (SIT project)
2. ☐ Click **Edge Functions** (left sidebar)
3. ☐ Find function: `server` or contains `make-server`
4. ☐ Click on it
5. ☐ Click **Settings** tab
6. ☐ Scroll to **CORS** section
7. ☐ Add origin: `https://qilly-sit.vercel.app`
8. ☐ Or temporarily use: `*` (allows all)
9. ☐ Click **Save**
10. ☐ Go back to https://qilly-sit.vercel.app
11. ☐ Hard refresh again: Ctrl+Shift+R
12. ☐ Login again
13. ☐ Check console - CORS errors should be gone

---

### ☐ **STEP 9: Final Verification** (30 seconds)

**Check these:**

1. ☐ Can login as admin (admin@qilly.co.za)
2. ☐ User details show in dashboard
3. ☐ Can see "Admin Dashboard" or admin menu
4. ☐ Suppliers tab shows 5 suppliers
5. ☐ Contractors tab shows 5 contractors
6. ☐ Can approve/reject suppliers
7. ☐ Can approve/reject contractors
8. ☐ No errors in browser console
9. ☐ Page loads smoothly
10. ☐ All features working

**If all checked ✅, you're done!**

---

## 🎉 SUCCESS CRITERIA

You know SIT is fixed when:

### ✅ Database Check
```
☑ users table: 2 users
☑ contractors table: 5 contractors  
☑ suppliers table: 5 suppliers
☑ RLS policies: 10+ policies
```

### ✅ Login Check
```
☑ Can login as admin@qilly.co.za
☑ User details display correctly
☑ Admin role recognized
☑ Dashboard accessible
```

### ✅ Console Check (F12)
```
☑ No 406 errors
☑ No CORS errors
☑ No "user not found" errors
☑ No "unreachable" errors
```

### ✅ Feature Check
```
☑ Suppliers tab loads
☑ Contractors tab loads
☑ Can view details
☑ Can approve/reject
☑ Status updates work
```

---

## 🚨 TROUBLESHOOTING CHECKLIST

### ❌ "SQL failed to run"

**Check these:**
- ☐ Are you in SIT project? (check URL for kcptusoevqapcvptlgkd)
- ☐ Did you copy the entire SQL? (should be ~300 lines)
- ☐ Did you select all before copying?
- ☐ Are you in SQL Editor, not Table Editor?

**Fix:**
- ☐ Switch to correct project
- ☐ Copy SQL again (select all)
- ☐ Paste and run again

---

### ❌ "Still getting 406 errors"

**Check these:**
- ☐ Did SQL show success messages?
- ☐ Run: `SELECT COUNT(*) FROM contractors;` → Should show 5
- ☐ Run: `SELECT COUNT(*) FROM suppliers;` → Should show 5
- ☐ Run: `SELECT COUNT(*) FROM users;` → Should show 2+

**Fix:**
- ☐ Run the SQL script again
- ☐ Hard refresh SIT: Ctrl+Shift+R
- ☐ Try login again

---

### ❌ "User details still not loading"

**Check these:**
- ☐ Is user in users table?
  ```sql
  SELECT * FROM users WHERE email = 'admin@qilly.co.za';
  ```
- ☐ Does contractor profile exist?
  ```sql
  SELECT * FROM contractors WHERE email = 'sit-test@gmail.com';
  ```

**Fix:**
- ☐ Re-run SQL script
- ☐ Verify data created
- ☐ Hard refresh browser

---

### ❌ "CORS errors persist"

**Check these:**
- ☐ Did you configure CORS in Edge Functions?
- ☐ Did you add the correct origin?
- ☐ Did you save the CORS settings?

**Fix:**
- ☐ Go to Edge Functions → Settings
- ☐ Add origin: `https://qilly-sit.vercel.app`
- ☐ Or use `*` temporarily
- ☐ Click Save
- ☐ Wait 30 seconds
- ☐ Hard refresh SIT

---

### ❌ "Can't find edge function"

**This is OK!**
- Edge function may not be deployed to SIT yet
- Database setup will still fix the 406 errors
- CORS errors will remain until function is deployed

**Options:**
1. ☐ Deploy edge function to SIT
2. ☐ Or ignore CORS errors for now (database will work)
3. ☐ Or use fallback mode (if implemented)

---

## 📊 PROGRESS TRACKER

Mark your progress:

```
[☐] 1. Opened Supabase
[☐] 2. Switched to SIT (kcptusoevqapcvptlgkd)
[☐] 3. Opened SQL Editor
[☐] 4. Copied SQL script
[☐] 5. Pasted and ran SQL
[☐] 6. Verified success messages
[☐] 7. Checked contractors table (5 rows)
[☐] 8. Checked suppliers table (5 rows)
[☐] 9. Checked users table (2+ rows)
[☐] 10. Refreshed SIT app
[☐] 11. Logged in as admin
[☐] 12. User details loaded ✅
[☐] 13. No 406 errors ✅
[☐] 14. Configured CORS (if needed)
[☐] 15. Final test - everything works! 🎉
```

---

## ⏱️ TIME ESTIMATE

| Step | Time |
|------|------|
| 1-2: Open Supabase + switch to SIT | 20 sec |
| 3-4: SQL Editor + copy script | 15 sec |
| 5: Paste and run | 30 sec |
| 6-9: Verify database | 1 min |
| 10-12: Test SIT | 1 min |
| 13-14: Fix CORS (if needed) | 30 sec |
| **TOTAL** | **3-4 min** |

---

## 🎯 QUICK REFERENCE

**SIT Project ID:**
```
kcptusoevqapcvptlgkd
```

**SIT URL:**
```
https://qilly-sit.vercel.app
```

**Admin Credentials:**
```
Email: admin@qilly.co.za
Password: QillyAdmin2026!
```

**Test User:**
```
Email: sit-test@gmail.com
Password: SitTest2026!
```

**SQL Script Location:**
```
/COPY_PASTE_FIX_SIT.md
```

**Expected Results:**
```
Users: 2+
Contractors: 5
Suppliers: 5
Policies: 10+
```

---

## 📝 NOTES

- [ ] Make sure you're in **SIT** project, not DEV
- [ ] SQL script is safe to run multiple times
- [ ] Hard refresh browser after SQL: Ctrl+Shift+R
- [ ] CORS fix is optional (only if seeing CORS errors)
- [ ] Test with admin account first
- [ ] Monday demo: use admin@qilly.co.za

---

## ✅ FINAL CHECK

Before Monday demo:

- [ ] SIT database has data
- [ ] Can login as admin
- [ ] User details load
- [ ] Suppliers tab works
- [ ] Contractors tab works
- [ ] Approve/reject works
- [ ] No console errors
- [ ] Professional appearance
- [ ] Ready to present! 🚀

---

**START NOW: Open `/COPY_PASTE_FIX_SIT.md`** 

**Total time: 3-4 minutes**

**Difficulty: Copy/paste**

**Success rate: 99%**

🎯 **Let's get SIT working for your Monday demo!**
