#!/bin/bash

# Full App Runner Script
# This script starts both backend and frontend services

set -e

echo "🚀 Starting Full Application..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found!"
    exit 1
fi

# Start Backend
echo "${GREEN}📦 Starting Backend (Database + API)...${NC}"
cd backend
docker compose up -d
echo "${GREEN}✅ Backend started!${NC}"
echo "   - API: http://localhost:8000"
echo "   - Docs: http://localhost:8000/docs"
cd ..

# Wait for backend to be ready
echo ""
echo "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
sleep 5

# Check if backend is responding
if curl -s http://localhost:8000/health > /dev/null; then
    echo "${GREEN}✅ Backend is ready!${NC}"
else
    echo "${YELLOW}⚠️  Backend might still be starting...${NC}"
fi

# Set environment variable for frontend
export NEXT_PUBLIC_BACKEND_URL="http://localhost:8000/api/v1"

# Start Frontend
echo ""
echo "${GREEN}⚛️  Starting Frontend...${NC}"
echo "   - URL: http://localhost:3000"
echo ""

# Check for package manager
if command -v pnpm > /dev/null 2>&1; then
    echo "Using pnpm..."
    pnpm dev
elif command -v npm > /dev/null 2>&1; then
    echo "Using npm..."
    npm run dev
elif command -v yarn > /dev/null 2>&1; then
    echo "Using yarn..."
    yarn dev
else
    echo "❌ No package manager found. Please install npm, pnpm, or yarn."
    exit 1
fi

