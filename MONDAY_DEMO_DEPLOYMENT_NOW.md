# 🚨 MONDAY DEMO - DEPLOY NOW (15 Minutes)

## The Problem
- ✅ Suppliers exist in database
- ✅ You can see them in Supabase UI  
- ❌ Can't see them in Figma Make (it can't connect to Supabase)
- ❌ Need a working live demo for Monday investors

## The Solution
Deploy to Vercel NOW. Get a professional URL for Monday.

---

## 🚀 QUICK DEPLOY (15 minutes)

### STEP 1: Check SQL Fix (2 min)

**In Supabase SQL Editor, run:**
```sql
SELECT is_admin();
```

**Result:**
- ✅ Returns `true` → SQL fix is done, skip to STEP 2
- ❌ ERROR "function does not exist" → **RUN SQL FIX FIRST:**

**If you need to run SQL fix:**
1. Open `/URGENT_SUPPLIER_FIX_NOW.md`
2. Copy the ENTIRE SQL block
3. Paste in Supabase SQL Editor
4. Click RUN
5. See "✅ SUCCESS"
6. Continue to STEP 2

---

### STEP 2: Push to GitHub (5 min)

**If you haven't already:**

```bash
# Open terminal in your Qilly project folder

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Qilly ready for Monday demo"

# Create GitHub repo (do this in GitHub.com web interface):
# 1. Go to github.com
# 2. Click "New repository"
# 3. Name: "qilly"
# 4. Click "Create repository"
# 5. Copy the repository URL (e.g., https://github.com/yourusername/qilly.git)

# Add remote (replace with YOUR repo URL)
git remote add origin https://github.com/YOURUSERNAME/qilly.git

# Push
git branch -M main
git push -u origin main
```

**Skip this if your code is already on GitHub!**

---

### STEP 3: Deploy to Vercel (3 min)

1. **Go to:** https://vercel.com
2. **Sign in** with GitHub
3. **Click:** "New Project"
4. **Select:** Your qilly repository
5. **Framework:** Vercel auto-detects Vite ✅
6. **Click:** "Deploy"
7. **Wait:** 2-3 minutes
8. **Done!** You get a URL like: `https://qilly-abc123.vercel.app`

**That's it! No environment variables needed** (credentials are hardcoded in your code)

---

### STEP 4: Test Deployed App (3 min)

1. **Open:** Your Vercel URL (e.g., `https://qilly-abc123.vercel.app`)
2. **Click:** "Login" or "Admin Login"
3. **Enter:**
   - Email: `admin@qilly.co.za`
   - Password: `QillyAdmin2026!`
4. **Go to:** Admin Dashboard
5. **Click:** Suppliers tab
6. **Expected:** ✅ See "Supplier Enterprise Test"

**If you DON'T see suppliers:**

Run the diagnostic:
1. In Suppliers tab, find blue "Supplier Visibility Diagnostic" card
2. Click "Run Diagnostic Check"
3. Look for red ❌ errors
4. Most common issue: SQL fix not run in Supabase

---

### STEP 5: Create Test Data for Monday (2 min)

**On your Vercel deployed app:**

1. **Logout** from admin
2. **Go to** Supplier Signup
3. **Create 3 test suppliers:**

**Supplier 1:**
- Company: Cape Town Builders
- Email: supplier1@test.com  
- Province: Western Cape
- Password: Test1234!
- Complete signup

**Supplier 2:**
- Company: Durban Materials Co
- Email: supplier2@test.com
- Province: KwaZulu-Natal  
- Password: Test1234!
- Complete signup

**Supplier 3:**
- Company: Joburg Cement Ltd
- Email: supplier3@test.com
- Province: Gauteng
- Password: Test1234!
- Complete signup

4. **Login as admin** again
5. **Go to Suppliers tab**
6. **Approve** "Cape Town Builders" and "Durban Materials Co"
7. **Leave** "Joburg Cement Ltd" and "Supplier Enterprise Test" as PENDING

**Now you have:**
- ✅ 2 approved suppliers (shows system works)
- ✅ 2 pending suppliers (for live demo)
- ✅ Multi-province coverage (WC, KZN, Gauteng)

---

## 🎬 Monday Demo Script

**Use your Vercel URL** for the demo:

### Opening (Problem)
> "Traditional construction BOQ pricing takes 3-7 days because supplier approvals are manual."

### Solution Demo (30 seconds)

**[Open Vercel URL on screen]**

> "With Qilly, we've automated this. Here's our admin dashboard."

**[Show Suppliers tab with 4 suppliers]**

> "We have suppliers from Western Cape, KwaZulu-Natal, and Gauteng."

**[Click View on "Joburg Cement Ltd"]**

> "Let's approve this new Johannesburg supplier..."

**[Click Approve]**

**[Status changes to green "Approved" instantly]**

> "Done. 3 seconds instead of 3-7 days."

> "This supplier can now provide real-time pricing to contractors across Gauteng."

### Impact
> "We're scaling to 100+ suppliers across all 9 South African provinces."

> "This creates the country's first live construction pricing database."

> "That's why we're seeking R25 million to accelerate rollout."

**[Show slide deck]**

---

## ✅ Monday Checklist

**Technical Setup:**
- [ ] SQL fix run in Supabase (is_admin() exists)
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel successfully
- [ ] Can access Vercel URL
- [ ] Can login as admin on Vercel URL
- [ ] Can see suppliers in Admin Dashboard
- [ ] Created 3-4 test suppliers
- [ ] Approved 2, left 2 pending
- [ ] Tested approval workflow

**Presentation Prep:**
- [ ] Have Vercel URL bookmarked
- [ ] Logged in as admin before meeting
- [ ] Suppliers tab open and ready
- [ ] Identified which supplier to approve live
- [ ] Practiced demo flow (30 seconds)
- [ ] Have slide deck ready
- [ ] Printed executive summary

**Backup Plan:**
- [ ] Saved screenshots of working demo
- [ ] Screen recording of approval flow
- [ ] PDF of supplier dashboard
- [ ] Have localhost running as backup

---

## 🐛 Troubleshooting

### Issue: "Can't login to deployed app"

**Check:**
1. Did you run the SQL fix in Supabase?
2. Is admin user created in Supabase Auth?
3. Try email: `admin@qilly.co.za` password: `QillyAdmin2026!`

### Issue: "Login works but no suppliers"

**Most common cause:** SQL fix not run

**Fix:**
1. Go to Supabase SQL Editor
2. Run: `SELECT is_admin();`
3. If error → Run SQL fix from `/URGENT_SUPPLIER_FIX_NOW.md`
4. Refresh deployed app

### Issue: "Vercel deployment failed"

**Check:**
1. Did npm install work locally?
2. Any build errors?
3. Check Vercel deployment logs
4. Usually a missing dependency

**Quick fix:**
```bash
npm run build
```
If that works locally, Vercel should deploy fine.

### Issue: "Diagnostic shows errors"

**Most common errors and fixes:**

| Error | Fix |
|-------|-----|
| "Not admin" | Wrong email - use admin@qilly.co.za |
| "Function not found" | SQL fix not run - run it |
| "Column does not exist" | SQL fix partially run - run it again |
| "0 suppliers found" | RLS blocking - run SQL fix |

---

## 📊 What You'll Have Monday Morning

✅ **Live demo URL:** `https://qilly-abc123.vercel.app`  
✅ **4 test suppliers** across 3 provinces  
✅ **Working approval flow** (3 seconds)  
✅ **Professional presentation** (not localhost or Figma)  
✅ **R25 million funding ready** 💰

---

## 🚀 Priority Actions RIGHT NOW

1. **NOW (2 min):** Check if SQL fix is run (`SELECT is_admin();`)
2. **NOW (5 min):** Push to GitHub if not already
3. **NOW (3 min):** Deploy to Vercel
4. **NOW (3 min):** Test login and suppliers on Vercel
5. **NOW (2 min):** Create 3 test suppliers
6. **TONIGHT:** Practice demo 3 times (30 seconds each)
7. **MONDAY AM:** Login before meeting, have tab open

---

## Emergency Contacts

**If completely stuck Sunday night:**

1. Check `/DEPLOYMENT.md` for detailed Vercel guide
2. Check `/FIGMA_MAKE_SUPABASE_CONNECTION_FIX.md` for connection issues
3. Check `/URGENT_SUPPLIER_FIX_NOW.md` for SQL fix
4. Run diagnostic tool in app for specific errors

---

## Success Metrics

**You're ready for Monday when:**

✅ Vercel URL loads  
✅ Admin login works  
✅ Suppliers tab shows 4 suppliers  
✅ Can approve a supplier in 3 seconds  
✅ Status changes to green instantly  
✅ Can show multi-province coverage  

---

**Time to Deploy:** 15 minutes  
**Time to Prep Demo:** 10 minutes  
**Total Time:** 25 minutes  
**Impact:** R25 million funding opportunity  

---

🚀 **STOP READING. START DEPLOYING!** 🚀

**Step 1:** Check SQL fix  
**Step 2:** Push to GitHub  
**Step 3:** Deploy to Vercel  
**Step 4:** Test  
**Step 5:** Create test data  
**Step 6:** Practice demo  

**You got this!** 💪
