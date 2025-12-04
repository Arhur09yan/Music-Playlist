# Quick Start: Deploy to Render

## 🚀 Fast Deployment Guide

### Option 1: Using Render Blueprint (Recommended)

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Go to Render Dashboard**

   - Visit: https://dashboard.render.com
   - Click **"New +"** → **"Blueprint"**

3. **Connect Repository**

   - Select your GitHub repository
   - Render will detect `backend/render.yaml`

4. **Review Configuration**

   - Check all services are listed
   - Update region if needed
   - Add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` manually

5. **Deploy**

   - Click **"Apply"**
   - Wait for all services to deploy (~5-10 minutes)

6. **Get URLs**
   - Backend: `https://music-api.onrender.com`
   - Frontend: `https://music-app.onrender.com`

---

### Option 2: Manual Deployment

#### 1. Deploy Database (2 minutes)

- **New +** → **PostgreSQL**
- Name: `music-db`
- Click **Create**
- **Save connection string**

#### 2. Deploy Backend (5 minutes)

- **New +** → **Web Service**
- Connect GitHub repo
- Settings:
  ```
  Name: music-api
  Root Directory: backend
  Build: pip install -r requirements.txt
  Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```
- Environment Variables:
  ```
  DATABASE_URL=<from database service>
  SECRET_KEY=<generate with: openssl rand -hex 32>
  SPOTIFY_CLIENT_ID=<your-id>
  SPOTIFY_CLIENT_SECRET=<your-secret>
  DEBUG=False
  ```
- Click **Create Web Service**

#### 3. Deploy Frontend (5 minutes)

- **New +** → **Web Service**
- Connect same GitHub repo
- Settings:
  ```
  Name: music-app
  Root Directory: . (root)
  Build: npm install && npm run build
  Start: npm start
  ```
- Environment Variables:
  ```
  NEXT_PUBLIC_BACKEND_URL=https://music-api.onrender.com/api/v1
  NODE_ENV=production
  ```
- Click **Create Web Service**

---

## 📋 Required Environment Variables

### Backend

| Variable                | Value                | How to Get                                                   |
| ----------------------- | -------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`          | Auto from PostgreSQL | Render provides                                              |
| `SECRET_KEY`            | Random 32+ chars     | `openssl rand -hex 32`                                       |
| `SPOTIFY_CLIENT_ID`     | Your Spotify ID      | [Spotify Dashboard](https://developer.spotify.com/dashboard) |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify Secret  | [Spotify Dashboard](https://developer.spotify.com/dashboard) |
| `DEBUG`                 | `False`              | Set manually                                                 |
| `ALLOWED_ORIGINS`       | Your frontend URL    | `https://music-app.onrender.com`                             |

### Frontend

| Variable                  | Value            | Example                                 |
| ------------------------- | ---------------- | --------------------------------------- |
| `NEXT_PUBLIC_BACKEND_URL` | Your backend URL | `https://music-api.onrender.com/api/v1` |
| `NODE_ENV`                | `production`     | Set manually                            |

---

## ✅ Verification Steps

1. **Test Backend**

   ```bash
   curl https://your-backend.onrender.com/health
   # Should return: {"status":"healthy"}
   ```

2. **Test Frontend**

   - Visit: `https://your-frontend.onrender.com`
   - Should load the app

3. **Test API Connection**
   - Open browser console
   - Check for API errors
   - Try registering a user

---

## 🔧 Common Issues

### Backend won't start

- ✅ Check `DATABASE_URL` is correct
- ✅ Verify `SECRET_KEY` is set
- ✅ Check build logs for errors

### Frontend can't connect

- ✅ Verify `NEXT_PUBLIC_BACKEND_URL` matches backend URL
- ✅ Check CORS settings in backend
- ✅ Verify backend is running

### Database connection fails

- ✅ Check `DATABASE_URL` format
- ✅ Verify database is running
- ✅ Check credentials

---

## 📚 Full Documentation

See `RENDER_DEPLOYMENT.md` for detailed instructions.

---

## 💡 Pro Tips

1. **Use Blueprint** - Deploys everything at once
2. **Save URLs** - Write down your service URLs
3. **Test Locally First** - Make sure everything works before deploying
4. **Check Logs** - Render dashboard shows detailed logs
5. **Free Tier Limits** - Services spin down after 15 min inactivity

---

## 🆘 Need Help?

- Check `DEPLOYMENT_CHECKLIST.md` for step-by-step guide
- Review `RENDER_DEPLOYMENT.md` for detailed documentation
- Check Render logs in dashboard
- Verify all environment variables are set
