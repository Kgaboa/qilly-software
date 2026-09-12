# 📸 VISUAL GUIDE: Fix SIT in 90 Seconds

## 🎯 YOUR GOAL
Fix this error:
```
❌ GET /contractors?user_id=eq.7dd06dfd... 406 (Not Acceptable)
```

---

## 📋 VISUAL CHECKLIST

```
┌─────────────────────────────────────────┐
│  STEP 1: OPEN SUPABASE                  │
└─────────────────────────────────────────┘
           ↓
   https://app.supabase.com
           ↓
      Login if needed
           ↓
   See your projects list


┌─────────────────────────────────────────┐
│  STEP 2: SELECT SIT PROJECT             │
└─────────────────────────────────────────┘
           ↓
   Click project dropdown (top left)
           ↓
   Look for: kcptusoevqapcvptlgkd
           ↓
   Click on that project
           ↓
   ⚠️ VERIFY: URL shows kcptusoevqapcvptlgkd


┌─────────────────────────────────────────┐
│  STEP 3: OPEN SQL EDITOR                │
└─────────────────────────────────────────┘
           ↓
   Left sidebar → Click "SQL Editor"
           ↓
   Top right → Click "New Query"
           ↓
   See blank SQL editor


┌─────────────────────────────────────────┐
│  STEP 4: COPY THE SQL                   │
└─────────────────────────────────────────┘
           ↓
   Open: /RUN_THIS_SQL_IN_SIT_NOW.sql
           ↓
   Ctrl+A (select all)
           ↓
   Ctrl+C (copy)
           ↓
   ✅ 200+ lines copied


┌─────────────────────────────────────────┐
│  STEP 5: PASTE AND RUN                  │
└─────────────────────────────────────────┘
           ↓
   Click in SQL Editor
           ↓
   Ctrl+V (paste)
           ↓
   Verify all SQL pasted (scroll to check)
           ↓
   Click "RUN" button
           ↓
   Wait 10-30 seconds...
           ↓
   See results appear below


┌─────────────────────────────────────────┐
│  STEP 6: CHECK SUCCESS                  │
└─────────────────────────────────────────┘
           ↓
   Look at Results panel
           ↓
   Should see:
   ✅ SETUP COMPLETE!
   ✅ Users: 1+
   ✅ Contractors: 11+
   ✅ Suppliers: 11+
           ↓
   SUCCESS! ✅


┌─────────────────────────────────────────┐
│  STEP 7: TEST SIT                       │
└─────────────────────────────────────────┘
           ↓
   New tab → https://qilly-sit.vercel.app
           ↓
   Ctrl+Shift+R (hard refresh)
           ↓
   F12 (open console)
           ↓
   Navigate the app
           ↓
   Check console:
   ✅ No 406 errors!
   ✅ User details load!
           ↓
   🎉 DONE!
```

---

## 🔍 WHAT TO LOOK FOR

### ✅ In Supabase SQL Editor Results:

```
┌────────────────────────────────────────┐
│ ✅ SETUP COMPLETE!                     │
├────────────────────────────────────────┤
│ check                    │ count       │
├──────────────────────────┼─────────────┤
│ Users in users table     │ 1           │
│ Contractors in database  │ 11          │
│ Suppliers in database    │ 11          │
│ RLS Policies created     │ 8           │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 👤 YOUR USER                           │
├────────────────────────────────────────┤
│ Email: builders@gmail.com              │
│ Role: contractor                       │
│ Contractor profiles: 1                 │
│ Supplier profiles: 1                   │
└────────────────────────────────────────┘
```

**This means it WORKED!** ✅

---

### ❌ In Browser Console (BEFORE FIX):

```
❌ GET /contractors?user_id=eq.7dd06dfd... 406 (Not Acceptable)
❌ GET /suppliers?user_id=eq.7dd06dfd... 406 (Not Acceptable)
❌ User details not loaded
```

---

### ✅ In Browser Console (AFTER FIX):

```
✅ GET /contractors?user_id=eq.7dd06dfd... 200 OK
✅ GET /suppliers?user_id=eq.7dd06dfd... 200 OK
✅ User details loaded successfully
```

---

## 🎯 PROJECT IDENTIFICATION

### How to verify you're in SIT:

```
┌──────────────────────────────────────────┐
│  CORRECT PROJECT (SIT)                   │
├──────────────────────────────────────────┤
│  ✅ URL shows: kcptusoevqapcvptlgkd      │
│  ✅ Project name: SIT or similar         │
│  ✅ Dashboard title shows correct name   │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  WRONG PROJECT (DEV)                     │
├──────────────────────────────────────────┤
│  ❌ URL shows: zzdzrlglivtpawtitvgu      │
│  ❌ Project name: Development            │
│  ❌ Not the project you need!            │
└──────────────────────────────────────────┘
```

**Always verify the project ID in the URL!**

---

## 📊 BEFORE vs AFTER

### BEFORE (Broken SIT):

```
┌────────────────────────────────────┐
│  SIT DATABASE                      │
├────────────────────────────────────┤
│  Users table:       EMPTY ❌       │
│  Contractors table: EMPTY ❌       │
│  Suppliers table:   EMPTY ❌       │
│  RLS Policies:      NONE ❌        │
├────────────────────────────────────┤
│  RESULT: 406 errors                │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  SIT APPLICATION                   │
├────────────────────────────────────┤
│  Login:            ❌ Broken       │
│  User details:     ❌ Not loading  │
│  Contractors:      ❌ 406 error    │
│  Suppliers:        ❌ 406 error    │
└────────────────────────────────────┘
```

---

### AFTER (Working SIT):

```
┌────────────────────────────────────┐
│  SIT DATABASE                      │
├────────────────────────────────────┤
│  Users table:       1+ users ✅    │
│  Contractors table: 11+ rows ✅    │
│  Suppliers table:   11+ rows ✅    │
│  RLS Policies:      8+ policies ✅ │
├────────────────────────────────────┤
│  RESULT: Everything works!         │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  SIT APPLICATION                   │
├────────────────────────────────────┤
│  Login:            ✅ Works        │
│  User details:     ✅ Loads        │
│  Contractors:      ✅ Visible      │
│  Suppliers:        ✅ Visible      │
└────────────────────────────────────┘
```

---

## ⏱️ TIME BREAKDOWN

```
┌──────────────────────────────┬──────────┐
│  TASK                        │  TIME    │
├──────────────────────────────┼──────────┤
│  Open Supabase               │  5 sec   │
│  Select SIT project          │  10 sec  │
│  Open SQL Editor             │  5 sec   │
│  Copy SQL script             │  10 sec  │
│  Paste SQL                   │  5 sec   │
│  Click RUN                   │  5 sec   │
│  Wait for execution          │  20 sec  │
│  Check results               │  10 sec  │
│  Go to SIT URL               │  5 sec   │
│  Hard refresh                │  5 sec   │
│  Test and verify             │  20 sec  │
├──────────────────────────────┼──────────┤
│  TOTAL TIME                  │  100 sec │
│                              │  ~2 min  │
└──────────────────────────────┴──────────┘
```

---

## 🚨 ERROR IDENTIFICATION

### 406 Error (Database Issue):

```
┌─────────────────────────────────────────┐
│  ERROR MESSAGE:                         │
│  GET /contractors?user_id=eq.XXX        │
│  Status: 406 (Not Acceptable)           │
├─────────────────────────────────────────┤
│  CAUSE:                                 │
│  • User not in users table              │
│  • RLS policies missing                 │
│  • Database not set up                  │
├─────────────────────────────────────────┤
│  FIX:                                   │
│  Run the SQL script! →                  │
│  /RUN_THIS_SQL_IN_SIT_NOW.sql           │
└─────────────────────────────────────────┘
```

---

### CORS Error (Separate Issue):

```
┌─────────────────────────────────────────┐
│  ERROR MESSAGE:                         │
│  Access to fetch has been blocked       │
│  by CORS policy                         │
├─────────────────────────────────────────┤
│  CAUSE:                                 │
│  • Edge function CORS not configured    │
│  • Origin not allowed                   │
├─────────────────────────────────────────┤
│  FIX:                                   │
│  Supabase → Edge Functions →            │
│  Settings → CORS → Add origin           │
└─────────────────────────────────────────┘
```

**NOTE:** CORS is separate from 406!  
Fix 406 first (with SQL), then CORS if needed.

---

## ✅ SUCCESS INDICATORS

### You know it worked when you see:

```
┌─────────────────────────────────────────┐
│  ✅ IN SQL EDITOR RESULTS:              │
├─────────────────────────────────────────┤
│  • "SETUP COMPLETE!" message            │
│  • Users: 1+                            │
│  • Contractors: 11+                     │
│  • Suppliers: 11+                       │
│  • RLS Policies: 8+                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ✅ IN BROWSER CONSOLE:                 │
├─────────────────────────────────────────┤
│  • GET /contractors → 200 OK            │
│  • GET /suppliers → 200 OK              │
│  • No 406 errors                        │
│  • User details loaded                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ✅ IN SIT APPLICATION:                 │
├─────────────────────────────────────────┤
│  • Dashboard loads                      │
│  • User name displays                   │
│  • Contractors tab shows data           │
│  • Suppliers tab shows data             │
│  • Everything works smoothly            │
└─────────────────────────────────────────┘
```

---

## 🎯 QUICK REFERENCE CARD

```
╔═══════════════════════════════════════════════╗
║  SIT FIX QUICK REFERENCE                      ║
╠═══════════════════════════════════════════════╣
║  PROJECT ID:   kcptusoevqapcvptlgkd           ║
║  SIT URL:      https://qilly-sit.vercel.app   ║
║  SQL FILE:     /RUN_THIS_SQL_IN_SIT_NOW.sql   ║
║  GUIDE:        /DO_THIS_EXACT_STEPS.md        ║
║  TIME:         90 seconds                     ║
╚═══════════════════════════════════════════════╝

╔═══════════════════════════════════════════════╗
║  WHAT TO DO                                   ║
╠═══════════════════════════════════════════════╣
║  1. Supabase → SIT (kcptusoevqapcvptlgkd)    ║
║  2. SQL Editor → New Query                    ║
║  3. Paste SQL from file                       ║
║  4. Click RUN                                 ║
║  5. Test on SIT URL                           ║
╚═══════════════════════════════════════════════╝
```

---

## 🆘 IF SOMETHING GOES WRONG

### SQL doesn't run:

```
Problem: Error when running SQL
         ↓
Check:   Are you in SIT project?
         (URL must show kcptusoevqapcvptlgkd)
         ↓
Fix:     Switch to correct project
         Run SQL again
```

---

### Still seeing 406:

```
Problem: 406 errors persist after SQL
         ↓
Check:   Did SQL show success message?
         Run: SELECT COUNT(*) FROM users;
         Should return: 1 or more
         ↓
Fix:     If count is 0, run SQL again
         Make sure you're in SIT project
```

---

### Can't find SIT project:

```
Problem: Don't see kcptusoevqapcvptlgkd
         ↓
Check:   Are you logged into correct account?
         Do you have access to SIT?
         ↓
Fix:     Ask project owner to grant access
         Or verify you're in right account
```

---

## 🚀 FINAL CHECKLIST

```
┌─────────────────────────────────────────┐
│  BEFORE YOU START:                      │
├─────────────────────────────────────────┤
│  [ ] I have Supabase access             │
│  [ ] I can see SIT project              │
│  [ ] I have /RUN_THIS_SQL_IN_SIT_NOW.sql│
│  [ ] I have 2 minutes free              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  DURING FIX:                            │
├─────────────────────────────────────────┤
│  [ ] In correct project (check URL)     │
│  [ ] Copied ALL the SQL                 │
│  [ ] Pasted in SQL Editor               │
│  [ ] Clicked RUN                        │
│  [ ] Saw success messages               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  AFTER FIX:                             │
├─────────────────────────────────────────┤
│  [ ] Went to SIT URL                    │
│  [ ] Hard refreshed (Ctrl+Shift+R)      │
│  [ ] No 406 errors in console           │
│  [ ] User details loaded                │
│  [ ] Data visible in app                │
│  [ ] ✅ DONE!                           │
└─────────────────────────────────────────┘
```

---

**🎯 BOTTOM LINE:**

1. **SIT** = `kcptusoevqapcvptlgkd`
2. **SQL** = `/RUN_THIS_SQL_IN_SIT_NOW.sql`
3. **RUN** = Click RUN button
4. **TEST** = Hard refresh SIT
5. **✅ DONE** = No more 406 errors!

---

**⚡ START NOW: 90 SECONDS TO FIX!**
