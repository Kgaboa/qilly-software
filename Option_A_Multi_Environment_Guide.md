# Option A: Multi-Environment Setup with Free Tier

## Can You Have SIT & Staging with Free Tier?

**Short Answer:** ✅ **YES!** You can absolutely set up multiple environments using Supabase and Vercel free tiers.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT                     │
│  - Run on localhost:3000                                 │
│  - Connect to Dev Supabase                               │
│  - Cost: R0                                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              SIT/UAT (System Integration Testing)        │
│  - Vercel Free (auto-deploy from 'sit' branch)          │
│  - Supabase Free Project #1                             │
│  - URL: qilly-sit.vercel.app                            │
│  - Cost: R0                                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                      STAGING                             │
│  - Vercel Free (auto-deploy from 'staging' branch)      │
│  - Supabase Free Project #2                             │
│  - URL: qilly-staging.vercel.app                        │
│  - Cost: R0                                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                     PRODUCTION                           │
│  - Vercel Free (auto-deploy from 'main' branch)         │
│  - Supabase Free Project #3                             │
│  - URL: qilly.co.za (custom domain)                     │
│  - Cost: R60/month (domain only)                        │
└─────────────────────────────────────────────────────────┘
```

**Total Monthly Cost: R60** (just domain name!)

---

## Step-by-Step Implementation Guide

### Step 1: Create Multiple Supabase Projects (Free)

You can create **multiple free projects** under one Supabase account:

**Project 1: Development**
- Name: `qilly-dev`
- Region: Europe (Frankfurt) - closest to SA
- Pausing: Acceptable (only used during dev)

**Project 2: SIT/UAT**
- Name: `qilly-sit`
- Region: Europe (Frankfurt)
- Pausing: Keep active with scheduled pings

**Project 3: Staging**
- Name: `qilly-staging`
- Region: Europe (Frankfurt)
- Pausing: Keep active with scheduled pings

**Project 4: Production**
- Name: `qilly-production`
- Region: Europe (Frankfurt)
- Pausing: Keep active with scheduled pings

**Important:** Supabase allows **unlimited free projects**! Each gets:
- 500MB database
- 50,000 MAU (monthly active users)
- 1GB file storage
- 2GB bandwidth

---

### Step 2: Set Up Git Branching Strategy

```bash
# Main branch structure
main            → Production
  ├─ staging    → Staging environment
  ├─ sit        → SIT/UAT environment
  └─ develop    → Development environment
```

**Workflow:**
```bash
# Create feature branch from develop
git checkout develop
git checkout -b feature/new-feature

# After testing locally, merge to develop
git checkout develop
git merge feature/new-feature

# When ready for SIT, merge develop to sit
git checkout sit
git merge develop

# After SIT approval, merge to staging
git checkout staging
git merge sit

# After final validation, merge to main (production)
git checkout main
git merge staging
```

---

### Step 3: Configure Vercel for Multiple Environments

**Vercel Free Tier Includes:**
- ✅ Unlimited projects
- ✅ Automatic deployments from Git branches
- ✅ Preview deployments for every push
- ✅ Environment variables per branch

**Setup:**

1. **Connect GitHub repository to Vercel**
   ```
   vercel.com → New Project → Import Git Repository
   ```

2. **Configure Environment Variables per Branch:**

   **For SIT Environment:**
   ```
   Branch: sit
   Variables:
   - NEXT_PUBLIC_SUPABASE_URL = https://[sit-project-id].supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = [sit-anon-key]
   - NEXT_PUBLIC_ENVIRONMENT = sit
   ```

   **For Staging Environment:**
   ```
   Branch: staging
   Variables:
   - NEXT_PUBLIC_SUPABASE_URL = https://[staging-project-id].supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = [staging-anon-key]
   - NEXT_PUBLIC_ENVIRONMENT = staging
   ```

   **For Production Environment:**
   ```
   Branch: main
   Variables:
   - NEXT_PUBLIC_SUPABASE_URL = https://[prod-project-id].supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = [prod-anon-key]
   - NEXT_PUBLIC_ENVIRONMENT = production
   ```

3. **Enable Automatic Deployments:**
   - Every push to `sit` → auto-deploys to qilly-git-sit.vercel.app
   - Every push to `staging` → auto-deploys to qilly-git-staging.vercel.app
   - Every push to `main` → auto-deploys to qilly.vercel.app

---

### Step 4: Prevent Database Pausing

**Problem:** Free Supabase projects pause after 7 days of inactivity.

**Solution: Automated Health Checks**

#### Option A: Vercel Cron Jobs (Free)

Create `/src/app/api/cron/keep-alive/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export const runtime = 'edge';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Simple query to keep database active
    const { data, error } = await supabase
      .from('suppliers')
      .select('id')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      message: 'Database keep-alive successful'
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

**Configure in `vercel.json`:**

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

This pings your database every 6 hours, preventing auto-pause.

**Cost: R0** (Vercel Cron is free!)

---

#### Option B: External Health Check (Free)

Use a free monitoring service:

**UptimeRobot (Free Plan):**
- Create HTTP(s) monitor
- URL: `https://qilly-sit.vercel.app/api/health`
- Interval: Every 5 minutes
- Cost: R0

**Healthchecks.io (Free Plan):**
- 20 checks per month
- Set to ping every 12 hours
- Cost: R0

---

### Step 5: Database Migration Between Environments

**Challenge:** Keep schemas in sync across all environments.

**Solution: Migration Scripts**

Create `/scripts/migrate-schema.sh`:

```bash
#!/bin/bash

# Export schema from production
pg_dump $PROD_DATABASE_URL --schema-only > schema.sql

# Apply to staging
psql $STAGING_DATABASE_URL < schema.sql

# Apply to SIT
psql $SIT_DATABASE_URL < schema.sql

# Apply to dev
psql $DEV_DATABASE_URL < schema.sql

echo "✅ Schema synced across all environments"
```

**Or use Supabase CLI:**

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your projects
supabase link --project-ref [sit-project-id]
supabase db push

supabase link --project-ref [staging-project-id]
supabase db push

supabase link --project-ref [prod-project-id]
supabase db push
```

---

### Step 6: Test Data Management

**Strategy:**

1. **Development:** Fake/mock data
2. **SIT:** Sanitized production data (anonymized)
3. **Staging:** Clone of production (last week's backup)
4. **Production:** Real data

**Anonymize Data Script** (`/scripts/anonymize-data.sql`):

```sql
-- Anonymize contractor data for SIT
UPDATE contractors SET
  email = 'contractor' || id || '@test.qilly.co.za',
  phone = '+27 11 000 ' || LPAD(id::text, 4, '0'),
  contact_person = 'Test User ' || id,
  company_name = 'Test Company ' || id
WHERE TRUE;

-- Anonymize supplier data for SIT
UPDATE suppliers SET
  email = 'supplier' || id || '@test.qilly.co.za',
  phone = '+27 11 000 ' || LPAD(id::text, 4, '0'),
  contact_person = 'Test Supplier ' || id,
  company_name = 'Test Supplier Co ' || id
WHERE TRUE;
```

---

## Deployment Workflow Example

### Scenario: Adding New Feature

**Week 1: Development**
```bash
# Developer creates feature branch
git checkout -b feature/contractor-dashboard

# Code changes, test locally with dev database
npm run dev

# Push to GitHub
git push origin feature/contractor-dashboard
```
→ Vercel creates **preview deployment** automatically  
→ URL: `qilly-git-feature-contractor-dashboard.vercel.app`  
→ Uses dev Supabase project

---

**Week 2: SIT Testing**
```bash
# Merge to SIT branch
git checkout sit
git merge feature/contractor-dashboard
git push origin sit
```
→ Vercel auto-deploys to **SIT environment**  
→ URL: `qilly-git-sit.vercel.app`  
→ Uses SIT Supabase project  
→ QA team tests with test data

---

**Week 3: Staging Validation**
```bash
# After SIT approval, merge to staging
git checkout staging
git merge sit
git push origin staging
```
→ Vercel auto-deploys to **Staging environment**  
→ URL: `qilly-git-staging.vercel.app`  
→ Uses Staging Supabase project (production clone)  
→ Final validation with production-like data

---

**Week 4: Production Release**
```bash
# After final approval, merge to main
git checkout main
git merge staging
git push origin main
```
→ Vercel auto-deploys to **Production**  
→ URL: `qilly.co.za`  
→ Uses Production Supabase project  
→ Live for all users

---

## Limitations of Free Tier Multi-Environment Setup

### Supabase Free Limitations (Per Project)

| Resource | Limit | Impact |
|----------|-------|--------|
| Database Size | 500MB | Small for production, fine for SIT/Staging |
| Pausing | After 7 days | Fixed with health checks |
| Bandwidth | 2GB/month | ~500 API calls/day |
| Storage | 1GB | Limited file uploads |
| Concurrent Connections | 60 | May hit during load testing |

**Mitigation:**
- Use production data clone in staging (monthly sync)
- Keep SIT with minimal test data
- Production should upgrade to Pro when approaching limits

---

### Vercel Free Limitations

| Resource | Limit | Impact |
|----------|-------|--------|
| Bandwidth | 100GB/month | Sufficient for testing |
| Build Time | 6,000 minutes/month | ~200 deployments |
| Serverless Execution | 100GB-hours | Plenty for testing |
| Domains | Vercel subdomains only | Can't use custom domains on preview |

**Mitigation:**
- Use Vercel subdomains for SIT/Staging
- Reserve custom domain for production only

---

## Cost Breakdown: Free Tier Multi-Environment

| Environment | Supabase | Vercel | Domain | Monitoring | Total/Month |
|-------------|----------|--------|--------|------------|-------------|
| Development | Free | Free | - | - | R0 |
| SIT | Free | Free | - | Free | R0 |
| Staging | Free | Free | - | Free | R0 |
| Production | Free | Free | R60 | Free | R60 |
| **TOTAL** | **R0** | **R0** | **R60** | **R0** | **R60/month** |

**Annual Cost: R720** (~$40/year)

---

## When to Upgrade Individual Environments

### Triggers for Upgrading to Paid Tiers

**SIT Environment:**
- ❌ Keep free (only used by QA team)
- Upgrade only if: Concurrent QA team >10 people

**Staging Environment:**
- ⚠️ Upgrade when database >400MB
- Or when you need production-level testing
- **Recommended:** Month 3-6

**Production Environment:**
- ✅ **Upgrade immediately when:**
  - Database approaching 500MB
  - >100 daily active users
  - Revenue starts coming in
  - SLA becomes important
- **Recommended:** Before official launch to customers

---

## Recommended Upgrade Path

### Phase 1: Months 1-2 (All Free)
```
Dev:      Supabase Free + Vercel Free
SIT:      Supabase Free + Vercel Free
Staging:  Supabase Free + Vercel Free
Prod:     Supabase Free + Vercel Free

Total: R60/month
```

**Best for:** MVP, initial testing, investor demos

---

### Phase 2: Months 3-6 (Upgrade Production)
```
Dev:      Supabase Free + Vercel Free
SIT:      Supabase Free + Vercel Free
Staging:  Supabase Free + Vercel Free
Prod:     Supabase Pro + Vercel Pro

Total: R810/month
```

**Best for:** Soft launch, beta customers

---

### Phase 3: Months 6+ (Upgrade Staging Too)
```
Dev:      Supabase Free + Vercel Free
SIT:      Supabase Free + Vercel Free
Staging:  Supabase Pro + Vercel Free
Prod:     Supabase Pro + Vercel Pro

Total: R1,260/month
```

**Best for:** Production launch, 100+ users

---

## Quick Start Checklist

### Week 1: Infrastructure Setup
- [ ] Create 4 Supabase projects (dev, sit, staging, prod)
- [ ] Set up Git branches (develop, sit, staging, main)
- [ ] Connect Vercel to GitHub repository
- [ ] Configure environment variables for each branch
- [ ] Test deployment to each environment

### Week 2: Automation
- [ ] Set up Vercel Cron for keep-alive
- [ ] Configure UptimeRobot monitors
- [ ] Create database migration scripts
- [ ] Set up data anonymization for SIT
- [ ] Test full deployment workflow

### Week 3: Documentation
- [ ] Document deployment process
- [ ] Create runbook for each environment
- [ ] Set up team access controls
- [ ] Configure notification channels (Slack/Email)

### Week 4: Testing
- [ ] Load test SIT environment
- [ ] Validate staging with production clone
- [ ] Perform security audit
- [ ] Test disaster recovery (backup/restore)

---

## Conclusion

**✅ YES - You can absolutely run SIT, Staging, and Production on free tiers!**

**Key Benefits:**
1. **Zero cost** (except R60/month for domain)
2. **Professional workflow** (4 environments)
3. **Automatic deployments** (Git-based)
4. **No database pausing** (with health checks)
5. **Easy to upgrade** (one environment at a time)

**Perfect for:**
- Startups validating product-market fit
- MVP development and testing
- Investor demos and presentations
- Pre-revenue applications

**When to upgrade:**
- Production database >400MB
- >100 daily active users
- Need uptime SLA
- Revenue generation starts

---

**Next Steps:**

1. **Set up development environment** (1 hour)
2. **Create SIT environment** (30 minutes)
3. **Create staging environment** (30 minutes)
4. **Deploy production** (1 hour)
5. **Configure health checks** (30 minutes)

**Total Setup Time: 3.5 hours**
**Total Cost: R60/month**

🚀 You can start with completely free multi-environment setup and upgrade only when you need to!
