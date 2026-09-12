# Qilly Deployment Workflow - Visual Guide

**How code flows from development to production**

---

## 📊 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEVELOPER WORKSTATION                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  1. Developer creates feature branch                             │  │
│  │     git checkout -b feature/new-feature                          │  │
│  │                                                                   │  │
│  │  2. Code changes + local testing                                 │  │
│  │     npm run dev → http://localhost:3000                         │  │
│  │     Uses: Supabase DEV database                                  │  │
│  │                                                                   │  │
│  │  3. Commit and push                                              │  │
│  │     git add . && git commit -m "feat: ..."                      │  │
│  │     git push origin feature/new-feature                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          GITHUB REPOSITORY                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  4. Pull Request Created                                         │  │
│  │     feature/new-feature → develop                                │  │
│  │                                                                   │  │
│  │  5. Code Review                                                  │  │
│  │     ✅ Approval from team lead                                   │  │
│  │     ✅ CI checks pass                                            │  │
│  │                                                                   │  │
│  │  6. Merge to develop                                             │  │
│  │     Branch: develop                                              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         VERCEL PREVIEW DEPLOY                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  7. Auto-Deploy Triggered                                        │  │
│  │     Branch: develop                                              │  │
│  │     URL: qilly-git-develop-xxx.vercel.app                       │  │
│  │     Database: Supabase DEV                                       │  │
│  │     Status: ✅ Preview ready for testing                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SIT/UAT ENVIRONMENT                              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  8. Merge to SIT                                                 │  │
│  │     git checkout sit                                             │  │
│  │     git merge develop                                            │  │
│  │     git push origin sit                                          │  │
│  │                                                                   │  │
│  │  9. Vercel Auto-Deploys                                          │  │
│  │     URL: qilly-git-sit.vercel.app                               │  │
│  │     Database: Supabase SIT                                       │  │
│  │     Env Vars: NEXT_PUBLIC_ENVIRONMENT=sit                       │  │
│  │                                                                   │  │
│  │  10. QA Team Testing                                             │  │
│  │      ✅ Functional testing                                       │  │
│  │      ✅ Integration testing                                      │  │
│  │      ✅ User acceptance testing                                  │  │
│  │      ✅ Test data validation                                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        STAGING ENVIRONMENT                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  11. Merge to Staging                                            │  │
│  │      git checkout staging                                        │  │
│  │      git merge sit                                               │  │
│  │      git push origin staging                                     │  │
│  │                                                                   │  │
│  │  12. Vercel Auto-Deploys                                         │  │
│  │      URL: qilly-git-staging.vercel.app                          │  │
│  │      Database: Supabase STAGING (prod clone)                    │  │
│  │      Env Vars: NEXT_PUBLIC_ENVIRONMENT=staging                  │  │
│  │                                                                   │  │
│  │  13. Final Validation                                            │  │
│  │      ✅ Business team approval                                   │  │
│  │      ✅ Performance testing                                      │  │
│  │      ✅ Security scan                                            │  │
│  │      ✅ Production-like data testing                             │  │
│  │      ✅ Stakeholder sign-off                                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       PRODUCTION ENVIRONMENT                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  14. Merge to Main (Production)                                  │  │
│  │      git checkout main                                           │  │
│  │      git merge staging                                           │  │
│  │      git push origin main                                        │  │
│  │                                                                   │  │
│  │  15. Vercel Production Deploy                                    │  │
│  │      URL: qilly.co.za (custom domain)                           │  │
│  │      Database: Supabase PRODUCTION                              │  │
│  │      Region: Johannesburg (hle1)                                │  │
│  │      Env Vars: NEXT_PUBLIC_ENVIRONMENT=production               │  │
│  │                                                                   │  │
│  │  16. LIVE - Serving Real Users                                  │  │
│  │      ✅ 24/7 uptime monitoring                                   │  │
│  │      ✅ Error tracking                                           │  │
│  │      ✅ Performance monitoring                                   │  │
│  │      ✅ Usage analytics                                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Environment Flow Summary

```
Developer Laptop → GitHub → Vercel Preview → SIT → Staging → Production
     (local)         (PR)     (testing)     (QA)   (final)    (LIVE)
       ↓              ↓           ↓           ↓        ↓         ↓
   Dev DB         Dev DB      SIT DB      Staging   Prod DB   Prod DB
```

---

## 🌳 Git Branch Strategy

```
main (production)
  │
  ├─── staging (pre-production)
  │      │
  │      ├─── sit (system integration testing)
  │      │      │
  │      │      └─── develop (integration branch)
  │      │             │
  │      │             ├─── feature/contractor-dashboard
  │      │             ├─── feature/boq-templates
  │      │             └─── bugfix/login-issue
  │      │
  │      └─── hotfix/critical-bug (emergency fixes)
  │
  └─── release/v1.2.0 (release branches)
```

### Branch Naming Convention:
- **feature/*** - New features
- **bugfix/*** - Bug fixes
- **hotfix/*** - Critical production fixes
- **release/*** - Release preparation

---

## 📦 Deployment Triggers

| Branch | Trigger | URL | Database | Purpose |
|--------|---------|-----|----------|---------|
| `feature/*` | Push | `qilly-git-feature-xxx.vercel.app` | Dev | Developer preview |
| `develop` | Push/Merge | `qilly-git-develop.vercel.app` | Dev | Integration testing |
| `sit` | Merge from develop | `qilly-git-sit.vercel.app` | SIT | QA testing |
| `staging` | Merge from sit | `qilly-git-staging.vercel.app` | Staging | Final validation |
| `main` | Merge from staging | `qilly.co.za` | Production | LIVE users |

---

## ⏱️ Typical Release Timeline

### Week 1-2: Development
```
Monday:    Feature branch created
Tuesday:   Development work
Wednesday: Local testing
Thursday:  Push to GitHub → Preview deployment
Friday:    Code review, merge to develop
```

### Week 3: SIT Testing
```
Monday:    Merge develop → sit
Tuesday:   QA functional testing
Wednesday: QA integration testing
Thursday:  Bug fixes (if any)
Friday:    SIT sign-off
```

### Week 4: Staging & Production
```
Monday:    Merge sit → staging
Tuesday:   Business validation
Wednesday: Performance testing
Thursday:  Staging sign-off, merge staging → main
Friday:    PRODUCTION DEPLOYMENT 🚀
```

**Total: 4 weeks from feature start to production**

---

## 🔐 Environment-Specific Configuration

### Development
```bash
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_SUPABASE_URL=https://xxxdev.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-key-xxx
CRON_SECRET=dev-secret-xxx
```

### SIT/UAT
```bash
NEXT_PUBLIC_ENVIRONMENT=sit
NEXT_PUBLIC_SUPABASE_URL=https://xxxsit.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sit-key-xxx
CRON_SECRET=sit-secret-xxx
```

### Staging
```bash
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_SUPABASE_URL=https://xxxstaging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging-key-xxx
CRON_SECRET=staging-secret-xxx
```

### Production
```bash
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_SUPABASE_URL=https://xxxprod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-key-xxx
CRON_SECRET=prod-secret-xxx
```

---

## 🚨 Rollback Procedures

### Option 1: Instant Rollback (Vercel Dashboard)
1. Go to Vercel → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"
4. **Result:** Instant rollback (<1 minute)

### Option 2: Git Revert
```bash
# Revert last commit on main
git checkout main
git revert HEAD
git push origin main

# Vercel auto-deploys reverted version
```

### Option 3: Force Deploy Previous Commit
```bash
# Deploy specific commit
git checkout main
git reset --hard <previous-commit-sha>
git push --force origin main

# WARNING: Use only in emergencies!
```

---

## 🔍 Health Check Flow

```
┌──────────��──────────────────────────────┐
│  Vercel Cron Job (Every 6 Hours)        │
│  Runs: /api/cron/keep-alive             │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Keep-Alive Endpoint                    │
│  • Verifies CRON_SECRET                 │
│  • Queries database (1 record)          │
│  • Logs success/failure                 │
│  • Returns JSON response                │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Supabase Database                      │
│  • Connection kept active               │
│  • Prevents auto-pause                  │
│  • Database stays warm                  │
└─────────────────────────────────────────┘

PARALLEL:

┌─────────────────────────────────────────┐
│  UptimeRobot (Every 5 Minutes)          │
│  Pings: /api/health                     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Public Health Endpoint                 │
│  • No auth required                     │
│  • Checks database connectivity         │
│  • Checks Supabase auth                 │
│  • Returns health status                │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Monitoring Dashboard                   │
│  • Uptime: 99.9%                        │
│  • Response time: <200ms                │
│  • Alert if down >2 min                 │
└─────────────────────────────────────────┘
```

---

## 📊 Database Sync Strategy

### Initial Setup
```bash
# 1. Create schema in development
# 2. Export schema
supabase db pull

# 3. Apply to all environments
supabase link --project-ref sit-id && supabase db push
supabase link --project-ref staging-id && supabase db push
supabase link --project-ref prod-id && supabase db push
```

### Ongoing Migrations
```bash
# 1. Create migration in development
supabase migration new add_new_column

# 2. Test locally
supabase db reset

# 3. Apply to SIT
supabase link --project-ref sit-id
supabase db push

# 4. After SIT approval, apply to staging
supabase link --project-ref staging-id
supabase db push

# 5. After staging approval, apply to production
supabase link --project-ref prod-id
supabase db push
```

---

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Code reviewed and approved
- [ ] Database migrations prepared
- [ ] Environment variables verified
- [ ] Backup created (production)

### Deployment
- [ ] Merge to target branch
- [ ] Vercel deployment triggered
- [ ] Build successful
- [ ] Deployment preview URL works
- [ ] Health check returns 200 OK

### Post-Deployment
- [ ] Smoke tests passing
- [ ] Error monitoring checked (no new errors)
- [ ] Performance metrics stable
- [ ] Database queries optimized
- [ ] Team notified of deployment

### Rollback Decision
If ANY of these fail, rollback immediately:
- [ ] Health check failing
- [ ] Error rate >1%
- [ ] Response time >500ms
- [ ] Database connection errors
- [ ] Critical feature broken

---

## 📈 Monitoring & Alerts

### What We Monitor

**Uptime:**
- Health endpoint: /api/health
- Production URL response
- Database connectivity
- Alert if: >2 minutes downtime

**Performance:**
- Page load time: <3 seconds
- API response: <250ms
- Database queries: <150ms
- Alert if: >500ms sustained

**Errors:**
- JavaScript errors
- API errors (500s)
- Database errors
- Alert if: >10 errors/minute

**Usage:**
- Active users
- BOQs generated
- Database size
- Alert if: Approaching limits

---

## 🔔 Alert Channels

### Critical Alerts (Immediate)
- 📱 SMS to technical lead
- 📧 Email to dev team
- 💬 Slack #critical-alerts

### Warning Alerts (15 minutes)
- 📧 Email to dev team
- 💬 Slack #monitoring

### Info Alerts (Daily digest)
- 📧 Email summary
- 📊 Dashboard review

---

**This workflow ensures:**
✅ Code quality through reviews  
✅ Thorough testing at each stage  
✅ Safe, incremental deployments  
✅ Quick rollback if needed  
✅ Zero-downtime releases

---

**Questions? See `/MULTI_ENVIRONMENT_SETUP.md` for detailed implementation guide**
