@echo off
REM InterviewIQ - Quick Start Script for Windows
REM This script explains how to start all three services

echo.
echo ====================================================
echo         InterviewIQ - Quick Start Guide
echo ====================================================
echo.
echo You need to open 3 separate Command Prompt (CMD) terminals
echo and run the following commands:
echo.
echo ====================================================
echo TERMINAL 1: Backend Server
echo ====================================================
echo cd backend
echo npm run dev
echo.
echo (Backend will run on http://localhost:5000)
echo.
echo ====================================================
echo TERMINAL 2: Frontend Server
echo ====================================================
echo cd frontend
echo npm run dev
echo.
echo (Frontend will run on http://localhost:5173)
echo.
echo ====================================================
echo TERMINAL 3: AI Service (Optional for Phase 2)
echo ====================================================
echo cd ai-service
echo python -m venv venv
echo venv\Scripts\activate
echo pip install -r requirements.txt
echo python -m uvicorn app.main:app --reload
echo.
echo (AI Service will run on http://localhost:8000)
echo.
echo ====================================================
echo NEXT STEPS:
echo ====================================================
echo 1. Open http://localhost:5173 in your browser
echo 2. Click "Register" to create a new account
echo 3. Fill in the form and click "Register"
echo 4. You should see a green success message
echo 5. Check your email for verification link
echo 6. Click the link to verify your email
echo 7. Login with your email and password
echo 8. You will see the dashboard
echo.
echo ====================================================
echo.
pause
