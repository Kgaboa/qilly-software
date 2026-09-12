# Qilly Multi-Environment Workflow Setup Guide

**Complete step-by-step guide to set up Development, SIT, Staging, and Production environments**

**Cost:** R0-R60/month (free tier) or R910-R1,800/month (production tier)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Supabase Projects](#step-1-create-supabase-projects)
4. [Step 2: Set Up Git Branching Strategy](#step-2-set-up-git-branching-strategy)
5. [Step 3: Configure Vercel Deployment](#step-3-configure-vercel-deployment)
6. [Step 4: Set Environment Variables](#step-4-set-environment-variables)
7. [Step 5: Database Schema Synchronization](#step-5-database-schema-synchronization)
8. [Step 6: Configure Health Checks](#step-6-configure-health-checks)
9. [Step 7: Test Deployment Workflow](#step-7-test-deployment-workflow)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  DEVELOPMENT (Local)                     │
│  • Run on localhost:3000                                 │
│  • Supabase Free Project: qilly-dev                     │
│  • Git branch: develop                                   │
│  • URL: http://localhost:3000                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              SIT/UAT (System Integration Testing)        │
│  • Vercel Free (auto-deploy)                            │
│  • Supabase Free Project: qilly-sit                     │
│  • Git branch: sit                                       │
│  • URL: qilly-git-sit.vercel.app                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                      STAGING                             │
│  • Vercel Free/Pro                                       │
│  • Supabase Free/Pro Project: qilly-staging             │
│  • Git branch: staging                                   │
│  • URL: qilly-git-staging.vercel.app                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                     PRODUCTION                           │
│  • Vercel Pro (Johannesburg)                            │
│  • Supabase Pro Project: qilly-production               │
│  • Git branch: main                                      │
│  • URL: qilly.co.za                                     │
└─────────────────────────────────────────────────────────┘
```

### Cost Breakdown

| Environment | Supabase | Vercel | Total/Month |
|-------------|----------|--------|-------------|
| Development | Free | Local | R0 |
| SIT/UAT | Free | Free | R0 |
| Staging | Free | Free | R0 |
| Production | Free | Free | R0 |
| **Total (All Free)** | **R0** | **R0** | **R60** (domain) |

**Production Upgrade:**
| Environment | Supabase | Vercel | Total/Month |
|-------------|----------|--------|-------------|
| Development | Free | Local | R0 |
| SIT/UAT | Free | Free | R0 |
| Staging | Free/Pro | Free | R0-R450 |
| Production | Pro | Pro | R810 |
| **Total (Prod Upgraded)** | **R450** | **R360** | **R910-R1,260** |

---

## Prerequisites

### Required Accounts

- ✅ **GitHub account** (free) - for version control
- ✅ **Vercel account** (free) - for hosting
- ✅ **Supabase account** (free) - for database
- ✅ **Domain name** (optional) - R60/month for .co.za

### Required Tools

```bash
# Install Git
# macOS: brew install git
# Ubuntu: sudo apt-get install git
# Windows: Download from git-scm.com

# Install Node.js (v18 or higher)
# macOS: brew install node
# Ubuntu: sudo apt-get install nodejs npm
# Windows: Download from nodejs.org

# Install Vercel CLI
npm install -g vercel

# Install Supabase CLI
npm install -g supabase
```

### Repository Setup

```bash
# Clone the Qilly repository
git clone https://github.com/your-org/qilly.git
cd qilly

# Install dependencies
npm install
```

---

## Step 1: Create Supabase Projects

### 1.1 Create Development Project

1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in details:
   - **Name:** `qilly-dev`
   - **Database Password:** Generate strong password (save it!)
   - **Region:** Europe (Frankfurt) - closest to SA
   - **Pricing Plan:** Free
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

### 1.2 Get Development Credentials

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://xxxdev.supabase.co`
   - **Anon/Public Key:** `eyJhbGc...` (long string)
3. Save to `.env.development`:

```bash
# Create .env.development file
cp .env.example .env.development

# Edit and add:
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_SUPABASE_URL=https://xxxdev.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-dev-key
CRON_SECRET=$(openssl rand -base64 32)
```

### 1.3 Repeat for SIT, Staging, and Production

**SIT Project:**
- Name: `qilly-sit`
- Region: Europe (Frankfurt)
- Plan: Free
- Save to `.env.sit`

**Staging Project:**
- Name: `qilly-staging`
- Region: Europe (Frankfurt)
- Plan: Free (upgrade to Pro later)
- Save to `.env.staging`

**Production Project:**
- Name: `qilly-production`
- Region: Europe (Frankfurt)
- Plan: Free (upgrade to Pro before launch)
- Save to `.env.production`

### 1.4 Verify All Projects Created

You should now have 4 Supabase projects:

```
✅ qilly-dev        → Development
✅ qilly-sit        → SIT/UAT
✅ qilly-staging    → Staging
✅ qilly-production → Production
```

---

## Step 2: Set Up Git Branching Strategy

### 2.1 Create Branch Structure

```bash
# Ensure you're on main branch
git checkout main

# Create staging branch
git checkout -b staging
git push -u origin staging

# Create sit branch
git checkout -b sit
git push -u origin sit

# Create develop branch
git checkout -b develop
git push -u origin develop

# Return to main
git checkout main
```

### 2.2 Branch Protection Rules (GitHub)

1. Go to GitHub repository → **Settings** → **Branches**
2. Add protection rule for `main`:
   - ✅ Require pull request before merging
   - ✅ Require status checks to pass
   - ✅ Do not allow bypassing the above settings
3. Repeat for `staging` and `sit`

### 2.3 Branching Workflow

```
Feature Development:
develop → feature/my-feature → develop

SIT Testing:
develop → sit (merge for testing)

Staging Validation:
sit → staging (merge after SIT approval)

Production Release:
staging → main (merge after final approval)
```

---

## Step 3: Configure Vercel Deployment

### 3.1 Connect GitHub Repository

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. **Framework Preset:** Next.js (auto-detected)
5. **Root Directory:** `./`
6. **DO NOT DEPLOY YET** - click "Skip" on environment variables

### 3.2 Configure Git Branch Deployments

In Vercel project settings:

1. Go to **Settings** → **Git**
2. **Production Branch:** `main`
3. **Preview Branches:** All branches enabled
4. Save changes

**Result:**
- Push to `main` → Deploys to production
- Push to `staging` → Creates preview deployment
- Push to `sit` → Creates preview deployment
- Push to `develop` → Creates preview deployment

---

## Step 4: Set Environment Variables

### 4.1 Vercel Environment Variables Setup

1. Go to Vercel → **Project** → **Settings** → **Environment Variables**

### 4.2 Add Development Environment Variables

Click **"Add Environment Variable"**:

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://xxxdev.supabase.co` (from dev project)
- Environments: ✅ Development ✅ Preview (select `develop` branch)

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGc...your-dev-anon-key`
- Environments: ✅ Development ✅ Preview (select `develop` branch)

**Variable 3:**
- Name: `NEXT_PUBLIC_ENVIRONMENT`
- Value: `development`
- Environments: ✅ Development ✅ Preview (select `develop` branch)

**Variable 4:**
- Name: `CRON_SECRET`
- Value: Generate with `openssl rand -base64 32`
- Environments: ✅ Development ✅ Preview (select `develop` branch)

### 4.3 Add SIT Environment Variables

Repeat above for SIT:
- Environment: ✅ Preview (select `sit` branch only)
- Use SIT Supabase credentials
- Set `NEXT_PUBLIC_ENVIRONMENT=sit`

### 4.4 Add Staging Environment Variables

Repeat for Staging:
- Environment: ✅ Preview (select `staging` branch only)
- Use Staging Supabase credentials
- Set `NEXT_PUBLIC_ENVIRONMENT=staging`

### 4.5 Add Production Environment Variables

Repeat for Production:
- Environment: ✅ Production
- Use Production Supabase credentials
- Set `NEXT_PUBLIC_ENVIRONMENT=production`

**Security Note:** Generate a unique `CRON_SECRET` for each environment!

---

## Step 5: Database Schema Synchronization

### 5.1 Export Schema from Development

```bash
# Link to development project
supabase link --project-ref your-dev-project-id

# Pull current schema
supabase db pull

# This creates ./supabase/migrations/ folder
```

### 5.2 Apply Schema to All Environments

```bash
# Apply to SIT
supabase link --project-ref your-sit-project-id
supabase db push

# Apply to Staging
supabase link --project-ref your-staging-project-id
supabase db push

# Apply to Production
supabase link --project-ref your-prod-project-id
supabase db push
```

### 5.3 Verify Schema Applied

For each environment:
1. Go to Supabase Dashboard
2. Click **"Table Editor"**
3. Verify tables exist:
   - ✅ suppliers
   - ✅ contractors
   - ✅ boq_templates
   - ✅ municipalities (etc.)

### 5.4 Enable Row-Level Security (RLS)

For **each Supabase project**, run:

```sql
-- Enable RLS on all tables
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;

-- Create policies (example for suppliers)
CREATE POLICY "Suppliers are viewable by everyone"
  ON suppliers FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert suppliers"
  ON suppliers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

---

## Step 6: Configure Health Checks

### 6.1 Verify Cron Job Configuration

The `/api/cron/keep-alive` endpoint is already created. Verify `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

This runs every 6 hours to prevent database pausing.

### 6.2 Set Up External Monitoring (Optional)

**UptimeRobot (Free):**

1. Go to https://uptimerobot.com (free account)
2. Add New Monitor:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Qilly SIT Health
   - **URL:** `https://qilly-git-sit.vercel.app/api/health`
   - **Monitoring Interval:** 5 minutes
3. Repeat for staging and production

**Result:** Database never pauses (pinged every 5 minutes)

### 6.3 Test Health Endpoints

```bash
# Test development
curl http://localhost:3000/api/health

# Test SIT
curl https://qilly-git-sit.vercel.app/api/health

# Test staging
curl https://qilly-git-staging.vercel.app/api/health

# Test production
curl https://qilly.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-02-24T10:30:00.000Z",
  "environment": "sit",
  "checks": {
    "database": { "status": "healthy", "duration": "45ms" },
    "auth": { "status": "healthy", "duration": "23ms" },
    "configuration": { "status": "healthy" }
  }
}
```

---

## Step 7: Test Deployment Workflow

### 7.1 Test Development Workflow

```bash
# Switch to develop branch
git checkout develop

# Make a small change
echo "// Test change" >> src/app/App.tsx

# Commit and push
git add .
git commit -m "test: verify deployment workflow"
git push origin develop
```

**Verify:**
- Go to Vercel dashboard
- See deployment in progress
- Preview URL created: `qilly-git-develop-xxx.vercel.app`

### 7.2 Test SIT Deployment

```bash
# Merge develop to sit
git checkout sit
git merge develop
git push origin sit
```

**Verify:**
- New deployment triggered
- Preview URL: `qilly-git-sit.vercel.app`
- Environment variables correct (check /api/health)

### 7.3 Test Staging Deployment

```bash
# Merge sit to staging
git checkout staging
git merge sit
git push origin staging
```

**Verify:**
- Staging deployment triggered
- Preview URL: `qilly-git-staging.vercel.app`
- Uses staging database

### 7.4 Test Production Deployment

```bash
# Merge staging to main
git checkout main
git merge staging
git push origin main
```

**Verify:**
- Production deployment triggered
- Production URL: `qilly.vercel.app` (or custom domain)
- Uses production database

---

## Complete Deployment Workflow Example

### Scenario: Adding New Feature

**Week 1: Development**
```bash
# Create feature branch
git checkout develop
git checkout -b feature/contractor-reports

# Develop feature locally
npm run dev  # Test on localhost:3000

# Commit changes
git add .
git commit -m "feat: add contractor reports"

# Push to GitHub
git push origin feature/contractor-reports

# Create Pull Request: feature/contractor-reports → develop
# After review, merge to develop
```

**Week 2: SIT Testing**
```bash
# Deploy to SIT
git checkout sit
git merge develop
git push origin sit

# Vercel auto-deploys to: qilly-git-sit.vercel.app
# QA team tests with test data
# Use SIT Supabase database
```

**Week 3: Staging Validation**
```bash
# Deploy to staging
git checkout staging
git merge sit
git push origin staging

# Vercel auto-deploys to: qilly-git-staging.vercel.app
# Business team validates with production-like data
# Use staging Supabase database (clone of production)
```

**Week 4: Production Release**
```bash
# Deploy to production
git checkout main
git merge staging
git push origin main

# Vercel auto-deploys to: qilly.co.za
# Live for all users
# Use production Supabase database
```

**Rollback if Needed:**
```bash
# Option 1: Revert in Vercel dashboard (instant)
# Option 2: Git revert
git checkout main
git revert HEAD
git push origin main
```

---

## Environment URLs Reference

| Environment | Git Branch | Vercel URL | Database |
|-------------|------------|------------|----------|
| Development | `develop` | `localhost:3000` | qilly-dev |
| SIT/UAT | `sit` | `qilly-git-sit.vercel.app` | qilly-sit |
| Staging | `staging` | `qilly-git-staging.vercel.app` | qilly-staging |
| Production | `main` | `qilly.co.za` | qilly-production |

---

## Troubleshooting

### Issue 1: Deployment Fails with "Missing Environment Variables"

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Verify all 4 variables exist for the branch:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ENVIRONMENT`
   - `CRON_SECRET`
3. Redeploy

### Issue 2: Database Connection Error

**Solution:**
1. Check Supabase project is not paused
2. Go to Supabase Dashboard → Restart project
3. Verify API keys are correct
4. Check RLS policies allow access

### Issue 3: Wrong Environment Variables

**Solution:**
1. Check `/api/health` endpoint response
2. Verify `environment` field matches expected
3. Check Vercel environment variable branch mapping
4. Redeploy after fixing

### Issue 4: Cron Job Not Running

**Solution:**
1. Verify `vercel.json` has cron configuration
2. Check `CRON_SECRET` is set in Vercel
3. View Vercel logs for cron executions
4. Manually test: `curl -H "Authorization: Bearer YOUR_SECRET" https://your-app/api/cron/keep-alive`

### Issue 5: Database Pausing (Free Tier)

**Solution:**
1. Set up UptimeRobot monitor (pings every 5 min)
2. Verify Vercel Cron is running (every 6 hours)
3. Or upgrade to Supabase Pro (no pausing)

### Issue 6: Merge Conflicts

**Solution:**
```bash
# Update your branch first
git checkout sit
git pull origin main
git merge develop

# Resolve conflicts manually
# Then commit and push
git add .
git commit -m "merge: resolve conflicts"
git push origin sit
```

---

## Security Checklist

Before going to production:

- [ ] All `.env.*` files in `.gitignore`
- [ ] Unique `CRON_SECRET` for each environment
- [ ] RLS policies enabled on all tables
- [ ] Staging uses production data clone (anonymized)
- [ ] Production uses strong database password
- [ ] Vercel environment variables encrypted
- [ ] No secrets in code or comments
- [ ] GitHub branch protection enabled
- [ ] 2FA enabled on all accounts (GitHub, Vercel, Supabase)
- [ ] Backup strategy verified

---

## Cost Optimization Tips

### Free Tier (R0-R60/month)

**Keep These Free:**
- Development (always free - local)
- SIT (free tier + health checks)
- Staging (free tier initially)

**What to Monitor:**
- Database size approaching 500MB → upgrade
- Bandwidth approaching 2GB/month → upgrade
- Active users >50 → consider upgrading

### Production Tier (R910/month)

**Upgrade Only Production:**
- Supabase Pro: R450/month
- Vercel Pro: R360/month
- Domain: R100/month
- Total: R910/month

**Keep Free:**
- Development
- SIT
- Staging (until needed)

### Full Production (R1,800/month)

**When to Upgrade All:**
- Staging database >500MB
- Need production-identical testing
- Multiple QA team members
- Critical pre-launch validation

---

## Maintenance Tasks

### Daily
- [ ] Monitor deployment success (automated)
- [ ] Check health check status (automated)

### Weekly
- [ ] Review Vercel analytics
- [ ] Check database storage usage
- [ ] Review error logs

### Monthly
- [ ] Verify all backups successful
- [ ] Review and optimize costs
- [ ] Sync staging with production data
- [ ] Update dependencies
- [ ] Security audit

### Quarterly
- [ ] Review and rotate secrets
- [ ] Audit access permissions
- [ ] Update documentation
- [ ] Disaster recovery test

---

## Next Steps

**You're now ready to:**

1. ✅ **Develop features** in `develop` branch
2. ✅ **Test in SIT** by merging to `sit`
3. ✅ **Validate in Staging** by merging to `staging`
4. ✅ **Deploy to Production** by merging to `main`

**All automatically** via Vercel deployments!

**Cost:** R0-R60/month until you're ready to upgrade production

---

## Support Resources

**Vercel Documentation:**
- https://vercel.com/docs
- https://vercel.com/docs/deployments/environments

**Supabase Documentation:**
- https://supabase.com/docs
- https://supabase.com/docs/guides/cli

**Qilly Internal:**
- See `/Qilly_Hosting_Architecture_Report.md` for full analysis
- See `/Option_A_Multi_Environment_Guide.md` for detailed free tier guide

---

**Setup Complete! 🎉**

You now have a professional multi-environment workflow ready for production deployment.
