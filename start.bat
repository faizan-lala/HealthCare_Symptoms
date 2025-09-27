@echo off
echo Starting HealthTracker Development Servers...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install
cd server
call npm install
cd ..\client
call npm install
cd ..

echo.
echo Starting servers...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:5000
echo.

REM Start both servers concurrently
start "Backend Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd client && npm run dev"

echo Both servers are starting...
echo Check the opened terminal windows for status.
pause
