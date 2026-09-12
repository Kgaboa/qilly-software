@echo off
echo ============================================
echo  Starting Qilly - Fresh Clean Build
echo ============================================
echo.

echo [1/3] Clearing all caches...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
if exist "node_modules\.vite-temp" rmdir /s /q "node_modules\.vite-temp"
if exist "dist" rmdir /s /q "dist"
echo     ✓ Cache cleared

echo.
echo [2/3] Starting Vite dev server...
echo.

npm run dev

pause
