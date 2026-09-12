# ✅ Your Current Git/Vercel Setup - Verification & Workflow

**Date:** March 6, 2026  
**Status:** 2-Branch Setup (main + sit-branch)

---

## 📊 CURRENT SETUP

### Git Branches
```
✅ main         ← Figma Make pushes here + your local pulls
✅ sit-branch   ← Pulls from git main
```

### Vercel Projects
```
✅ Project 1: main branch       → Production deployment
✅ Project 2: sit-branch        → SIT deployment
```

---

## 🔍 VERIFICATION CHECKLIST

### Step 1: Verify Vercel Branch Configuration

**For Production Project (main):**
```
1. Go to Vercel Dashboard → Your production project
2. Click Settings → Git
3. Check "Production Branch": Should be "main" ✅
4. Check "Branch Deployments": Should show ONLY "main" ✅
```

**For SIT Project (sit-branch):**
```
1. Go to Vercel Dashboard → Your SIT project
2. Click Settings → Git
3. Check "Production Branch": Should be "sit-branch" ✅
4. Check "Branch Deployments": Should show ONLY "sit-branch" ✅
```

### Step 2: Verify They're Separate Projects

Run this test:
```bash
# Check current branch
git branch

# If you're on main:
git checkout main
echo "test-main-only" >> test.txt
git add test.txt
git commit -m "Test main deployment"
git push origin main

# Wait 2 minutes
# ✅ ONLY Production should deploy
# ❌ SIT should NOT deploy

# Clean up
git rm test.txt
git commit -m "Remove test file"
git push origin main
```

---

## ⚠️ CRITICAL ISSUE WITH YOUR CURRENT SETUP

### The Problem: "sit-branch pulls from git main"

**Current Flow (INCORRECT):**
```
Figma Make → main branch → git push
                ↓
          sit-branch pulls from main
                ↓
         BOTH environments update!
```

**This means:**
- Every time you push to `main`, you must manually update `sit-branch`
- If you forget to update `sit-branch`, SIT becomes outdated
- If you update `sit-branch` from `main`, SIT deploys production code (not ideal for testing)

---

## ✅ RECOMMENDED WORKFLOW

### Option A: Development → SIT → Production (BEST)

Create a 3rd branch for daily work:

```bash
# Create development branch
git checkout -b development
git push -u origin development

# New workflow:
Development (your daily work)
     ↓
   merge to sit-branch (testing)
     ↓
   merge to main (production)
```

**Advantages:**
- ✅ Work safely on `development` without deploying
- ✅ Deploy to SIT when ready for testing
- ✅ Deploy to Production only after SIT approval
- ✅ Never accidentally deploy untested code

### Option B: Keep 2-Branch Setup (SIMPLER)

Use your current setup with clear rules:

```
sit-branch (your daily work + testing)
     ↓
   merge to main (production only)
```

**Advantages:**
- ✅ Simple - only 2 branches
- ✅ SIT is your development environment
- ✅ Production stays clean

**Disadvantages:**
- ⚠️ Every code change deploys to SIT immediately
- ⚠️ Can't work on multiple features without deploying

---

## 🎯 RECOMMENDED: Option A (3-Branch Setup)

### Implementation Steps

#### Step 1: Create Development Branch
```bash
# Ensure you're on main with latest code
git checkout main
git pull origin main

# Create development branch from main
git checkout -b development
git push -u origin development

# Now you have 3 branches:
# - development (daily work)
# - sit-branch (testing)
# - main (production)
```

#### Step 2: Update Your Daily Workflow

**OLD Workflow (Risky):**
```bash
# In Figma Make → Push to main
git push origin main
# 🔴 Production deploys immediately!
```

**NEW Workflow (Safe):**
```bash
# In Figma Make → Push to development
git checkout development
# ... make changes ...
git push origin development
# ✅ Nothing deploys yet!

# When ready to test:
git checkout sit-branch
git merge development
git push origin sit-branch
# ⚡ ONLY SIT deploys

# After SIT testing passes:
git checkout main
git merge sit-branch
git push origin main
# ⚡ ONLY Production deploys
```

---

## 📋 STEP-BY-STEP WORKFLOW GUIDE

### Daily Development (No Deployment)

```bash
# 1. Start your day - switch to development branch
git checkout development
git pull origin development

# 2. Work in Figma Make or locally
# ... edit code ...
# ... test locally: npm run dev ...

# 3. Commit your work (but don't deploy yet)
git add .
git commit -m "Add new feature"
git push origin development

# ✅ Code is saved to Git
# ✅ Nothing deployed yet
# ✅ Safe to continue working
```

### Deploy to SIT for Testing

```bash
# 1. Switch to sit-branch
git checkout sit-branch

# 2. Pull latest from sit-branch (in case others updated)
git pull origin sit-branch

# 3. Merge your development work
git merge development

# 4. Push to trigger SIT deployment
git push origin sit-branch

# ⚡ Vercel auto-deploys to SIT
# ⏱️ Wait 2-3 minutes for deployment
# 🔗 Test at: https://sit.qilly.co.za (or your SIT URL)
```

### Deploy to Production (After SIT Testing)

```bash
# 1. Ensure SIT testing passed ✅

# 2. Switch to main branch
git checkout main

# 3. Pull latest from main
git pull origin main

# 4. Merge approved sit-branch code
git merge sit-branch

# 5. Push to trigger Production deployment
git push origin main

# ⚡ Vercel auto-deploys to Production
# ⏱️ Wait 2-3 minutes for deployment
# 🔗 Live at: https://qilly.co.za (or your production URL)
```

---

## 🚨 IMPORTANT: Figma Make Git Settings

### Check Your Current Branch in Figma Make

**Before pushing changes:**
1. Open your project in Figma Make
2. Look at the Git panel
3. Check which branch is currently active
4. **ALWAYS** ensure you're on `development` branch before pushing

### How to Switch Branches in Figma Make

```bash
# In terminal/command line (if Figma Make allows terminal access):
git branch              # Shows current branch (*)
git checkout development   # Switch to development
git branch              # Verify you're on development (*)

# Then push in Figma Make
```

---

## 🔧 VERCEL PROJECT CONFIGURATION

### Verify Each Project is Isolated

#### Production Project Settings
```
Project Name: qilly-production (or your production name)
├── Settings → Git
│   ├── Production Branch: main ✅
│   ├── Connected Branch: main ONLY ✅
│   └── Auto-deploy: ON ✅
├── Settings → Environment Variables
│   ├── VITE_SUPABASE_URL: [production Supabase]
│   ├── VITE_SUPABASE_ANON_KEY: [production key]
│   └── VITE_ENVIRONMENT: production
└── Build Settings
    ├── Build Command: npm run build
    └── Output Directory: dist
```

#### SIT Project Settings
```
Project Name: qilly-sit (or your SIT name)
├── Settings → Git
│   ├── Production Branch: sit-branch ✅
│   ├── Connected Branch: sit-branch ONLY ✅
│   └── Auto-deploy: ON ✅
├── Settings → Environment Variables
│   ├── VITE_SUPABASE_URL: [SIT Supabase]
│   ├── VITE_SUPABASE_ANON_KEY: [SIT key]
│   └── VITE_ENVIRONMENT: sit
└── Build Settings
    ├── Build Command: npm run build:sit
    └── Output Directory: dist
```

---

## 🧪 TESTING YOUR SETUP

### Test 1: Verify Branches are Isolated

```bash
# Test that push to sit-branch doesn't deploy to production

# 1. Create test file on sit-branch
git checkout sit-branch
echo "SIT test $(date)" > sit-test.txt
git add sit-test.txt
git commit -m "Test SIT deployment isolation"
git push origin sit-branch

# 2. Wait 3 minutes for deployment

# 3. Check deployments
# ✅ Vercel SIT project should show new deployment
# ❌ Vercel Production project should NOT show new deployment

# 4. Clean up
git rm sit-test.txt
git commit -m "Remove test file"
git push origin sit-branch
```

### Test 2: Verify Main Doesn't Affect SIT

```bash
# Test that push to main doesn't deploy to SIT

# 1. Create test file on main
git checkout main
echo "Production test $(date)" > prod-test.txt
git add prod-test.txt
git commit -m "Test production deployment isolation"
git push origin main

# 2. Wait 3 minutes for deployment

# 3. Check deployments
# ✅ Vercel Production project should show new deployment
# ❌ Vercel SIT project should NOT show new deployment

# 4. Clean up
git rm prod-test.txt
git commit -m "Remove test file"
git push origin main
```

---

## 📊 DEPLOYMENT HISTORY TRACKING

### View Recent Deployments

**In Vercel Dashboard:**
```
1. Go to your project
2. Click "Deployments" tab
3. Check:
   ✅ Each deployment shows correct branch
   ✅ Auto-deployed commits match your Git history
   ✅ No unexpected deployments
```

**Via Vercel CLI:**
```bash
# View production deployments
vercel ls qilly-production

# View SIT deployments
vercel ls qilly-sit
```

---

## 🎯 QUICK REFERENCE CARD

### For Monday Demo and Daily Use

```
┌─────────────────────────────────────────────────────────┐
│          QILLY GIT/VERCEL WORKFLOW GUIDE                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  DAILY WORK (No Deploy):                                │
│  $ git checkout development                             │
│  $ git pull origin development                          │
│  ... make changes ...                                   │
│  $ git push origin development                          │
│  ✅ Code saved, nothing deployed                        │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  DEPLOY TO SIT (Testing):                               │
│  $ git checkout sit-branch                              │
│  $ git merge development                                │
│  $ git push origin sit-branch                           │
│  ⚡ SIT deploys to https://sit.qilly.co.za              │
│  ⏱️  Wait 2-3 minutes                                   │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  DEPLOY TO PRODUCTION (After Testing):                  │
│  $ git checkout main                                    │
│  $ git merge sit-branch                                 │
│  $ git push origin main                                 │
│  ⚡ Production deploys to https://qilly.co.za           │
│  ⏱️  Wait 2-3 minutes                                   │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  EMERGENCY ROLLBACK:                                    │
│  $ git checkout main                                    │
│  $ git revert HEAD                                      │
│  $ git push origin main                                 │
│  ⚡ Previous version redeploys                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ⚠️ COMMON MISTAKES TO AVOID

### ❌ DON'T: Push directly to main from Figma Make
```bash
# This deploys to production immediately!
git checkout main
git push origin main
# 🔴 PRODUCTION DEPLOYS (risky!)
```

### ✅ DO: Push to development, then merge to sit-branch
```bash
# Safe workflow
git checkout development
git push origin development
# ✅ Nothing deploys

# When ready:
git checkout sit-branch
git merge development
git push origin sit-branch
# ⚡ Only SIT deploys
```

### ❌ DON'T: Forget to test in SIT before production
```bash
# Skipping SIT is dangerous
git checkout main
git merge development  # Untested code!
git push origin main
# 🔴 Bugs go straight to production
```

### ✅ DO: Always test in SIT first
```bash
# Safe approach
git checkout sit-branch
git merge development
git push origin sit-branch
# ⚡ Test in SIT

# After testing passes:
git checkout main
git merge sit-branch
git push origin main
# ✅ Tested code goes to production
```

---

## 🚀 NEXT STEPS FOR YOU

### Before Monday Demo (Critical)

1. **Create Development Branch** (5 minutes)
```bash
git checkout main
git pull origin main
git checkout -b development
git push -u origin development
```

2. **Test the Workflow** (10 minutes)
```bash
# Make a small change on development
git checkout development
echo "// Test comment" >> src/app/App.tsx
git add .
git commit -m "Test workflow"
git push origin development
# ✅ Verify nothing deployed

# Deploy to SIT
git checkout sit-branch
git merge development
git push origin sit-branch
# ✅ Verify only SIT deployed

# Check production is untouched
# ✅ Verify production didn't deploy
```

3. **Configure Figma Make** (2 minutes)
```
- Open Figma Make
- Check current branch (should be development)
- If not, switch to development
- Save as default branch
```

### For Long-Term Success

4. **Document for Your Team**
   - Print the Quick Reference Card
   - Share with anyone who pushes code
   - Add to team onboarding docs

5. **Set Up Branch Protection** (Optional but recommended)
```
GitHub → Settings → Branches → Add Rule
- Branch name: main
- Require pull request reviews
- Require status checks
- Save
```

6. **Monitor Deployments**
   - Check Vercel dashboard daily
   - Verify deployments match your Git commits
   - Set up deployment notifications (Vercel → Settings → Notifications)

---

## 📞 TROUBLESHOOTING

### Issue: "I pushed to development but SIT deployed"

**Cause:** Vercel is watching the wrong branch

**Fix:**
```bash
# In Vercel Dashboard:
1. Go to SIT project → Settings → Git
2. Ensure "Production Branch" is "sit-branch"
3. Ensure "Branch Deployments" shows ONLY "sit-branch"
4. Save changes
```

### Issue: "I pushed to sit-branch but Production deployed"

**Cause:** Both projects watching the same branch

**Fix:**
```bash
# Verify projects are separate:
1. Check you have 2 different Vercel projects
2. Each should watch a different branch
3. Not the same project with multiple branches
```

### Issue: "Figma Make pushes to main automatically"

**Cause:** Figma Make default branch is main

**Fix:**
```bash
# Before pushing in Figma Make:
git checkout development
# Then push
```

---

## ✅ VERIFICATION SUMMARY

### Your Setup Should Look Like This:

```
GIT BRANCHES:
├── development    ← Daily work (no auto-deploy)
├── sit-branch     ← Testing (auto-deploys to SIT)
└── main          ← Production (auto-deploys to Production)

VERCEL PROJECTS:
├── qilly-sit         → watches sit-branch → https://sit.qilly.co.za
└── qilly-production  → watches main → https://qilly.co.za

WORKFLOW:
development → sit-branch → main
   (work)      (test)    (live)
```

### Final Checklist:
- [ ] ✅ 2 Git branches exist (main, sit-branch)
- [ ] ✅ 2 Vercel projects exist (separate projects, not same project)
- [ ] ✅ Each Vercel project watches only ONE branch
- [ ] ✅ Tested: push to sit-branch doesn't deploy to production
- [ ] ✅ Tested: push to main doesn't deploy to SIT
- [ ] ⚠️ **TODO:** Create `development` branch for daily work
- [ ] ⚠️ **TODO:** Configure Figma Make to push to `development`
- [ ] ⚠️ **TODO:** Test full workflow before Monday demo

---

## 🎯 RECOMMENDATION FOR MONDAY

**Current State:** ✅ Mostly correct (2 isolated branches)  
**Risk Level:** ⚠️ MEDIUM (working directly on main/sit-branch is risky)  
**Time to Fix:** 15 minutes (add development branch)  
**Priority:** 🟡 Important but not critical

**Can you demo on Monday with current setup?** YES, but be careful:
- Don't push directly to `main` during demo
- Use `sit-branch` for any live coding/changes
- Merge to `main` only after demo ends

**Should you add development branch before Monday?** YES - 15 minutes now saves hours of stress during demo.

---

*Setup verified: March 6, 2026*  
*Next action: Create development branch and test workflow*
