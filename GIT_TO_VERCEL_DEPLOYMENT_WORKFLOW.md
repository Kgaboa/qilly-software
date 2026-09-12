# 🚀 Git to Vercel Deployment Workflow - Qilly
## Understanding Auto-Deploy vs Manual Control

**Date:** March 6, 2026  
**Status:** Current Deployment Configuration Analysis

---

## ❓ YOUR QUESTION ANSWERED

### Question 1: Does pushing changes from Figma Make to Git auto-trigger deployment to SIT?
**Answer:** ⚠️ **IT DEPENDS** on your Vercel configuration.

### Question 2: Do changes to main Git repo auto-trigger deployments to both Dev and SIT?
**Answer:** 🔴 **YES** - By default, Vercel auto-deploys EVERY push to connected branches.

---

## 📊 CURRENT CONFIGURATION ANALYSIS

### What I Found in Your Codebase

#### 1. Vercel Configuration Files
```json
// vercel.json (Main Production Config)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}

// vercel-sit.json (SIT Config)
{
  "name": "qilly-sit",
  "buildCommand": "npm run build:sit",
  "env": {
    "NODE_ENV": "staging"
  }
}
```

#### 2. Build Scripts in package.json
```json
{
  "scripts": {
    "build": "vite build",                    // Production
    "build:sit": "vite build --mode sit",     // SIT
    "build:uat": "vite build --mode uat",     // UAT
    "build:preprod": "vite build --mode preprod"
  }
}
```

#### 3. Environment Files
```
.env.development    → Local dev
.env.sit           → SIT environment
.env.uat           → UAT environment
.env.preprod       → Pre-production
.env.production    → Production
```

---

## 🔍 HOW VERCEL AUTO-DEPLOY WORKS

### Default Vercel Behavior (WITHOUT Branch Protection)

```
┌─────────────────┐
│  Figma Make     │ ← You edit code here
└────────┬────────┘
         │
         │ Manual: "Push to Git"
         ↓
┌─────────────────┐
│  GitHub Repo    │ ← Code pushed to "main" branch
│   (main branch) │
└────────┬────────┘
         │
         │ ⚡ AUTOMATIC (Vercel webhook triggered)
         ↓
┌─────────────────┐
│  Vercel         │ ← Detects new commit
│  Auto-Build     │ ← Builds automatically
└────────┬────────┘
         │
         │ ⚡ AUTOMATIC DEPLOYMENT
         ↓
┌─────────────────────────────────────┐
│  ALL Connected Environments Deploy  │
│  - Production (main branch)         │
│  - SIT (if connected to main)       │
│  - UAT (if connected to main)       │
└─────────────────────────────────────┘
```

### ⚠️ THE PROBLEM
**If you push to main, EVERYTHING deploys automatically!**

This means:
- ✅ Development changes → Push to Git → 
- 🔴 **PRODUCTION DEPLOYS** (not what you want!)
- 🔴 **SIT DEPLOYS** (may or may not want)
- 🔴 **UAT DEPLOYS** (may or may not want)

---

## ✅ SOLUTION: Git Branch Strategy

### Recommended Multi-Environment Git Workflow

```
┌──────────────────────────────────────────────────────────────┐
│                    GIT BRANCH STRATEGY                       │
└──────────────────────────────────────────────────────────────┘

main                 ← Production only (protected)
  │
  ├── preprod        ← Pre-production testing
  │
  ├── uat            ← User acceptance testing
  │
  ├── sit            ← System integration testing
  │
  └── development    ← Active development (YOU WORK HERE)
```

### How It Should Work

#### Step 1: Daily Development (No Auto-Deploy)
```bash
# You work on "development" branch
git checkout development
git add .
git commit -m "Add new feature"
git push origin development

# ✅ Nothing deploys yet!
```

#### Step 2: Deploy to SIT When Ready
```bash
# Merge development → sit
git checkout sit
git merge development
git push origin sit

# ⚡ ONLY SIT deploys automatically
# Production stays untouched ✅
```

#### Step 3: Deploy to UAT After SIT Testing
```bash
# Merge sit → uat
git checkout uat
git merge sit
git push origin uat

# ⚡ ONLY UAT deploys
```

#### Step 4: Deploy to Production After UAT Approval
```bash
# Merge uat → main
git checkout main
git merge uat
git push origin main

# ⚡ ONLY Production deploys
```

---

## 🛠️ SETUP INSTRUCTIONS

### OPTION A: Use Git Branches (Recommended)

#### Step 1: Create Branches Locally
```bash
# Navigate to your project
cd qilly

# Create branches
git checkout -b development
git push -u origin development

git checkout -b sit
git push -u origin sit

git checkout -b uat
git push -u origin uat

git checkout -b preprod
git push -u origin preprod

# Keep main for production
git checkout main
```

#### Step 2: Configure Vercel Projects

**Create 5 Separate Vercel Projects:**

1. **qilly-production** (https://qilly.co.za)
   - Connected to: `main` branch
   - Build: `npm run build` (uses .env.production)
   - Auto-deploy: ✅ ON

2. **qilly-sit** (https://sit.qilly.co.za)
   - Connected to: `sit` branch
   - Build: `npm run build:sit` (uses .env.sit)
   - Auto-deploy: ✅ ON

3. **qilly-uat** (https://uat.qilly.co.za)
   - Connected to: `uat` branch
   - Build: `npm run build:uat` (uses .env.uat)
   - Auto-deploy: ✅ ON

4. **qilly-preprod** (https://preprod.qilly.co.za)
   - Connected to: `preprod` branch
   - Build: `npm run build:preprod` (uses .env.preprod)
   - Auto-deploy: ✅ ON

5. **qilly-dev** (https://dev.qilly.co.za)
   - Connected to: `development` branch
   - Build: `npm run build:dev` (uses .env.development)
   - Auto-deploy: ⚠️ OPTIONAL (can be manual)

---

### OPTION B: Use Manual Deployments (Safer for Learning)

#### Disable Auto-Deploy in Vercel

```bash
# Via Vercel Dashboard:
1. Go to your Vercel project
2. Settings → Git
3. Uncheck "Automatically deploy all commits"
4. Save changes

# Now pushes to Git won't auto-deploy!
```

#### Manual Deploy When Ready
```bash
# When you're ready to deploy to SIT:
npm run build:sit
vercel --prod --cwd . --yes

# When ready for production:
npm run build
vercel --prod --cwd . --yes
```

---

## 📋 VERCEL PROJECT SETUP GUIDE

### Creating Separate Vercel Projects for Each Environment

#### 1. Create SIT Project in Vercel

```bash
# Option 1: Via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Name: qilly-sit
5. Framework: Vite
6. Build Command: npm run build:sit
7. Output Directory: dist
8. Branch: sit
9. Environment Variables:
   - VITE_SUPABASE_URL: [SIT Supabase URL]
   - VITE_SUPABASE_ANON_KEY: [SIT anon key]
   - VITE_ENVIRONMENT: sit

# Option 2: Via Vercel CLI
cd qilly
vercel --prod --name qilly-sit
# Follow prompts, select "sit" branch
```

#### 2. Create UAT Project
```bash
# Repeat process:
- Name: qilly-uat
- Branch: uat
- Build: npm run build:uat
- Env vars from .env.uat
```

#### 3. Create Production Project
```bash
# Repeat process:
- Name: qilly-production
- Branch: main
- Build: npm run build
- Env vars from .env.production
```

---

## 🔐 BRANCH PROTECTION RULES

### Protect Production Branch

```bash
# In GitHub:
1. Go to Settings → Branches
2. Add rule for "main"
3. Enable:
   ✅ Require pull request reviews (1 approval)
   ✅ Require status checks (CI/CD tests)
   ✅ Include administrators
   ✅ Restrict who can push
4. Save changes

# Now direct pushes to main are blocked!
# Must create Pull Request → Review → Merge
```

---

## 📊 DEPLOYMENT WORKFLOW COMPARISON

### ❌ Current Setup (Risky)
```
Development
    ↓
  Push to main
    ↓
🔴 ALL environments deploy at once
    ↓
Production, SIT, UAT all updated
    ↓
😱 Bugs go straight to production!
```

### ✅ Recommended Setup (Safe)
```
Development (development branch)
    ↓
  Manual push when ready
    ↓
SIT (sit branch) → Auto-deploy to sit.qilly.co.za
    ↓
  Test & verify
    ↓
UAT (uat branch) → Auto-deploy to uat.qilly.co.za
    ↓
  User acceptance testing
    ↓
Preprod (preprod branch) → Auto-deploy to preprod.qilly.co.za
    ↓
  Final QA
    ↓
Production (main branch) → Auto-deploy to qilly.co.za
    ↓
✅ Controlled, tested deployment!
```

---

## 🎯 QUICK START FOR YOUR WORKFLOW

### What You Should Do RIGHT NOW

#### Step 1: Create Development Branch
```bash
cd qilly
git checkout -b development
git push -u origin development
```

#### Step 2: Update vercel.json for Branch Mapping
```json
// vercel.json
{
  "git": {
    "deploymentEnabled": {
      "main": true,           // Production auto-deploy
      "sit": true,            // SIT auto-deploy
      "uat": true,            // UAT auto-deploy
      "development": false    // Dev manual only
    }
  }
}
```

#### Step 3: Configure Vercel Projects
```bash
# SIT Project
vercel link --project qilly-sit
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_ENVIRONMENT production
# Enter: sit

# Repeat for UAT and Production
```

#### Step 4: Your New Daily Workflow
```bash
# Morning: Start working
git checkout development
git pull origin development

# During day: Make changes (in Figma Make or locally)
# ... edit code ...

# End of day: Commit to development
git add .
git commit -m "Today's work"
git push origin development
# ✅ Nothing deploys yet!

# When ready to test in SIT:
git checkout sit
git merge development
git push origin sit
# ⚡ SIT auto-deploys

# After SIT testing passes:
git checkout uat
git merge sit
git push origin uat
# ⚡ UAT auto-deploys

# After UAT approval:
git checkout main
git merge uat
git push origin main
# ⚡ Production deploys
```

---

## 🚨 IMPORTANT NOTES

### About Figma Make
- Figma Make pushes to whatever branch you have checked out
- **Always check your current branch before pushing!**
- Use `git branch` to see current branch
- Switch branches with `git checkout [branch-name]`

### About Vercel Auto-Deploy
- Vercel watches ALL branches you've connected
- Each Vercel project can watch 1 branch
- You need separate Vercel projects for each environment
- Auto-deploy can be disabled per-project

### About Environment Variables
- Each Vercel project has its own environment variables
- Variables are NOT shared across projects
- Must set them separately for SIT, UAT, Production

---

## 📋 VERIFICATION CHECKLIST

### Before Monday Demo
- [ ] Create `development` branch
- [ ] Create `sit` branch  
- [ ] Create separate Vercel project for SIT
- [ ] Configure SIT environment variables
- [ ] Test: Push to `development` → Nothing deploys ✅
- [ ] Test: Merge to `sit` → SIT deploys ✅
- [ ] Test: Push to `main` → Only Production deploys ✅

### Recommended for Long-Term
- [ ] Create `uat` branch
- [ ] Create `preprod` branch
- [ ] Set up GitHub branch protection on `main`
- [ ] Configure CI/CD tests
- [ ] Document deployment process for team

---

## 🎯 ANSWER TO YOUR SPECIFIC QUESTIONS

### Q1: "Is pushing changes manually from Figma Make to Git auto-trigger deployment to SIT?"
**A:** Currently, YES if both are connected to the same Vercel project. 
**Solution:** Create separate Vercel projects for each branch/environment.

### Q2: "I would like to only work on development and deploy to SIT when ready"
**A:** Perfect! Use the branch strategy:
1. Work on `development` branch (no auto-deploy)
2. When ready: `git checkout sit && git merge development && git push`
3. SIT auto-deploys, production stays untouched

### Q3: "Does Vercel auto-trigger changes to all dev and SIT once changes hit main repo?"
**A:** Currently, likely YES if misconfigured.
**Fix:** 
- Separate Vercel projects (qilly-production, qilly-sit, qilly-dev)
- Each watches a different branch
- `main` → Production only
- `sit` → SIT only
- `development` → Dev only

---

## 🛠️ IMMEDIATE ACTION ITEMS

### To Fix Before Monday Demo (15 minutes)

```bash
# 1. Create development branch
git checkout -b development
git push -u origin development

# 2. Create SIT branch
git checkout -b sit
git push -u origin sit

# 3. In Vercel Dashboard:
#    - Ensure Production project watches "main" ONLY
#    - Create new "qilly-sit" project watching "sit" branch
#    - Test by pushing to "development" (nothing should deploy)

# 4. From now on:
#    - Daily work on "development" branch
#    - Deploy to SIT: git checkout sit && git merge development && git push
#    - Deploy to Prod: git checkout main && git merge sit && git push
```

---

## 📚 ADDITIONAL RESOURCES

### Vercel Documentation
- [Git Integration](https://vercel.com/docs/git)
- [Deploy Branches](https://vercel.com/docs/git/deploy-branches)
- [Environment Variables](https://vercel.com/docs/environment-variables)

### Best Practices
- [GitFlow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Environment Strategies](https://12factor.net/config)

---

## ✅ SUMMARY

**Current Risk:** 🔴 Every push to main deploys EVERYWHERE  
**Solution:** ✅ Branch-based deployment strategy  
**Timeline:** ⚡ 15 minutes to set up  
**Result:** 🎯 Full control over when each environment deploys

**Recommendation:** Implement branch strategy BEFORE Monday demo to avoid accidental production deployments during testing.

---

*Last Updated: March 6, 2026*  
*Next Review: After implementing branch strategy*
