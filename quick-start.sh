#!/bin/bash

# InterviewIQ - Quick Start Script
# This script starts all three services for development

echo "🚀 InterviewIQ - Starting all services..."
echo ""

# Check if running on Windows (Git Bash or WSL)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    echo "📝 For Windows CMD users:"
    echo ""
    echo "Open 3 separate CMD terminals and run:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "  cd backend"
    echo "  npm run dev"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "  cd frontend"
    echo "  npm run dev"
    echo ""
    echo "Terminal 3 (AI Service):"
    echo "  cd ai-service"
    echo "  python -m venv venv"
    echo "  venv\Scripts\activate"
    echo "  pip install -r requirements.txt"
    echo "  python -m uvicorn app.main:app --reload"
else
    echo "🖥️  Running on macOS/Linux"
    echo ""
    
    # Start backend in background
    echo "Starting Backend..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    
    # Start frontend in background
    echo "Starting Frontend..."
    cd ../frontend
    npm run dev &
    FRONTEND_PID=$!
    
    # Start AI service in background
    echo "Starting AI Service..."
    cd ../ai-service
    python -m uvicorn app.main:app --reload &
    AI_PID=$!
    
    echo ""
    echo "✅ All services started!"
    echo ""
    echo "Frontend: http://localhost:5173"
    echo "Backend: http://localhost:5000"
    echo "AI Service: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Wait for signals
    wait
fi
