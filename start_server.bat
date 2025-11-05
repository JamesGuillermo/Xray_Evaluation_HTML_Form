@echo off
REM Simple HTTP Server for Testing X-ray Form Locally
REM This allows you to test the form without deploying to Firebase

echo ========================================
echo X-RAY FORM - LOCAL TEST SERVER
echo ========================================
echo.
echo Starting local web server...
echo.
echo The form will be available at:
echo   http://localhost:8000/index.html
echo.
echo To test the CSV validator:
echo   http://localhost:8000/csv_validator.html
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed!
    echo.
    echo Please install Python from: https://python.org/downloads
    echo Then run this script again.
    pause
    exit /b 1
)

REM Start Python HTTP server
python -m http.server 8000

pause
