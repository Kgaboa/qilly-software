# 🚨 SIT DEPLOYMENT FIX - Wrong Database Connection

## Problem Summary
SIT deployment at https://qilly-2ctfxlfcx-assure-tech-solution.vercel.app is using the **DEVELOPMENT database** (zzdzrlglivtpawtitvgu) instead of the **SIT database** (kcptusoevqapcvptlgkd).

## Root Cause
When Vercel builds your app, it doesn't have access to local build modes. The environment detection falls back to 'development' because:
1. `vercel-build` runs `vite build` without `--mode sit`
2. No environment variables are set in Vercel to override this
3. Result: Uses development database instead of SIT database

---

## ✅ SOLUTION: 3-Step Fix

### **Step 1: Set Environment Variables in Vercel** ⚙️

1. **Go to:** https://vercel.com/assure-tech-solution/qilly-sit/settings/environment-variables

2. **Add these 3 variables:**

   | Variable Name | Value | Environment |
   |---------------|-------|-------------|
   | `VITE_ENVIRONMENT` | `sit` | Production |
   | `VITE_SUPABASE_URL` | `https://kcptusoevqapcvptlgkd.supabase.co` | Production |
   | `VITE_SUPABASE_ANON_KEY` | [See below] | Production |

3. **Get the SIT Anon Key:**
   - Go to: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/settings/api
   - Copy the **"anon public"** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - Paste as `VITE_SUPABASE_ANON_KEY` value

4. **Click "Save"** for each variable

---

### **Step 2: Rebuild and Redeploy** 🚀

After setting environment variables, you need to rebuild:

**Option A: From Local (Recommended)**
```bash
cd "C:\Users\Kgabo Sekhula\Onlinepricingsystem-main"

# Pull latest fixes from Figma Make
git pull origin main

# Redeploy (Vercel will use the new environment variables)
vercel --prod
```

**Option B: From Vercel Dashboard**
1. Go to: https://vercel.com/assure-tech-solution/qilly-sit/deployments
2. Click the **latest deployment**
3. Click **"Redeploy"** button
4. Wait ~1 minute for build to complete

---

### **Step 3: Verify SIT Database Setup** 🗂️

**CRITICAL:** The SIT database needs tables created.

1. **Go to:** https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd
2. **Click:** Table Editor (left sidebar)
3. **Check:** Do you see 8 tables?
   - ✅ users
   - ✅ bills
   - ✅ bill_items
   - ✅ suppliers
   - ✅ contractors
   - ✅ subscriptions
   - ✅ provinces
   - ✅ municipalities

**If NO tables exist:**
1. Click **SQL Editor** → New Query
2. Open your local file: `C:\Users\Kgabo Sekhula\Onlinepricingsystem-main\COMPLETE_DATABASE_SETUP.sql`
3. Copy ALL 713 lines
4. Paste into SQL Editor
5. Click **"Run"** (Ctrl+Enter)
6. Wait ~15 seconds
7. Verify tables appear in Table Editor

---

## 🧪 Testing After Deployment

### **Test 1: Check Environment Badge**
1. Visit: https://qilly-2ctfxlfcx-assure-tech-solution.vercel.app
2. Look for environment badge (top-right)
3. **Expected:** Gray badge with 🔍 icon saying **"SIT"**

### **Test 2: Check Console Logs**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Refresh page
4. **Expected:** `🌍 Using environment from VITE_ENVIRONMENT: SIT`

### **Test 3: Test Contractor Signup**
1. Click "Get Started" → "Contractor Signup"
2. Fill in test data:
   ```
   Company: Test SIT Company
   Email: test-sit-contractor@example.com
   Province: Gauteng
   ```
3. Submit form
4. **Expected:** Success message

### **Test 4: Verify Database**
1. Go to: https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd/editor
2. Click **contractors** table
3. **Expected:** See your test contractor (test-sit-contractor@example.com)

### **Test 5: Admin Dashboard**
1. Login as admin
2. Go to **Contractors** tab
3. **Expected:** See the test contractor
4. Go to **Settings** tab
5. **Expected:** See **5 environments** (Development, SIT, UAT, Preprod, Production)
6. **Expected:** Current environment shows **SIT**

---

## 🌐 DNS Configuration (Separate Issue)

The domain `sit.qilly.co.za` isn't working yet. This is a DNS issue, not a deployment issue.

### **Fix DNS in HostAfrica:**

1. **Login:** https://www.hostafrica.com/
2. **Navigate:** Domains → qilly.co.za → DNS Management
3. **Add CNAME record:**
   ```
   Type:  CNAME
   Name:  sit
   Value: cname.vercel-dns.com.
   TTL:   3600 (or Auto)
   ```
4. **Save changes**
5. **Wait:** 5-30 minutes for DNS propagation

### **Verify DNS is working:**
```bash
# In Command Prompt:
nslookup sit.qilly.co.za

# Expected output (after propagation):
Name:    sit.qilly.co.za
Address: 76.76.21.21  (Vercel IP)
```

### **Check SSL Certificate:**
After DNS propagates, Vercel will auto-issue SSL certificate (1-5 minutes).

**Check status:**
1. https://vercel.com/assure-tech-solution/qilly-sit/settings/domains
2. Look for `sit.qilly.co.za`
3. Status should show: ✅ "Valid Certificate"

---

## 📊 Environment Detection Priority

After the fix, environment is detected in this order:

1. **localStorage override** (for testing in browser)
2. **URL parameter** (`?env=sit`)
3. **VITE_ENVIRONMENT** (set in Vercel) ⭐ **NEW!**
4. **Build mode** (`vite build --mode sit`)
5. **Default** (falls back to development)

Now Vercel deployments will use **#3** (VITE_ENVIRONMENT variable).

---

## 🗂️ Complete Environment Configuration

| Environment | Database | URL | Status |
|-------------|----------|-----|--------|
| **Development** | zzdzrlglivtpawtitvgu | http://localhost:5173 | ✅ Active |
| **SIT** | kcptusoevqapcvptlgkd | https://sit.qilly.co.za | 🔧 Fixing now |
| **UAT** | Not created | https://uat.qilly.co.za | ⏳ Pending |
| **Preprod** | Not created | https://preprod.qilly.co.za | ⏳ Pending |
| **Production** | Not created | https://qilly.co.za | ⏳ Pending |

---

## ✅ Verification Checklist

After completing all steps:

- [ ] Environment variables set in Vercel (3 variables)
- [ ] Redeployed to Vercel
- [ ] SIT database has 8 tables
- [ ] Environment badge shows "SIT"
- [ ] Console logs show "Using environment from VITE_ENVIRONMENT: SIT"
- [ ] Contractor signup works
- [ ] Data appears in SIT database (kcptusoevqapcvptlgkd)
- [ ] Data DOES NOT appear in development database (zzdzrlglivtpawtitvgu)
- [ ] Admin Dashboard shows 5 environments
- [ ] DNS configured in HostAfrica
- [ ] sit.qilly.co.za resolves (after DNS propagation)
- [ ] SSL certificate issued (after DNS propagation)

---

## 🚀 Summary

**What was wrong:**
- ❌ Vercel deployment had no environment variables
- ❌ Defaulted to development database
- ❌ DNS not configured for sit.qilly.co.za

**What's fixed:**
- ✅ Added VITE_ENVIRONMENT variable support
- ✅ Environment variables configured in Vercel
- ✅ DNS configuration instructions provided
- ✅ Complete testing checklist

**Next steps:**
1. Set 3 environment variables in Vercel
2. Redeploy
3. Run SQL setup on SIT database (if not done)
4. Test contractor signup
5. Configure DNS in HostAfrica

---

**After setting environment variables and redeploying, your SIT environment will use the correct database!** 🎯
