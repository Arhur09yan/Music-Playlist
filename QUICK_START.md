# 🚀 Quick Start - Run Full App

## One-Command Setup (Easiest)

```bash
# Terminal 1: Start Backend
make backend-up

# Terminal 2: Start Frontend
make frontend-dev
```

---

## 📋 Complete Commands

### 🐍 Backend (FastAPI)

#### Start Backend:

```bash
cd backend
docker compose up -d
```

#### Stop Backend:

```bash
cd backend
docker compose down
```

#### View Backend Logs:

```bash
cd backend
docker compose logs -f api
```

#### Run Backend Locally (without Docker):

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Backend URL:** http://localhost:8000
**API Docs:** http://localhost:8000/docs

---

### ⚛️ Frontend (Next.js)

#### Start Frontend:

```bash
npm install          # First time only
npm run dev
```

**Frontend URL:** http://localhost:3000

#### Production Build:

```bash
npm run build
npm start
```

---

## 🌐 Full Stack - Run Everything

### Development Mode:

**Terminal 1 (Backend):**

```bash
cd backend
docker compose up
```

**Terminal 2 (Frontend):**

```bash
npm run dev
```

---

## 🎯 Render Deployment Commands

### Backend Service:

```
Root Directory: backend
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend Service:

```
Root Directory: . (root)
Environment: Node
Build Command: npm install && npm run build
Start Command: npm start
```

---

## ✅ Verify Everything Works

```bash
# Check backend
curl http://localhost:8000/health

# Check frontend
open http://localhost:3000

# Check database
cd backend
docker compose exec db psql -U music_user -d music_db -c "SELECT 1;"
```

---

## 🔧 Environment Variables

### Backend:

```bash
DATABASE_URL=postgresql+psycopg2://music_user:music_password@localhost:5433/music_db
SECRET_KEY=your-secret-key
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
```

### Frontend:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api/v1
```

---

## 📦 Makefile Commands

```bash
make backend-up      # Start backend
make frontend-dev    # Start frontend
make backend-down    # Stop backend
make backend-logs    # View logs
make help           # See all commands
```

---

## 🚨 Troubleshooting

### Backend not starting:

```bash
cd backend
docker compose logs api
docker compose restart api
```

### Frontend not connecting:

```bash
# Check backend is running
curl http://localhost:8000/health

# Check environment variable
echo $NEXT_PUBLIC_BACKEND_URL
```

---

## 🎬 Complete Run Script

Save as `run.sh`:

```bash
#!/bin/bash

# Start backend
echo "🚀 Starting backend..."
cd backend && docker compose up -d && cd ..

# Wait for backend
sleep 5

# Start frontend
echo "🚀 Starting frontend..."
export NEXT_PUBLIC_BACKEND_URL="http://localhost:8000/api/v1"
npm run dev
```

Run:

```bash
chmod +x run.sh
./run.sh
```
