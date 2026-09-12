# 🔧 Fix PartnerPortal.tsx Build Error

## Problem
Your `PartnerPortal.tsx` file has **escaped quotes** (`\"`) instead of regular quotes (`"`), which causes this build error:

```
ERROR: Expected "{" but found "\\"
```

## Quick Fix (Windows)

### Option 1: PowerShell Script (Recommended - 10 seconds)

1. Open PowerShell in your project root directory:
   ```
   C:\Users\Kgabo Sekhula\Onlinepricingsystem-main>
   ```

2. Run this command:
   ```powershell
   (Get-Content -Path "src\app\components\PartnerPortal.tsx" -Raw) -replace '\\"', '"' | Set-Content -Path "src\app\components\PartnerPortal.tsx"
   ```

3. Test the build:
   ```
   npm run build
   ```

### Option 2: Manual Find & Replace in VS Code (2 minutes)

1. Open `src/app/components/PartnerPortal.tsx` in VS Code

2. Press `Ctrl + H` (Find and Replace)

3. In "Find" box, type: `\"`

4. In "Replace" box, type: `"`

5. Click "Replace All" button

6. Save the file (`Ctrl + S`)

7. Test the build:
   ```
   npm run build
   ```

### Option 3: Using sed (if Git Bash is installed)

1. Open Git Bash in project root

2. Run:
   ```bash
   sed -i 's/\\"/"/g' src/app/components/PartnerPortal.tsx
   ```

3. Test:
   ```
   npm run build
   ```

---

## What Happened?

The file somehow got corrupted with escaped quotes (`\"`). This typically happens when:
- Copying code from markdown/documentation
- Manual edits with incorrect escaping  
- File encoding issues

The fix replaces all `\"` (escaped quotes) with `"` (normal quotes) throughout the file.

---

## After Fixing

Once the file is fixed, you should be able to:

1. **Build successfully:**
   ```
   npm run build
   ✓ Build successful!
   ```

2. **Push to dev branch:**
   ```
   git add src/app/components/PartnerPortal.tsx
   git commit -m "fix: Remove escaped quotes from PartnerPortal.tsx"
   git push origin dev
   ```

3. **Deploy automatically** via Vercel/Netlify

---

## Verify the Fix

After running the fix, check that line 56 now looks like this:

**BEFORE (broken):**
```tsx
<div className=\"min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6\">
```

**AFTER (correct):**
```tsx
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
```

---

## If You Still Have Issues

If the above doesn't work, let me know and I can provide the corrected file directly.

---

**Quick Command Summary:**

```powershell
# Fix the file
(Get-Content -Path "src\app\components\PartnerPortal.tsx" -Raw) -replace '\\"', '"' | Set-Content -Path "src\app\components\PartnerPortal.tsx"

# Test build
npm run build

# If successful, push to dev
git add src/app/components/PartnerPortal.tsx
git commit -m "fix: Remove escaped quotes from PartnerPortal.tsx"
git push origin dev
```

---

**That's it! Your build should work after this fix.** ✅
