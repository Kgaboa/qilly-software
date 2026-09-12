# 🔄 Rename Git Main to Development Branch - Step by Step

**Date:** March 6, 2026  
**Task:** Rename `main` → `development` and create new `main` for production  
**Time Required:** 15 minutes  
**Risk Level:** LOW (if you follow steps carefully)

---

## 🎯 WHAT YOU'RE DOING

### Current Situation:
```
main         ← Figma Make pushes here (used as development)
sit-branch   ← SIT testing
```

### Goal:
```
development  ← Figma Make pushes here (renamed from main)
sit-branch   ← SIT testing
main         ← NEW clean production branch
```

---

## ⚠️ BEFORE YOU START

### Prerequisites Checklist:
- [ ] All your work is committed (no uncommitted changes)
- [ ] You have pushed everything to GitHub
- [ ] You have backup/know how to recover if needed
- [ ] You're not in the middle of the Monday demo

### Save Current State (Safety Backup):
```bash
# Check current status
git status
# Should say: "nothing to commit, working tree clean"

# If you have uncommitted changes:
git add .
git commit -m "Save work before branch rename"
git push origin main
```

---

## 📋 METHOD 1: SAFE APPROACH (Recommended)

This method creates a new `development` branch from `main`, then creates a new clean `main`.

### Step 1: Create Development Branch from Current Main

```bash
# Ensure you're on main with latest code
git checkout main
git pull origin main

# Create development branch (copy of main)
git checkout -b development

# Push development branch to GitHub
git push -u origin development

# Verify it worked
git branch -a
# You should see:
# * development
#   main
#   sit-branch
#   remotes/origin/development
#   remotes/origin/main
#   remotes/origin/sit-branch
```

### Step 2: Update GitHub Default Branch to Development

```bash
# Go to GitHub in your browser:
1. Navigate to your repository
2. Click "Settings" (top menu)
3. Click "Branches" (left sidebar)
4. Under "Default branch" section
5. Click the switch icon (⇄) next to "main"
6. Select "development" from dropdown
7. Click "Update"
8. Confirm the change

# This makes development the default branch
```

### Step 3: Update Figma Make to Use Development Branch

```bash
# In your local repository:
git checkout development

# Verify you're on development
git branch
# Should show: * development

# This is now your working branch
# Figma Make will push to whichever branch is checked out
```

### Step 4: Create New Clean Main for Production

```bash
# Option A: Create main from sit-branch (if sit-branch is stable)
git checkout sit-branch
git pull origin sit-branch
git checkout -b main-new
git push -u origin main-new

# Option B: Create main from current main (if main is production-ready)
git checkout main
git pull origin main
# Keep this as your production branch

# For now, let's assume Option B (keep current main as production)
```

### Step 5: Update Vercel Projects

**For Development (former main):**
```
1. Go to Vercel Dashboard
2. Find your current "Production" project (watching main)
3. Settings → Git
4. Change "Production Branch" from "main" to "development"
5. Save

OR create a new Vercel project for development:
1. Vercel Dashboard → Add New Project
2. Name: qilly-development
3. Git Branch: development
4. Build Command: npm run build:dev
5. Environment Variables: (copy from .env.development)
```

**For Production (main):**
```
1. Vercel Dashboard → your Production project
2. Settings → Git
3. Ensure "Production Branch" is "main"
4. Verify environment variables are production values
5. Save
```

---

## 📋 METHOD 2: COMPLETE RENAME (Advanced)

This method completely renames the `main` branch to `development`.

### ⚠️ WARNING: 
This is more complex and can break things if not done carefully. Use Method 1 instead unless you have a specific reason.

### Step 1: Rename Local Branch

```bash
# Ensure you're on main
git checkout main

# Rename main to development locally
git branch -m main development

# Verify
git branch
# Should show: * development (no main)
```

### Step 2: Rename Remote Branch on GitHub

```bash
# Push the renamed branch
git push origin -u development

# Delete old main branch on GitHub
git push origin --delete main

# Verify on GitHub
# Go to your repo → Branches
# Should only see: development, sit-branch (no main)
```

### Step 3: Update GitHub Default Branch

```bash
# IMMEDIATELY go to GitHub:
1. Repository Settings → Branches
2. Change default branch to "development"
3. Save

# This prevents GitHub from auto-creating a new main
```

### Step 4: Create New Main for Production

```bash
# Create new main branch from your stable code
git checkout sit-branch  # or wherever your stable code is
git checkout -b main
git push -u origin main

# Or create empty main
git checkout --orphan main
git rm -rf .
git commit --allow-empty -m "Initial production branch"
git push -u origin main
```

---

## 🔄 HOW TO PULL IN YOUR LOCAL

### Scenario 1: You Already Have the Repository Locally

#### First Time After Rename (One-Time Setup):

```bash
# If you used Method 1 (created development from main):

# 1. Fetch latest from GitHub
git fetch origin

# 2. See all branches
git branch -a
# Shows: main, development, sit-branch, and remote versions

# 3. Switch to development
git checkout development

# 4. Pull latest changes
git pull origin development

# 5. Set upstream tracking
git branch --set-upstream-to=origin/development development
```

#### After Rename Setup (Daily Use):

```bash
# Always start your day with:
git checkout development
git pull origin development

# Make your changes...
# ... work in Figma Make or locally ...

# Push when ready
git push origin development
```

### Scenario 2: Fresh Clone on Another Computer

```bash
# Clone the repository
git clone https://github.com/yourusername/qilly.git
cd qilly

# By default, you'll be on the default branch (development)
git branch
# Shows: * development

# Pull latest
git pull origin development

# See all branches
git branch -a
# Shows all local and remote branches
```

---

## 📋 COMPLETE WORKFLOW AFTER RENAME

### Daily Development Workflow

```bash
# Start of day
git checkout development
git pull origin development

# Work on your code (Figma Make or local)
# ... make changes ...

# Save your work
git add .
git commit -m "Your changes"
git push origin development

# ✅ Development branch updated
# ✅ Nothing deployed yet
```

### Deploy to SIT for Testing

```bash
# Switch to sit-branch
git checkout sit-branch
git pull origin sit-branch

# Merge development into sit-branch
git merge development

# Push to deploy
git push origin sit-branch

# ⚡ Vercel deploys to SIT environment
# Test at your SIT URL
```

### Deploy to Production

```bash
# After SIT testing passes

# Switch to main
git checkout main
git pull origin main

# Merge tested code from sit-branch
git merge sit-branch

# Push to deploy
git push origin main

# ⚡ Vercel deploys to Production environment
# Live at your production URL
```

---

## 🧪 TESTING YOUR RENAME

### Test 1: Verify Branches Exist

```bash
# List all branches (local and remote)
git branch -a

# Should show:
#   development
#   main
#   sit-branch
#   remotes/origin/development
#   remotes/origin/main
#   remotes/origin/sit-branch
```

### Test 2: Verify Development is Default

```bash
# Go to GitHub repository in browser
# The main page should show "development" in branch dropdown
# This confirms development is the default branch
```

### Test 3: Test Pulling Development

```bash
# From any branch
git checkout development
git pull origin development

# Should say: "Already up to date" or show pulled changes
# No errors
```

### Test 4: Verify Figma Make Uses Development

```bash
# In your local repo (where Figma Make works)
git branch

# Should show: * development
# The asterisk (*) shows current branch
# Figma Make will push to this branch
```

---

## 🚨 TROUBLESHOOTING

### Issue: "fatal: refusing to merge unrelated histories"

**Solution:**
```bash
# If merging branches that have diverged
git merge development --allow-unrelated-histories
```

### Issue: "Your branch is ahead of origin/development"

**Solution:**
```bash
# You have local commits not pushed
git push origin development
```

### Issue: "Your branch is behind origin/development"

**Solution:**
```bash
# Remote has changes you don't have
git pull origin development
```

### Issue: "Cannot delete branch 'main' checked out at..."

**Solution:**
```bash
# Switch to different branch first
git checkout development
# Then try deleting main
git branch -D main  # Local delete
git push origin --delete main  # Remote delete
```

### Issue: GitHub still shows "main" as default

**Solution:**
```bash
# Manually update on GitHub:
1. Repository → Settings → Branches
2. Default branch → Switch to "development"
3. Update default branch
4. Confirm
```

### Issue: Vercel still deploying from "main"

**Solution:**
```bash
# Update Vercel project:
1. Vercel Dashboard → Your Project
2. Settings → Git
3. Production Branch: Change to "development"
4. Save changes
5. Redeploy
```

---

## 📋 CHECKLIST: Post-Rename Verification

After completing the rename, verify everything:

### GitHub Checks:
- [ ] ✅ `development` branch exists on GitHub
- [ ] ✅ `development` is the default branch
- [ ] ✅ `main` branch exists for production
- [ ] ✅ `sit-branch` still exists
- [ ] ✅ All your code is in `development`

### Local Checks:
- [ ] ✅ Can pull `development`: `git pull origin development`
- [ ] ✅ Can see all branches: `git branch -a`
- [ ] ✅ Current branch is `development`: `git branch` shows *
- [ ] ✅ No uncommitted changes: `git status` is clean

### Vercel Checks:
- [ ] ✅ SIT project watches `sit-branch`
- [ ] ✅ Production project watches `main`
- [ ] ✅ Development project watches `development` (optional)
- [ ] ✅ Test deployments work for each environment

### Workflow Checks:
- [ ] ✅ Push to `development` doesn't deploy anywhere
- [ ] ✅ Push to `sit-branch` deploys to SIT only
- [ ] ✅ Push to `main` deploys to Production only

---

## 🎯 RECOMMENDED APPROACH FOR YOU

Based on your situation (Monday demo coming), I recommend **METHOD 1**:

### Why Method 1:
- ✅ Safer (doesn't delete anything)
- ✅ Faster (15 minutes)
- ✅ Reversible (can go back easily)
- ✅ Less chance of breaking things before demo

### Quick Steps (15 minutes):

```bash
# 1. Create development from main (2 min)
git checkout main
git checkout -b development
git push -u origin development

# 2. Update GitHub default branch (2 min)
# → GitHub.com → Settings → Branches → Default: development

# 3. Switch your local to development (1 min)
git checkout development

# 4. Update Vercel if needed (5 min)
# → Vercel Dashboard → Settings → Git → Branch: development

# 5. Test pulling (1 min)
git pull origin development

# Done! ✅
```

---

## 📝 SUMMARY COMMANDS

### One-Time Setup (Do Once):

```bash
# Create development branch
git checkout main
git checkout -b development
git push -u origin development

# Switch to development
git checkout development

# Verify setup
git branch
git pull origin development
```

### Daily Use (Every Day):

```bash
# Pull latest development
git checkout development
git pull origin development

# ... work on code ...

# Push your changes
git push origin development
```

### Pull on Another Computer:

```bash
# Clone repo
git clone https://github.com/yourusername/qilly.git
cd qilly

# You're automatically on development (default branch)
git pull origin development
```

---

## ✅ FINAL ANSWER TO YOUR QUESTIONS

### Q1: "How do I rename git main to git development branch?"

**Answer:**
```bash
# Easiest way (creates new branch, keeps main):
git checkout main
git checkout -b development
git push -u origin development

# Then set development as default on GitHub:
# Settings → Branches → Default branch → development
```

### Q2: "When in my local how do I pull it?"

**Answer:**
```bash
# After creating development branch:
git checkout development
git pull origin development

# That's it! Use this every day to get latest changes.
```

---

## 🚀 NEXT STEPS

### Do This Now (15 minutes):

1. **Create development branch** (5 min)
   ```bash
   git checkout main
   git checkout -b development
   git push -u origin development
   ```

2. **Set as default on GitHub** (2 min)
   - GitHub → Settings → Branches → Default: development

3. **Test pulling** (2 min)
   ```bash
   git checkout development
   git pull origin development
   ```

4. **Update Figma Make** (2 min)
   - Ensure current branch is `development`
   - All future pushes go to `development`

5. **Verify Vercel** (4 min)
   - Check each project watches correct branch
   - Test deployments still work

### Before Monday Demo:

- [ ] ✅ Test full workflow (dev → sit → production)
- [ ] ✅ Verify all 3 branches work independently
- [ ] ✅ Make small test commit to development
- [ ] ✅ Merge to sit-branch and verify SIT deploys
- [ ] ✅ Ensure production stays stable

---

**Good luck with your rename! The steps above are safe and reversible. If anything goes wrong, you still have all your code in the original `main` branch.** 🎯

*Created: March 6, 2026*  
*Estimated Time: 15 minutes*  
*Risk Level: LOW (safe with backups)*
