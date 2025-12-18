# Complete Commands to Run the Full App

## 🚀 Quick Start - Run Everything

### Option 1: Using Makefile (Easiest)

```bash
# Start everything (database + backend + frontend)
make all

# Or start individually:
make backend-up    # Start database and backend
make frontend-dev  # Start frontend
```

---

## 📋 Complete Command List

### 1. Start Backend (Database + API)

#### Using Docker (Recommended for Development):

```bash
cd backend
docker compose up -d
```

#### Or using Makefile:

```bash
make backend-up
```

#### Manual Docker Commands:

```bash
# Start database
cd backend
docker compose up db -d

# Start API
docker compose up api -d

# View logs
docker compose logs -f api
```

#### Run Backend Locally (without Docker):

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql+psycopg2://music_user:music_password@localhost:5433/music_db"
export SECRET_KEY="your-secret-key"
export SPOTIFY_CLIENT_ID="your-client-id"
export SPOTIFY_CLIENT_SECRET="your-client-secret"

# Run the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

### 2. Start Frontend

#### Using Makefile:

```bash
make frontend-dev
```

#### Manual Commands:

```bash
# Install dependencies (first time only)
npm install
# OR
pnpm install

# Set environment variable
export NEXT_PUBLIC_BACKEND_URL="http://localhost:8000/api/v1"

# Run development server
npm run dev
# OR
pnpm dev
```

#### Production Build:

```bash
# Build for production
npm run build
# OR
pnpm build

# Start production server
npm start
# OR
pnpm start
```

---

## 🌐 Full Stack - Complete Setup

### Development (Local)

```bash
# Terminal 1: Start Backend
cd backend
docker compose up

# Terminal 2: Start Frontend
cd /Users/artur/Desktop/fast-api-next-js-scaffold
npm install
export NEXT_PUBLIC_BACKEND_URL="http://localhost:8000/api/v1"
npm run dev
```

### Production (Render Deployment)

**Backend:**

```bash
# Build Command (in Render)
pip install -r requirements.txt

# Start Command (in Render)
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Frontend:**

```bash
# Build Command (in Render)
npm install && npm run build

# Start Command (in Render)
npm start
```

---

## 🔧 Environment Variables

### Backend (.env file or Render Environment Variables)

```bash
DATABASE_URL=postgresql+psycopg2://music_user:music_password@localhost:5433/music_db
SECRET_KEY=your-super-secret-key-min-32-characters
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DEBUG=True
API_V1_STR=/api/v1
AUDIO_STORAGE_DIR=audio_storage
```

### Frontend (Environment Variables)

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api/v1
NODE_ENV=development
```

For Production (Render):

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com/api/v1
NODE_ENV=production
```

---

## 📦 One-Command Setup (First Time)

```bash
# Clone and setup everything
git clone <your-repo>
cd fast-api-next-js-scaffold

# Backend setup
cd backend
docker compose up -d
# Wait for database to be ready, then:
docker compose up api

# Frontend setup (new terminal)
cd ..
npm install
npm run dev
```

---

## 🐳 Docker Commands

### Start All Services:

```bash
cd backend
docker compose up -d
```

### Stop All Services:

```bash
cd backend
docker compose down
```

### View Logs:

```bash
cd backend
docker compose logs -f
```

### Restart Services:

```bash
cd backend
docker compose restart
```

---

## 🎯 Render Deployment Commands

### Backend Service:

- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend Service:

- **Root Directory:** `.` (root)
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

---

## ✅ Verification Commands

### Check Backend:

```bash
# Health check
curl http://localhost:8000/health

# API docs
open http://localhost:8000/docs

# Test endpoint
curl http://localhost:8000/api/v1/songs?limit=5
```

### Check Frontend:

```bash
# Open in browser
open http://localhost:3000
```

### Check Database:

```bash
cd backend
docker compose exec db psql -U music_user -d music_db -c "SELECT COUNT(*) FROM songs;"
```

---

## 🔄 Full Restart

```bash
# Stop everything
cd backend
docker compose down

# Start fresh
docker compose up -d

# Frontend (if needed)
cd ..
npm run dev
```

---

## 📝 Quick Reference

| Service         | Command                                           | Port |
| --------------- | ------------------------------------------------- | ---- |
| **Database**    | `docker compose up db`                            | 5433 |
| **Backend API** | `uvicorn app.main:app --host 0.0.0.0 --port 8000` | 8000 |
| **Frontend**    | `npm run dev`                                     | 3000 |

---

## 🚨 Troubleshooting

### Backend won't start:

```bash
# Check if database is running
docker compose ps

# Check backend logs
docker compose logs api

# Restart backend
docker compose restart api
```

### Frontend won't connect:

```bash
# Check backend is running
curl http://localhost:8000/health

# Check environment variable
echo $NEXT_PUBLIC_BACKEND_URL

# Restart frontend
npm run dev
```

---

## 🎬 Complete Run Script

Create a file `run-all.sh`:

```bash
#!/bin/bash

# Start backend
echo "Starting backend..."
cd backend
docker compose up -d
sleep 5

# Start frontend
echo "Starting frontend..."
cd ..
export NEXT_PUBLIC_BACKEND_URL="http://localhost:8000/api/v1"
npm run dev
```

Make it executable:

```bash
chmod +x run-all.sh
./run-all.sh
```
