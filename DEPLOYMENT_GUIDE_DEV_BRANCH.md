# 🚀 Deployment Guide: Figma Make → Git Dev Branch → Production

## 📋 Table of Contents
1. [Git Workflow - Push to Dev Branch](#git-workflow)
2. [Deployment Platforms](#deployment-platforms)
3. [Environment Configuration](#environment-configuration)
4. [Verification & Testing](#verification-testing)
5. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Git Workflow - Push to Dev Branch

### Step 1: Commit Your Changes in Figma Make

Since you've made changes in Figma Make, you'll need to commit them:

```bash
# Check what files have changed
git status

# Add all changes
git add .

# Or add specific files
git add src/app/components/PartnerPortal.tsx
git add src/app/components/AdminDashboard.tsx
git add src/utils/exportHelpers.ts

# Commit with descriptive message
git commit -m "feat: Add Partner Portal & White-Label SaaS integration"

# Or more detailed commit
git commit -m "feat: Partner Portal integration

- Added PartnerPortal component with 5 tabs
- Integrated white-label configuration
- Added API & Integration hub
- Added tier upgrade buttons in MainDashboard
- Added export functionality (JSON, HTML, Excel)
- Updated AdminDashboard with Partners tab"
```

### Step 2: Push to Dev Branch

```bash
# Check current branch
git branch

# If not on dev branch, switch to it
git checkout dev

# If dev branch doesn't exist, create it
git checkout -b dev

# Push to remote dev branch
git push origin dev

# If this is the first push to dev branch
git push -u origin dev
```

### Step 3: Verify Push

```bash
# Check remote branches
git branch -r

# View commit history
git log --oneline -5

# Check if your changes are on remote
git remote show origin
```

---

## 2️⃣ Deployment Platforms

### Option A: **Vercel** (Recommended for React/Vite)

#### Automatic Deployment (Recommended)

1. **Connect Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Select the repository

2. **Configure Branch Deployments:**
   ```
   Production Branch: main (or master)
   Development Branch: dev
   ```

3. **Vercel will automatically:**
   - Deploy `main` branch to production: `qilly.vercel.app`
   - Deploy `dev` branch to preview: `qilly-dev.vercel.app` or `qilly-git-dev.vercel.app`

4. **Check Deployment:**
   - Go to Vercel Dashboard
   - Click on your project
   - See "Deployments" tab
   - Find your dev branch deployment

#### Manual Deployment via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy dev branch (creates preview deployment)
vercel --prod=false

# Deploy to production (from main branch)
vercel --prod

# Specify environment
vercel --env VITE_ENVIRONMENT=development
```

---

### Option B: **Netlify**

#### Automatic Deployment

1. **Connect Repository:**
   - Go to [netlify.com](https://netlify.com)
   - "Add new site" → "Import an existing project"
   - Connect to Git provider (GitHub, GitLab, Bitbucket)
   - Select repository

2. **Build Settings:**
   ```
   Base directory: /
   Build command: npm run build
   Publish directory: dist
   ```

3. **Branch Deployments:**
   ```
   Production branch: main
   Branch deploys: All (includes dev)
   ```

4. **Dev Branch URL:**
   - `dev--qilly.netlify.app`
   - Or custom: `dev.qilly.co.za`

#### Manual Deployment via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy draft (preview)
netlify deploy

# Deploy to production
netlify deploy --prod

# Deploy from specific folder
netlify deploy --dir=dist
```

---

### Option C: **Manual Deployment (Any Server)**

```bash
# 1. Build the project locally
npm run build

# 2. This creates a 'dist' folder with production files

# 3. Upload via FTP/SFTP to your server
# Using FileZilla, WinSCP, or command line:
scp -r dist/* user@yourserver.com:/var/www/html/dev/

# Or using rsync
rsync -avz dist/ user@yourserver.com:/var/www/html/dev/

# 4. SSH into server and restart web server (if needed)
ssh user@yourserver.com
sudo systemctl restart nginx
# or
sudo systemctl restart apache2
```

---

## 3️⃣ Environment Configuration

### A. Environment Variables Setup

Create different `.env` files for each environment:

#### `.env.development` (for dev branch)
```env
# Supabase Development
VITE_SUPABASE_URL=https://your-dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-dev-anon-key

# Environment
VITE_ENVIRONMENT=development
VITE_APP_URL=https://dev.qilly.co.za

# API Endpoints
VITE_API_URL=https://api-dev.qilly.co.za

# Feature Flags
VITE_SHOW_AI_UPLOAD=true
VITE_SHOW_DEV_TOOLS=true
VITE_SHOW_TESTING_TABS=true

# Payment Gateway (Test Mode)
VITE_YOCO_PUBLIC_KEY=pk_test_xxxxxxxxxx
VITE_PAYFAST_MERCHANT_ID=test_merchant_id
VITE_PAYFAST_SANDBOX=true
```

#### `.env.production` (for main branch)
```env
# Supabase Production
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key

# Environment
VITE_ENVIRONMENT=production
VITE_APP_URL=https://qilly.co.za

# API Endpoints
VITE_API_URL=https://api.qilly.co.za

# Feature Flags
VITE_SHOW_AI_UPLOAD=false
VITE_SHOW_DEV_TOOLS=false
VITE_SHOW_TESTING_TABS=false

# Payment Gateway (Live Mode)
VITE_YOCO_PUBLIC_KEY=pk_live_xxxxxxxxxx
VITE_PAYFAST_MERCHANT_ID=live_merchant_id
VITE_PAYFAST_SANDBOX=false
```

### B. Configure Environment in Deployment Platform

#### Vercel Environment Variables:
1. Go to Project Settings → Environment Variables
2. Add variables for each environment:
   - **Production**: Select "Production" branch
   - **Preview**: Select "Preview" (dev branch)
   - **Development**: Select "Development"

#### Netlify Environment Variables:
1. Go to Site Settings → Build & Deploy → Environment
2. Add variables
3. Click "Deploy contexts" to set per-branch variables

---

## 4️⃣ Verification & Testing

### After Deployment, Verify:

#### 1. Check Build Logs
```bash
# Vercel CLI
vercel logs

# Netlify CLI
netlify logs

# Or check in dashboard
```

#### 2. Test Key Features

Visit your dev deployment URL and check:

✅ **Authentication:**
- Login works
- Registration works
- Session persistence

✅ **Database Connection:**
- Supabase connection is live
- Data loads correctly
- CRUD operations work

✅ **New Features:**
- Partner Portal accessible (Admin → Partners tab)
- Export functionality works (JSON, HTML, Excel)
- Tier upgrade buttons visible
- White-label configuration saves

✅ **Environment Detection:**
```javascript
// Should show "Development" or "SIT"
console.log(getCurrentEnvironment());
```

#### 3. Check Environment Variables
```bash
# In browser console on dev deployment:
console.log(import.meta.env.VITE_ENVIRONMENT);
// Should output: "development"

console.log(import.meta.env.VITE_SUPABASE_URL);
// Should show dev Supabase URL
```

---

## 5️⃣ Complete Deployment Workflow

### Recommended Flow:

```
┌─────────────────────────────────────────────────────────┐
│  1. Figma Make Changes                                  │
│     - Build features in Figma Make IDE                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  2. Commit & Push to Dev Branch                         │
│     git add .                                           │
│     git commit -m "feat: description"                   │
│     git push origin dev                                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─���───────────────────────────────────────────────────────┐
│  3. Automatic Deployment (Vercel/Netlify)               │
│     - Triggered by git push                             │
│     - Builds project                                    │
│     - Deploys to dev URL                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  4. Test on Dev Environment                             │
│     - Visit dev.qilly.co.za                             │
│     - Test new features                                 │
│     - Verify database connection                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────���───────────────────────┐
│  5. Merge to Main (Production)                          │
│     git checkout main                                   │
│     git merge dev                                       │
│     git push origin main                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  6. Production Deployment                               │
│     - Automatic deployment to qilly.co.za               │
│     - Monitor for errors                                │
│     - Verify production environment                     │
└─────────────────────────────────────────────────────────┘
```

---

## 6️⃣ Troubleshooting

### Issue 1: Build Fails on Deployment

**Error:** `Module not found` or `Cannot find module`

**Solution:**
```bash
# Make sure all dependencies are in package.json
npm install

# Check for missing dependencies
npm run build

# If build works locally, check deployment logs
```

**Common causes:**
- Missing imports
- Wrong file paths (case sensitivity)
- Dependency not in package.json

---

### Issue 2: Environment Variables Not Working

**Error:** `undefined` when accessing `import.meta.env.VITE_*`

**Solution:**

1. **Check variable prefix:**
   - Must start with `VITE_` for Vite projects
   - Example: `VITE_SUPABASE_URL` ✅
   - Not: `SUPABASE_URL` ❌

2. **Restart dev server:**
   ```bash
   # After changing .env file
   npm run dev
   ```

3. **Check deployment platform:**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Build & Deploy → Environment

4. **Redeploy:**
   ```bash
   # Trigger new deployment after adding env vars
   git commit --allow-empty -m "Trigger rebuild"
   git push origin dev
   ```

---

### Issue 3: Database Connection Fails

**Error:** `Invalid API key` or `Connection refused`

**Solution:**

1. **Check Supabase project URL:**
   ```bash
   # Should match your Supabase project
   echo $VITE_SUPABASE_URL
   ```

2. **Verify API keys:**
   - Use `anon` key (not service_role)
   - Check Supabase dashboard → Settings → API

3. **Check CORS settings:**
   - Supabase → Settings → API → CORS
   - Add your deployment URL: `https://dev.qilly.co.za`

---

### Issue 4: Assets Not Loading

**Error:** 404 on images, fonts, or SVGs

**Solution:**

1. **Check public folder:**
   - Static assets should be in `/public`
   - Access via `/asset-name.png` (not `/public/asset-name.png`)

2. **Check import paths:**
   ```typescript
   // Correct
   import logo from '/logo.png';
   
   // Correct for assets
   import logo from '@/assets/logo.png';
   
   // Wrong
   import logo from 'public/logo.png';
   ```

3. **Verify build output:**
   ```bash
   npm run build
   ls dist/assets
   ```

---

## 7️⃣ Quick Commands Cheat Sheet

```bash
# === GIT COMMANDS ===
git status                          # Check changes
git add .                           # Stage all changes
git commit -m "message"             # Commit changes
git push origin dev                 # Push to dev branch
git checkout main                   # Switch to main
git merge dev                       # Merge dev into main

# === BUILD COMMANDS ===
npm install                         # Install dependencies
npm run build                       # Build for production
npm run preview                     # Preview production build
npm run dev                         # Start dev server

# === DEPLOYMENT COMMANDS ===
# Vercel
vercel                              # Deploy preview
vercel --prod                       # Deploy production

# Netlify
netlify deploy                      # Deploy draft
netlify deploy --prod               # Deploy production

# === TROUBLESHOOTING ===
npm run build                       # Test build locally
npm ls                              # List installed packages
git log --oneline -10               # View recent commits
git remote -v                       # Check remote URLs
```

---

## 8️⃣ Deployment Checklist

Before deploying to production (`main` branch):

- [ ] ✅ All features tested on dev branch
- [ ] ✅ No console errors in browser
- [ ] ✅ Database connections working
- [ ] ✅ Authentication functional
- [ ] ✅ Environment variables configured
- [ ] ✅ Build succeeds locally (`npm run build`)
- [ ] ✅ Payment integrations tested (sandbox mode)
- [ ] ✅ Export functionality verified
- [ ] ✅ Mobile responsiveness checked
- [ ] ✅ Performance acceptable (<3s load time)
- [ ] ✅ SEO meta tags present
- [ ] ✅ Error tracking configured (Sentry, etc.)
- [ ] ✅ Backup database created
- [ ] ✅ Rollback plan ready

---

## 9️⃣ Monitoring After Deployment

### Check These Metrics:

1. **Deployment Status:**
   - Vercel Dashboard → Deployments
   - Netlify Dashboard → Deploys

2. **Error Tracking:**
   - Browser console errors
   - Network tab for failed requests
   - Supabase logs

3. **Performance:**
   - Page load time
   - Time to Interactive (TTI)
   - Lighthouse score

4. **User Analytics:**
   - Google Analytics
   - Vercel Analytics
   - Supabase Analytics

---

## 🔟 Recommended Setup for Qilly

### Branch Strategy:
```
main (production)     → https://qilly.co.za
  ↑
  │ merge after testing
  │
dev (development)     → https://dev.qilly.co.za
  ↑
  │ feature branches merge here
  │
feature/partner-portal
feature/export-functionality
feature/tier-upgrades
```

### Deployment URLs:
- **Production**: `https://qilly.co.za` (from `main` branch)
- **Development**: `https://dev.qilly.co.za` (from `dev` branch)
- **Preview**: `https://qilly-git-feature-xyz.vercel.app` (from feature branches)

### Recommended Tools:
- **Hosting**: Vercel (best for React/Vite)
- **Database**: Supabase (already using)
- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics + Google Analytics
- **Monitoring**: Vercel Logs + Supabase Logs

---

## 📞 Need Help?

### Common Resources:
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html
- **Supabase Docs**: https://supabase.com/docs

### For Qilly-Specific Issues:
- Check `/PARTNER_PORTAL_INTEGRATION_COMPLETE.md`
- Review environment settings in `/src/utils/environment.ts`
- Check Supabase configuration in `/src/utils/supabase.ts`

---

**🎉 You're all set! Push to dev, test, then merge to main for production! 🚀**
