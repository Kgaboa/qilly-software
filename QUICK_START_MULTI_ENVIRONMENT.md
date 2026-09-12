# 🚀 Quick Start: Multi-Environment Setup

**Time to complete:** 30-60 minutes  
**Cost:** R0-R60/month (completely free!)

---

## ✅ Prerequisites Checklist

Before starting, ensure you have:

- [ ] **GitHub account** (free) - [Sign up](https://github.com/signup)
- [ ] **Vercel account** (free) - [Sign up](https://vercel.com/signup)
- [ ] **Supabase account** (free) - [Sign up](https://app.supabase.com)
- [ ] **Git installed** on your computer
- [ ] **Node.js v18+** installed
- [ ] **npm** installed

---

## 🎯 Step 1: Run Setup Script (5 minutes)

```bash
# Make script executable
chmod +x scripts/setup-environments.sh

# Run setup
./scripts/setup-environments.sh
```

**What this does:**
- ✅ Installs dependencies
- ✅ Creates Git branches (develop, sit, staging, main)
- ✅ Creates environment files (.env.development, .env.sit, etc.)
- ✅ Generates security secrets

---

## 🗄️ Step 2: Create Supabase Projects (15 minutes)

### Create Development Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name:** `qilly-dev`
   - **Database Password:** Generate and save securely
   - **Region:** Europe (Frankfurt)
   - **Pricing Plan:** Free
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

6. Copy credentials:
   - Go to **Settings** → **API**
   - Copy **Project URL**: `https://xxxdev.supabase.co`
   - Copy **Anon/Public Key**: `eyJhbGc...`

7. Update `.env.development`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxdev.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-dev-key
   ```

### Repeat for SIT

- Name: `qilly-sit`
- Update `.env.sit` with credentials

### Repeat for Staging

- Name: `qilly-staging`
- Update `.env.staging` with credentials

### Repeat for Production

- Name: `qilly-production`
- Update `.env.production` with credentials

**✅ You should now have 4 Supabase projects!**

---

## 🌿 Step 3: Push Branches to GitHub (5 minutes)

```bash
# Ensure you're on main branch
git checkout main
git add .
git commit -m "feat: multi-environment setup"

# Push all branches
git push -u origin main
git push -u origin staging
git push -u origin sit
git push -u origin develop
```

---

## ☁️ Step 4: Deploy to Vercel (10 minutes)

### 4.1 Import Repository

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. **Framework:** Vite (auto-detected)
5. **Root Directory:** `./`
6. Click **"Deploy"** (will fail - that's OK!)

### 4.2 Configure Environment Variables

Go to **Settings** → **Environment Variables**

**For Development (develop branch):**

Add 4 variables:
1. `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your dev project URL
   - Environment: ☑️ Preview → Select `develop` branch
   
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your dev anon key
   - Environment: ☑️ Preview → Select `develop` branch
   
3. `NEXT_PUBLIC_ENVIRONMENT`
   - Value: `development`
   - Environment: ☑️ Preview → Select `develop` branch
   
4. `CRON_SECRET`
   - Value: Copy from `.env.development`
   - Environment: ☑️ Preview → Select `develop` branch

**Repeat for SIT (sit branch):**
- Use SIT credentials
- Set `NEXT_PUBLIC_ENVIRONMENT=sit`
- Select `sit` branch

**Repeat for Staging (staging branch):**
- Use Staging credentials
- Set `NEXT_PUBLIC_ENVIRONMENT=staging`
- Select `staging` branch

**For Production (main branch):**
- Use Production credentials
- Set `NEXT_PUBLIC_ENVIRONMENT=production`
- Environment: ☑️ Production

### 4.3 Redeploy

1. Go to **Deployments**
2. Click **"..."** on latest deployment → **Redeploy**
3. Wait 2-3 minutes

**✅ All environments now deployed!**

---

## 🧪 Step 5: Test Each Environment (5 minutes)

### Test Development
```bash
npm run dev
# Open http://localhost:3000
# Check environment badge shows "Development"
```

### Test SIT
```bash
# Visit your SIT URL
https://qilly-git-sit-yourproject.vercel.app

# Check /api/health endpoint
https://qilly-git-sit-yourproject.vercel.app/api/health

# Should show:
{
  "status": "healthy",
  "environment": "sit",
  "checks": { ... }
}
```

### Test Staging
```bash
https://qilly-git-staging-yourproject.vercel.app/api/health
# Should show environment: "staging"
```

### Test Production
```bash
https://qilly-yourproject.vercel.app/api/health
# Should show environment: "production"
```

---

## 🎯 Step 6: Set Up Health Monitoring (Optional - 5 minutes)

### Option A: Vercel Cron (Already Configured!)

Your `vercel.json` already has:
```json
{
  "crons": [{
    "path": "/api/cron/keep-alive",
    "schedule": "0 */6 * * *"
  }]
}
```

This runs every 6 hours automatically on Vercel Pro tier (or manually trigger).

### Option B: UptimeRobot (Free External Monitor)

1. Go to [https://uptimerobot.com](https://uptimerobot.com) (free)
2. Create account
3. Add 3 monitors:

**SIT Monitor:**
- Monitor Type: HTTP(s)
- URL: `https://qilly-git-sit-yourproject.vercel.app/api/health`
- Interval: 5 minutes

**Staging Monitor:**
- URL: `https://qilly-git-staging-yourproject.vercel.app/api/health`
- Interval: 5 minutes

**Production Monitor:**
- URL: `https://qilly-yourproject.vercel.app/api/health`
- Interval: 5 minutes

**Result:** Databases never pause! ✅

---

## 🎉 Complete! Your Environment URLs

| Environment | Git Branch | URL | Database |
|-------------|------------|-----|----------|
| Development | `develop` | `http://localhost:3000` | qilly-dev |
| SIT/UAT | `sit` | `qilly-git-sit.vercel.app` | qilly-sit |
| Staging | `staging` | `qilly-git-staging.vercel.app` | qilly-staging |
| Production | `main` | `qilly.vercel.app` | qilly-production |

---

## 🚀 Daily Workflow

### Developing New Feature

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Develop locally
npm run dev
# Make changes, test locally

# 4. Commit changes
git add .
git commit -m "feat: new feature description"
git push origin feature/new-feature

# 5. Create Pull Request on GitHub: feature/new-feature → develop
# After review, merge to develop
```

### Deploying to SIT

```bash
# After feature merged to develop
git checkout sit
git pull origin sit
git merge develop
git push origin sit

# Vercel automatically deploys to: qilly-git-sit.vercel.app
# QA team can now test
```

### Deploying to Staging

```bash
# After SIT testing passes
git checkout staging
git pull origin staging
git merge sit
git push origin staging

# Vercel automatically deploys to: qilly-git-staging.vercel.app
# Final validation with production-like data
```

### Deploying to Production

```bash
# After staging approval
git checkout main
git pull origin main
git merge staging
git push origin main

# Vercel automatically deploys to: qilly.vercel.app (or your custom domain)
# LIVE! 🎉
```

---

## 💰 Current Cost: R0/month!

| Environment | Supabase | Vercel | Total |
|-------------|----------|--------|-------|
| Development | Free | Local | R0 |
| SIT | Free | Free | R0 |
| Staging | Free | Free | R0 |
| Production | Free | Free | R0 |
| **TOTAL** | **R0** | **R0** | **R0** |

**Add custom domain:** +R60/month

---

## ⚠️ When to Upgrade

### Upgrade Production to Pro when:
- [ ] Database approaching 500MB
- [ ] >100 daily active users
- [ ] Revenue starts coming in
- [ ] Need uptime SLA

**Cost after upgrade:**
- Supabase Pro: R450/month
- Vercel Pro: R360/month
- **Total: R810/month**

---

## 🆘 Troubleshooting

### Issue: Environment variables not working

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Verify branch mapping (develop, sit, staging, main)
3. Redeploy after changes

### Issue: Database connection error

**Solution:**
1. Check Supabase project not paused (Settings → Restart)
2. Verify API keys are correct
3. Test with: `curl https://your-project.supabase.co/rest/v1/`

### Issue: Cron not running

**Solution:**
1. Vercel Cron requires Hobby/Pro tier
2. Use UptimeRobot as free alternative
3. Manually trigger: `curl -H "Authorization: Bearer YOUR_SECRET" https://your-app/api/cron/keep-alive`

### Issue: Deployment fails

**Solution:**
1. Check build logs in Vercel
2. Verify `vercel.json` is valid JSON
3. Ensure all dependencies in `package.json`

---

## 📚 Additional Resources

- **Full Setup Guide:** `/MULTI_ENVIRONMENT_SETUP.md`
- **Architecture Report:** `/Qilly_Hosting_Architecture_Report.md`
- **Presentation Slides:** `/PRESENTATION_SLIDES.md`
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs

---

## ✅ Success Checklist

- [ ] 4 Supabase projects created
- [ ] 4 Git branches created and pushed
- [ ] Vercel project connected
- [ ] Environment variables configured
- [ ] All 4 environments deployed successfully
- [ ] Health endpoints returning "healthy"
- [ ] UptimeRobot monitors set up (optional)
- [ ] Team has access to all environments

---

**🎉 Congratulations! You now have a professional multi-environment workflow!**

**Next:** Deploy your first feature to SIT and watch the magic happen! ✨

---

**Questions?** See `/MULTI_ENVIRONMENT_SETUP.md` for detailed troubleshooting.
