# Qilly Git Workflow Diagrams

Visual guides for understanding Git workflows in the Qilly project.

---

## 📊 Basic Git Workflow

```
┌─────────────────────────────────────────────────────────┐
│                    WORKING DIRECTORY                     │
│              (Your files on computer)                    │
│                                                          │
│  Edit files → src/app/components/NewComponent.tsx       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ git add .
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   STAGING AREA                          │
│             (Files ready to commit)                     │
│                                                          │
│  Staged → NewComponent.tsx ✓                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ git commit -m "message"
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  LOCAL REPOSITORY                       │
│              (Committed changes)                        │
│                                                          │
│  Commit #1234 → "Add new component"                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ git push
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  REMOTE REPOSITORY                      │
│              (GitHub/GitLab)                            │
│                                                          │
│  origin/main → Commit #1234                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🌿 Branching Workflow

```
Time →

main:      •────────•────────────────•──────────────→
           │        │                ▲
           │        │                │ git merge
           │        │                │
feature:   │        •────•────•────•
           │        │    │    │    │
           │        ▼    ▼    ▼    ▼
           │    "Start" "Work" "Test" "Done"
           │
           ▼
      git checkout -b feature/new


Legend:
• = Commit
→ = Branch continues
▼ = Branch created
▲ = Branch merged
```

---

## 🔄 Complete Development Cycle

```
┌─────────────────────────────────────────────────────────┐
│ 1. START: Create Feature Branch                        │
│    git checkout -b feature/supplier-analytics           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. DEVELOP: Make Changes                               │
│    - Edit files                                         │
│    - Test locally                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. COMMIT: Save Changes                                │
│    git add .                                            │
│    git commit -m "Add supplier analytics"               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. PUSH: Backup to Remote                              │
│    git push -u origin feature/supplier-analytics        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. REVIEW: (Optional) Create Pull Request              │
│    - Team reviews code                                  │
│    - Make requested changes                             │
│    - Push updates                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. MERGE: Integrate to Main                            │
│    git checkout main                                    │
│    git merge feature/supplier-analytics                 │
│    git push                                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 7. CLEANUP: Delete Feature Branch                      │
│    git branch -d feature/supplier-analytics             │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Qilly Branch Strategy

```
main (Production)
│
├─── develop (Integration)
│    │
│    ├─── feature/supplier-reports
│    │    │
│    │    ├─── Start → Work → Test → Merge to develop
│    │
│    ├─── feature/advanced-search
│    │    │
│    │    ├─── Start → Work → Test → Merge to develop
│    │
│    └─── bugfix/admin-login
│         │
│         ├─── Start → Fix → Test → Merge to develop
│
└─── hotfix/urgent-security-patch
     │
     └─── Fix → Test → Merge to main IMMEDIATELY
```

**Rules:**
- `main` = Production-ready code only
- `develop` = Integration branch for testing
- `feature/*` = New features
- `bugfix/*` = Bug fixes
- `hotfix/*` = Urgent production fixes

---

## 🔄 Team Collaboration Flow

```
Developer A's Computer          GitHub/GitLab          Developer B's Computer
─────────────────────          ─────────────          ─────────────────────

    Local Repo                  Remote Repo                Local Repo
        │                           │                           │
        │                           │                           │
        │      git push             │                           │
        ├──────────────────────────►│                           │
        │                           │                           │
        │                           │       git pull            │
        │                           │◄──────────────────────────┤
        │                           │                           │
        │                           │                           │
   Make changes              Both developers              Make changes
        │                     can see changes                  │
        │                           │                           │
        │      git push             │                           │
        ├──────────────────────────►│                           │
        │                           │                           │
        │                           │      git pull             │
        │                           ├──────────────────────────►│
        │                           │                           │
        ▼                           ▼                           ▼
```

---

## 💾 Commit Frequency Timeline

```
Hour 1: Initial work
│
├─ • git commit -m "Create component structure"
│
Hour 2: Add functionality
│
├─ • git commit -m "Add form validation"
│
Hour 3: More features
│
├─ • git commit -m "Add submit handler"
│  • git commit -m "Add error handling"
│
Lunch break: PUSH!
│
├─ • git push  ← Backup your work!
│
Hour 4: Continue work
│
├─ • git commit -m "Add success message"
│
End of day: PUSH!
│
└─ • git push  ← Always push at end of day!


✅ Good: Commit every hour or logical change
❌ Bad: Only commit at end of day
```

---

## 🔀 Merge Conflict Resolution

```
Step 1: Conflict Occurs
───────────────────────
main:     •────────•────────•
                   │        │
                   │        │ Your changes
                   │        │
feature:           •────────X  ← CONFLICT!
                            │
                   Someone else changed
                   the same lines!


Step 2: Git Shows Conflict
───────────────────────────
<<<<<<< HEAD (your changes)
const name = "Qilly Supplier";
=======
const name = "Qilly System";
>>>>>>> feature/new-name


Step 3: Manually Resolve
─────────────────────────
Choose one or combine:
const name = "Qilly Supplier System";


Step 4: Complete Merge
───────────────────────
git add resolved-file.tsx
git commit -m "Resolve merge conflict"

main:     •────────•────────•────────•
                   │        │        │
                   │        │        └─ Merged!
feature:           •────────X────────┘
```

---

## 📅 Daily Git Routine

```
┌───────────────────────────────────────────────────────┐
│                    MORNING                            │
├───────────────────────────────────────────────────────┤
│  9:00 AM → git pull                                   │
│            (Get latest changes)                       │
│                                                       │
│  9:05 AM → git checkout -b feature/today-work         │
│            (Create branch)                            │
└───────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────┐
│                  DURING THE DAY                       │
├───────────────────────────────────────────────────────┤
│  Every hour:                                          │
│    - Make changes                                     │
│    - git add .                                        │
│    - git commit -m "Descriptive message"              │
│                                                       │
│  Before lunch:                                        │
│    - git push -u origin feature/today-work            │
│                                                       │
│  After lunch:                                         │
│    - git pull (in case teammate pushed)               │
│    - Continue work                                    │
└───────────────────────────────────────────────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────────────┐
│                   END OF DAY                          │
├───────────────────────────────────────────────────────┤
│  5:00 PM → git add .                                  │
│            git commit -m "End of day progress"        │
│            git push                                   │
│                                                       │
│  Optional:                                            │
│    - Merge to main if feature complete                │
│    - Create Pull Request for review                   │
└───────────────────────────────────────────────────────┘
```

---

## 🎯 Feature Development Flow

```
┌────────────────────────────────────────────────────────┐
│             PLANNING PHASE                             │
│  - Define feature requirements                         │
│  - Create branch: git checkout -b feature/name         │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│           DEVELOPMENT PHASE                            │
│                                                        │
│  Cycle (repeat):                                       │
│  ┌──────────────────────────────────────────┐         │
│  │ 1. Write code (30-60 min)                │         │
│  │ 2. Test locally                           │         │
│  │ 3. git add .                              │         │
│  │ 4. git commit -m "Incremental progress"   │         │
│  └──────────────────────────────────────────┘         │
│                    │                                   │
│                    ▼                                   │
│  Every few hours: git push                             │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│             TESTING PHASE                              │
│  - Full feature testing                                │
│  - Bug fixes                                           │
│  - git commit -m "Fix bug in feature"                  │
│  - git push                                            │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│             REVIEW PHASE (Optional)                    │
│  - Create Pull Request on GitHub                      │
│  - Team reviews code                                   │
│  - Address feedback                                    │
│  - git push (updates PR automatically)                 │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│             MERGE PHASE                                │
│  - git checkout main                                   │
│  - git merge feature/name                              │
│  - Resolve conflicts if any                            │
│  - git push                                            │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│             CLEANUP PHASE                              │
│  - git branch -d feature/name                          │
│  - Update CHANGELOG.md                                 │
│  - Celebrate! 🎉                                       │
└────────────────────────────────────────────────────────┘
```

---

## 🚨 Emergency Hotfix Flow

```
Production is broken! 🔥

main:  •───────────────•───────────X  ← Bug discovered!
       │               │           │
       │               │           │
       │               │           └─ Critical bug affecting users!
       │               │
       │               └─ Last known good commit
       │
       └─ Create hotfix branch IMMEDIATELY

Step-by-step:

1. git checkout main
   git checkout -b hotfix/urgent-fix

2. Fix the bug quickly
   - Focus on minimum changes
   - Test thoroughly

3. git add .
   git commit -m "Fix critical bug in production"

4. git checkout main
   git merge hotfix/urgent-fix
   git push

5. Deploy to production ASAP!

6. Also merge to develop:
   git checkout develop
   git merge hotfix/urgent-fix
   git push

7. Clean up:
   git branch -d hotfix/urgent-fix

Result:

main:  •───────────────•───────────X───•  ← Fixed!
       │               │           │   │
       │               │           │   └─ Hotfix merged
       │               │           │
hotfix:                            •───┘
                                   │
                              Emergency fix
```

---

## 📊 Version Release Flow

```
Development → Testing → Release


develop:  •───•───•───•───•───•───•
          │                       │
          │                       │ Ready for release
          │                       │
          └───────────────────────┼─→ Tag v1.3.0
                                  │
                                  ▼
main:     •───────────────────────•
                                  │
                                  └─ Production ready


Commands:

1. Merge develop to main:
   git checkout main
   git merge develop

2. Create version tag:
   git tag -a v1.3.0 -m "Version 1.3.0: New features"

3. Push everything:
   git push
   git push --tags

4. Update CHANGELOG.md:
   - Move [Unreleased] items to [1.3.0]
   - Add release date

5. Deploy to production!
```

---

## 🎓 Quick Reference

```
COMMON COMMANDS                    WHAT IT DOES
─────────────────                  ────────────
git status                         Check what changed
git diff                           See detailed changes
git add .                          Stage all changes
git commit -m "msg"                Save changes
git push                           Upload to remote
git pull                           Download from remote
git checkout -b name               Create branch
git merge name                     Merge branch
git log                            View history
git reset --hard HEAD              Discard all changes
```

---

## 📚 Learn More

- [VERSION_CONTROL_GUIDE.md](./VERSION_CONTROL_GUIDE.md) - Complete guide
- [GIT_QUICK_START.md](./GIT_QUICK_START.md) - Quick commands
- [CHANGELOG.md](./CHANGELOG.md) - Version history

---

**Remember: These diagrams are guides - adapt to your workflow!** 🚀
