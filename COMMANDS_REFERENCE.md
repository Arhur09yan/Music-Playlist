# 📚 Complete Commands Reference

## 🚀 Quick Start (Easiest)

```bash
# Option 1: Use the run script
./run-app.sh

# Option 2: Use Makefile
make start

# Option 3: Manual (two terminals)
# Terminal 1:
make backend-up

# Terminal 2:
make frontend-dev
```

---

## 🐍 Backend Commands

### Start Backend:

```bash
# Using Makefile
make backend-up

# Using Docker directly
cd backend
docker compose up -d

# Run locally (without Docker)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Stop Backend:

```bash
make backend-down
# OR
cd backend && docker compose down
```

### View Logs:

```bash
make backend-logs
# OR
cd backend && docker compose logs -f api
```

### Restart Backend:

```bash
make backend-restart
```

---

## ⚛️ Frontend Commands

### Start Frontend:

```bash
# Using Makefile
make frontend-dev

# Manual
npm install          # First time only
npm run dev
```

### Build Frontend:

```bash
make frontend-build
# OR
npm run build
```

### Start Production Frontend:

```bash
make frontend-start
# OR
npm start
```

---

## 🗄️ Database Commands

### Connect to Database:

```bash
make db-connect
# OR
cd backend && docker compose exec db psql -U music_user -d music_db
```

### Import Spotify Songs:

```bash
make import-spotify QUERY="indie pop" LIMIT=20
```

---

## 🌐 Full Stack Commands

### Development (Local):

```bash
# Terminal 1: Backend
make backend-up

# Terminal 2: Frontend
make frontend-dev
```

### Production (Render):

**Backend:**

- Root Directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Frontend:**

- Root Directory: `.`
- Build: `npm install && npm run build`
- Start: `npm start`

---

## 📋 All Makefile Commands

```bash
make help              # Show all available commands
make setup             # Initial setup
make backend-up        # Start backend
make backend-down      # Stop backend
make backend-logs      # View backend logs
make frontend-dev      # Start frontend dev server
make frontend-build    # Build frontend
make db-connect        # Connect to database
make import-spotify    # Import songs from Spotify
```

---

## ✅ Verification Commands

```bash
# Check backend health
curl http://localhost:8000/health

# Check API docs
open http://localhost:8000/docs

# Check frontend
open http://localhost:3000

# Check database
make db-connect
```

---

## 🎯 Render Deployment Commands

### Backend:

```
Environment: Python 3
Root Directory: backend
Build: pip install -r requirements.txt
Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend:

```
Environment: Node
Root Directory: . (root)
Build: npm install && npm run build
Start: npm start
```

---

## 🔧 Environment Setup

### Backend (.env):

```bash
DATABASE_URL=postgresql+psycopg2://music_user:music_password@localhost:5433/music_db
SECRET_KEY=your-secret-key
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
```

### Frontend:

```bash
export NEXT_PUBLIC_BACKEND_URL="http://localhost:8000/api/v1"
```

---

## 📖 See Also

- `QUICK_START.md` - Quick reference
- `RUN_APP_COMMANDS.md` - Detailed commands
- `RENDER_DEPLOYMENT.md` - Deployment guide
