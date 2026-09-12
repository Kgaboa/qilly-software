# 🚀 SIT Quick Start - 5 Minute Setup

## ✅ **SIT Configuration Complete!**

Your SIT (System Integration Testing) environment is now configured.

---

## 📋 **What Was Done:**

1. ✅ Created `qilly-sit` Supabase project in Singapore
2. ✅ Updated `/src/utils/supabase/info.ts` with SIT credentials
3. ✅ Added SIT build scripts to `package.json`
4. ✅ Created deployment configuration files

---

## 🎯 **Next: Set Up SIT Database (Required)**

### **Step 1: Open SIT Supabase Dashboard**

```
https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd
```

### **Step 2: Run Database Setup**

1. Click **SQL Editor** (left sidebar)
2. Click **+ New Query**
3. On your local computer, open: `C:\Users\Kgabo Sekhula\Onlinepricingsystem-main\COMPLETE_DATABASE_SETUP.sql`
4. Copy entire contents
5. Paste into Supabase SQL Editor
6. Click **RUN** (bottom right)

**Expected Result:** ✅ "Success. No rows returned"

### **Step 3: Disable Email Confirmations (For Testing)**

1. In Supabase dashboard, click **Authentication** → **Providers**
2. Click **Email**
3. Scroll down to **"Confirm email"**
4. Toggle it **OFF**
5. Click **Save**

---

## 🧪 **Test SIT Locally (Optional)**

Before deploying, test SIT environment on your computer:

```bash
# Run app in SIT mode
npm run dev:sit
```

This connects to `qilly-sit` Supabase instead of `qilly-dev`.

**In the app:**
- Switch environment to "Staging" (use Environment Switcher)
- Try creating a test account
- Upload a BOQ

---

## 🌐 **Deploy SIT to Vercel**

### **Quick Deploy (5 minutes):**

```bash
# 1. Build for SIT
npm run build:sit

# 2. Install Vercel CLI (if not already installed)
npm install -g vercel

# 3. Login to Vercel
vercel login

# 4. Deploy
vercel --prod
```

**When prompted:**
- Project name: `qilly-sit`
- Deploy? **Yes**

**Result:** You'll get a URL like:
```
https://qilly-sit.vercel.app
```

---

## 👥 **Share with Testers**

### **Send to your team:**

```
🚀 Qilly SIT Environment Ready!

URL: https://qilly-sit.vercel.app
Environment: Staging/SIT
Purpose: Integration testing

To test:
1. Go to URL above
2. Click "Sign Up"
3. Create test account (no email confirmation needed)
4. Start testing!

Note: This is a TEST environment - use fake data only.
```

---

## 🔀 **Git Workflow (Optional - For CI/CD)**

If you want automatic deployments when you push to GitHub:

### **Create SIT Branch:**

```bash
# Create SIT branch
git checkout -b sit

# Add new files
git add .

# Commit
git commit -m "Configure SIT environment"

# Push to GitHub
git push -u origin sit
```

### **Connect to Vercel:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import from GitHub: `Onlinepricingsystem`
4. Settings:
   - **Branch:** `sit`
   - **Build Command:** `npm run build:sit`
   - **Output Directory:** `dist`
5. Click **Deploy**

Now every push to `sit` branch auto-deploys to SIT!

---

## ✅ **Checklist:**

- [ ] Open SIT Supabase dashboard
- [ ] Run `COMPLETE_DATABASE_SETUP.sql` in SQL Editor
- [ ] Disable email confirmations
- [ ] Test locally with `npm run dev:sit` (optional)
- [ ] Deploy to Vercel with `vercel --prod`
- [ ] Share URL with testers
- [ ] Create SIT git branch (optional)

---

## 🚨 **If Something Goes Wrong:**

### **Database connection error:**
```bash
# Verify SIT credentials
type src\utils\supabase\info.ts | findstr "staging"
```

### **Build fails:**
```bash
# Try clean build
npm run build:sit
```

### **Can't login in SIT:**
1. Check Supabase dashboard
2. Authentication → Providers → Email must be enabled
3. Disable email confirmations

---

## 📊 **Monitoring:**

**SIT Database:**
```
https://supabase.com/dashboard/project/kcptusoevqapcvptlgkd
```

**SIT Deployment:**
```
https://vercel.com/dashboard
```

---

## 🎯 **You're Ready!**

Your SIT environment is configured. Just:

1. **Set up database** (5 min)
2. **Deploy to Vercel** (5 min)
3. **Start testing!**

---

**Questions?** Check `/SIT_DEPLOYMENT_GUIDE.md` for detailed instructions.
