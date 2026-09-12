@echo off
echo ============================================
echo  Qilly - Clear All Vite Caches
echo ============================================
echo.

echo [1/4] Stopping any running processes...
timeout /t 2 /nobreak >nul

echo [2/4] Clearing node_modules/.vite cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo     ✓ Deleted node_modules\.vite
) else (
    echo     ✓ No .vite cache found
)

echo [3/4] Clearing node_modules/.vite-temp cache...
if exist "node_modules\.vite-temp" (
    rmdir /s /q "node_modules\.vite-temp"
    echo     ✓ Deleted node_modules\.vite-temp
) else (
    echo     ✓ No .vite-temp cache found
)

echo [4/4] Clearing dist folder...
if exist "dist" (
    rmdir /s /q "dist"
    echo     ✓ Deleted dist
) else (
    echo     ✓ No dist folder found
)

echo.
echo ============================================
echo  Cache cleared successfully!
echo ============================================
echo.
echo Now restart your dev server:
echo   npm run dev
echo     OR
echo   pnpm dev
echo.
pause
