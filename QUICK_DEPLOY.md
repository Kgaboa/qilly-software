# ⚡ Quick Deploy Guide - Figma Make to Dev Branch

## 🚀 5-Minute Deployment

### Step 1: Commit & Push (2 minutes)
```bash
# Check what changed
git status

# Add all changes
git add .

# Commit
git commit -m "feat: Partner Portal integration"

# Push to dev branch
git push origin dev
```

### Step 2: Automatic Deployment (3 minutes)
If you have Vercel/Netlify connected, deployment is **automatic**!

- **Vercel**: Check https://vercel.com/dashboard
- **Netlify**: Check https://app.netlify.com

Your dev branch will deploy to:
- Vercel: `qilly-git-dev.vercel.app`
- Netlify: `dev--qilly.netlify.app`

---

## 🔧 First-Time Setup (One-Time Only)

### Option A: Vercel (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Click**: "Add New Project"
3. **Import**: Your Git repository
4. **Framework**: Select "Vite"
5. **Build Settings**: (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Environment Variables**: Add these
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ENVIRONMENT=development
   ```
7. **Deploy**: Click "Deploy"

**Done!** Every push to `dev` branch auto-deploys.

---

### Option B: Netlify

1. **Go to Netlify**: https://app.netlify.com
2. **Click**: "Add new site" → "Import an existing project"
3. **Connect**: GitHub/GitLab/Bitbucket
4. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Environment Variables**: Same as Vercel
6. **Deploy**: Click "Deploy site"

**Done!** Every push auto-deploys.

---

## ✅ Verify Deployment

1. **Check Deployment URL** (sent via email or in dashboard)
2. **Test These:**
   - [ ] App loads
   - [ ] Login works
   - [ ] Partner Portal visible (Admin → Partners tab)
   - [ ] Export buttons work
   - [ ] Database connection active

---

## 🆘 Quick Troubleshooting

### Build Fails?
```bash
# Test build locally first
npm run build

# If it works, check deployment logs in Vercel/Netlify dashboard
```

### Environment Variables Not Working?
```bash
# 1. Check they start with VITE_
# 2. Add them in Vercel/Netlify dashboard
# 3. Redeploy:
git commit --allow-empty -m "Redeploy"
git push origin dev
```

### Database Not Connecting?
1. Check Supabase URL in environment variables
2. Verify API key is the `anon` key (not service_role)
3. Check CORS settings in Supabase dashboard

---

## 📋 Today's Deployment (What You Just Built)

### Files Changed:
- ✅ `/src/app/components/PartnerPortal.tsx` (NEW)
- ✅ `/src/app/components/AdminDashboard.tsx` (UPDATED)
- ✅ `/src/app/components/MainDashboard.tsx` (UPDATED)
- ✅ `/src/utils/exportHelpers.ts` (NEW)
- ✅ `/src/app/components/PerformanceStressTest.tsx` (UPDATED)
- ✅ `/src/app/components/UIAutomationTester.tsx` (UPDATED)

### What to Test After Deploy:
1. Admin Dashboard → **Partners** tab (should show with NEW badge)
2. Partner Portal → All 5 tabs functional
3. MainDashboard → Tier upgrade buttons visible
4. Admin → Dev Tools → Export dropdowns (JSON/HTML/Excel)

---

## 🎯 Next Steps

### For Tuesday Demo:
1. ✅ Deploy to dev (you're doing this now)
2. ✅ Test all features on dev URL
3. ✅ Merge to main for production
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```
4. ✅ Production auto-deploys to `qilly.co.za`

---

## 💡 Pro Tips

### Auto-Deploy on Every Push:
```bash
# Just push to dev branch
git push origin dev

# Vercel/Netlify automatically:
# 1. Detects the push
# 2. Builds the project
# 3. Deploys to dev URL
# 4. Sends you notification
```

### Check Deployment Status:
- **Vercel**: https://vercel.com/dashboard → Click project → "Deployments"
- **Netlify**: https://app.netlify.com → Click site → "Deploys"

### View Live Logs:
```bash
# Vercel CLI
npm i -g vercel
vercel logs

# Netlify CLI
npm i -g netlify-cli
netlify logs
```

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Netlify Dashboard**: https://app.netlify.com
- **Supabase Dashboard**: https://app.supabase.com
- **Full Deployment Guide**: See `/DEPLOYMENT_GUIDE_DEV_BRANCH.md`

---

**That's it! Just push and wait ~3 minutes for automatic deployment! 🚀**
