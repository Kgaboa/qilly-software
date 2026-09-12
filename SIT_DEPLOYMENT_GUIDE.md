# 🚀 Qilly SIT Environment - Deployment Guide

## 📋 Overview

**SIT (System Integration Testing)** environment is now configured for integration teams and testers.

---

## 🌍 **Environment Setup**

### **Available Environments:**

| Environment | Purpose | Supabase Project | Status |
|------------|---------|------------------|--------|
| **Development** | Local development | `qilly-dev` (zzdzrlglivtpawtitvgu) | ✅ Active |
| **SIT/Staging** | Integration testing | `qilly-sit` (kcptusoevqapcvptlgkd) | ✅ Active |
| **Production** | Live production | Not configured yet | ⏳ Pending |

---

## 🔧 **Local Development Commands**

### **Run in DEV Environment:**
```bash
npm run dev
```
- Uses `qilly-dev` Supabase project
- For local development only

### **Run in SIT Environment:**
```bash
npm run dev:sit
```
- Uses `qilly-sit` Supabase project
- For testing SIT configuration locally

### **Build for SIT Deployment:**
```bash
npm run build:sit
```
- Creates production build for SIT environment
- Ready for deployment to hosting platform

---

## 🗄️ **SIT Database Setup**

Before testers can use SIT, you need to set up the database:

### **Step 1: Go to SIT Supabase Dashboard**
```
https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd
```

### **Step 2: Run Database Setup**

1. Click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the contents of `/COMPLETE_DATABASE_SETUP.sql`
4. Paste and click **Run**

This creates all tables, RLS policies, and initial data.

### **Step 3: Configure Authentication**

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Go to **Authentication** → **Email Templates**
4. Customize confirmation emails (optional)

### **Step 4: Disable Email Confirmations (For Testing)**

1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. **Uncheck** "Enable email confirmations"
4. Click **Save**

This allows testers to sign up without email verification.

---

## 🌐 **Deploying SIT to Vercel**

### **Option 1: Manual Deployment (Recommended)**

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Login to Vercel**
```bash
vercel login
```

#### **Step 3: Deploy SIT**
```bash
# Build for staging
npm run build:sit

# Deploy to Vercel
vercel --prod
```

When prompted:
- **Project name:** `qilly-sit`
- **Build command:** `npm run build:sit`
- **Output directory:** `dist`

#### **Step 4: Set Up Custom Domain (Optional)**
```bash
vercel domains add sit.qilly.app
```

---

### **Option 2: GitHub Integration (Automated)**

#### **Step 1: Create SIT Branch**
```bash
# Create and switch to SIT branch
git checkout -b sit

# Push to GitHub
git push -u origin sit
```

#### **Step 2: Connect to Vercel**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import `Onlinepricingsystem` from GitHub
4. Configure:
   - **Branch:** `sit`
   - **Build Command:** `npm run build:sit`
   - **Output Directory:** `dist`
   - **Environment Variables:** Leave empty (credentials in code)

#### **Step 3: Enable Auto-Deploy**

Every push to `sit` branch will automatically deploy to SIT environment.

---

## 🔀 **Git Workflow for SIT**

### **Branch Strategy:**

```
main (production-ready code)
  └── develop (ongoing development)
       └── sit (integration testing)
```

### **Workflow:**

1. **Develop locally on `develop` branch:**
   ```bash
   git checkout develop
   git add .
   git commit -m "Add new feature"
   git push origin develop
   ```

2. **Merge to SIT for testing:**
   ```bash
   git checkout sit
   git merge develop
   git push origin sit
   ```
   - Auto-deploys to SIT environment (if Vercel connected)

3. **After testing passes, merge to main:**
   ```bash
   git checkout main
   git merge sit
   git push origin main
   ```

---

## 👥 **Team Access**

### **For Testers:**

1. **SIT URL:** (After deployment)
   - Vercel: `https://qilly-sit.vercel.app`
   - Custom: `https://sit.qilly.app`

2. **Test Accounts:**
   - Email confirmations disabled for easy signup
   - Can create accounts directly in app

3. **Supabase Dashboard Access (Optional):**
   - Go to Supabase project settings
   - Invite testers as "Read-only" members
   - URL: `https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd`

### **For Integration Teams:**

1. **API Endpoints:**
   ```
   Supabase URL: https://kcptusoevqapcvptlgkd.supabase.co
   Anon Key: Available in codebase (public key, safe to share)
   ```

2. **Environment Switcher:**
   - App has built-in environment switcher
   - Can switch between Demo/Dev/SIT/Prod

---

## 🧪 **Testing Guidelines**

### **What to Test in SIT:**

- ✅ User registration and login
- ✅ BOQ upload and pricing
- ✅ Provincial pricing calculations
- ✅ Supplier integration
- ✅ Payment flows (test mode)
- ✅ Document generation (PDF/DOCX)
- ✅ Compliance calculations

### **Test Data:**

SIT database is separate from DEV, so:
- Create test contractors
- Upload test BOQs
- Test all 9 provinces
- Verify pricing accuracy

---

## 🚨 **Troubleshooting**

### **Issue: Can't connect to SIT database**

**Solution:**
```bash
# Verify SIT credentials in code
type src\utils\supabase\info.ts | findstr "staging"

# Should show:
# staging: {
#   projectUrl: 'https://kcptusoevqapcvptlgkd.supabase.co',
#   enabled: true
# }
```

### **Issue: Database tables don't exist**

**Solution:**
1. Go to SIT Supabase SQL Editor
2. Run `/COMPLETE_DATABASE_SETUP.sql`

### **Issue: Authentication errors**

**Solution:**
1. Check SIT Supabase Authentication settings
2. Disable email confirmations for testing
3. Verify Email provider is enabled

---

## 📊 **Monitoring**

### **Supabase Logs:**
```
https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/logs/explorer
```

### **Vercel Logs:**
```
https://vercel.com/dashboard/qilly-sit/logs
```

---

## 🔐 **Security Notes**

1. **Environment Isolation:**
   - SIT uses separate database from DEV
   - No production data in SIT

2. **Credentials:**
   - Anon keys are public (safe to expose)
   - Service role keys should NEVER be in code
   - Only in Supabase dashboard

3. **Test Data:**
   - Use fake data in SIT
   - Don't use real PII
   - Can reset database anytime

---

## ✅ **Checklist: SIT Ready for Testers**

- [x] SIT Supabase project created
- [x] Credentials configured in code
- [ ] Database setup completed
- [ ] Authentication configured
- [ ] SIT deployed to Vercel
- [ ] Test accounts created
- [ ] Team access granted
- [ ] Testing guidelines shared

---

## 🎯 **Next Steps**

1. **Set up SIT database** (run SQL script)
2. **Deploy to Vercel** (choose manual or GitHub integration)
3. **Share SIT URL with testers**
4. **Create test data**
5. **Begin integration testing**

---

## 📞 **Support**

For SIT environment issues:
1. Check this guide first
2. Review Supabase logs
3. Check Vercel deployment logs
4. Contact: Kgabo Sekhula

---

**SIT Environment Configured by:** Figma Make AI  
**Date:** February 26, 2026  
**Version:** 1.0
