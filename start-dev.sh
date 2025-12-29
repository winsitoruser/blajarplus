#!/bin/bash

# Blajarplus Development Starter Script
# This script starts both backend and frontend servers

echo "🚀 Starting Blajarplus Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Backend dependencies not found. Installing...${NC}"
    cd backend && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Frontend dependencies not found. Installing...${NC}"
    cd frontend && npm install && cd ..
fi

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env not found. Copying from .env.example...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your database credentials${NC}"
fi

# Check if .env.local exists in frontend
if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}⚠️  Frontend .env.local not found. Copying from .env.local.example...${NC}"
    cp frontend/.env.local.example frontend/.env.local
fi

echo ""
echo -e "${GREEN}✅ All dependencies ready!${NC}"
echo ""
echo -e "${BLUE}📦 Starting Backend (http://localhost:3000)...${NC}"
echo -e "${BLUE}📦 Starting Frontend (http://localhost:3001)...${NC}"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start backend in background
cd backend && npm run start:dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend in background
cd frontend && npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for both processes
wait
