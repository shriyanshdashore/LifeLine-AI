@echo off
title LifeLine AI - Launch Server
echo ==============================================
echo    Starting LifeLine AI (PS6 Safety MVP)
echo ==============================================
echo.
cd /d "%~dp0"
echo [1/2] Verifying dependencies...
call npm install
echo.
echo [2/2] Launching Vite Server...
echo Site will open at: http://localhost:5173/
start http://localhost:5173/
call npm run dev
pause
