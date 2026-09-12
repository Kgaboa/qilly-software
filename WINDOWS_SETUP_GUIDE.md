# 🪟 Windows Setup Guide

**Complete multi-environment setup for Windows users**

**Time:** 30-60 minutes  
**Difficulty:** Easy

---

## ✅ Prerequisites (Windows)

### Required Software

- [ ] **Node.js v18+** - [Download](https://nodejs.org/)
- [ ] **Git for Windows** - [Download](https://git-scm.com/download/win)
- [ ] **Text Editor** - VS Code recommended: [Download](https://code.visualstudio.com/)
- [ ] **GitHub account** - [Sign up](https://github.com/signup)
- [ ] **Vercel account** - [Sign up](https://vercel.com/signup)
- [ ] **Supabase account** - [Sign up](https://app.supabase.com)

### Verify Installation

Open **Command Prompt** or **PowerShell** and run:

```cmd
node --version
npm --version
git --version
```

**Expected output:**
```
v18.x.x (or higher)
8.x.x (or higher)
git version 2.x.x
```

✅ All installed? Continue to setup!

---

## 🚀 Step 1: Run Setup Script (5 minutes)

### Method 1: Using Command Prompt (Recommended)

1. **Open Command Prompt:**
   - Press `Win + R`
   - Type `cmd`
   - Press Enter

2. **Navigate to project:**
   ```cmd
   cd C:\path\to\qilly
   ```

3. **Run the setup script:**
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

### Method 2: Using PowerShell

1. **Open PowerShell:**
   - Press `Win + X`
   - Select "Windows PowerShell"

2. **Navigate to project:**
   ```powershell
   cd C:\path\to\qilly
   ```

3. **Run the setup script:**
   ```powershell
   .\scripts\setup-environments.bat
   ```

### Method 3: Double-Click (Easiest)

1. **Open File Explorer** (`Win + E`)
2. **Navigate to** `C:\path\to\qilly\scripts\`
3. **Double-click** `setup-environments.bat`
4. **Follow on-screen instructions**

---

## 📺 What the Script Does

### Phase 1: Prerequisites Check
```
[INFO] Checking prerequisites...
```

**Checks for:**
- ✅ Node.js installed
- ✅ npm installed
- ✅ Git installed

**If any missing:**
```
[ERROR] Node.js is not installed. Please install Node.js v18+ first.
Download from: https://nodejs.org/
```

**Action:** Install the missing software, then re-run script

---

### Phase 2: Install Dependencies
```
[INFO] Installing npm dependencies...
```

**What happens:**
- Runs `npm install`
- Installs all packages from package.json
- Takes 1-3 minutes

**Success:**
```
[SUCCESS] Dependencies installed
```

---

### Phase 3: Git Branch Setup
```
[INFO] Setting up Git branches...
```

**Creates branches:**
- `develop` - For feature development
- `sit` - For QA testing
- `staging` - For pre-production
- (Already on `main` - for production)

**Output:**
```
[SUCCESS] Created branch: develop
[SUCCESS] Created branch: sit
[SUCCESS] Created branch: staging
[SUCCESS] Git branches configured
```

---

### Phase 4: Environment Files
```
[INFO] Creating environment configuration files...
```

**Creates 4 files:**
- `.env.development` - Dev config
- `.env.sit` - SIT config
- `.env.staging` - Staging config
- `.env.production` - Production config

**Each contains:**
- Environment name
- Supabase credentials (to be updated)
- Unique `CRON_SECRET` (auto-generated)
- Feature flags

**Output:**
```
[SUCCESS] Created .env.development
[SUCCESS] Created .env.sit
[SUCCESS] Created .env.staging
[SUCCESS] Created .env.production
```

---

### Phase 5: Next Steps
```
==========================================
  Multi-Environment Setup Complete!
==========================================

Next Steps:
1. Create Supabase Projects...
2. Update Environment Files...
...

[SUCCESS] Ready to deploy!

Press any key to continue . . .
```

**Press any key to close the window**

---

## 🗄️ Step 2: Create Supabase Projects (15 minutes)

### Create Development Project

1. **Open browser:** https://app.supabase.com
2. **Click:** "New Project"
3. **Fill in:**
   - Name: `qilly-dev`
   - Database Password: Click "Generate" → **Copy and save!**
   - Region: Europe (Frankfurt)
   - Plan: Free
4. **Click:** "Create new project"
5. **Wait:** 2-3 minutes

### Get Credentials

1. **Go to:** Settings → API
2. **Copy these values:**

```
Project URL: https://xxxdev.supabase.co
Anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Update .env.development (Windows)

**Option 1: Using Notepad**

1. **Right-click** `.env.development`
2. **Select:** "Open with" → "Notepad"
3. **Replace lines:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxdev.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Save:** `Ctrl + S`

**Option 2: Using VS Code**

1. **Right-click** `.env.development`
2. **Select:** "Open with Code"
3. **Update credentials**
4. **Save:** `Ctrl + S`

**Option 3: Using Command Line**

```cmd
notepad .env.development
```

### Repeat for Other Environments

**Create 3 more projects:**
- `qilly-sit` → Update `.env.sit`
- `qilly-staging` → Update `.env.staging`
- `qilly-production` → Update `.env.production`

**Tip:** Open all files in VS Code tabs for easy editing!

---

## 🧪 Step 3: Test Local Development (2 minutes)

**Open Command Prompt or PowerShell:**

```cmd
cd C:\path\to\qilly
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in 450 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Open browser:** http://localhost:3000

**Verify:**
- [ ] App loads successfully
- [ ] Environment badge shows "Development"
- [ ] No errors in browser console

### Test Health Endpoint

**In new Command Prompt window:**

```cmd
curl http://localhost:3000/api/health
```

**Don't have curl?** Install it:
```cmd
# Windows 10/11 includes curl by default
# Or use PowerShell:
Invoke-RestMethod http://localhost:3000/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "environment": "development",
  "checks": { ... }
}
```

✅ **Local development working!**

---

## 🌿 Step 4: Push to GitHub (5 minutes)

### First Time Git Setup

**Open Command Prompt or PowerShell:**

```cmd
cd C:\path\to\qilly

# Configure Git (if not done already)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize repository (if needed)
git init

# Add remote
git remote add origin https://github.com/your-username/qilly.git

# Verify
git remote -v
```

### Push All Branches

```cmd
# Stage all files
git add .

# Commit
git commit -m "feat: multi-environment setup complete"

# Push main branch
git push -u origin main

# Push other branches
git push -u origin develop
git push -u origin sit
git push -u origin staging
```

**Expected output:**
```
Enumerating objects: 150, done.
Writing objects: 100% (150/150), 45.23 KiB | 2.26 MiB/s, done.
To github.com:your-username/qilly.git
 * [new branch]      main -> main
 * [new branch]      develop -> develop
 * [new branch]      sit -> sit
 * [new branch]      staging -> staging
```

✅ **All branches on GitHub!**

---

## ☁️ Step 5: Deploy to Vercel (10 minutes)

### Import Repository

1. **Go to:** https://vercel.com
2. **Click:** "Add New..." → "Project"
3. **Import:** Your GitHub repository
4. **Framework:** Vite (auto-detected)
5. **Build settings:** Leave defaults
6. **DON'T DEPLOY YET!** → Add environment variables first

### Add Environment Variables

**For each environment:**

#### Development (develop branch)

1. Click "Environment Variables"
2. Add 4 variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | From `.env.development` | Preview → `develop` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From `.env.development` | Preview → `develop` |
| `NEXT_PUBLIC_ENVIRONMENT` | `development` | Preview → `develop` |
| `CRON_SECRET` | From `.env.development` | Preview → `develop` |

**To copy values on Windows:**

**Using Notepad:**
1. Open `.env.development` in Notepad
2. Select value after `=`
3. Press `Ctrl + C` to copy
4. Paste in Vercel with `Ctrl + V`

**Using VS Code:**
1. Open `.env.development`
2. Select value
3. Copy (`Ctrl + C`)
4. Paste in Vercel

#### SIT, Staging, Production

Repeat the above for:
- SIT: Use `.env.sit`, select `sit` branch
- Staging: Use `.env.staging`, select `staging` branch
- Production: Use `.env.production`, select "Production"

### Deploy!

1. **Click:** "Deploy"
2. **Wait:** 2-3 minutes
3. **Success:** 🎉

---

## 🧪 Step 6: Test All Environments (5 minutes)

### Using PowerShell (Windows 10/11)

```powershell
# Local
Invoke-RestMethod http://localhost:3000/api/health

# SIT (replace with your URL)
Invoke-RestMethod https://qilly-git-sit-yourproject.vercel.app/api/health

# Staging
Invoke-RestMethod https://qilly-git-staging-yourproject.vercel.app/api/health

# Production
Invoke-RestMethod https://qilly-yourproject.vercel.app/api/health
```

### Using curl (if installed)

```cmd
curl http://localhost:3000/api/health
curl https://qilly-git-sit-yourproject.vercel.app/api/health
curl https://qilly-git-staging-yourproject.vercel.app/api/health
curl https://qilly-yourproject.vercel.app/api/health
```

### Using Browser

Just visit:
- http://localhost:3000/api/health
- https://qilly-git-sit-yourproject.vercel.app/api/health
- https://qilly-git-staging-yourproject.vercel.app/api/health
- https://qilly-yourproject.vercel.app/api/health

**Each should show:**
```json
{
  "status": "healthy",
  "environment": "sit" (or staging/production)
}
```

✅ **All environments deployed!**

---

## 🎊 Congratulations! Setup Complete!

### What You've Built

- ✅ 4 environments (dev, SIT, staging, production)
- ✅ Automated Git workflow
- ✅ Health monitoring
- ✅ Professional CI/CD pipeline
- ✅ R0/month cost to start!

---

## 🔄 Daily Workflow (Windows)

### Developing a Feature

**Open Command Prompt or PowerShell:**

```cmd
# 1. Create feature branch
git checkout develop
git checkout -b feature/my-feature

# 2. Code locally
npm run dev
# Make changes in VS Code...

# 3. Commit and push
git add .
git commit -m "feat: description"
git push origin feature/my-feature

# 4. Create Pull Request on GitHub
# Merge to develop after review
```

### Deploying to Environments

```cmd
# Deploy to SIT
git checkout sit
git merge develop
git push origin sit
# → Auto-deploys to qilly-git-sit.vercel.app

# Deploy to Staging
git checkout staging
git merge sit
git push origin staging
# → Auto-deploys to qilly-git-staging.vercel.app

# Deploy to Production
git checkout main
git merge staging
git push origin main
# → Auto-deploys to qilly.vercel.app
```

---

## 🆘 Windows-Specific Troubleshooting

### Issue: "scripts\setup-environments.bat is not recognized"

**Fix:**
```cmd
# Make sure you're in the project directory
cd C:\path\to\qilly

# Run with full path
C:\path\to\qilly\scripts\setup-environments.bat
```

---

### Issue: "Permission denied" or "Access denied"

**Fix:**

1. **Run Command Prompt as Administrator:**
   - Press `Win + X`
   - Select "Command Prompt (Admin)" or "PowerShell (Admin)"
   - Navigate to project and re-run

2. **Or disable antivirus temporarily** (may block script)

---

### Issue: PowerShell execution policy error

**Error:**
```
scripts cannot be loaded because running scripts is disabled
```

**Fix:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Re-run setup
.\scripts\setup-environments.bat
```

---

### Issue: Git commands not working

**Fix:**

1. **Verify Git is installed:**
   ```cmd
   git --version
   ```

2. **If not found, install Git:**
   - Download: https://git-scm.com/download/win
   - Install with default options
   - **Restart Command Prompt**

3. **Add Git to PATH (if needed):**
   - Search: "Environment Variables"
   - Edit "Path" in System variables
   - Add: `C:\Program Files\Git\bin`
   - Click OK
   - **Restart Command Prompt**

---

### Issue: Node/npm commands not working

**Fix:**

1. **Verify Node is installed:**
   ```cmd
   node --version
   ```

2. **If not found:**
   - Download: https://nodejs.org/
   - Install LTS version
   - **Restart Command Prompt**

3. **Add Node to PATH (if needed):**
   - Usually auto-added during installation
   - Default location: `C:\Program Files\nodejs\`

---

### Issue: .env files not showing in File Explorer

**Fix:**

**.env files are hidden by default on Windows**

1. **Open File Explorer**
2. **Click:** "View" tab
3. **Check:** "Hidden items"
4. **Check:** "File name extensions"

Now you can see `.env.development`, `.env.sit`, etc.

---

### Issue: Can't edit .env files

**Fix:**

**Option 1: Use Notepad**
```cmd
notepad .env.development
```

**Option 2: Use VS Code**
```cmd
code .env.development
```

**Option 3: Use File Explorer**
1. Right-click `.env.development`
2. "Open with" → "Notepad" or "VS Code"

---

### Issue: curl not found

**Fix:**

**Windows 10/11 includes curl**

If not working:

**Option 1: Use PowerShell alternative**
```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

**Option 2: Install curl**
- Download: https://curl.se/windows/
- Extract to `C:\curl`
- Add to PATH

**Option 3: Use browser**
- Just visit the URL in Chrome/Edge

---

## 💡 Windows Tips

### Use Git Bash (Recommended)

Git Bash gives you a Linux-like terminal on Windows:

1. **Installed with Git for Windows**
2. **Right-click folder** → "Git Bash Here"
3. **Use Linux commands:**
   ```bash
   ./scripts/setup-environments.sh  # Use .sh version
   ```

### Use Windows Terminal (Modern)

Better than Command Prompt:

1. **Install from Microsoft Store:** "Windows Terminal"
2. **Supports tabs, themes, and modern features**
3. **Can run CMD, PowerShell, Git Bash in tabs**

### VS Code Integrated Terminal

1. **Open project in VS Code**
2. **Press:** `` Ctrl + ` `` (backtick)
3. **Select:** PowerShell or Command Prompt
4. **Run commands right in VS Code!**

---

## 📋 Quick Command Reference (Windows)

### File Operations

```cmd
# Navigate
cd C:\path\to\qilly

# List files
dir

# View file
type .env.development

# Edit file
notepad .env.development

# Copy file
copy .env.example .env.local

# Delete file
del filename.txt
```

### Git Commands

```cmd
# Check status
git status

# List branches
git branch

# Switch branch
git checkout develop

# Create branch
git checkout -b feature/name

# Add files
git add .

# Commit
git commit -m "message"

# Push
git push origin main
```

### npm Commands

```cmd
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

---

## ✅ Windows Setup Checklist

- [ ] Node.js v18+ installed
- [ ] Git for Windows installed
- [ ] VS Code installed (optional but recommended)
- [ ] Setup script completed
- [ ] 4 Supabase projects created
- [ ] All .env files updated
- [ ] All branches pushed to GitHub
- [ ] Vercel connected
- [ ] Environment variables configured
- [ ] All deployments successful
- [ ] Health endpoints working

**All done?** You're ready to build! 🎉

---

## 🚀 What's Next?

**Start developing:**
```cmd
npm run dev
```

**Deploy to SIT:**
```cmd
git checkout sit
git merge develop
git push origin sit
```

**Check deployment:**
- Visit Vercel dashboard
- Test SIT URL
- Verify health endpoint

---

## 📚 Additional Windows Resources

**Documentation:**
- Main setup guide: `/START_HERE_SETUP.md`
- Command reference: `/COMMAND_REFERENCE.md`
- Full guide: `/MULTI_ENVIRONMENT_SETUP.md`

**Windows Tools:**
- Git for Windows: https://git-scm.com/download/win
- Node.js: https://nodejs.org/
- VS Code: https://code.visualstudio.com/
- Windows Terminal: Microsoft Store

**Community:**
- Vercel Discord: discord.gg/vercel
- Supabase Discord: discord.supabase.com

---

**🪟 Windows setup complete! Happy coding!** 🎉
