# 🛠️ Windows Troubleshooting Guide

**Quick fixes for common Windows setup issues**

---

## ✅ Fixed: ".' is not recognized" Error

**Issue:** Running `scripts\setup-environments.bat` gives error:
```
.' is not recognized as an internal or external command,
operable program or batch file.
```

**Cause:** Syntax error in the original batch file.

**Solution:** ✅ **FIXED!** The batch file has been updated.

**Run this again:**
```cmd
cd C:\path\to\qilly
scripts\setup-environments.bat
```

Should now work! ✅

---

## 🚀 How to Run the Script (Step-by-Step)

### Method 1: Command Prompt (Recommended)

**Step 1:** Open Command Prompt
- Press `Win + R`
- Type: `cmd`
- Press Enter

**Step 2:** Navigate to your project
```cmd
cd C:\Users\YourName\qilly
```
*(Replace with your actual path)*

**Step 3:** Verify you're in the right place
```cmd
dir
```
You should see: `package.json`, `src`, `scripts`, etc.

**Step 4:** Run the script
```cmd
scripts\setup-environments.bat
```

**Expected output:**
```
========================================
  Qilly Multi-Environment Setup
========================================

[INFO] Checking prerequisites...
[SUCCESS] All prerequisites installed
...
```

---

### Method 2: PowerShell

**Step 1:** Open PowerShell
- Press `Win + X`
- Select "Windows PowerShell"

**Step 2:** Navigate to project
```powershell
cd C:\Users\YourName\qilly
```

**Step 3:** Run script
```powershell
.\scripts\setup-environments.bat
```

---

### Method 3: Windows Terminal (Modern)

**Step 1:** Install Windows Terminal (if not installed)
- Open Microsoft Store
- Search "Windows Terminal"
- Install

**Step 2:** Open Windows Terminal
- Press `Win + X`
- Select "Terminal"

**Step 3:** Navigate and run
```cmd
cd C:\Users\YourName\qilly
scripts\setup-environments.bat
```

---

### Method 4: File Explorer (Double-Click)

**Step 1:** Open File Explorer
- Press `Win + E`

**Step 2:** Navigate to scripts folder
```
C:\Users\YourName\qilly\scripts\
```

**Step 3:** Double-click
- `setup-environments.bat`

**Script runs in new window!**

---

## 🆘 Common Issues & Fixes

### Issue: "The system cannot find the path specified"

**Error:**
```
The system cannot find the path specified.
```

**Cause:** You're not in the project directory.

**Fix:**
```cmd
# Check where you are
cd

# Navigate to project (replace with YOUR path)
cd C:\Users\YourName\qilly

# Verify you're in the right place
dir

# You should see: package.json, src, scripts
```

---

### Issue: "package.json not found"

**Error:**
```
[ERROR] package.json not found. Please run this script from the project root directory.
```

**Cause:** Running from wrong directory.

**Fix:**
```cmd
# Don't run from inside scripts folder!
# WRONG:
cd C:\Users\YourName\qilly\scripts
setup-environments.bat   ❌

# CORRECT:
cd C:\Users\YourName\qilly
scripts\setup-environments.bat   ✅
```

---

### Issue: "Node.js is not installed"

**Error:**
```
[ERROR] Node.js is not installed. Please install Node.js v18+ first.
```

**Fix:**

**Step 1:** Download Node.js
- Visit: https://nodejs.org/
- Download LTS version (v18+)
- Run installer

**Step 2:** Install with defaults
- Click "Next" through all options
- Check "Automatically install necessary tools"
- Click "Install"

**Step 3:** Restart Command Prompt
- Close all Command Prompt windows
- Open new Command Prompt
- Verify:
```cmd
node --version
npm --version
```

**Expected:**
```
v18.x.x (or higher)
8.x.x (or higher)
```

---

### Issue: "Git is not installed"

**Error:**
```
[ERROR] Git is not installed. Please install Git first.
```

**Fix:**

**Step 1:** Download Git
- Visit: https://git-scm.com/download/win
- Download 64-bit version

**Step 2:** Install with defaults
- Click "Next" through options
- **Important:** Keep "Git from the command line" selected
- Click "Install"

**Step 3:** Restart Command Prompt
- Close all CMD windows
- Open new Command Prompt
- Verify:
```cmd
git --version
```

**Expected:**
```
git version 2.x.x
```

---

### Issue: "npm install" fails

**Error:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Fix:**

**Option 1: Clear npm cache**
```cmd
npm cache clean --force
npm install
```

**Option 2: Delete node_modules and reinstall**
```cmd
rmdir /s /q node_modules
del package-lock.json
npm install
```

**Option 3: Run as Administrator**
- Right-click Command Prompt
- Select "Run as Administrator"
- Navigate to project
- Run script again

---

### Issue: PowerShell execution policy error

**Error:**
```
PowerShell: Execution of scripts is disabled on this system
```

**Fix:**

**Step 1:** Open PowerShell as Administrator
- Press `Win + X`
- Select "Windows PowerShell (Admin)"

**Step 2:** Run this command
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Step 3:** Type `Y` and press Enter

**Step 4:** Close and reopen PowerShell (normal, not admin)

**Step 5:** Run script again

---

### Issue: "Access denied" or "Permission denied"

**Cause:** Antivirus blocking or admin rights needed.

**Fix:**

**Option 1: Run as Administrator**
- Right-click Command Prompt icon
- Select "Run as Administrator"
- Navigate to project
- Run script

**Option 2: Temporarily disable antivirus**
- Windows Defender or other antivirus may block
- Temporarily disable
- Run script
- Re-enable antivirus

**Option 3: Add exception**
- Add project folder to antivirus exceptions
- Windows Defender → Virus & threat protection → Exclusions
- Add folder: `C:\Users\YourName\qilly`

---

### Issue: ".env files not showing in File Explorer"

**Cause:** Windows hides files starting with `.` by default.

**Fix:**

**Step 1:** Open File Explorer
- Press `Win + E`

**Step 2:** Click "View" tab

**Step 3:** Check these boxes:
- ✅ "Hidden items"
- ✅ "File name extensions"

**Now you can see:**
- `.env.development`
- `.env.sit`
- `.env.staging`
- `.env.production`

---

### Issue: Git branches not created

**Error:**
```
[ERROR] Failed to create branch: develop
```

**Fix:**

**Option 1: Initialize Git first**
```cmd
git init
git add .
git commit -m "Initial commit"
scripts\setup-environments.bat
```

**Option 2: Check if already in Git repo**
```cmd
git status
```

If says "not a git repository", initialize:
```cmd
git init
```

Then run script again.

---

### Issue: "Command not found" for git/node/npm

**Cause:** PATH environment variable not set.

**Fix:**

**Step 1:** Search for "Environment Variables"
- Press `Win + S`
- Type: "environment variables"
- Click: "Edit the system environment variables"

**Step 2:** Edit PATH
- Click "Environment Variables"
- Under "System variables", find "Path"
- Click "Edit"

**Step 3:** Add Node.js path
- Click "New"
- Add: `C:\Program Files\nodejs\`
- Click OK

**Step 4:** Add Git path
- Click "New"
- Add: `C:\Program Files\Git\bin\`
- Click OK

**Step 5:** Restart Command Prompt
- Close all CMD windows
- Open new one
- Verify: `node --version` and `git --version`

---

## ✅ Verification Checklist

**Before running script:**
- [ ] Node.js v18+ installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Git installed: `git --version`
- [ ] In project directory: `cd C:\path\to\qilly`
- [ ] Can see package.json: `dir package.json`

**After running script:**
- [ ] Saw "All prerequisites installed"
- [ ] Saw "Dependencies installed"
- [ ] Saw "Git branches configured"
- [ ] Saw 4x "Created .env.*" messages
- [ ] Saw "Multi-Environment Setup Complete!"
- [ ] Can see .env files: `dir .env.*`

**All checked?** ✅ Setup successful!

---

## 🎯 Quick Test

**After setup completes, test it:**

```cmd
# Test Node
node --version

# Test npm
npm --version

# Test Git
git --version

# Check branches
git branch

# Check .env files
dir .env.*

# Start development
npm run dev
```

**Expected:**
```
Node: v18.x.x ✅
npm: 8.x.x ✅
Git: 2.x.x ✅
Branches: main, develop, sit, staging ✅
.env files: 4 files found ✅
Dev server: Running on http://localhost:3000 ✅
```

---

## 🔧 Advanced Troubleshooting

### Enable Detailed Error Messages

```cmd
# Run script with error details
scripts\setup-environments.bat 2>&1 | more
```

### Check Script Syntax

```cmd
# View script contents
type scripts\setup-environments.bat
```

### Manual Step-by-Step

If script still fails, run commands manually:

```cmd
# 1. Install dependencies
npm install

# 2. Initialize Git (if needed)
git init
git add .
git commit -m "Initial commit"

# 3. Create branches
git checkout -b develop
git checkout -b sit
git checkout -b staging
git checkout main

# 4. Create .env files manually
notepad .env.development
notepad .env.sit
notepad .env.staging
notepad .env.production
```

**Template for .env files:**
```env
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
CRON_SECRET=your-random-secret-here
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true
NEXT_PUBLIC_APP_VERSION=1.0.0-dev
```

---

## 📞 Still Having Issues?

### Check Documentation

1. **WINDOWS_SETUP_GUIDE.md** - Complete Windows guide
2. **START_HERE_SETUP.md** - Main setup guide
3. **DOCUMENTATION_INDEX.md** - All docs

### Verify Prerequisites

```cmd
# Check versions
node --version
npm --version
git --version

# Check location
cd
dir

# Check package.json exists
dir package.json
```

### Try Alternative Methods

**Option 1: Use Git Bash**
- Included with Git for Windows
- Right-click folder → "Git Bash Here"
- Run: `./scripts/setup-environments.sh`

**Option 2: Use WSL (Windows Subsystem for Linux)**
- If you have WSL installed
- Run: `./scripts/setup-environments.sh`

**Option 3: Manual Setup**
- Follow steps in WINDOWS_SETUP_GUIDE.md
- Run commands one by one

---

## ✅ Success Indicators

**When script runs successfully, you'll see:**

```
========================================
  Qilly Multi-Environment Setup
========================================

[INFO] Checking prerequisites...
[SUCCESS] All prerequisites installed

[INFO] Installing npm dependencies...
[SUCCESS] Dependencies installed

[INFO] Setting up Git branches...
[SUCCESS] Created branch: develop
[SUCCESS] Created branch: sit
[SUCCESS] Created branch: staging
[SUCCESS] Git branches configured

[INFO] Creating environment configuration files...
[SUCCESS] Created .env.development
[SUCCESS] Created .env.sit
[SUCCESS] Created .env.staging
[SUCCESS] Created .env.production

==========================================
  Multi-Environment Setup Complete!
==========================================

[SUCCESS] Ready to deploy!
```

**Press any key to close.**

---

## 🎊 After Successful Setup

**Next steps:**

1. **Create Supabase projects** (15 min)
   - Visit: https://app.supabase.com
   - Create 4 projects

2. **Update .env files** (5 min)
   - Edit with Notepad or VS Code
   - Add Supabase credentials

3. **Test locally** (2 min)
   ```cmd
   npm run dev
   ```

4. **Push to GitHub** (5 min)
   ```cmd
   git push -u origin main
   git push -u origin develop
   git push -u origin sit
   git push -u origin staging
   ```

5. **Deploy to Vercel** (10 min)
   - Import repository
   - Configure environment variables

**Full guide:** WINDOWS_SETUP_GUIDE.md

---

**🛠️ Issue resolved? Run the script again!**

```cmd
scripts\setup-environments.bat
```

**Still stuck?** Open an issue on GitHub with:
- Error message (full text)
- Windows version
- Node/npm/Git versions
- Steps you tried
