@echo off
title NRO Online 2D - Local Game Server
echo.
echo  =========================================
echo  Dragon Ball Online 2D - Khoi Dong Server
echo  =========================================
echo.
echo  Dang kiem tra Node.js...

where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  [LOI] Node.js chua duoc cai dat!
    echo  Hay tai Node.js tai: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo  Node.js tim thay!
echo  Dang khoi dong server...
echo.

cd /d "%~dp0"
node server.js

pause
