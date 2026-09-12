@echo off
echo ============================================
echo  EMERGENCY FIX - Force Clean Dashboard
echo ============================================
echo.
echo [1] Close VS Code or any editor NOW!
echo [2] Press any key when editor is closed...
pause >nul

echo.
echo [3] Killing any Node/Vite processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [4] Clearing all caches...
rmdir /s /q "node_modules\.vite" 2>nul
rmdir /s /q "node_modules\.vite-temp" 2>nul
rmdir /s /q "dist" 2>nul

echo [5] File is already clean - ready to restart!
echo.
echo ============================================
echo  NOW DO THIS:
echo ============================================
echo 1. Open your editor fresh
echo 2. DO NOT modify Dashboard.tsx
echo 3. Run: npm run dev
echo 4. Hard refresh browser (Ctrl+Shift+R)
echo ============================================
pause
