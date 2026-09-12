# Qilly Version Control Guide

## 🎯 Overview

This guide will help you set up and use **Git version control** for the Qilly project, allowing you to track all code changes, collaborate with team members, and maintain a complete history of your development.

---

## 📋 Table of Contents

1. [Why Version Control?](#why-version-control)
2. [Quick Start (5 Minutes)](#quick-start-5-minutes)
3. [Git Installation](#git-installation)
4. [Initial Setup](#initial-setup)
5. [Daily Workflow](#daily-workflow)
6. [GitHub/GitLab Setup](#githubgitlab-setup)
7. [Branching Strategy](#branching-strategy)
8. [Commit Best Practices](#commit-best-practices)
9. [Troubleshooting](#troubleshooting)

---

## 🤔 Why Version Control?

**Git provides:**

✅ **Complete History** - See every change ever made  
✅ **Backup & Recovery** - Never lose work again  
✅ **Collaboration** - Multiple developers can work together  
✅ **Branching** - Work on features without breaking production  
✅ **Rollback** - Undo mistakes easily  
✅ **Accountability** - Know who changed what and when  

---

## 🚀 Quick Start (5 Minutes)

If you already have Git installed, run these commands in your Qilly project folder:

```bash
# 1. Initialize Git repository
git init

# 2. Add all files
git add .

# 3. Create your first commit
git commit -m "Initial Qilly commit - Complete system with supplier signup"

# 4. Check status
git status
```

**That's it!** You now have version control. See [Daily Workflow](#daily-workflow) for ongoing usage.

---

## 💻 Git Installation

### Windows

1. Download Git from [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Run installer with default settings
3. Verify: Open Command Prompt and type `git --version`

### macOS

**Option 1: Homebrew** (Recommended)
```bash
brew install git
```

**Option 2: Installer**
1. Download from [https://git-scm.com/download/mac](https://git-scm.com/download/mac)
2. Run installer

Verify: Open Terminal and type `git --version`

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git
```

Verify:
```bash
git --version
```

---

## ⚙️ Initial Setup

### Step 1: Configure Git

Set your name and email (used for commit history):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 2: Initialize Repository

Navigate to your Qilly project folder and run:

```bash
# Initialize Git
git init

# Verify initialization
git status
```

You should see: `On branch main` or `On branch master`

### Step 3: Create First Commit

```bash
# Stage all files
git add .

# Create commit
git commit -m "Initial commit: Qilly complete system

- Core BOQ pricing engine
- Supplier management with signup/approval system
- Admin dashboard with authentication
- Production deployment system with Supabase
- Environment detection (demo/production)
- Comprehensive documentation"

# View commit history
git log
```

---

## 📅 Daily Workflow

### Making Changes

```bash
# 1. Check current status
git status

# 2. See what changed
git diff

# 3. Stage specific files
git add src/app/components/NewComponent.tsx

# OR stage all changes
git add .

# 4. Commit with descriptive message
git commit -m "Add new supplier export feature"

# 5. View history
git log --oneline
```

### Viewing History

```bash
# See recent commits
git log

# Compact view
git log --oneline

# Last 5 commits
git log -5

# See changes in a specific file
git log -p src/app/App.tsx
```

### Undoing Changes

```bash
# Discard changes in a file (CAREFUL!)
git checkout -- src/app/components/Component.tsx

# Unstage a file (keep changes)
git reset HEAD src/app/components/Component.tsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes - CAREFUL!)
git reset --hard HEAD~1
```

---

## 🌐 GitHub/GitLab Setup

### Create Remote Repository

**GitHub:**
1. Go to [https://github.com](https://github.com)
2. Click **"New Repository"**
3. Name: `qilly`
4. Description: "Qilly - Core Ground Civils Construction Billing System"
5. Choose **Private** (recommended for commercial projects)
6. **DO NOT** initialize with README (you already have code)
7. Click **"Create Repository"**

**GitLab:**
1. Go to [https://gitlab.com](https://gitlab.com)
2. Click **"New Project"**
3. Select **"Create blank project"**
4. Name: `qilly`
5. Choose **Private**
6. Click **"Create Project"**

### Connect Local to Remote

After creating the repository, you'll see commands like this:

```bash
# Add remote repository
git remote add origin https://github.com/YourUsername/qilly.git

# OR for GitLab
git remote add origin https://gitlab.com/YourUsername/qilly.git

# Rename branch to main (if needed)
git branch -M main

# Push to remote
git push -u origin main
```

**From now on, just use:**
```bash
git push    # Upload your changes
git pull    # Download others' changes
```

---

## 🌿 Branching Strategy

### Why Branches?

Branches let you work on features without affecting the main codebase.

### Recommended Structure

```
main (or master)          ← Production-ready code
├── develop              ← Integration branch
    ├── feature/supplier-reports
    ├── feature/advanced-search
    ├── bugfix/login-issue
    └── hotfix/urgent-fix
```

### Branch Commands

```bash
# Create and switch to new branch
git checkout -b feature/supplier-reports

# List all branches
git branch

# Switch branches
git checkout main

# Merge feature into main
git checkout main
git merge feature/supplier-reports

# Delete branch
git branch -d feature/supplier-reports

# Push branch to remote
git push -u origin feature/supplier-reports
```

### Example Workflow

```bash
# Start new feature
git checkout -b feature/pdf-export

# Make changes, commit
git add .
git commit -m "Add PDF export functionality"

# Push to remote
git push -u origin feature/pdf-export

# Switch back to main
git checkout main

# Merge feature
git merge feature/pdf-export

# Push to remote
git push

# Delete feature branch
git branch -d feature/pdf-export
```

---

## ✍️ Commit Best Practices

### Good Commit Messages

```bash
# ✅ GOOD: Clear, descriptive, imperative mood
git commit -m "Add supplier approval email notifications"
git commit -m "Fix product category filter bug in admin dashboard"
git commit -m "Update deployment guide with Supabase setup"

# ❌ BAD: Vague, unclear
git commit -m "updates"
git commit -m "fix stuff"
git commit -m "wip"
```

### Commit Message Format

```
<type>: <subject>

<optional body>

<optional footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code restructuring (no functionality change)
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```bash
git commit -m "feat: Add supplier signup form with validation"

git commit -m "fix: Resolve undefined product_categories error in admin dashboard"

git commit -m "docs: Update deployment guide with production checklist"

git commit -m "refactor: Extract supplier data layer to separate module"
```

### When to Commit?

✅ **Commit when you:**
- Complete a logical unit of work
- Fix a bug
- Add a feature (even incomplete)
- Before switching branches
- Before making risky changes
- At the end of each day

❌ **Don't commit:**
- Broken code (unless on a WIP branch)
- Sensitive data (passwords, API keys)
- Generated files (node_modules, dist)
- Large binary files

---

## 🔍 Useful Git Commands

### Status & Information

```bash
git status              # See what's changed
git diff                # See detailed changes
git log                 # View commit history
git log --oneline       # Compact history
git show COMMIT_HASH    # View specific commit
git blame FILE          # See who changed each line
```

### Stashing (Temporary Storage)

```bash
git stash               # Save changes temporarily
git stash list          # View stashed changes
git stash apply         # Restore stashed changes
git stash pop           # Restore and delete stash
git stash drop          # Delete stash
```

### Comparing Changes

```bash
git diff                        # Changes not staged
git diff --staged               # Changes staged
git diff main feature/new       # Compare branches
git diff HEAD~1 HEAD            # Compare with previous commit
```

### Tagging (Version Releases)

```bash
# Create version tag
git tag -a v1.0.0 -m "Version 1.0.0: Initial Qilly release"

# List tags
git tag

# Push tags to remote
git push --tags

# Checkout specific version
git checkout v1.0.0
```

---

## 🐛 Troubleshooting

### "Repository not found" when pushing

**Solution:**
```bash
# Check remote URL
git remote -v

# Update remote URL
git remote set-url origin https://github.com/YourUsername/qilly.git
```

### Merge Conflicts

When Git can't automatically merge changes:

```bash
# 1. Git will show conflicted files
git status

# 2. Open conflicted files - look for:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# 3. Manually resolve conflicts, remove markers

# 4. Stage resolved files
git add resolved-file.tsx

# 5. Complete merge
git commit -m "Merge feature branch, resolve conflicts"
```

### Accidentally Committed Sensitive Data

```bash
# Remove file from Git (keep local copy)
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Remove .env from tracking"

# If already pushed to remote, change the secrets!
```

### Forgot to Create Branch

```bash
# Create branch with current changes
git checkout -b feature/forgot-branch

# Now commit
git add .
git commit -m "My changes"
```

---

## 📊 Recommended Tools

### Git GUI Clients

**Free:**
- **GitHub Desktop** - [https://desktop.github.com](https://desktop.github.com)
- **GitKraken** (Free for public repos) - [https://www.gitkraken.com](https://www.gitkraken.com)
- **Sourcetree** - [https://www.sourcetreeapp.com](https://www.sourcetreeapp.com)

**VS Code Extension:**
- **GitLens** - See Git history inline in your editor

### Terminal Enhancements

- **Oh My Zsh** (macOS/Linux) - Better Git command line
- **Posh-Git** (Windows PowerShell) - Git status in prompt

---

## 📝 Qilly-Specific Workflows

### Working on Supplier Features

```bash
# Create feature branch
git checkout -b feature/supplier-export

# Make changes to supplier components
# ... edit files ...

# Commit frequently
git add src/app/components/SupplierSignup.tsx
git commit -m "feat: Add CSV export to supplier list"

# Push to remote
git push -u origin feature/supplier-export

# Create Pull Request on GitHub/GitLab for review
```

### Hotfix for Production Bug

```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/urgent-login-fix

# Fix the bug
# ... edit files ...

# Commit and push
git add .
git commit -m "fix: Resolve login redirect issue"
git push -u origin hotfix/urgent-login-fix

# Merge back to main
git checkout main
git merge hotfix/urgent-login-fix
git push

# Delete hotfix branch
git branch -d hotfix/urgent-login-fix
```

### Updating Documentation

```bash
# Update docs on main branch
git checkout main

# Edit documentation
# ... edit README.md, DEPLOYMENT_GUIDE.md, etc. ...

# Commit
git add *.md
git commit -m "docs: Update deployment guide with new Supabase steps"
git push
```

---

## 🎓 Learning Resources

**Official Git Documentation:**
- [https://git-scm.com/doc](https://git-scm.com/doc)

**Interactive Tutorials:**
- [https://learngitbranching.js.org](https://learngitbranching.js.org)
- [https://try.github.io](https://try.github.io)

**Quick Reference:**
- [https://education.github.com/git-cheat-sheet-education.pdf](https://education.github.com/git-cheat-sheet-education.pdf)

---

## 🚀 Next Steps

1. ✅ Initialize Git in your Qilly project
2. ✅ Create initial commit
3. ✅ Set up GitHub/GitLab remote repository
4. ✅ Push code to remote
5. ✅ Start using branches for new features
6. ✅ Review the [CHANGELOG.md](./CHANGELOG.md) file for version tracking

---

## 📞 Quick Reference Card

```bash
# DAILY COMMANDS
git status              # What changed?
git add .               # Stage all changes
git commit -m "msg"     # Save changes
git push                # Upload to remote
git pull                # Download from remote

# BRANCHING
git branch              # List branches
git checkout -b name    # Create branch
git merge name          # Merge branch

# HISTORY
git log                 # View history
git diff                # See changes

# UNDO (CAREFUL!)
git checkout -- file    # Discard changes
git reset HEAD~1        # Undo commit
```

---

**Remember:** Commit often, push regularly, write clear messages! 🎯
