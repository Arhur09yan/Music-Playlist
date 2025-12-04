# Deployment Checklist for Render

## Pre-Deployment

### 1. Generate Secret Key

```bash
openssl rand -hex 32
```

Save this for your backend `SECRET_KEY` environment variable.

### 2. Get Spotify API Credentials

- Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Create a new app
- Copy `Client ID` and `Client Secret`

### 3. Prepare Database

- Decide on database name, user, and password
- Note: Render PostgreSQL will provide connection string automatically

---

## Deployment Steps

### Step 1: Deploy PostgreSQL Database

- [ ] Create PostgreSQL service on Render
- [ ] Save connection string
- [ ] Note the database name, user, and host

### Step 2: Deploy FastAPI Backend

- [ ] Create Web Service for backend
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `pip install -r requirements.txt`
- [ ] Set Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Add environment variables:
  - [ ] `DATABASE_URL` (from PostgreSQL service)
  - [ ] `SECRET_KEY` (generated in step 1)
  - [ ] `SPOTIFY_CLIENT_ID`
  - [ ] `SPOTIFY_CLIENT_SECRET`
  - [ ] `ALGORITHM=HS256`
  - [ ] `ACCESS_TOKEN_EXPIRE_MINUTES=30`
  - [ ] `REFRESH_TOKEN_EXPIRE_DAYS=7`
  - [ ] `DEBUG=False`
  - [ ] `API_V1_STR=/api/v1`
  - [ ] `AUDIO_STORAGE_DIR=audio_storage`
- [ ] Save backend URL (e.g., `https://music-api.onrender.com`)

### Step 3: Deploy Next.js Frontend

- [ ] Create Web Service for frontend
- [ ] Set Root Directory: `.` (root)
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Start Command: `npm start`
- [ ] Add environment variables:
  - [ ] `NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com/api/v1`
  - [ ] `NODE_ENV=production`
- [ ] Save frontend URL

### Step 4: Update CORS (if needed)

- [ ] Update `ALLOWED_ORIGINS` in backend environment variables
- [ ] Format: `https://your-frontend.onrender.com,http://localhost:3000`

### Step 5: Test Deployment

- [ ] Test backend health: `https://your-backend.onrender.com/health`
- [ ] Test backend API docs: `https://your-backend.onrender.com/docs`
- [ ] Test frontend loads correctly
- [ ] Test user registration/login
- [ ] Test API calls from frontend

---

## Environment Variables Quick Reference

### Backend

```bash
DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/dbname
SECRET_KEY=<generated-32-char-key>
SPOTIFY_CLIENT_ID=<your-client-id>
SPOTIFY_CLIENT_SECRET=<your-client-secret>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DEBUG=False
API_V1_STR=/api/v1
AUDIO_STORAGE_DIR=audio_storage
ALLOWED_ORIGINS=https://your-frontend.onrender.com
```

### Frontend

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com/api/v1
NODE_ENV=production
```

---

## Post-Deployment

- [ ] Test all features work correctly
- [ ] Set up database backups (if using paid tier)
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/alerts
- [ ] Document your deployment URLs

---

## Quick Commands

### Generate Secret Key

```bash
openssl rand -hex 32
```

### Test Backend Health

```bash
curl https://your-backend.onrender.com/health
```

### Test Backend API

```bash
curl https://your-backend.onrender.com/api/v1/songs?limit=5
```

---

## Troubleshooting

### Backend won't start

- Check logs in Render dashboard
- Verify `DATABASE_URL` is correct
- Check `SECRET_KEY` is set
- Verify build command completed successfully

### Frontend can't connect to backend

- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Check backend is running
- Check CORS settings
- Check browser console for errors

### Database connection issues

- Verify `DATABASE_URL` format is correct
- Check database is running
- Verify credentials are correct
