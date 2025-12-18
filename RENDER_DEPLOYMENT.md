# Render Deployment Guide

This guide will help you deploy your FastAPI + Next.js application to Render.

## Architecture

You'll need to deploy 3 services on Render:

1. **PostgreSQL Database** (Render PostgreSQL)
2. **FastAPI Backend** (Web Service)
3. **Next.js Frontend** (Web Service)

---

## Step 1: Deploy PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `music-db` (or your preferred name)
   - **Database**: `music_db`
   - **User**: `music_user`
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 16
4. Click **"Create Database"**
5. **Save the connection string** - you'll need it for the backend

---

## Step 2: Deploy FastAPI Backend

### 2.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository and branch

### 2.2 Configure Backend Service

**Basic Settings:**

- **Name**: `music-api` (or your preferred name)
- **Region**: Same as database
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
Add these in the Render dashboard:

```bash
# Database (use the connection string from Step 1)
DATABASE_URL=postgresql+psycopg2://music_user:password@hostname:5432/music_db

# JWT Security (generate a strong secret key)
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Spotify API (get from https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Server Settings
DEBUG=False
API_V1_STR=/api/v1

# Audio Storage (optional, for local file caching)
AUDIO_STORAGE_DIR=audio_storage

# Port (Render sets this automatically)
PORT=10000
```

**Important Notes:**

- Replace `DATABASE_URL` with your actual PostgreSQL connection string from Step 1
- Generate a strong `SECRET_KEY` (use: `openssl rand -hex 32`)
- Get Spotify credentials from [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

### 2.3 Deploy Backend

Click **"Create Web Service"** and wait for deployment.

**Save the backend URL** (e.g., `https://music-api.onrender.com`)

---

## Step 3: Deploy Next.js Frontend

### 3.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect the same GitHub repository
4. Select the repository and branch

### 3.2 Configure Frontend Service

**Basic Settings:**

- **Name**: `music-app` (or your preferred name)
- **Region**: Same as other services
- **Branch**: `main` (or your default branch)
- **Root Directory**: `.` (root of repository)
- **Runtime**: `Node`
- **Build Command**: `pnpm install && pnpm run build`
- **Start Command**: `pnpm start`

**Environment Variables:**
Add these in the Render dashboard:

```bash
# Backend API URL (use your backend URL from Step 2)
NEXT_PUBLIC_BACKEND_URL=https://music-api.onrender.com/api/v1
# OR
NEXT_PUBLIC_API_URL=https://music-api.onrender.com/api/v1

# Node Environment (IMPORTANT: Must be exactly "production" - no typos or extra spaces)
NODE_ENV=production
```

**Important Notes:**

- Replace `https://music-api.onrender.com` with your actual backend URL
- The `NEXT_PUBLIC_` prefix makes these variables available in the browser
- **CRITICAL**: Ensure `NODE_ENV` is set to exactly `production` (not `development` or any other value)
- **CRITICAL**: Use `pnpm start` (not `pnpm run dev`) for the Start Command in production

### 3.3 Deploy Frontend

Click **"Create Web Service"** and wait for deployment.

---

## Step 4: Update CORS (if needed)

If you get CORS errors, update `backend/app/main.py` to allow your frontend domain:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.onrender.com",
        "http://localhost:3000",  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Step 5: Database Migrations

After deployment, you may need to run database migrations. You can do this via:

1. **Render Shell** (recommended):

   - Go to your backend service
   - Click "Shell" tab
   - Run migration commands

2. **Or create a one-time script** in your backend

---

## Environment Variables Summary

### Backend (.env or Render Environment Variables)

```
DATABASE_URL=postgresql+psycopg2://...
SECRET_KEY=...
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DEBUG=False
AUDIO_STORAGE_DIR=audio_storage
```

### Frontend (Render Environment Variables)

```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com/api/v1
NODE_ENV=production
```

---

## Troubleshooting

### Backend Issues

1. **Database Connection Failed**

   - Check `DATABASE_URL` is correct
   - Ensure database is running
   - Check firewall/network settings

2. **Port Issues**

   - Render sets `$PORT` automatically
   - Use `--port $PORT` in start command

3. **Build Failures**
   - Check `requirements.txt` is correct
   - Ensure Python version is compatible

### Frontend Issues

1. **API Connection Failed**

   - Verify `NEXT_PUBLIC_BACKEND_URL` is correct
   - Check backend is running
   - Check CORS settings

2. **Build Failures**
   - Check Node version compatibility
   - Ensure all dependencies are in `package.json`

3. **NODE_ENV Warning**
   - Error: `⚠ You are using a non-standard "NODE_ENV" value`
   - **Solution**: Ensure `NODE_ENV` is set to exactly `production` (case-sensitive, no extra spaces)
   - Check in Render dashboard: Environment → Verify `NODE_ENV=production`
   - **DO NOT** use `development`, `dev`, `prod`, or any other value

4. **baseline-browser-mapping Warning**
   - Warning: `The data in this module is over two months old`
   - **Solution**: This is now included in `package.json` devDependencies
   - Run `pnpm install` to update it
   - This is a non-critical warning and won't affect functionality

5. **TypeScript Configuration Warning**
   - Next.js may suggest adding `.next/dev/types/**/*.ts` to tsconfig.json
   - **Solution**: This is already included in the project's `tsconfig.json`
   - The warning can be safely ignored

### General Issues

1. **Services Not Starting**

   - Check logs in Render dashboard
   - Verify environment variables are set
   - Check build/start commands are correct

2. **Slow Cold Starts**
   - Render free tier has cold starts
   - Consider upgrading to paid tier for better performance

---

## Cost Estimation (Free Tier)

- **PostgreSQL**: Free (limited to 90 days, then $7/month)
- **Backend Web Service**: Free (with limitations)
- **Frontend Web Service**: Free (with limitations)

**Note**: Free tier services spin down after 15 minutes of inactivity.

---

## Next Steps

1. Set up custom domains (optional)
2. Enable HTTPS (automatic on Render)
3. Set up monitoring and alerts
4. Configure auto-deploy from Git
5. Set up database backups

---

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
