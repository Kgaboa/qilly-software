@echo off
REM ⚡ Quick Deploy Script - Partner Portal Integration (Windows)
REM Run this script to deploy your changes to dev branch

echo.
echo ========================================
echo 🚀 Qilly Dev Branch Deployment Script
echo ========================================
echo.

REM Step 1: Check Git status
echo Step 1: Checking Git status...
git status
echo.

REM Step 2: Stage all changes
echo Step 2: Staging all changes...
git add .
echo ✓ Changes staged
echo.

REM Step 3: Commit changes
echo Step 3: Committing changes...
set /p COMMIT_MSG="Enter commit message (or press Enter for default): "

if "%COMMIT_MSG%"=="" (
    set "COMMIT_MSG=feat: Partner Portal & White-Label SaaS integration - Added PartnerPortal component with 5 comprehensive tabs - Integrated white-label configuration with live preview - Added API & Integration hub with code examples - Added tier upgrade buttons in MainDashboard - Added export functionality (JSON, HTML, Excel) with dropdown menus - Updated AdminDashboard with Partners tab - Ready for Tuesday eTender demo"
)

git commit -m "%COMMIT_MSG%"
echo ✓ Changes committed
echo.

REM Step 4: Check current branch
echo Step 4: Checking current branch...
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo Current branch: %CURRENT_BRANCH%

if NOT "%CURRENT_BRANCH%"=="dev" (
    echo ⚠️  You're not on dev branch. Switching to dev...
    
    REM Check if dev branch exists
    git show-ref --verify --quiet refs/heads/dev
    if errorlevel 1 (
        echo Dev branch doesn't exist. Creating it...
        git checkout -b dev
    ) else (
        git checkout dev
    )
    
    echo ✓ Switched to dev branch
)
echo.

REM Step 5: Push to remote dev branch
echo Step 5: Pushing to remote dev branch...
git push origin dev
echo ✓ Pushed to origin/dev
echo.

REM Step 6: Success message
echo ======================================
echo ✅ Deployment Complete!
echo ======================================
echo.
echo Next Steps:
echo 1. Check your deployment platform:
echo    - Vercel: https://vercel.com/dashboard
echo    - Netlify: https://app.netlify.com
echo.
echo 2. Wait ~2-3 minutes for automatic build and deploy
echo.
echo 3. Your dev site will be available at:
echo    - Vercel: qilly-git-dev.vercel.app
echo    - Netlify: dev--qilly.netlify.app
echo.
echo 4. Test the new Partner Portal:
echo    - Login to Admin Dashboard
echo    - Click 'Partners' tab (marked with NEW badge)
echo    - Verify all 5 tabs work correctly
echo.
echo For Tuesday's eTender demo, merge to main:
echo    git checkout main
echo    git merge dev
echo    git push origin main
echo.
echo 🎉 Ready for deployment! Good luck with the demo! 🚀
echo.
pause
