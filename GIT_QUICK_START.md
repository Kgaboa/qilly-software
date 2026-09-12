# Qilly Git Quick Start

## 🚀 Get Started in 2 Minutes

### First Time Setup

```bash
# 1. Open terminal in your Qilly project folder
cd /path/to/qilly

# 2. Configure your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 3. Initialize repository
git init

# 4. Add all files
git add .

# 5. Create first commit
git commit -m "Initial commit: Qilly v1.2.0 - Complete system"

# ✅ Done! You now have version control
```

---

## 📅 Daily Commands (Use These Every Day)

```bash
# Morning: Get latest changes (if working with team)
git pull

# Check what you changed
git status
git diff

# Save your work
git add .
git commit -m "Add supplier export feature"

# End of day: Upload your work
git push
```

---

## 🎯 Common Qilly Workflows

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/supplier-analytics

# 2. Make your changes
# ... edit files ...

# 3. Commit frequently (every hour or logical change)
git add src/app/components/SupplierAnalytics.tsx
git commit -m "Add supplier analytics dashboard"

# 4. Push when done
git push -u origin feature/supplier-analytics

# 5. Merge back to main when ready
git checkout main
git merge feature/supplier-analytics
git push
```

### Fixing a Bug

```bash
# 1. Create bugfix branch
git checkout -b bugfix/admin-login-issue

# 2. Fix the bug
# ... edit files ...

# 3. Commit
git add .
git commit -m "Fix admin login redirect issue"

# 4. Push
git push -u origin bugfix/admin-login-issue

# 5. Merge to main
git checkout main
git merge bugfix/admin-login-issue
git push
```

### Updating Documentation

```bash
# Work directly on main for docs
git checkout main

# Edit docs
# ... update README.md, DEPLOYMENT_GUIDE.md, etc. ...

# Commit
git add *.md
git commit -m "Update deployment guide"
git push
```

---

## 🌐 Connect to GitHub/GitLab

### GitHub

```bash
# 1. Create repository at github.com
# Click "New Repository", name it "qilly", make it Private

# 2. Connect local to remote
git remote add origin https://github.com/YourUsername/qilly.git
git branch -M main
git push -u origin main

# ✅ Done! Now use: git push / git pull
```

### GitLab

```bash
# 1. Create project at gitlab.com
# Click "New Project", name it "qilly", make it Private

# 2. Connect local to remote
git remote add origin https://gitlab.com/YourUsername/qilly.git
git branch -M main
git push -u origin main

# ✅ Done! Now use: git push / git pull
```

---

## 🔥 Emergency Commands

### "I messed up, undo my changes!"

```bash
# Discard ALL uncommitted changes (CAREFUL!)
git reset --hard HEAD

# Discard changes to one file
git checkout -- src/app/App.tsx
```

### "I committed something wrong!"

```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Fix your changes, then recommit
git add .
git commit -m "Correct commit message"
```

### "I accidentally committed .env file!"

```bash
# Remove from Git (keep local file)
git rm --cached .env

# Add to .gitignore
echo ".env" >> .gitignore

# Commit
git commit -m "Remove .env from tracking"

# ⚠️ IMPORTANT: Change your secrets immediately!
```

### "Merge conflict help!"

```bash
# 1. Git will show conflicted files
git status

# 2. Open each file, look for:
# <<<<<<< HEAD
# Your changes
# =======
# Their changes
# >>>>>>> branch-name

# 3. Manually fix conflicts, remove markers

# 4. Mark as resolved
git add conflicted-file.tsx

# 5. Complete merge
git commit -m "Resolve merge conflicts"
```

---

## 📊 Viewing History

```bash
# See all commits
git log

# Compact view
git log --oneline

# Last 10 commits
git log -10

# Visual branch graph
git log --oneline --graph --all

# Changes in specific file
git log -p src/app/App.tsx

# Who changed what
git blame src/app/components/AdminDashboard.tsx
```

---

## 🏷️ Version Tags (for Releases)

```bash
# Create version tag
git tag -a v1.2.0 -m "Version 1.2.0: Production deployment system"

# List tags
git tag

# Push tags to remote
git push --tags

# Checkout specific version
git checkout v1.2.0
```

---

## 🌿 Branch Management

```bash
# List branches
git branch

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Delete branch
git branch -d feature/old-feature

# Push branch to remote
git push -u origin feature/new-feature
```

---

## 💡 Pro Tips

### Commit Often

```bash
# ✅ Good: Many small commits
git commit -m "Add supplier form validation"
git commit -m "Add email field to supplier form"
git commit -m "Add phone number validation"

# ❌ Bad: One huge commit
git commit -m "Add entire supplier system"
```

### Write Clear Messages

```bash
# ✅ Good messages
git commit -m "Fix login redirect after supplier approval"
git commit -m "Add CSV export to supplier list"
git commit -m "Update deployment guide with Supabase steps"

# ❌ Bad messages
git commit -m "fix"
git commit -m "updates"
git commit -m "stuff"
```

### Commit Message Types

```bash
feat: Add new feature
fix: Fix a bug
docs: Update documentation
style: Code formatting
refactor: Code restructuring
test: Add tests
chore: Maintenance

# Examples:
git commit -m "feat: Add supplier analytics dashboard"
git commit -m "fix: Resolve admin login timeout issue"
git commit -m "docs: Update README with installation steps"
```

---

## 📁 What Files to Commit?

### ✅ Always Commit

- Source code (`src/**/*.tsx`, `src/**/*.ts`)
- Documentation (`*.md`)
- Configuration (`package.json`, `vite.config.ts`)
- Git ignore (`.gitignore`)

### ❌ Never Commit

- `node_modules/` (too large)
- `.env` files (secrets!)
- `dist/` or `build/` (generated)
- `.DS_Store`, `Thumbs.db` (OS files)

**The `.gitignore` file handles this automatically!**

---

## 🔍 Check Before Committing

```bash
# 1. What files changed?
git status

# 2. What exactly changed?
git diff

# 3. Review staged changes
git diff --staged

# 4. If looks good, commit
git commit -m "Your message"
```

---

## 🚨 Common Mistakes & Solutions

### Forgot to Pull Before Push

```bash
# Error: "Updates were rejected"
# Solution:
git pull --rebase
git push
```

### Made Changes on Wrong Branch

```bash
# Save changes temporarily
git stash

# Switch to correct branch
git checkout correct-branch

# Restore changes
git stash pop
```

### Want to Include More Files in Last Commit

```bash
# Stage new files
git add forgotten-file.tsx

# Add to previous commit
git commit --amend --no-edit
```

---

## 📞 Qilly-Specific Branches

```
main                              ← Production code
├── develop                       ← Integration
    ├── feature/supplier-reports  ← New supplier features
    ├── feature/advanced-search   ← Search improvements
    ├── feature/mobile-app        ← Mobile development
    ├── bugfix/login-issue        ← Bug fixes
    └── hotfix/urgent-security    ← Emergency fixes
```

---

## 🎯 Recommended Workflow

### For Solo Development

```bash
# Work directly on main for small changes
git checkout main
# ... make changes ...
git add .
git commit -m "Add feature"
git push

# Use branches for big features
git checkout -b feature/big-feature
# ... make changes ...
git commit -m "Work in progress"
git push -u origin feature/big-feature
```

### For Team Development

```bash
# Always use branches
git checkout -b feature/my-work

# Commit frequently
git add .
git commit -m "Incremental progress"

# Push to remote for backup
git push -u origin feature/my-work

# Create Pull Request on GitHub/GitLab
# Get review, then merge to main
```

---

## 📚 Learn More

- Full guide: [VERSION_CONTROL_GUIDE.md](./VERSION_CONTROL_GUIDE.md)
- Change history: [CHANGELOG.md](./CHANGELOG.md)
- GitHub Desktop: [https://desktop.github.com](https://desktop.github.com)
- Interactive tutorial: [https://learngitbranching.js.org](https://learngitbranching.js.org)

---

## 🎓 One-Page Cheat Sheet

```bash
# SETUP
git init                        # Initialize repository
git config --global user.name   # Set name
git config --global user.email  # Set email

# DAILY USE
git status                      # Check status
git add .                       # Stage all changes
git commit -m "message"         # Save changes
git push                        # Upload to remote
git pull                        # Download from remote

# BRANCHES
git branch                      # List branches
git checkout -b name            # Create branch
git checkout name               # Switch branch
git merge name                  # Merge branch

# HISTORY
git log                         # View commits
git log --oneline               # Compact view
git diff                        # See changes

# UNDO
git checkout -- file            # Discard file changes
git reset --soft HEAD~1         # Undo last commit
git reset --hard HEAD           # Discard all changes

# REMOTE
git remote add origin URL       # Connect to GitHub/GitLab
git push -u origin main         # First push
git clone URL                   # Download repository

# TAGS
git tag -a v1.0.0 -m "msg"      # Create tag
git push --tags                 # Push tags
```

---

**Remember: Commit early, commit often, push at end of day!** 🚀
