@echo off
REM Qilly Multi-Environment Setup Script (Windows)
REM This script helps you set up Development, SIT, Staging, and Production environments

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Qilly Multi-Environment Setup
echo ========================================
echo.

REM Check if we're running from the correct directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root directory.
    echo.
    echo Example: cd C:\path\to\qilly
    echo          scripts\setup-environments.bat
    pause
    exit /b 1
)

echo [INFO] Checking prerequisites...
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v18+ first.
    echo Download from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    echo.
    pause
    exit /b 1
)

REM Check Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed. Please install Git first.
    echo Download from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [SUCCESS] All prerequisites installed
echo.

REM Install dependencies
echo [INFO] Installing npm dependencies...
echo This may take a few minutes...
echo.
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo.
echo [SUCCESS] Dependencies installed
echo.

REM Set up Git branches
echo [INFO] Setting up Git branches...
echo.

REM Check if we're in a git repository
git rev-parse --is-inside-work-tree >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Not a git repository. Initializing...
    git init
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to initialize git repository
        pause
        exit /b 1
    )
    git add .
    git commit -m "Initial commit"
    echo [SUCCESS] Git repository initialized
    echo.
)

REM Get current branch
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set current_branch=%%i
if "!current_branch!"=="" set current_branch=main

REM Create develop branch
git show-ref --verify --quiet refs/heads/develop 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Branch 'develop' already exists
) else (
    git checkout -b develop 2>nul
    if %errorlevel% equ 0 (
        echo [SUCCESS] Created branch: develop
    ) else (
        echo [ERROR] Failed to create branch: develop
    )
)

REM Create sit branch
git show-ref --verify --quiet refs/heads/sit 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Branch 'sit' already exists
) else (
    git checkout -b sit 2>nul
    if %errorlevel% equ 0 (
        echo [SUCCESS] Created branch: sit
    ) else (
        echo [ERROR] Failed to create branch: sit
    )
)

REM Create staging branch
git show-ref --verify --quiet refs/heads/staging 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Branch 'staging' already exists
) else (
    git checkout -b staging 2>nul
    if %errorlevel% equ 0 (
        echo [SUCCESS] Created branch: staging
    ) else (
        echo [ERROR] Failed to create branch: staging
    )
)

REM Return to original branch
git checkout %current_branch% 2>nul

echo.
echo [SUCCESS] Git branches configured
echo.

REM Create environment files
echo [INFO] Creating environment configuration files...
echo.

REM Create .env.development
if not exist ".env.development" (
    echo # Development Environment Configuration > .env.development
    echo NEXT_PUBLIC_ENVIRONMENT=development >> .env.development
    echo. >> .env.development
    echo # TODO: Replace with your Supabase development project credentials >> .env.development
    echo NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co >> .env.development
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key >> .env.development
    echo. >> .env.development
    echo # Cron Secret (Generated) >> .env.development
    for /f "tokens=*" %%i in ('powershell -Command "[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))"') do echo CRON_SECRET=%%i >> .env.development
    echo. >> .env.development
    echo # Development settings >> .env.development
    echo NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true >> .env.development
    echo NEXT_PUBLIC_APP_VERSION=1.0.0-dev >> .env.development
    echo [SUCCESS] Created .env.development
) else (
    echo [INFO] .env.development already exists (skipping)
)

REM Create .env.sit
if not exist ".env.sit" (
    echo # SIT/UAT Environment Configuration > .env.sit
    echo NEXT_PUBLIC_ENVIRONMENT=sit >> .env.sit
    echo. >> .env.sit
    echo # TODO: Replace with your Supabase SIT project credentials >> .env.sit
    echo NEXT_PUBLIC_SUPABASE_URL=https://your-sit-project.supabase.co >> .env.sit
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-sit-anon-key >> .env.sit
    echo. >> .env.sit
    echo # Cron Secret (Generated) >> .env.sit
    for /f "tokens=*" %%i in ('powershell -Command "[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))"') do echo CRON_SECRET=%%i >> .env.sit
    echo. >> .env.sit
    echo # SIT settings >> .env.sit
    echo NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true >> .env.sit
    echo NEXT_PUBLIC_APP_VERSION=1.0.0-sit >> .env.sit
    echo [SUCCESS] Created .env.sit
) else (
    echo [INFO] .env.sit already exists (skipping)
)

REM Create .env.staging
if not exist ".env.staging" (
    echo # Staging Environment Configuration > .env.staging
    echo NEXT_PUBLIC_ENVIRONMENT=staging >> .env.staging
    echo. >> .env.staging
    echo # TODO: Replace with your Supabase staging project credentials >> .env.staging
    echo NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co >> .env.staging
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key >> .env.staging
    echo. >> .env.staging
    echo # Cron Secret (Generated) >> .env.staging
    for /f "tokens=*" %%i in ('powershell -Command "[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))"') do echo CRON_SECRET=%%i >> .env.staging
    echo. >> .env.staging
    echo # Staging settings >> .env.staging
    echo NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=false >> .env.staging
    echo NEXT_PUBLIC_APP_VERSION=1.0.0-staging >> .env.staging
    echo [SUCCESS] Created .env.staging
) else (
    echo [INFO] .env.staging already exists (skipping)
)

REM Create .env.production
if not exist ".env.production" (
    echo # Production Environment Configuration > .env.production
    echo NEXT_PUBLIC_ENVIRONMENT=production >> .env.production
    echo. >> .env.production
    echo # TODO: Replace with your Supabase production project credentials >> .env.production
    echo NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co >> .env.production
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key >> .env.production
    echo. >> .env.production
    echo # Cron Secret (Generated) >> .env.production
    for /f "tokens=*" %%i in ('powershell -Command "[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))"') do echo CRON_SECRET=%%i >> .env.production
    echo. >> .env.production
    echo # Production settings >> .env.production
    echo NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=false >> .env.production
    echo NEXT_PUBLIC_APP_VERSION=1.0.0 >> .env.production
    echo [SUCCESS] Created .env.production
) else (
    echo [INFO] .env.production already exists (skipping)
)

echo.
echo ==========================================
echo   Multi-Environment Setup Complete!
echo ==========================================
echo.
echo.
echo Next Steps:
echo.
echo 1. Create Supabase Projects:
echo    - Go to https://app.supabase.com
echo    - Create 4 projects: qilly-dev, qilly-sit, qilly-staging, qilly-production
echo    - Region: Europe (Frankfurt) - closest to SA
echo.
echo 2. Update Environment Files:
echo    - Edit .env.development with dev Supabase credentials
echo    - Edit .env.sit with SIT Supabase credentials
echo    - Edit .env.staging with staging Supabase credentials
echo    - Edit .env.production with production Supabase credentials
echo.
echo 3. Push Branches to GitHub:
echo    - git push -u origin main
echo    - git push -u origin staging
echo    - git push -u origin sit
echo    - git push -u origin develop
echo.
echo 4. Connect to Vercel:
echo    - Go to https://vercel.com
echo    - Import your GitHub repository
echo    - Configure environment variables (see MULTI_ENVIRONMENT_SETUP.md)
echo.
echo 5. Test Deployment:
echo    - npm run dev (local development)
echo    - Push to 'sit' branch to auto-deploy to SIT
echo    - Push to 'staging' branch to auto-deploy to Staging
echo    - Push to 'main' branch to auto-deploy to Production
echo.
echo.
echo Documentation:
echo    - Full guide: MULTI_ENVIRONMENT_SETUP.md
echo    - Windows guide: WINDOWS_SETUP_GUIDE.md
echo    - Architecture report: Qilly_Hosting_Architecture_Report.md
echo.
echo.
echo Cost:
echo    - Development: R0/month (local)
echo    - SIT: R0/month (free tier + health checks)
echo    - Staging: R0/month (free tier initially)
echo    - Production: R0-R1,800/month (upgrade when ready)
echo.
echo.
echo [SUCCESS] Ready to deploy!
echo.
pause
