# Qilly Multi-Environment Implementation Checklist

**Complete task list for setting up free multi-environment workflow**

**Estimated Time:** 4-6 hours  
**Cost:** R0-R60/month (free tier)

---

## 📋 Pre-Implementation Checklist

### Account Creation
- [ ] GitHub account created and verified
- [ ] Vercel account created (linked to GitHub)
- [ ] Supabase account created
- [ ] Domain registered (optional, R60/month)
- [ ] UptimeRobot account created (optional, free tier)

### Tools Installed
- [ ] Git installed and configured
- [ ] Node.js v18+ installed
- [ ] npm or pnpm installed
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Code editor (VS Code recommended)

### Repository Access
- [ ] Qilly repository cloned locally
- [ ] Dependencies installed (`npm install`)
- [ ] Local development server running (`npm run dev`)
- [ ] Can access localhost:3000 successfully

---

## 🗄️ Phase 1: Supabase Projects Setup

**Estimated Time:** 60 minutes

### Development Project
- [ ] Create new Supabase project: `qilly-dev`
- [ ] Region: Europe (Frankfurt)
- [ ] Tier: Free
- [ ] Database password saved securely
- [ ] Project URL copied: `https://xxxdev.supabase.co`
- [ ] Anon key copied and saved
- [ ] Service role key saved (keep secret!)

### SIT Project
- [ ] Create new Supabase project: `qilly-sit`
- [ ] Region: Europe (Frankfurt)
- [ ] Tier: Free
- [ ] Database password saved securely
- [ ] Project URL copied: `https://xxxsit.supabase.co`
- [ ] Anon key copied and saved
- [ ] Service role key saved

### Staging Project
- [ ] Create new Supabase project: `qilly-staging`
- [ ] Region: Europe (Frankfurt)
- [ ] Tier: Free (or Pro if budget approved)
- [ ] Database password saved securely
- [ ] Project URL copied: `https://xxxstaging.supabase.co`
- [ ] Anon key copied and saved
- [ ] Service role key saved

### Production Project
- [ ] Create new Supabase project: `qilly-production`
- [ ] Region: Europe (Frankfurt)
- [ ] Tier: Free initially (upgrade to Pro before launch)
- [ ] Database password saved securely
- [ ] Project URL copied: `https://xxxprod.supabase.co`
- [ ] Anon key copied and saved
- [ ] Service role key saved

### Verify All Projects
- [ ] 4 Supabase projects visible in dashboard
- [ ] All project URLs unique and saved
- [ ] All anon keys unique and saved
- [ ] Can access each project's dashboard

---

## 🌿 Phase 2: Git Branch Setup

**Estimated Time:** 15 minutes

### Create Branch Structure
```bash
# From main branch
git checkout main
git pull origin main

# Create and push staging branch
git checkout -b staging
git push -u origin staging

# Create and push sit branch
git checkout -b sit
git push -u origin sit

# Create and push develop branch
git checkout -b develop
git push -u origin develop

# Return to main
git checkout main
```

### Verify Branches
- [ ] `main` branch exists
- [ ] `staging` branch exists
- [ ] `sit` branch exists
- [ ] `develop` branch exists
- [ ] All branches visible on GitHub
- [ ] All branches at same commit (initially)

### Set Up Branch Protection (GitHub)
- [ ] Go to Settings → Branches
- [ ] Add rule for `main`: Require pull request
- [ ] Add rule for `staging`: Require pull request
- [ ] Add rule for `sit`: Require pull request (optional)
- [ ] Save rules

---

## 🔐 Phase 3: Environment Variables

**Estimated Time:** 30 minutes

### Generate CRON Secrets
```bash
# Generate 4 unique secrets (one per environment)
openssl rand -base64 32  # For development
openssl rand -base64 32  # For SIT
openssl rand -base64 32  # For staging
openssl rand -base64 32  # For production
```

- [ ] 4 unique CRON secrets generated
- [ ] Secrets saved in password manager
- [ ] Each secret labeled by environment

### Create Local Environment Files
- [ ] Copy `.env.example` to `.env.development`
- [ ] Fill in development Supabase URL and key
- [ ] Set `NEXT_PUBLIC_ENVIRONMENT=development`
- [ ] Add development CRON_SECRET
- [ ] Verify `.env.*` files in `.gitignore`

### Configure Vercel Environment Variables

#### For Development Branch
- [ ] Go to Vercel → Project → Settings → Environment Variables
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` (dev URL)
  - Environments: ✅ Development, ✅ Preview (develop branch)
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` (dev key)
  - Environments: ✅ Development, ✅ Preview (develop branch)
- [ ] Add `NEXT_PUBLIC_ENVIRONMENT` = `development`
  - Environments: ✅ Development, ✅ Preview (develop branch)
- [ ] Add `CRON_SECRET` (dev secret)
  - Environments: ✅ Development, ✅ Preview (develop branch)

#### For SIT Branch
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` (sit URL)
  - Environments: ✅ Preview (sit branch only)
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` (sit key)
  - Environments: ✅ Preview (sit branch only)
- [ ] Add `NEXT_PUBLIC_ENVIRONMENT` = `sit`
  - Environments: ✅ Preview (sit branch only)
- [ ] Add `CRON_SECRET` (sit secret)
  - Environments: ✅ Preview (sit branch only)

#### For Staging Branch
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` (staging URL)
  - Environments: ✅ Preview (staging branch only)
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` (staging key)
  - Environments: ✅ Preview (staging branch only)
- [ ] Add `NEXT_PUBLIC_ENVIRONMENT` = `staging`
  - Environments: ✅ Preview (staging branch only)
- [ ] Add `CRON_SECRET` (staging secret)
  - Environments: ✅ Preview (staging branch only)

#### For Production
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` (prod URL)
  - Environments: ✅ Production
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` (prod key)
  - Environments: ✅ Production
- [ ] Add `NEXT_PUBLIC_ENVIRONMENT` = `production`
  - Environments: ✅ Production
- [ ] Add `CRON_SECRET` (prod secret)
  - Environments: ✅ Production

### Verify Environment Variables
- [ ] All 4 variables set for each environment
- [ ] Branch targeting correct for each variable
- [ ] No typos in variable names
- [ ] Secrets not visible in plain text (encrypted)

---

## 🚀 Phase 4: Vercel Deployment Setup

**Estimated Time:** 20 minutes

### Connect Repository
- [ ] Go to https://vercel.com
- [ ] Click "Add New..." → "Project"
- [ ] Select GitHub repository (Qilly)
- [ ] Import repository
- [ ] Framework: Next.js (auto-detected)
- [ ] Root directory: `./`
- [ ] Build command: `npm run build` (auto)
- [ ] Output directory: `.next` (auto)

### Configure Git Integration
- [ ] Go to Settings → Git
- [ ] Production branch: `main`
- [ ] Deploy all branches: ✅ Enabled
- [ ] Automatic deployments: ✅ Enabled
- [ ] Save settings

### Configure Project Settings
- [ ] Go to Settings → General
- [ ] Node.js Version: 18.x (or higher)
- [ ] Region: Johannesburg (hle1) - for production
- [ ] Function Region: Same as region
- [ ] Save settings

### Verify vercel.json Configuration
- [ ] `vercel.json` exists in project root
- [ ] Cron job configured for `/api/cron/keep-alive`
- [ ] Schedule: `0 */6 * * *` (every 6 hours)
- [ ] Security headers configured
- [ ] Region: `hle1` (Johannesburg)

---

## 🗄️ Phase 5: Database Schema Deployment

**Estimated Time:** 45 minutes

### Export Current Schema
```bash
# Link to development project
supabase login
supabase link --project-ref <dev-project-id>

# Pull schema
supabase db pull
```

- [ ] Supabase CLI authenticated
- [ ] Linked to development project
- [ ] Schema exported to `./supabase/migrations/`
- [ ] Migration files created

### Apply Schema to SIT
```bash
# Link to SIT project
supabase link --project-ref <sit-project-id>

# Push schema
supabase db push
```

- [ ] Linked to SIT project
- [ ] Schema applied successfully
- [ ] No errors in console
- [ ] Tables visible in Supabase dashboard

### Apply Schema to Staging
```bash
# Link to staging project
supabase link --project-ref <staging-project-id>

# Push schema
supabase db push
```

- [ ] Linked to staging project
- [ ] Schema applied successfully
- [ ] No errors in console
- [ ] Tables visible in Supabase dashboard

### Apply Schema to Production
```bash
# Link to production project
supabase link --project-ref <prod-project-id>

# Push schema
supabase db push
```

- [ ] Linked to production project
- [ ] Schema applied successfully
- [ ] No errors in console
- [ ] Tables visible in Supabase dashboard

### Verify Tables in All Environments
For each environment (Dev, SIT, Staging, Prod):
- [ ] `suppliers` table exists
- [ ] `contractors` table exists
- [ ] `boq_templates` table exists
- [ ] `municipalities` table exists
- [ ] All columns present
- [ ] Indexes created
- [ ] Foreign keys established

### Enable Row-Level Security
For each Supabase project, run this SQL:

```sql
-- Enable RLS on all tables
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;

-- Create read policies (example)
CREATE POLICY "Enable read access for all users" ON suppliers
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON suppliers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

- [ ] RLS enabled on development
- [ ] RLS enabled on SIT
- [ ] RLS enabled on staging
- [ ] RLS enabled on production
- [ ] Policies created and tested

---

## ✅ Phase 6: Health Check Configuration

**Estimated Time:** 20 minutes

### Verify Health Endpoints Created
- [ ] `/src/app/api/health/route.ts` exists
- [ ] `/src/app/api/cron/keep-alive/route.ts` exists
- [ ] Both files have correct code
- [ ] Edge runtime configured
- [ ] CRON_SECRET validation in place

### Test Health Endpoints Locally
```bash
# Start development server
npm run dev

# Test health endpoint
curl http://localhost:3000/api/health

# Test keep-alive (with secret)
curl -H "Authorization: Bearer YOUR_DEV_SECRET" \
  http://localhost:3000/api/cron/keep-alive
```

- [ ] Health endpoint returns 200 OK
- [ ] Keep-alive with correct secret returns 200
- [ ] Keep-alive without secret returns 401
- [ ] JSON responses valid
- [ ] Database connectivity confirmed

### Set Up UptimeRobot Monitoring (Optional, Free)
- [ ] Go to https://uptimerobot.com
- [ ] Create account (free)
- [ ] Add monitor: `qilly-git-sit.vercel.app/api/health`
  - Type: HTTP(s)
  - Interval: 5 minutes
  - Alert email: your-email@example.com
- [ ] Add monitor: `qilly-git-staging.vercel.app/api/health`
- [ ] Add monitor: `qilly.co.za/api/health` (production)
- [ ] Verify monitors active (green status)

---

## 🧪 Phase 7: Test Deployment Workflow

**Estimated Time:** 30 minutes

### Test Development Deployment
```bash
git checkout develop
echo "// Test deployment workflow" >> src/app/App.tsx
git add .
git commit -m "test: verify deployment"
git push origin develop
```

- [ ] Push successful
- [ ] Vercel deployment triggered
- [ ] Build successful (check Vercel dashboard)
- [ ] Preview URL created: `qilly-git-develop-xxx.vercel.app`
- [ ] Preview URL loads correctly
- [ ] Environment: "development" (check /api/health)

### Test SIT Deployment
```bash
git checkout sit
git merge develop
git push origin sit
```

- [ ] Merge successful
- [ ] Vercel deployment triggered
- [ ] Preview URL: `qilly-git-sit.vercel.app`
- [ ] Uses SIT database (verify contractor count)
- [ ] Environment: "sit" (check /api/health)
- [ ] Health check returns healthy

### Test Staging Deployment
```bash
git checkout staging
git merge sit
git push origin staging
```

- [ ] Merge successful
- [ ] Vercel deployment triggered
- [ ] Preview URL: `qilly-git-staging.vercel.app`
- [ ] Uses staging database
- [ ] Environment: "staging" (check /api/health)
- [ ] Health check returns healthy

### Test Production Deployment (Careful!)
```bash
git checkout main
git merge staging
git push origin main
```

- [ ] Merge successful
- [ ] Production deployment triggered
- [ ] Production URL: `qilly.vercel.app` or `qilly.co.za`
- [ ] Uses production database
- [ ] Environment: "production" (check /api/health)
- [ ] Health check returns healthy

### Revert Test Changes
```bash
git checkout develop
git revert HEAD
git push origin develop
```

- [ ] Test changes reverted
- [ ] Clean state restored

---

## 🔍 Phase 8: Verification & Testing

**Estimated Time:** 30 minutes

### Verify All Environments Accessible
- [ ] Development: http://localhost:3000 works
- [ ] SIT: https://qilly-git-sit.vercel.app works
- [ ] Staging: https://qilly-git-staging.vercel.app works
- [ ] Production: https://qilly.co.za works

### Verify Database Connections
For each environment, test:
- [ ] Can view suppliers list
- [ ] Can view contractors list
- [ ] Can register new contractor (SIT only)
- [ ] Data persists to correct database

### Verify Environment Variables
Visit `/api/health` on each environment:
- [ ] Development shows `"environment": "development"`
- [ ] SIT shows `"environment": "sit"`
- [ ] Staging shows `"environment": "staging"`
- [ ] Production shows `"environment": "production"`

### Verify Cron Jobs
- [ ] Go to Vercel → Deployments → Production
- [ ] Check "Functions" tab
- [ ] See `/api/cron/keep-alive` listed
- [ ] Schedule shown: `0 */6 * * *`
- [ ] Wait 6 hours or trigger manually to verify

### Verify Security
- [ ] `.env.*` files NOT in GitHub
- [ ] Secrets encrypted in Vercel
- [ ] RLS enabled on all tables
- [ ] CORS configured correctly
- [ ] HTTPS enforced (production)

---

## 📊 Phase 9: Monitoring Setup

**Estimated Time:** 20 minutes

### Vercel Analytics
- [ ] Go to Vercel → Project → Analytics
- [ ] Enable Analytics (free tier)
- [ ] Verify data collection started

### Error Tracking (Optional)
If using Sentry:
- [ ] Create Sentry project
- [ ] Add DSN to environment variables
- [ ] Deploy and verify errors tracked

### Performance Monitoring
- [ ] Set up BetterStack (optional, R180/month)
- [ ] Or use free alternatives:
  - [ ] UptimeRobot (uptime)
  - [ ] Vercel Analytics (performance)
  - [ ] Supabase Logs (database)

### Alert Configuration
- [ ] Email alerts for downtime
- [ ] Slack webhook for critical errors (optional)
- [ ] Daily summary emails configured

---

## 📚 Phase 10: Documentation & Training

**Estimated Time:** 30 minutes

### Document Environment URLs
Create `/ENVIRONMENTS.md`:
```markdown
# Qilly Environments

## Development
- URL: http://localhost:3000
- Database: qilly-dev

## SIT
- URL: https://qilly-git-sit.vercel.app
- Database: qilly-sit

## Staging
- URL: https://qilly-git-staging.vercel.app
- Database: qilly-staging

## Production
- URL: https://qilly.co.za
- Database: qilly-production
```

- [ ] Environment URLs documented
- [ ] Database project IDs documented
- [ ] Access credentials securely stored

### Update README
- [ ] Add multi-environment setup section
- [ ] Add deployment workflow diagram
- [ ] Add troubleshooting guide
- [ ] Add contact information

### Team Training
- [ ] Schedule training session
- [ ] Demonstrate deployment workflow
- [ ] Walk through rollback procedure
- [ ] Share documentation links

---

## ✅ Final Verification Checklist

### Infrastructure
- [ ] 4 Supabase projects created and accessible
- [ ] 4 Git branches created and pushed
- [ ] Vercel connected to repository
- [ ] All environment variables configured
- [ ] Health checks working on all environments

### Security
- [ ] All secrets encrypted
- [ ] No credentials in code
- [ ] RLS enabled on all databases
- [ ] Branch protection rules active
- [ ] 2FA enabled on all accounts

### Monitoring
- [ ] Health checks configured
- [ ] UptimeRobot monitors active (optional)
- [ ] Error tracking enabled
- [ ] Alert emails configured

### Testing
- [ ] Can deploy to each environment
- [ ] Can roll back deployments
- [ ] Database migrations work
- [ ] Health endpoints respond correctly

### Documentation
- [ ] Environment URLs documented
- [ ] Deployment workflow documented
- [ ] Troubleshooting guide created
- [ ] Team trained

---

## 🎉 Completion Certificate

### Multi-Environment Workflow - COMPLETE ✅

**Setup Date:** _______________  
**Completed By:** _______________  
**Total Time:** _____ hours  
**Total Cost:** R_____ /month

### Environments Active:
- ✅ Development (local + cloud preview)
- ✅ SIT/UAT (cloud preview)
- ✅ Staging (cloud preview)
- ✅ Production (live)

### Next Steps:
1. [ ] Start developing features in `develop` branch
2. [ ] Test in SIT before promoting to staging
3. [ ] Validate in staging before production
4. [ ] Monitor health and performance daily

---

## 🆘 Troubleshooting Quick Reference

### Deployment Fails
- Check environment variables in Vercel
- Verify branch names match configuration
- Check build logs for errors
- Ensure dependencies installed

### Database Connection Error
- Verify Supabase project not paused
- Check API keys are correct
- Restart Supabase project if needed
- Check RLS policies

### Wrong Environment Variables
- Check `/api/health` response
- Verify Vercel env var branch targeting
- Redeploy after fixing variables

### Cron Not Running
- Verify `vercel.json` configuration
- Check `CRON_SECRET` set in Vercel
- View logs in Vercel Functions tab
- Test manually with curl

---

## 📞 Support Resources

**Vercel:**
- Docs: https://vercel.com/docs
- Support: support@vercel.com

**Supabase:**
- Docs: https://supabase.com/docs
- Discord: discord.supabase.com

**Qilly Internal:**
- Technical Lead: [Name]
- Email: [Email]
- Slack: #qilly-dev

---

**🚀 You're ready to deploy with confidence!**

Multi-environment workflow complete. Time to build! 🎯
