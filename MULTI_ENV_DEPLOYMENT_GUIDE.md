# 🚀 Qilly Multi-Environment Deployment Guide

Complete guide for deploying Qilly across all 4 environments with custom domains.

---

## 📊 **Environment Overview**

```
┌──────────────┬──────────────────────────┬─────────────────────┬──────────────┐
│ Environment  │ URL                      │ Supabase Project    │ Purpose      │
├──────────────┼──────────────────────────┼─────────────────────┼──────────────┤
│ Development  │ http://localhost:5173    │ qilly-dev           │ Local dev    │
│ SIT          │ https://sit.qilly.co.za  │ qilly-sit           │ Integration  │
│ UAT          │ https://uat.qilly.co.za  │ qilly-uat           │ User testing │
│ Preprod      │ https://preprod.qilly.co.za │ qilly-preprod    │ Final QA     │
│ Production   │ https://qilly.co.za      │ qilly-production    │ Live system  │
└──────────────┴──────────────────────────┴─────────────────────┴──────────────┘
```

---

## ✅ **Prerequisites Checklist**

### Already Completed:
- [x] Domain qilly.co.za registered with HostAfrica
- [x] DNS records configured for all subdomains
- [x] Supabase DEV project created (qilly-dev)
- [x] Supabase SIT project created (qilly-sit)
- [x] Environment configuration files created
- [x] Build scripts added to package.json

### To Complete:
- [ ] Create 3 more Supabase projects (UAT, Preprod, Production)
- [ ] Update .env files with Supabase credentials
- [ ] Deploy each environment to Vercel
- [ ] Connect custom domains in Vercel
- [ ] Set up database schemas for each environment
- [ ] Configure environment variables in Vercel

---

## 📋 **PHASE 1: Create Supabase Projects**

### **1.1 Create qilly-uat Project**

```
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Organization: Your organization
4. Project name: qilly-uat
5. Database password: [Save securely!]
6. Region: Singapore (ap-southeast-1)
7. Plan: Free
8. Click "Create new project"
9. Wait 2-3 minutes for provisioning
```

**Save these credentials:**
- Project URL: `https://[project-id].supabase.co`
- Anon Key: Settings → API → `anon` `public` key

### **1.2 Create qilly-preprod Project**

Repeat the same process:
- Project name: `qilly-preprod`
- Region: Singapore
- Save credentials

### **1.3 Create qilly-production Project**

**IMPORTANT:** For production, consider using a closer region:
- Project name: `qilly-production`
- Region: **Europe (West) - Ireland** (eu-west-1) - Lower latency to South Africa
- Plan: **Free** (upgrade to Pro when going live)
- Save credentials

---

## 📋 **PHASE 2: Update Environment Files**

### **2.1 Update .env.sit**

```bash
# File: /.env.sit

VITE_SUPABASE_URL=https://[your-sit-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-sit-anon-key]
VITE_ENVIRONMENT=sit
```

### **2.2 Update .env.uat**

```bash
# File: /.env.uat

VITE_SUPABASE_URL=https://[your-uat-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-uat-anon-key]
VITE_ENVIRONMENT=uat
```

### **2.3 Update .env.preprod**

```bash
# File: /.env.preprod

VITE_SUPABASE_URL=https://[your-preprod-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-preprod-anon-key]
VITE_ENVIRONMENT=preprod
```

### **2.4 Update .env.production**

```bash
# File: /.env.production

VITE_SUPABASE_URL=https://[your-production-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-production-anon-key]
VITE_ENVIRONMENT=production
```

---

## 📋 **PHASE 3: Deploy to Vercel**

### **3.1 Install Vercel CLI (if not installed)**

```bash
npm install -g vercel
```

### **3.2 Login to Vercel**

```bash
vercel login
```

---

### **3.3 Deploy SIT Environment**

```bash
# Build for SIT
npm run build:sit

# Deploy to Vercel
vercel --prod

# Answer prompts:
# - Project name: qilly-sit
# - Which scope: [Your Vercel account]
# - Link to existing project: No
# - In which directory: ./
```

**After deployment:**
1. Go to Vercel Dashboard
2. Select `qilly-sit` project
3. Settings → Environment Variables
4. Add:
   - `VITE_SUPABASE_URL` = [your SIT Supabase URL]
   - `VITE_SUPABASE_ANON_KEY` = [your SIT anon key]
5. Settings → Domains
6. Add domain: `sit.qilly.co.za`
7. Wait for DNS verification (15-30 minutes)

---

### **3.4 Deploy UAT Environment**

```bash
# Build for UAT
npm run build:uat

# Deploy to Vercel
vercel --prod

# Answer prompts:
# - Project name: qilly-uat
# - Which scope: [Your Vercel account]
# - Link to existing project: No
```

**After deployment:**
1. Settings → Environment Variables:
   - `VITE_SUPABASE_URL` = [UAT Supabase URL]
   - `VITE_SUPABASE_ANON_KEY` = [UAT anon key]
2. Settings → Domains → Add: `uat.qilly.co.za`

---

### **3.5 Deploy Preprod Environment**

```bash
# Build for Preprod
npm run build:preprod

# Deploy to Vercel
vercel --prod

# Project name: qilly-preprod
```

**After deployment:**
1. Settings → Environment Variables:
   - `VITE_SUPABASE_URL` = [Preprod Supabase URL]
   - `VITE_SUPABASE_ANON_KEY` = [Preprod anon key]
2. Settings → Domains → Add: `preprod.qilly.co.za`

---

### **3.6 Deploy Production Environment**

```bash
# Build for Production
npm run build:prod

# Deploy to Vercel
vercel --prod

# Project name: qilly-production
```

**After deployment:**
1. Settings → Environment Variables:
   - `VITE_SUPABASE_URL` = [Production Supabase URL]
   - `VITE_SUPABASE_ANON_KEY` = [Production anon key]
2. Settings → Domains:
   - Add: `qilly.co.za`
   - Add: `www.qilly.co.za` (optional, will redirect)

---

## 📋 **PHASE 4: Verify DNS Configuration**

Your HostAfrica DNS should have these records:

```
┌──────────┬──────────┬───────────────────────┬──────┐
│ Type     │ Name     │ Value                 │ TTL  │
├──────────┼──────────┼───────────────────────┼──────┤
│ CNAME    │ sit      │ cname.vercel-dns.com  │ 3600 │
│ CNAME    │ uat      │ cname.vercel-dns.com  │ 3600 │
│ CNAME    │ preprod  │ cname.vercel-dns.com  │ 3600 │
│ A        │ @        │ 76.76.21.21           │ 3600 │
│ CNAME    │ www      │ cname.vercel-dns.com  │ 3600 │
└──────────┴──────────┴───────────────────────┴──────┘
```

**Verification:**
```bash
# Check SIT
nslookup sit.qilly.co.za

# Check UAT
nslookup uat.qilly.co.za

# Check Preprod
nslookup preprod.qilly.co.za

# Check Production
nslookup qilly.co.za
```

---

## 📋 **PHASE 5: Set Up Database Schemas**

Each Supabase project needs the database schema.

### **5.1 Run Schema Setup for SIT**

1. Go to https://supabase.com/dashboard
2. Select `qilly-sit` project
3. Click "SQL Editor"
4. Copy contents from `/COMPLETE_DATABASE_SETUP.sql`
5. Paste and run
6. Verify tables created in Table Editor

### **5.2 Repeat for UAT, Preprod, Production**

Run the same SQL script in each environment.

---

## 📋 **PHASE 6: Test Each Environment**

### **Test SIT:**
```
URL: https://sit.qilly.co.za
Database: qilly-sit
Expected: SIT badge shows in admin dashboard
```

### **Test UAT:**
```
URL: https://uat.qilly.co.za
Database: qilly-uat
Expected: UAT badge shows in admin dashboard
```

### **Test Preprod:**
```
URL: https://preprod.qilly.co.za
Database: qilly-preprod
Expected: Preprod badge shows in admin dashboard
```

### **Test Production:**
```
URL: https://qilly.co.za
Database: qilly-production
Expected: Production badge shows, no dev/test features
```

---

## 🚀 **Quick Reference: Build Commands**

```bash
# Development (Local)
npm run dev

# SIT
npm run dev:sit    # Local testing
npm run build:sit  # Build for deployment
vercel --prod      # Deploy

# UAT
npm run dev:uat
npm run build:uat
vercel --prod

# Preprod
npm run dev:preprod
npm run build:preprod
vercel --prod

# Production
npm run dev:prod
npm run build:prod
vercel --prod
```

---

## 📊 **Environment Feature Comparison**

```
┌──────────────────┬─────┬─────┬─────┬────────┬────────────┐
│ Feature          │ Dev │ SIT │ UAT │ Preprod│ Production │
├──────────────────┼─────┼─────┼─────┼────────┼────────────┤
│ Dev Tools Tab    │  ✅  │  ❌  │  ❌  │   ❌   │     ❌     │
│ Testing Tabs     │  ✅  │  ✅  │  ✅  │   ✅   │     ❌     │
│ Debug Mode       │  ✅  │  ❌  │  ❌  │   ❌   │     ❌     │
│ Real Database    │  ✅  │  ✅  │  ✅  │   ✅   │     ✅     │
│ Payment Sandbox  │  ✅  │  ✅  │  ✅  │   ✅   │     ❌     │
│ Payment Live     │  ❌  │  ❌  │  ❌  │   ❌   │     ✅     │
│ Error Details    │  ✅  │  ❌  │  ❌  │   ❌   │     ❌     │
│ Console Logs     │  ✅  │  ❌  │  ❌  │   ❌   │     ❌     │
└──────────────────┴─────┴─────┴─────┴────────┴────────────┘
```

---

## 🔄 **Deployment Workflow**

```
Developer → Commit → Git Push
                       │
                       ▼
                ┌──────────────┐
                │  Development  │ (localhost:5173)
                │  qilly-dev    │
                └──────┬────────┘
                       │ Integration tests pass
                       ▼
                ┌──────────────┐
                │     SIT      │ (sit.qilly.co.za)
                │  qilly-sit   │
                └──────┬────────┘
                       │ Integration approved
                       ▼
                ┌──────────────┐
                │     UAT      │ (uat.qilly.co.za)
                │  qilly-uat   │
                └──────┬────────┘
                       │ User acceptance sign-off
                       ▼
                ┌──────────────┐
                │   Preprod    │ (preprod.qilly.co.za)
                │ qilly-preprod│
                └──────┬────────┘
                       │ Final QA approval
                       ▼
                ┌──────────────┐
                │  Production  │ (qilly.co.za)
                │qilly-production│
                └──────────────┘
```

---

## ✅ **Deployment Checklist**

### SIT Environment:
- [ ] Supabase project created
- [ ] .env.sit updated with credentials
- [ ] Database schema deployed
- [ ] Built with `npm run build:sit`
- [ ] Deployed to Vercel
- [ ] Domain `sit.qilly.co.za` connected
- [ ] SSL certificate valid
- [ ] Environment badge shows "SIT"
- [ ] Database connection working

### UAT Environment:
- [ ] Supabase project created
- [ ] .env.uat updated
- [ ] Database schema deployed
- [ ] Built with `npm run build:uat`
- [ ] Deployed to Vercel
- [ ] Domain `uat.qilly.co.za` connected
- [ ] SSL certificate valid
- [ ] Environment badge shows "UAT"
- [ ] Testing features accessible

### Preprod Environment:
- [ ] Supabase project created
- [ ] .env.preprod updated
- [ ] Database schema deployed
- [ ] Built with `npm run build:preprod`
- [ ] Deployed to Vercel
- [ ] Domain `preprod.qilly.co.za` connected
- [ ] SSL certificate valid
- [ ] Environment badge shows "Preprod"
- [ ] Production-like configuration

### Production Environment:
- [ ] Supabase project created (EU region)
- [ ] .env.production updated
- [ ] Database schema deployed
- [ ] Built with `npm run build:prod`
- [ ] Deployed to Vercel
- [ ] Domain `qilly.co.za` connected
- [ ] SSL certificate valid
- [ ] Environment badge shows "Production"
- [ ] No dev/test features visible
- [ ] Payment gateways in LIVE mode

---

## 💰 **Cost Summary**

```
Monthly Costs:
┌─────────────────────────┬──────────┐
│ Item                    │ Cost     │
├─────────────────────────┼──────────┤
│ Domain (qilly.co.za)    │ ~R20/mo  │
│ Vercel (4 projects)     │ FREE     │
│ Supabase (4 projects)   │ FREE     │
│ SSL Certificates        │ FREE     │
│ DNS Hosting (HostAfrica)│ FREE     │
├─────────────────────────┼──────────┤
│ TOTAL                   │ ~R20/mo  │
└─────────────────────────┴──────────┘

Note: All environments use free tiers!
Upgrade to paid plans when scaling.
```

---

## 🆘 **Troubleshooting**

### **Problem: Environment badge not showing correct environment**

**Solution:**
```bash
# Clear localStorage and reload
localStorage.removeItem('qilly_environment');
window.location.reload();
```

### **Problem: Wrong database connection**

**Check:**
1. Vercel environment variables are set correctly
2. Build command used correct mode (`--mode sit` etc.)
3. Clear browser cache and hard reload

### **Problem: DNS not resolving**

**Check:**
1. Wait 30-60 minutes for DNS propagation (HostAfrica can be slow)
2. Use https://dnschecker.org to verify
3. Check HostAfrica DNS settings match guide

### **Problem: SSL certificate not valid**

**Solution:**
- Wait 10-15 minutes after DNS validates
- Vercel auto-issues certificates
- Check Vercel Dashboard → Domains for status

---

## 📞 **Support Contacts**

**HostAfrica:** +27 (0)21 300 0903  
**Vercel:** https://vercel.com/support  
**Supabase:** https://supabase.com/support  

---

## ✅ **Next Steps**

1. ✅ Create remaining Supabase projects
2. ✅ Update .env files with credentials
3. ✅ Deploy SIT environment first
4. ✅ Test SIT thoroughly
5. ✅ Deploy UAT, Preprod, Production in sequence
6. ✅ Set up monitoring and alerts
7. ✅ Document deployment process for team

---

**All environments are FREE until you're ready to scale!** 🎉
