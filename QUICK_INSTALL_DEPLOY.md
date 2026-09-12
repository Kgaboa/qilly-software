# ⚡ QUICK: Install Supabase CLI & Deploy (Windows)

**Goal:** Fix CORS error and get to 100% ready!

**Time:** 10 minutes

---

## 🚀 COPY-PASTE THESE COMMANDS

### **STEP 1: Install Supabase CLI**

**Open PowerShell as Administrator:**
- Press `Win + X`
- Click "Windows PowerShell (Admin)"

**Copy and paste these commands ONE BY ONE:**

```powershell
# Allow script execution
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install Scoop package manager
irm get.scoop.sh | iex

# Add Supabase bucket
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git

# Install Supabase CLI
scoop install supabase

# Verify installation
supabase --version
```

**Expected output:**
```
1.x.x
```

✅ **If you see a version number, CLI is installed!**

---

### **STEP 2: Deploy Edge Function**

**Open regular Command Prompt (NOT PowerShell):**
- Press `Win + R`
- Type `cmd`
- Press Enter

**Copy and paste these commands ONE BY ONE:**

```bash
# Login to Supabase (opens browser)
supabase login

# Navigate to your project
cd "C:\Users\Kgabo Sekhula\Onlinepricingsystem-main"

# Link to SIT project
supabase link --project-ref kcptusoevqapcvptlgkd

# Deploy edge function to SIT
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
```

**When asked for database password:**
- Check Supabase Dashboard: Settings → Database → Database Password
- Or ask your team for the SIT database password

**Expected output:**
```
✓ Deployed function server
```

---

### **STEP 3: Verify It Works**

**Test in browser:**

1. Open: https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/health

2. Should show: `{"status":"ok"}`

3. If you see that: ✅ **Edge function deployed!**

---

### **STEP 4: Test SIT BOQ Processing**

1. Go to: https://qilly-sit.vercel.app
2. Login as contractor
3. Upload BOQ file
4. Click "Process Bill"
5. **Should work with NO CORS error!** ✅

---

## ✅ THAT'S IT!

**What you just did:**
- ✅ Installed Supabase CLI
- ✅ Deployed edge function to SIT
- ✅ Fixed CORS error
- ✅ SIT now at 100% functionality!

**Monday demo:**
- ✅ Can use SIT for EVERYTHING
- ✅ Contractor management ✅
- ✅ BOQ processing ✅
- ✅ 100% ready! 🎉

---

## 🆘 IF SOMETHING FAILS

**Use Plan B: Hybrid Demo**

- SIT: Contractor management ✅
- LOCAL: BOQ processing ✅
- Still 95% ready!

**See:** `/MONDAY_DEMO_PLAN.md` for hybrid demo script

---

## 📞 QUICK REFERENCE

**Install:**
```powershell
# PowerShell as Admin
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Deploy:**
```bash
# Regular Command Prompt
cd "C:\Users\Kgabo Sekhula\Onlinepricingsystem-main"
supabase login
supabase link --project-ref kcptusoevqapcvptlgkd
supabase functions deploy server --project-ref kcptusoevqapcvptlgkd
```

**Test:**
```
https://kcptusoevqapcvptlgkd.supabase.co/functions/v1/server/make-server-9db710f3/health
```

---

## ⏱️ TIME: 10 MINUTES

```
Install Scoop + Supabase CLI    5 min
Deploy edge function            3 min
Test deployment                 2 min
────────────────────────────────────
TOTAL:                         10 min
```

**Then you're at 100% for Monday!** 🚀

---

**Full guide:** `/INSTALL_SUPABASE_CLI_WINDOWS.md`

**Go get that edge function deployed!** 💪
