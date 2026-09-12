# 🚀 Install Supabase CLI on Windows & Deploy Edge Function

**Goal:** Fix the edge function CORS error by deploying to SIT

**Time:** 10 minutes

---

## 🔧 OPTION 1: Install via Scoop (RECOMMENDED)

### **Step 1: Install Scoop (if not already installed)**

**Open PowerShell as Administrator:**
1. Press `Win + X`
2. Click "Windows PowerShell (Admin)" or "Terminal (Admin)"

**Run this command:**

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

**Wait for Scoop to install** (takes 1-2 minutes)

---

### **Step 2: Install Supabase CLI via Scoop**

**In the same PowerShell window:**

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Wait for installation** (takes 1-2 minutes)

---

### **Step 3: Verify Installation**

```powershell
supabase --version
```

**Expected output:**
```
1.x.x (or similar version number)
```

**If you see the version:** ✅ **Installation successful!**

---

## 🔧 OPTION 2: Install via NPM (Alternative)

**If Scoop doesn't work, use NPM instead:**

**Open Command Prompt or PowerShell:**

```bash
npm install -g supabase
```

**Wait for installation**

**Verify:**

```bash
supabase --version
```

---

## 🔧 OPTION 3: Download Installer (Manual)

**If neither Scoop nor NPM work:**

1. Go to: https://github.com/supabase/cli/releases
2. Download latest Windows installer (.exe or .msi)
3. Run installer
4. Follow installation wizard
5. Restart Command Prompt
6. Run: `supabase --version`

---

## ✅ AFTER INSTALLATION: Deploy Edge Function

### **Step 1: Login to Supabase**

**Open Command Prompt (or PowerShell):**

```bash
supabase login
```

**What happens:**
1. Opens browser
2. Login to your Supabase account
3. Authorize CLI access
4. Return to command prompt

**Expected output:**
```
✓ Logged in successfully
```

---

### **Step 2: Navigate to Your Project**

```bash
cd C:\Users\Kgabo Sekhula\Onlinepricingsystem-main
```

**Or if spaces cause issues:**

```bash
cd "C:\Users\Kgabo Sekhula\Onlinepricingsystem-main"
```

---

### **Step 3: Link to SIT Project**

```bash
supabase link --project-ref kcptusoevqapcvptlgkd
```

**You'll be asked for database password:**
- Check your Supabase dashboard: Settings → Database → Database Password
- Or if you saved it, use that password

**Expected output:**
```
✓ Linked to project kcptusoevqapcvptlgkd
```

---

### **Step 4: Deploy Edge Function**

```bash
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
```

**What happens:**
1. Bundles the edge function code
2. Uploads to Supabase
3. Deploys to SIT environment

**Expected output:**
```
Bundling function...
Deploying function...
✓ Deployed function server
URL: https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server
```

---

### **Step 5: Verify Deployment**

**Test health endpoint:**

```bash
curl https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/health
```

**Expected response:**
```json
{"status":"ok"}
```

**If you see this:** ✅ **Edge function deployed successfully!**

---

## 🎯 COMPLETE COMMAND SEQUENCE

**Copy and paste these commands one by one:**

```bash
# 1. Install Supabase CLI (PowerShell as Admin)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# 2. Verify installation
supabase --version

# 3. Login
supabase login

# 4. Navigate to project
cd "C:\Users\Kgabo Sekhula\Onlinepricingsystem-main"

# 5. Link to SIT
supabase link --project-ref kcptusoevqapcvptlgkd

# 6. Deploy edge function
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd

# 7. Verify deployment
curl https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/health
```

---

## 🎯 TEST IN SIT AFTER DEPLOYMENT

**After deploying, test in SIT:**

1. Go to: https://qilly-sit.vercel.app
2. Login as contractor (kgabo123@gmail.com or create new)
3. Upload BOQ file
4. Click "Process Bill"
5. **SHOULD WORK NOW!** ✅

**Expected in console:**
```
✅ POST /process-bill → 200 OK
✅ BOQ processed successfully
✅ No CORS errors!
```

---

## 🆘 TROUBLESHOOTING

### **Issue 1: Scoop not recognized**

**Solution:**
Close and reopen PowerShell, then try again.

Or use NPM instead:
```bash
npm install -g supabase
```

---

### **Issue 2: Permission denied during installation**

**Solution:**
Run PowerShell as Administrator:
1. Right-click PowerShell
2. Select "Run as Administrator"
3. Try installation again

---

### **Issue 3: Database password not working**

**Solution:**
Get password from Supabase Dashboard:
1. Go to: https://app.supabase.com
2. Select SIT project (kcptusoevqapcvptlgkd)
3. Settings → Database → Database Password
4. Copy the password
5. Paste when prompted

---

### **Issue 4: Deployment fails**

**Check:**
1. Are you in the correct directory? (`C:\Users\Kgabo Sekhula\Onlinepricingsystem-main`)
2. Does `/supabase/functions/server/` folder exist?
3. Is internet connection stable?

**Solution:**
```bash
# Verify you're in the right directory
dir supabase\functions\server

# Should show:
# index.tsx
# kv_store.tsx

# If not, navigate to correct directory
```

---

### **Issue 5: curl not recognized**

**Solution (Windows):**

Use PowerShell's Invoke-WebRequest instead:

```powershell
Invoke-WebRequest -Uri "https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/health"
```

Or install curl:
```bash
scoop install curl
```

Or just test in browser:
- Open: https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/health
- Should show: `{"status":"ok"}`

---

## ✅ SUCCESS CHECKLIST

After completing all steps:

- [ ] Supabase CLI installed (`supabase --version` works)
- [ ] Logged in to Supabase (`supabase login` successful)
- [ ] Linked to SIT project (`supabase link` successful)
- [ ] Edge function deployed (`supabase functions deploy` successful)
- [ ] Health check passes (returns `{"status":"ok"}`)
- [ ] SIT BOQ processing works (no CORS error)

**If all checked:** ✅ **100% READY FOR MONDAY!**

---

## 🎉 AFTER DEPLOYMENT

**What this fixes:**

**BEFORE:**
```
❌ Access blocked by CORS policy
❌ Edge function unreachable
❌ BOQ processing fails in SIT
```

**AFTER:**
```
✅ Edge function deployed
✅ CORS working
✅ BOQ processing works in SIT
✅ 100% SIT functionality!
```

---

## ⏱️ TIME ESTIMATE

```
Install Scoop              2 min
Install Supabase CLI       2 min
Login to Supabase          1 min
Link to project            1 min
Deploy edge function       2 min
Test deployment            1 min
Test SIT BOQ processing    1 min
────────────────────────────────
TOTAL:                    10 min
```

---

## 🎯 QUICK START (Copy-Paste)

**PowerShell as Administrator:**

```powershell
# Install Scoop
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Install Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Verify
supabase --version
```

**Then in regular Command Prompt:**

```bash
# Login
supabase login

# Navigate to project
cd "C:\Users\Kgabo Sekhula\Onlinepricingsystem-main"

# Link to SIT
supabase link --project-ref kcptusoevqapcvptlgkd

# Deploy
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
```

**Done!** ✅

---

## 📞 ALTERNATIVE: Use Supabase Dashboard

**If CLI installation is too complex:**

**Manual deployment via Dashboard:**

1. Go to: https://app.supabase.com
2. Select: SIT project (kcptusoevqapcvptlgkd)
3. Click: Edge Functions
4. Click: "New Function" or upload existing
5. Upload your `/supabase/functions/server/` code
6. Deploy

**However, CLI is faster and more reliable!**

---

## 🚀 FOR MONDAY DEMO

### **IF YOU DEPLOY SUCCESSFULLY:**

**Demo flow:**
1. ✅ Show contractor management in SIT
2. ✅ Show BOQ processing in SIT (now working!)
3. ✅ 100% SIT demo!
4. ✅ Very impressive!

### **IF DEPLOYMENT DOESN'T WORK:**

**Demo flow:**
1. ✅ Show contractor management in SIT
2. ✅ Show BOQ processing in LOCAL
3. ✅ Hybrid demo (still professional!)
4. ✅ Still impressive!

**Either way, you're ready!** 🎉

---

## 📋 FINAL NOTES

**Remember:**
- Installation is ONE-TIME only
- After this, deployment is just: `supabase functions deploy server`
- Edge function will be available in SIT immediately
- CORS error will be fixed
- BOQ processing will work in SIT

**This gets you from 95% → 100% ready!**

---

## ✅ YOU'VE GOT THIS!

**Steps:**
1. ✅ Install Scoop (2 min)
2. ✅ Install Supabase CLI (2 min)
3. ✅ Deploy edge function (5 min)
4. ✅ Test SIT (1 min)
5. ✅ **100% READY FOR MONDAY!** 🚀

**Let's get that edge function deployed!** 💪

---

**Good luck! You're almost at 100%!** 🎯
