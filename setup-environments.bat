@echo off
echo ========================================
echo  Qilly Environment Setup
echo ========================================
echo.

REM Check if .env.example exists
if not exist .env.example (
    echo Creating .env.example template...
    (
        echo # Qilly Environment Variables Template
        echo # Copy this to .env.local and fill in your values
        echo.
        echo VITE_SUPABASE_URL=your_supabase_url_here
        echo VITE_SUPABASE_ANON_KEY=your_anon_key_here
        echo VITE_API_BASE_URL=http://localhost:3000
        echo VITE_ENVIRONMENT=development
    ) > .env.example
    echo ✓ Created .env.example
)

REM Check if .env.local exists
if not exist .env.local (
    echo.
    echo ⚠️  WARNING: .env.local not found!
    echo Creating from template...
    copy .env.example .env.local
    echo.
    echo ✓ Created .env.local
    echo ⚠️  IMPORTANT: Edit .env.local with your actual credentials!
    echo.
    pause
    notepad .env.local
)

REM Create .gitignore if it doesn't exist
if not exist .gitignore (
    echo.
    echo Creating .gitignore...
    (
        echo # Environment files
        echo .env
        echo .env.local
        echo .env.*.local
        echo .env.sit
        echo .env.staging
        echo .env.production
        echo.
        echo # Dependencies
        echo node_modules/
        echo.
        echo # Build output
        echo dist/
        echo build/
        echo .vite/
        echo.
        echo # Logs
        echo *.log
        echo.
        echo # Editor
        echo .vscode/
        echo .idea/
        echo .DS_Store
    ) > .gitignore
    echo ✓ Created .gitignore
)

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Your environment files are protected:
echo   ✓ .env.local - for local development
echo   ✓ .gitignore - protects secrets from Git
echo.
echo NEXT STEPS:
echo   1. Edit .env.local with your Supabase credentials
echo   2. Never commit .env.local to Git
echo   3. Only pull/push SOURCE CODE changes
echo.
pause
