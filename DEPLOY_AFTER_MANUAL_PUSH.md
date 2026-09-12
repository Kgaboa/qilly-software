# 🚀 Deploy to Dev Branch After Manual Git Push

## Overview
Since you've **manually pushed** Figma Make changes to the **dev branch**, here's what happens next and how to complete your deployment.

---

## ✅ What You've Already Done

You mentioned you've **manually pushed to git dev branch**. This means you've already completed:

```bash
git add .
git commit -m "your commit message"
git push origin dev
```

✅ **Great!** Your code is now in the remote dev branch.

---

## 🎯 Next Steps: Automatic Deployment

### If You Have Vercel or Netlify Connected (Recommended):

**Good News:** Your deployment is **already happening automatically!** 🎉

#### Vercel (Recommended):
1. **Go to:** https://vercel.com/dashboard
2. **Click:** Your Qilly project
3. **View:** "Deployments" tab
4. **Look for:** A deployment triggered by your recent `dev` branch push
5. **Status:** Should show:
   - 🟡 **Building** (in progress)
   - 🟢 **Ready** (deployed successfully)
   - 🔴 **Error** (build failed - see troubleshooting below)

**Your dev URL will be:**
- `https://qilly-git-dev.vercel.app`
- Or custom domain: `https://dev.qilly.co.za`

**Wait Time:** ~2-3 minutes for build + deploy

---

#### Netlify:
1. **Go to:** https://app.netlify.com
2. **Click:** Your Qilly site
3. **View:** "Deploys" tab
4. **Look for:** A deployment from `dev` branch
5. **Status:** Shows build progress in real-time

**Your dev URL will be:**
- `https://dev--qilly.netlify.app`
- Or custom domain: `https://dev.qilly.co.za`

**Wait Time:** ~2-4 minutes for build + deploy

---

## 🔧 If You DON'T Have Vercel/Netlify Connected Yet

### Quick Setup (One-Time - 5 Minutes):

#### Option A: Vercel (Easiest for Vite + React)

**Step 1:** Go to https://vercel.com and sign up/login

**Step 2:** Click "Add New Project"

**Step 3:** Import your Git repository
- Connect to GitHub/GitLab/Bitbucket
- Select your Qilly repository
- Authorize Vercel

**Step 4:** Configure Project
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Step 5:** Add Environment Variables (IMPORTANT!)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ENVIRONMENT=development
VITE_SHOW_AI_UPLOAD=false
VITE_YOCO_PUBLIC_KEY=pk_test_your_test_key
VITE_PAYFAST_SANDBOX=true
```

**Step 6:** Deploy!
- Click "Deploy"
- Wait ~3 minutes
- Done! ✅

**Step 7:** Configure Branch Deployments
- Go to Project Settings → Git
- Set:
  - **Production Branch:** `main`
  - **Preview Branches:** All branches (including `dev`)

✅ **Now every push to `dev` auto-deploys!**

---

#### Option B: Netlify

**Step 1:** Go to https://app.netlify.com and sign up/login

**Step 2:** Click "Add new site" → "Import an existing project"

**Step 3:** Connect to Git
- Choose GitHub/GitLab/Bitbucket
- Select Qilly repository

**Step 4:** Build Settings
```
Base directory: (leave empty)
Build command: npm run build
Publish directory: dist
```

**Step 5:** Add Environment Variables
- Click "Show advanced"
- Add same variables as Vercel (above)

**Step 6:** Deploy
- Click "Deploy site"
- Wait ~3 minutes

**Step 7:** Enable Branch Deploys
- Go to Site Settings → Build & deploy → Continuous deployment
- Under "Branch deploys": Select "All"

✅ **Now every push to `dev` auto-deploys!**

---

## 🧪 Verify Your Deployment

### 1. Check Build Status

#### Vercel:
```bash
# Option 1: Check dashboard
# Visit: https://vercel.com/dashboard

# Option 2: Use CLI (if installed)
npm i -g vercel
vercel logs
```

#### Netlify:
```bash
# Option 1: Check dashboard
# Visit: https://app.netlify.com

# Option 2: Use CLI (if installed)
npm i -g netlify-cli
netlify logs
```

---

### 2. Test Your Deployed App

Once deployment shows "Ready" or "Published", visit your dev URL and test:

#### ✅ Authentication & Database:
- [ ] Login works
- [ ] Registration works
- [ ] Data loads from Supabase
- [ ] User session persists

#### ✅ New Partner Portal Features:
- [ ] Admin Dashboard → **Partners** tab visible
- [ ] Partners tab shows NEW badge
- [ ] All 5 Partner Portal tabs work:
  - Overview
  - Partner Onboarding
  - White-Label Config
  - API & Integration
  - Analytics & Revenue
- [ ] White-label live preview works
- [ ] API key generation works

#### ✅ Tier Upgrade Buttons:
- [ ] Visible under FREE tier badge
- [ ] Visible under PROFESSIONAL tier badge
- [ ] Not visible for ENTERPRISE tier

#### ✅ Export Functionality:
- [ ] Admin → Dev Tools → Performance Testing
- [ ] Export dropdown shows (JSON, HTML, Excel)
- [ ] Admin → Dev Tools → UI Automation
- [ ] Export dropdown shows (JSON, HTML, Excel)

---

### 3. Check Environment

Open browser console on your deployed dev site and run:

```javascript
// Should show "development" or "SIT"
console.log(import.meta.env.VITE_ENVIRONMENT);

// Should show your dev Supabase URL
console.log(import.meta.env.VITE_SUPABASE_URL);

// AI Upload should be hidden (false)
console.log(import.meta.env.VITE_SHOW_AI_UPLOAD);
```

---

## 🚨 Troubleshooting

### Issue 1: Build Failing

**Symptoms:** Deployment shows error/failed status

**Solution:**

1. **Test build locally first:**
```bash
npm install
npm run build
```

2. **If local build works:**
   - Check deployment logs in Vercel/Netlify dashboard
   - Look for missing environment variables
   - Check for case-sensitive import errors

3. **Common fixes:**
```bash
# Missing dependencies
npm install lucide-react xlsx file-saver

# Rebuild
npm run build
```

---

### Issue 2: Environment Variables Not Working

**Symptoms:** `undefined` errors, Supabase connection fails

**Solution:**

1. **Check variable names** - Must start with `VITE_`:
   - ✅ `VITE_SUPABASE_URL`
   - ❌ `SUPABASE_URL`

2. **Add in deployment platform:**
   - **Vercel:** Project Settings → Environment Variables → Add
   - **Netlify:** Site Settings → Build & deploy → Environment → Add

3. **Select correct environment:**
   - Set for "Preview" (for dev branch)
   - Set for "Production" (for main branch)

4. **Trigger redeploy:**
```bash
git commit --allow-empty -m "Trigger rebuild with env vars"
git push origin dev
```

---

### Issue 3: Deployment Not Triggering

**Symptoms:** No new deployment after pushing to dev

**Solution:**

1. **Check Git integration:**
   - Vercel: Project Settings → Git
   - Netlify: Site Settings → Build & deploy → Continuous deployment

2. **Verify branch settings:**
   - Ensure "All branches" or specifically "dev" is enabled for deploys

3. **Manual trigger:**
   - **Vercel:** Click "Deploy" → Select "dev" branch
   - **Netlify:** Click "Trigger deploy" → "Deploy site"

---

### Issue 4: Old Version Still Showing

**Symptoms:** Deployed site doesn't show new changes

**Solution:**

1. **Hard refresh browser:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear cache:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty cache and hard reload"

3. **Check deployment timestamp:**
   - Verify latest deployment is actually deployed
   - Check deployment logs for any errors

---

## 📊 Deployment Status Checklist

After pushing to dev branch:

- [ ] ✅ Code pushed to remote dev branch successfully
- [ ] ✅ Deployment platform detected the push
- [ ] ✅ Build started (check dashboard)
- [ ] ✅ Build completed successfully (no errors)
- [ ] ✅ Deployment published to dev URL
- [ ] ✅ Dev URL accessible in browser
- [ ] ✅ Environment variables configured correctly
- [ ] ✅ All new features working (Partner Portal, exports, etc.)
- [ ] ✅ No console errors in browser
- [ ] ✅ Database connection working (Supabase)
- [ ] ✅ Authentication functional

---

## 🎯 For Tuesday's eTender Demo

Once dev deployment is tested and working:

### Deploy to Production (Main Branch)

```bash
# Step 1: Switch to main branch
git checkout main

# Step 2: Pull latest changes (if any)
git pull origin main

# Step 3: Merge dev branch
git merge dev

# Step 4: Push to main
git push origin main
```

**Result:**
- Production deployment triggers automatically
- Available at: `https://qilly.co.za` or `https://qilly.vercel.app`
- Wait ~2-3 minutes for deployment

### Pre-Demo Checklist:

- [ ] ✅ Dev branch tested thoroughly
- [ ] ✅ All features working on dev environment
- [ ] ✅ No critical bugs or errors
- [ ] ✅ Performance acceptable (<3s load)
- [ ] ✅ Partner Portal fully functional
- [ ] ✅ Export reports generating correctly
- [ ] ✅ Tier upgrade flow working
- [ ] ✅ Admin dashboard accessible
- [ ] ✅ Database seeded with demo data
- [ ] ✅ Production environment variables set
- [ ] ✅ AI Upload feature hidden (VITE_SHOW_AI_UPLOAD=false)
- [ ] ✅ Backup of database taken
- [ ] ✅ Rollback plan ready (if needed)

---

## 🔄 Complete Workflow Summary

```
┌─────────────────────────────────────────┐
│  YOU ARE HERE ✅                         │
│  Manually pushed to dev branch          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  AUTOMATIC (Vercel/Netlify)             │
│  - Detects git push                     │
│  - Runs npm install                     │
│  - Runs npm run build                   │
│  - Deploys to dev URL                   │
│  (~2-3 minutes)                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  YOU: Test & Verify                     │
│  - Visit dev URL                        │
│  - Test Partner Portal                  │
│  - Test export functionality            │
│  - Verify tier upgrades                 │
│  - Check console for errors             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  PRODUCTION DEPLOY (Before Tuesday)     │
│  git checkout main                      │
│  git merge dev                          │
│  git push origin main                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  AUTOMATIC PRODUCTION DEPLOY            │
│  → https://qilly.co.za                  │
└─────────────────────────────────────────┘
```

---

## 💡 Pro Tips

### Tip 1: Monitor Deployments
Set up notifications:
- **Vercel:** Project Settings → Notifications → Enable email/Slack
- **Netlify:** Site Settings → Build hooks → Add webhook

### Tip 2: Preview Deployments
Every branch push creates a unique preview URL:
- `https://qilly-git-feature-xyz-yourname.vercel.app`
- Test features before merging to dev

### Tip 3: Use Deployment CLI
Install CLI for faster workflows:

```bash
# Vercel
npm i -g vercel
vercel login
vercel --prod  # Deploy to production
vercel logs    # View logs

# Netlify
npm i -g netlify-cli
netlify login
netlify deploy --prod  # Deploy to production
netlify logs           # View logs
```

### Tip 4: Environment-Specific Builds
Use `.env.development` and `.env.production` files:

```bash
# .env.development (for dev branch)
VITE_ENVIRONMENT=development
VITE_SHOW_AI_UPLOAD=false
VITE_SHOW_DEV_TOOLS=true

# .env.production (for main branch)
VITE_ENVIRONMENT=production
VITE_SHOW_AI_UPLOAD=false
VITE_SHOW_DEV_TOOLS=false
```

---

## 📞 Quick Reference

### URLs to Check:
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Netlify Dashboard:** https://app.netlify.com
- **Supabase Dashboard:** https://app.supabase.com
- **Your Dev Site:** `qilly-git-dev.vercel.app` or `dev--qilly.netlify.app`

### Commands to Remember:
```bash
# Check deployment status
vercel ls          # List deployments (Vercel)
netlify status     # Check status (Netlify)

# View logs
vercel logs        # Vercel
netlify logs       # Netlify

# Manual deploy
vercel             # Deploy preview (Vercel)
netlify deploy     # Deploy draft (Netlify)
```

### Documentation:
- `/DEPLOYMENT_GUIDE_DEV_BRANCH.md` - Complete deployment guide
- `/QUICK_DEPLOY.md` - Quick 5-minute guide
- `/PARTNER_PORTAL_INTEGRATION_COMPLETE.md` - Feature documentation

---

## ✅ What Happens Next?

**Immediately (0-3 minutes):**
1. ✅ Your code is in dev branch (you did this)
2. 🔄 Vercel/Netlify detects the push
3. 🔄 Build starts automatically
4. 🔄 Tests run (if configured)
5. 🔄 Build completes
6. 🔄 Deployment publishes to dev URL

**Within 5 minutes:**
7. ✅ Dev site is live and accessible
8. 🧪 You can test all features
9. ✅ Verify everything works
10. 🎯 Ready for Tuesday demo!

**Before Tuesday Demo:**
11. ✅ Merge dev → main
12. 🚀 Production deployment
13. 🎉 Demo on live production site!

---

## 🎉 Summary

### You've Already Done:
✅ Built Partner Portal & White-Label SaaS platform  
✅ Added export functionality (JSON, HTML, Excel)  
✅ Added tier upgrade buttons  
✅ Integrated Partners tab in Admin Dashboard  
✅ Manually pushed changes to dev branch  

### What's Happening Now:
🔄 Automatic deployment to dev environment  
🔄 Build process running  
🔄 Publishing to dev URL  

### What You Need to Do:
1. ⏰ Wait 2-3 minutes for deployment
2. 🌐 Visit your dev URL (check Vercel/Netlify dashboard)
3. 🧪 Test all features thoroughly
4. ✅ Verify Partner Portal works
5. 🚀 Merge to main before Tuesday

---

**🎯 You're all set! Your deployment is happening automatically right now. Check your Vercel or Netlify dashboard to see the progress! 🚀**

**For Tuesday's demo, once dev is tested, just merge to main and you're production-ready!** 🎉
