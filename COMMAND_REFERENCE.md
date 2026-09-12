# 🎯 Quick Command Reference

**Cheat sheet for Qilly multi-environment setup**

---

## 🚀 Setup Commands

### Initial Setup
```bash
# Make script executable
chmod +x scripts/setup-environments.sh

# Run setup script
./scripts/setup-environments.sh

# Or if above doesn't work
bash scripts/setup-environments.sh
```

### Verify Installation
```bash
# Check prerequisites
node --version      # Should be v18+
npm --version       # Should be 8+
git --version       # Any recent version

# Check Git branches
git branch          # Should show: main, develop, sit, staging

# Check environment files
ls -la .env.*       # Should show 5 files
```

---

## 📦 Dependency Management

### Install Dependencies
```bash
# Install all packages
npm install

# Install specific package
npm install <package-name>

# Update dependencies
npm update
```

### Development Server
```bash
# Start local dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌿 Git Commands

### Branch Management
```bash
# List all branches
git branch

# Switch to branch
git checkout <branch-name>

# Create new feature branch
git checkout -b feature/my-feature

# Delete branch (local)
git branch -d feature/my-feature
```

### Daily Workflow
```bash
# 1. Update develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/contractor-reports

# 3. Make changes, then commit
git add .
git commit -m "feat: add contractor reports"

# 4. Push to GitHub
git push origin feature/contractor-reports

# 5. Create Pull Request on GitHub: feature → develop
```

### Deployment Workflow
```bash
# Deploy to SIT
git checkout sit
git pull origin sit
git merge develop
git push origin sit
# → Auto-deploys to qilly-git-sit.vercel.app

# Deploy to Staging
git checkout staging
git pull origin staging
git merge sit
git push origin staging
# → Auto-deploys to qilly-git-staging.vercel.app

# Deploy to Production
git checkout main
git pull origin main
git merge staging
git push origin main
# → Auto-deploys to qilly.vercel.app
```

### Common Git Tasks
```bash
# Check status
git status

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Discard all local changes
git reset --hard HEAD
git clean -fd
```

---

## 🗄️ Supabase Commands

### Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref <your-project-id>

# Pull database schema
supabase db pull

# Push database changes
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > src/types/database.ts
```

### Database Migrations
```bash
# Create new migration
supabase migration new <migration-name>

# Apply migrations
supabase db push

# Reset database (DESTRUCTIVE!)
supabase db reset
```

---

## ☁️ Vercel Commands

### Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs <deployment-url>
```

### Environment Variables
```bash
# List environment variables
vercel env ls

# Add environment variable
vercel env add <variable-name>

# Remove environment variable
vercel env rm <variable-name>

# Pull environment variables to local
vercel env pull .env.local
```

---

## 🏥 Health Check Commands

### Test Health Endpoints
```bash
# Local
curl http://localhost:3000/api/health

# SIT
curl https://qilly-git-sit-yourproject.vercel.app/api/health

# Staging
curl https://qilly-git-staging-yourproject.vercel.app/api/health

# Production
curl https://qilly-yourproject.vercel.app/api/health

# Pretty print JSON response
curl https://qilly-yourproject.vercel.app/api/health | jq
```

### Test Keep-Alive Endpoint
```bash
# Requires CRON_SECRET from environment file
CRON_SECRET="your-secret-here"

# Test keep-alive
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://qilly-yourproject.vercel.app/api/cron/keep-alive
```

---

## 🔍 Debugging Commands

### Check Logs
```bash
# Vercel deployment logs
vercel logs <deployment-url>

# Vercel real-time logs
vercel logs --follow

# Local development logs
npm run dev
# Console shows all logs
```

### Database Connection Test
```bash
# Test Supabase connection
curl https://your-project.supabase.co/rest/v1/

# Should return: {"message":"Welcome to your Supabase project"}
```

### Environment Variable Check
```bash
# View local environment variables (development)
cat .env.development

# Check what's loaded in app
# Add to your code:
console.log('Environment:', import.meta.env.NEXT_PUBLIC_ENVIRONMENT);
console.log('Supabase URL:', import.meta.env.NEXT_PUBLIC_SUPABASE_URL);
```

---

## 📝 File Management

### Create Environment File
```bash
# Copy example file
cp .env.example .env.development

# Edit file
nano .env.development
# or
code .env.development
# or
vim .env.development
```

### View File Contents
```bash
# View environment file
cat .env.development

# View with line numbers
cat -n .env.development

# View first 10 lines
head -n 10 .env.development

# View last 10 lines
tail -n 10 .env.development
```

### Search Files
```bash
# Find files by name
find . -name "*.env*"

# Search for text in files
grep -r "SUPABASE_URL" .

# Search with line numbers
grep -rn "SUPABASE_URL" .
```

---

## 🧹 Cleanup Commands

### Clean Build Files
```bash
# Remove build directory
rm -rf dist/

# Remove node_modules
rm -rf node_modules/

# Clean install
rm -rf node_modules/
npm install
```

### Clean Git Cache
```bash
# Remove file from Git tracking (but keep local)
git rm --cached <file-name>

# Clean untracked files (dry run)
git clean -n

# Clean untracked files (execute)
git clean -fd
```

---

## 🔐 Security Commands

### Generate Secrets
```bash
# Generate random secret (32 characters)
openssl rand -base64 32

# Generate UUID
uuidgen

# Generate random password
openssl rand -base64 24
```

### Check File Permissions
```bash
# View file permissions
ls -la .env.*

# Make file readable only by owner
chmod 600 .env.production

# Make script executable
chmod +x scripts/setup-environments.sh
```

---

## 📊 Monitoring Commands

### Check Deployment Status
```bash
# List all deployments
vercel ls

# View specific deployment
vercel inspect <deployment-url>

# Get deployment URL
vercel ls | grep "qilly"
```

### Performance Testing
```bash
# Test response time
time curl https://qilly-yourproject.vercel.app/api/health

# Detailed timing
curl -w "@curl-format.txt" -o /dev/null -s https://qilly-yourproject.vercel.app/api/health

# Create curl-format.txt:
echo "time_namelookup: %{time_namelookup}\ntime_connect: %{time_connect}\ntime_starttransfer: %{time_starttransfer}\ntime_total: %{time_total}\n" > curl-format.txt
```

---

## 🎯 Quick Workflows

### Full Deployment Pipeline
```bash
# 1. Develop feature
git checkout develop
git checkout -b feature/new-feature
# ... code changes ...
git add .
git commit -m "feat: description"
git push origin feature/new-feature
# Create PR on GitHub → Merge to develop

# 2. Deploy to SIT
git checkout sit
git merge develop
git push origin sit
# Wait for deployment, test at qilly-git-sit.vercel.app

# 3. Deploy to Staging
git checkout staging
git merge sit
git push origin staging
# Wait for deployment, validate at qilly-git-staging.vercel.app

# 4. Deploy to Production
git checkout main
git merge staging
git push origin main
# Wait for deployment, live at qilly.vercel.app
```

### Hotfix Workflow
```bash
# 1. Create hotfix from main
git checkout main
git checkout -b hotfix/critical-bug

# 2. Fix and test locally
npm run dev
# ... make changes ...

# 3. Commit and push
git add .
git commit -m "fix: critical bug description"
git push origin hotfix/critical-bug

# 4. Merge to main immediately
git checkout main
git merge hotfix/critical-bug
git push origin main
# → Deploys to production

# 5. Backport to other branches
git checkout staging
git merge hotfix/critical-bug
git push origin staging

git checkout sit
git merge hotfix/critical-bug
git push origin sit

git checkout develop
git merge hotfix/critical-bug
git push origin develop
```

### Rollback Workflow
```bash
# Option 1: Vercel instant rollback
# Go to Vercel dashboard → Deployments → Previous deployment → Promote

# Option 2: Git revert
git checkout main
git log --oneline  # Find commit to revert
git revert <commit-hash>
git push origin main
# → Auto-deploys reverted version
```

---

## 🆘 Emergency Commands

### Kill Stuck Processes
```bash
# Find process using port 3000
lsof -i :3000

# Kill process by PID
kill -9 <PID>

# Or kill all node processes (CAREFUL!)
pkill -f node
```

### Force Clean Restart
```bash
# Nuclear option - start fresh
rm -rf node_modules/
rm -rf dist/
rm -rf .vercel/
npm install
npm run dev
```

### Reset Git to Remote
```bash
# DESTRUCTIVE - discards all local changes
git fetch origin
git reset --hard origin/main
git clean -fd
```

---

## 📋 Checklist Commands

### Daily Standup Checks
```bash
# 1. Check current branch
git branch

# 2. Update develop
git checkout develop
git pull origin develop

# 3. Check deployment status
vercel ls | head -5

# 4. Check health
curl https://qilly-yourproject.vercel.app/api/health | jq .status
```

### Pre-Deployment Checks
```bash
# 1. Build locally
npm run build

# 2. Preview build
npm run preview

# 3. Check Git status
git status

# 4. View changes
git diff

# 5. Run tests (if you have them)
npm test
```

---

## 💡 Productivity Shortcuts

### Git Aliases
Add to `~/.gitconfig`:

```bash
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = log --graph --oneline --all
```

Then use:
```bash
git co develop     # Instead of: git checkout develop
git br             # Instead of: git branch
git ci -m "msg"    # Instead of: git commit -m "msg"
```

### Bash Aliases
Add to `~/.bashrc` or `~/.zshrc`:

```bash
alias dev="npm run dev"
alias build="npm run build"
alias gst="git status"
alias gco="git checkout"
alias glog="git log --oneline"
alias health="curl http://localhost:3000/api/health | jq"
```

Then use:
```bash
dev        # Instead of: npm run dev
gst        # Instead of: git status
health     # Check health endpoint
```

---

## 🎓 Common Use Cases

### Scenario: "I need to deploy NOW"
```bash
# Fastest path to production
git add .
git commit -m "feat: urgent deployment"
git checkout main
git merge develop
git push origin main
# Wait 2-3 minutes → Live!
```

### Scenario: "I broke something in develop"
```bash
# Revert last commit
git checkout develop
git revert HEAD
git push origin develop
# OR reset to previous commit
git reset --hard HEAD~1
git push --force origin develop  # CAREFUL!
```

### Scenario: "Need to update production ASAP"
```bash
# Create hotfix
git checkout main
git checkout -b hotfix/urgent-fix
# ... make changes ...
git add .
git commit -m "fix: urgent issue"
git checkout main
git merge hotfix/urgent-fix
git push origin main
# → Deployed in 2-3 minutes
```

---

**🎯 Keep this reference handy for quick command lookup!**

**Print this page** or bookmark it for easy access during development.
