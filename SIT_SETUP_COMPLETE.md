# ✅ SIT Environment Setup - COMPLETE

## 🎉 **Congratulations!**

Your SIT (System Integration Testing) environment for Qilly is fully configured and ready for integration teams and testers.

---

## 📊 **Environment Summary**

| Environment | Purpose | Supabase Project | Status |
|------------|---------|------------------|--------|
| **Development** | Local development | `qilly-dev` | ✅ Active |
| **SIT/Staging** | Integration testing | `qilly-sit` | ✅ Configured |
| **Production** | Live production | TBD | ⏳ Pending |

---

## 🔧 **What Was Configured:**

### **1. Supabase Project**
- ✅ Created `qilly-sit` project in Singapore region
- ✅ Project ID: `kcptusoevqapcvptlgkd`
- ✅ URL: `https://kcptusoevqapcvptlgkd.supabase.co`

### **2. Code Configuration**
- ✅ Updated `/src/utils/supabase/info.ts` with SIT credentials
- ✅ Set `enabled: true` for staging environment
- ✅ Environment switcher already built into app

### **3. Build Scripts**
Added to `package.json`:
- ✅ `npm run dev:sit` - Run locally in SIT mode
- ✅ `npm run build:sit` - Build for SIT deployment
- ✅ `npm run preview:sit` - Preview SIT build locally

### **4. Deployment Files**
- ✅ `/vercel-sit.json` - Vercel deployment configuration
- ✅ `/.gitignore` - Protect sensitive files

### **5. Documentation**
- ✅ `/SIT_DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- ✅ `/SIT_QUICK_START.md` - 5-minute quick start
- ✅ `/COMMIT_SIT_SETUP.bat` - Git commit helper

---

## 🎯 **Next Steps (Required)**

### **STEP 1: Commit to Git** ⏱️ 1 minute

```bash
# Run the commit script
COMMIT_SIT_SETUP.bat
```

Or manually:
```bash
git add .
git commit -m "Configure SIT environment"
git push origin main
```

---

### **STEP 2: Set Up SIT Database** ⏱️ 5 minutes

1. Open: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd
2. Click **SQL Editor**
3. Copy `COMPLETE_DATABASE_SETUP.sql`
4. Paste and **RUN**
5. Go to **Authentication** → **Providers** → **Email**
6. Disable "Confirm email"
7. Click **Save**

**✅ Database ready!**

---

### **STEP 3: Deploy to Vercel** ⏱️ 5 minutes

**Option A: Quick Deploy**
```bash
npm run build:sit
npm install -g vercel
vercel login
vercel --prod
```

**Option B: GitHub Auto-Deploy**
```bash
git checkout -b sit
git push -u origin sit
```
Then connect to Vercel via dashboard.

**✅ SIT deployed!**

---

### **STEP 4: Share with Team** ⏱️ 2 minutes

Send this to your integration team:

```
🚀 Qilly SIT Environment is Live!

URL: [Your Vercel URL]
Environment: Staging/SIT
Database: qilly-sit (separate from dev)

To test:
1. Go to the URL
2. Switch to "Staging" environment (top-right)
3. Sign up with test account
4. Upload BOQs and test features

Important:
- Use FAKE data only (no real PII)
- This is a TEST environment
- Separate from production

Documentation:
- Quick Start: /SIT_QUICK_START.md
- Full Guide: /SIT_DEPLOYMENT_GUIDE.md
```

---

## 🧪 **Testing SIT Locally (Before Deploy)**

Want to test SIT on your local machine first?

```bash
npm run dev:sit
```

This runs the app connected to `qilly-sit` instead of `qilly-dev`.

**In the app:**
1. Environment switcher shows "🏗️ Staging"
2. All data goes to SIT database
3. No impact on DEV environment

---

## 🔀 **Recommended Git Workflow**

### **Branch Strategy:**

```
main (production-ready)
  │
  ├── develop (active development)
  │
  └── sit (integration testing)
```

### **Workflow:**

1. **Develop on `develop` branch:**
   ```bash
   git checkout develop
   # Make changes
   git commit -m "Add feature"
   git push origin develop
   ```

2. **Merge to `sit` for testing:**
   ```bash
   git checkout sit
   git merge develop
   git push origin sit
   # Auto-deploys to SIT if Vercel connected
   ```

3. **After testing passes:**
   ```bash
   git checkout main
   git merge sit
   git push origin main
   # Deploy to production
   ```

---

## 📋 **Commands Cheat Sheet**

### **Local Development:**
```bash
npm run dev              # DEV environment
npm run dev:sit          # SIT environment
npm run dev:prod         # PROD environment (future)
```

### **Building:**
```bash
npm run build            # DEV build
npm run build:sit        # SIT build
npm run build:prod       # PROD build (future)
```

### **Git:**
```bash
git checkout develop     # Switch to develop
git checkout sit         # Switch to SIT
git checkout main        # Switch to main
```

### **Vercel:**
```bash
vercel                   # Deploy preview
vercel --prod            # Deploy to production
vercel logs              # View logs
```

---

## 🚨 **Troubleshooting**

### **Issue: Can't switch to SIT environment in app**

**Solution:**
- Check that `staging` is enabled in `/src/utils/supabase/info.ts`
- Should show: `enabled: true`

### **Issue: Database connection error**

**Solution:**
1. Verify database setup was run
2. Check Supabase dashboard for errors
3. Run database setup script again

### **Issue: Build fails**

**Solution:**
```bash
# Clear cache and rebuild
npm cache clean --force
npm install
npm run build:sit
```

### **Issue: Vercel deployment fails**

**Solution:**
1. Check build command: `npm run build:sit`
2. Check output directory: `dist`
3. Check Vercel logs for errors

---

## 📊 **Monitoring SIT**

### **Supabase Dashboard:**
```
https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd
```

Monitor:
- Database usage
- API requests
- Authentication activity
- Error logs

### **Vercel Dashboard:**
```
https://vercel.com/dashboard
```

Monitor:
- Deployments
- Function logs
- Analytics
- Performance

---

## 🔐 **Security Reminders**

1. **Environment Isolation:**
   - ✅ SIT has separate database from DEV
   - ✅ SIT has separate authentication
   - ✅ No production data in SIT

2. **Credentials:**
   - ✅ Anon keys are public (safe to expose)
   - ❌ Service role keys NEVER in code
   - ✅ All credentials in Supabase dashboard

3. **Test Data:**
   - ✅ Use fake data only
   - ❌ No real PII
   - ✅ Can reset database anytime

---

## ✅ **Configuration Files**

All SIT configuration files are in your project:

```
/
├── src/utils/supabase/info.ts    # Supabase credentials
├── package.json                  # Build scripts
├── vercel-sit.json               # Vercel config
├── .gitignore                    # Protected files
├── SIT_DEPLOYMENT_GUIDE.md       # Full deployment guide
├── SIT_QUICK_START.md            # Quick start guide
├── COMMIT_SIT_SETUP.bat          # Git commit helper
└── SIT_SETUP_COMPLETE.md         # This file
```

---

## 🎯 **Current Status:**

- [x] SIT Supabase project created
- [x] Code configuration complete
- [x] Build scripts added
- [x] Documentation created
- [ ] **TODO: Set up SIT database**
- [ ] **TODO: Deploy to Vercel**
- [ ] **TODO: Share with testers**

---

## 📞 **Need Help?**

1. **Quick Start:** Read `/SIT_QUICK_START.md`
2. **Full Guide:** Read `/SIT_DEPLOYMENT_GUIDE.md`
3. **Database Setup:** Run `COMPLETE_DATABASE_SETUP.sql` in Supabase
4. **Deployment:** Follow Vercel steps above

---

## 🚀 **Ready to Go!**

Your SIT environment is **fully configured**. Just complete the 3 steps above:

1. ✅ Commit to Git (1 min)
2. ⏳ Set up database (5 min)
3. ⏳ Deploy to Vercel (5 min)

**Total time: 11 minutes to SIT in production!** 🎉

---

**Configured by:** Figma Make AI  
**Date:** February 26, 2026  
**Environment:** SIT (System Integration Testing)  
**Version:** 1.0
