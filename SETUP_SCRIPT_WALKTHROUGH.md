# 🚀 Setup Script Walkthrough - Step by Step

**Script:** `scripts/setup-environments.sh`  
**Time:** 5-10 minutes  
**Difficulty:** Easy

---

## 📋 Pre-Flight Checklist

Before running the script, ensure you have:

- [ ] **Terminal/Command Line** access
- [ ] **Git** installed (`git --version`)
- [ ] **Node.js** v18+ installed (`node --version`)
- [ ] **npm** installed (`npm --version`)
- [ ] **Project cloned** or opened in terminal

---

## 🎯 Step 1: Navigate to Project Directory

```bash
# If you're not already in the project directory
cd /path/to/qilly

# Verify you're in the right place (should show package.json, src/, etc.)
ls -la
```

**Expected output:**
```
drwxr-xr-x  node_modules/
drwxr-xr-x  src/
drwxr-xr-x  scripts/
-rw-r--r--  package.json
-rw-r--r--  vercel.json
... (other files)
```

---

## 🎯 Step 2: Make Script Executable

```bash
# Give execute permission to the setup script
chmod +x scripts/setup-environments.sh

# Verify it's executable (should show -rwxr-xr-x)
ls -la scripts/setup-environments.sh
```

**Expected output:**
```
-rwxr-xr-x  1 youruser  staff  7892 Feb 24 10:30 scripts/setup-environments.sh
```

The `x` means it's now executable ✅

---

## 🎯 Step 3: Run the Setup Script

```bash
# Execute the script
./scripts/setup-environments.sh
```

**Alternative if above doesn't work:**
```bash
bash scripts/setup-environments.sh
```

---

## 📺 What Happens Next (Live Walkthrough)

### Phase 1: Welcome Screen

```
🚀 Qilly Multi-Environment Setup
==================================

ℹ️  Checking prerequisites...
```

**What it's doing:**
- Checking if Node.js is installed
- Checking if npm is installed
- Checking if Git is installed

**Possible outputs:**

✅ **Success:**
```
✅ All prerequisites installed
```

❌ **Error (if something missing):**
```
❌ Node.js is not installed. Please install Node.js v18+ first.
```
**Fix:** Install the missing tool, then re-run script

---

### Phase 2: Installing Dependencies

```
ℹ️  Installing npm dependencies...
```

**What it's doing:**
- Running `npm install`
- Installing all packages from package.json

**This may take 1-3 minutes** depending on your internet speed.

**Progress indicators:**
```
npm WARN deprecated ...
added 450 packages in 45s
```

✅ **Success:**
```
✅ Dependencies installed
```

---

### Phase 3: Setting Up Git Branches

```
ℹ️  Setting up Git branches...
```

**What it's doing:**
1. Checking if you're in a Git repository
2. If not, initializing Git
3. Creating branches: `develop`, `sit`, `staging`

**Possible scenarios:**

**Scenario A: Fresh Git Repository**
```
⚠️  Not a git repository. Initializing...
✅ Git repository initialized
✅ Created branch: develop
✅ Created branch: sit
✅ Created branch: staging
✅ Git branches configured
```

**Scenario B: Existing Git Repository**
```
ℹ️  Branch 'develop' already exists
ℹ️  Branch 'sit' already exists
ℹ️  Branch 'staging' already exists
✅ Git branches configured
```

---

### Phase 4: Creating Environment Files

```
ℹ️  Creating environment configuration files...
```

**What it's doing:**
- Creating `.env.development`
- Creating `.env.sit`
- Creating `.env.staging`
- Creating `.env.production`
- Generating unique `CRON_SECRET` for each

**Output:**
```
✅ Created .env.development
✅ Created .env.sit
✅ Created .env.staging
✅ Created .env.production
```

**If files already exist:**
```
ℹ️  .env.development already exists (skipping)
ℹ️  .env.sit already exists (skipping)
```

**Note:** Script won't overwrite existing files to protect your credentials!

---

### Phase 5: Next Steps Display

```
==========================================
✅ Multi-Environment Setup Complete!
==========================================

📋 Next Steps:

1. Create Supabase Projects:
   → Go to https://app.supabase.com
   → Create 4 projects: qilly-dev, qilly-sit, qilly-staging, qilly-production
   → Region: Europe (Frankfurt) - closest to SA

2. Update Environment Files:
   → Edit .env.development with dev Supabase credentials
   → Edit .env.sit with SIT Supabase credentials
   → Edit .env.staging with staging Supabase credentials
   → Edit .env.production with production Supabase credentials

3. Push Branches to GitHub:
   → git push -u origin main
   → git push -u origin staging
   → git push -u origin sit
   → git push -u origin develop

4. Connect to Vercel:
   → Go to https://vercel.com
   → Import your GitHub repository
   → Configure environment variables (see MULTI_ENVIRONMENT_SETUP.md)

5. Test Deployment:
   → npm run dev (local development)
   → Push to 'sit' branch → auto-deploys to SIT
   → Push to 'staging' branch → auto-deploys to Staging
   → Push to 'main' branch → auto-deploys to Production

📚 Documentation:
   → Full guide: /MULTI_ENVIRONMENT_SETUP.md
   → Architecture report: /Qilly_Hosting_Architecture_Report.md

🎯 Cost:
   → Development: R0/month (local)
   → SIT: R0/month (free tier + health checks)
   → Staging: R0/month (free tier initially)
   → Production: R0-R1,800/month (upgrade when ready)

✅ Ready to deploy!
```

---

## 🎯 Step 4: Verify What Was Created

```bash
# Check Git branches
git branch

# Check environment files
ls -la .env.*

# Check file contents (example)
cat .env.development
```

**Expected Git branches:**
```
* main
  develop
  sit
  staging
```

**Expected environment files:**
```
-rw-r--r--  .env.development
-rw-r--r--  .env.example
-rw-r--r--  .env.production
-rw-r--r--  .env.sit
-rw-r--r--  .env.staging
```

**Example .env.development content:**
```bash
# Development Environment Configuration
NEXT_PUBLIC_ENVIRONMENT=development

# TODO: Replace with your Supabase development project credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key

# Cron Secret (Generated)
CRON_SECRET=a8f3j2k9d8s7f6g5h4j3k2l1m0n9b8v7

# Development settings
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true
NEXT_PUBLIC_APP_VERSION=1.0.0-dev
```

---

## 🎯 Step 5: Create Supabase Projects (15 minutes)

Now you need to create 4 Supabase projects and update the environment files.

### Create First Project (Development)

1. **Go to:** https://app.supabase.com
2. **Click:** "New Project"
3. **Fill in:**
   - **Name:** `qilly-dev`
   - **Database Password:** Click "Generate password" → **SAVE IT SECURELY!**
   - **Region:** Europe (Frankfurt)
   - **Pricing Plan:** Free
4. **Click:** "Create new project"
5. **Wait:** 2-3 minutes for setup

### Get Credentials

1. **Go to:** Settings → API (left sidebar)
2. **Copy these values:**

```
Project URL: https://abcdefghijk.supabase.co
Anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Update .env.development

```bash
# Open the file in your editor
code .env.development
# or
nano .env.development
# or
vim .env.development
```

**Replace these lines:**
```bash
# BEFORE:
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key

# AFTER (with your actual credentials):
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Save the file** (Ctrl+S or :wq in vim)

### Repeat for SIT, Staging, Production

**Create 3 more projects:**
- `qilly-sit` → Update `.env.sit`
- `qilly-staging` → Update `.env.staging`
- `qilly-production` → Update `.env.production`

**💡 Tip:** Open all 4 environment files side-by-side to fill them efficiently!

---

## 🎯 Step 6: Test Local Development (2 minutes)

```bash
# Start local development server
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in 450 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Open browser:** http://localhost:3000

**Verify:**
- [ ] App loads successfully
- [ ] Environment badge shows "Development"
- [ ] No console errors
- [ ] Can interact with UI

**Test health endpoint:**
```bash
# In another terminal
curl http://localhost:3000/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "environment": "development",
  "timestamp": "2025-02-24T10:30:00.000Z",
  "checks": {
    "database": { "status": "healthy", "duration": "45ms" },
    "auth": { "status": "healthy", "duration": "23ms" },
    "configuration": { "status": "healthy" }
  }
}
```

✅ **Local development working!**

---

## 🎯 Step 7: Push to GitHub (5 minutes)

### First Time Setup

If you haven't connected to GitHub yet:

```bash
# Initialize Git (if not already done)
git init

# Add remote (replace with your GitHub URL)
git remote add origin https://github.com/your-username/qilly.git

# Verify remote
git remote -v
```

### Push All Branches

```bash
# Make sure you're on main branch
git checkout main

# Stage all files
git add .

# Commit
git commit -m "feat: multi-environment setup complete"

# Push main branch
git push -u origin main

# Push other branches
git push -u origin develop
git push -u origin sit
git push -u origin staging
```

**Expected output:**
```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Delta compression using up to 8 threads
Compressing objects: 100% (120/120), done.
Writing objects: 100% (150/150), 45.23 KiB | 2.26 MiB/s, done.
Total 150 (delta 85), reused 0 (delta 0), pack-reused 0
To github.com:your-username/qilly.git
 * [new branch]      main -> main
 * [new branch]      develop -> develop
 * [new branch]      sit -> sit
 * [new branch]      staging -> staging
```

✅ **All branches on GitHub!**

---

## 🎯 Step 8: Connect to Vercel (10 minutes)

### Import Repository

1. **Go to:** https://vercel.com
2. **Click:** "Add New..." → "Project"
3. **Import:** Your GitHub repository
4. **Framework:** Vite (auto-detected)
5. **Root Directory:** `./` (leave default)
6. **Build Command:** `npm run build` (auto-detected)
7. **Output Directory:** `dist` (auto-detected)
8. **DON'T DEPLOY YET!** Click "Environment Variables" first

### Configure Environment Variables

**For Each Environment:**

#### Development (Preview - develop branch)

1. Click "Add Environment Variable"
2. Add 4 variables:

**Variable 1:**
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: Copy from `.env.development`
- Environment: ☑️ Preview → Select `develop` branch

**Variable 2:**
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: Copy from `.env.development`
- Environment: ☑️ Preview → Select `develop` branch

**Variable 3:**
- Key: `NEXT_PUBLIC_ENVIRONMENT`
- Value: `development`
- Environment: ☑️ Preview → Select `develop` branch

**Variable 4:**
- Key: `CRON_SECRET`
- Value: Copy from `.env.development`
- Environment: ☑️ Preview → Select `develop` branch

#### SIT (Preview - sit branch)

Repeat above but:
- Use credentials from `.env.sit`
- Set `NEXT_PUBLIC_ENVIRONMENT=sit`
- Select `sit` branch

#### Staging (Preview - staging branch)

Repeat but:
- Use credentials from `.env.staging`
- Set `NEXT_PUBLIC_ENVIRONMENT=staging`
- Select `staging` branch

#### Production (Production - main branch)

Repeat but:
- Use credentials from `.env.production`
- Set `NEXT_PUBLIC_ENVIRONMENT=production`
- Environment: ☑️ Production (not Preview!)

### Deploy!

**After all environment variables are set:**

1. Click "Deploy"
2. Wait 2-3 minutes
3. You should see: "🎉 Congratulations!"

---

## 🎯 Step 9: Test All Environments (5 minutes)

### Get Your URLs

After deployment, Vercel gives you:

```
Production: https://qilly-yourproject.vercel.app
```

For preview branches, push to trigger deployment:

```bash
# Deploy to SIT
git checkout sit
git merge develop
git push origin sit
# Wait 2 minutes → Check Vercel dashboard for URL
```

### Test Health Endpoints

```bash
# SIT
curl https://qilly-git-sit-yourproject.vercel.app/api/health

# Staging
curl https://qilly-git-staging-yourproject.vercel.app/api/health

# Production
curl https://qilly-yourproject.vercel.app/api/health
```

**Each should return:**
```json
{
  "status": "healthy",
  "environment": "sit" (or staging/production),
  "checks": { ... }
}
```

✅ **All environments deployed!**

---

## 🎊 Congratulations! Setup Complete!

### ✅ What You've Accomplished:

- [x] Installed all dependencies
- [x] Created Git branch structure
- [x] Generated environment files
- [x] Created 4 Supabase projects
- [x] Configured credentials
- [x] Pushed to GitHub
- [x] Deployed to Vercel
- [x] Verified all environments work

### 📊 Your Environment URLs:

| Environment | URL | Status |
|-------------|-----|--------|
| Development | `localhost:3000` | ✅ Local |
| SIT | `qilly-git-sit-*.vercel.app` | ✅ Deployed |
| Staging | `qilly-git-staging-*.vercel.app` | ✅ Deployed |
| Production | `qilly-*.vercel.app` | ✅ Deployed |

### 💰 Current Cost:

**R0/month** - Everything on free tier!

---

## 🚀 What's Next?

### Daily Development Workflow

```bash
# 1. Create feature
git checkout develop
git checkout -b feature/my-feature

# 2. Code locally
npm run dev

# 3. Push when ready
git add .
git commit -m "feat: description"
git push origin feature/my-feature

# 4. Create PR on GitHub: feature → develop
# 5. After merge, deploy to SIT for testing
git checkout sit
git merge develop
git push origin sit
```

### When to Upgrade to Pro

**Upgrade when:**
- Database approaching 500MB
- >100 daily users
- Need uptime SLA for DoHS demo

**Cost:** R1,800/month

**How to upgrade:**
1. Supabase: Settings → Billing → Upgrade to Pro
2. Vercel: Account → Billing → Upgrade to Pro

---

## 🆘 Troubleshooting

### Issue: Script permission denied

**Error:**
```
bash: ./scripts/setup-environments.sh: Permission denied
```

**Fix:**
```bash
chmod +x scripts/setup-environments.sh
./scripts/setup-environments.sh
```

---

### Issue: Git not found

**Error:**
```
❌ Git is not installed. Please install Git first.
```

**Fix:**
```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt-get install git

# Windows
# Download from: https://git-scm.com/download/win
```

---

### Issue: Node.js version too old

**Error:**
```
❌ Node.js version must be 18 or higher
```

**Fix:**
```bash
# macOS
brew install node@18

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm
nvm install 18
nvm use 18
```

---

### Issue: Environment variables not working

**Symptom:** App loads but shows "Configuration error"

**Fix:**
1. Check Vercel → Settings → Environment Variables
2. Verify all 4 variables exist for each branch
3. Redeploy: Deployments → "..." → Redeploy

---

### Issue: Health check fails

**Error:**
```json
{
  "status": "unhealthy",
  "checks": {
    "database": { "status": "unhealthy", "error": "connection refused" }
  }
}
```

**Fix:**
1. Go to Supabase → Your project
2. Check if paused: Settings → Restart project
3. Verify credentials in environment file
4. Test connection: https://your-project.supabase.co/rest/v1/

---

## 📞 Need Help?

**Documentation:**
- Quick Start: `/QUICK_START_MULTI_ENVIRONMENT.md`
- Full Guide: `/MULTI_ENVIRONMENT_SETUP.md`
- Troubleshooting: `/MULTI_ENVIRONMENT_SETUP.md` Section 10

**Community:**
- Vercel Discord: discord.gg/vercel
- Supabase Discord: discord.supabase.com

**Qilly Team:**
- Technical Lead: [Your contact]
- Email: [Your email]

---

## ✅ Final Checklist

- [ ] Script ran successfully
- [ ] 4 Supabase projects created
- [ ] All environment files updated
- [ ] All branches pushed to GitHub
- [ ] Vercel connected
- [ ] Environment variables configured
- [ ] All deployments successful
- [ ] Health endpoints returning "healthy"
- [ ] Local development working

**All done? You're ready to build!** 🎉

---

**Next:** Start developing features and deploying to SIT for testing!
