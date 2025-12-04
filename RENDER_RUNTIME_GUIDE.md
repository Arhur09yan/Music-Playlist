# Render Runtime Environment Selection Guide

## Runtime Environments for Your Services

When deploying on Render, you need to select the correct runtime environment for each service.

---

## 🗄️ PostgreSQL Database

**Service Type:** PostgreSQL (Managed Database)

**Runtime Selection:**

- ✅ **Not applicable** - Render manages this automatically
- Just select **"PostgreSQL"** from the service types
- Choose version: **PostgreSQL 16** (or latest available)

---

## 🐍 FastAPI Backend

**Service Type:** Web Service

**Runtime Environment:**

- ✅ **Python 3**
- ✅ **Python 3.11** (recommended, matches your Dockerfile)
- ✅ Or **Python 3.12** (if available)

**Settings:**

- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**How to Select:**

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. In **"Environment"** dropdown, select: **"Python 3"**
5. Render will auto-detect Python version from your code

---

## ⚛️ Next.js Frontend

**Service Type:** Web Service

**Runtime Environment:**

- ✅ **Node**
- ✅ **Node.js 20** (recommended - matches your local setup)
- ✅ Or **Node.js 18** (minimum for Next.js 16)

**Settings:**

- **Root Directory:** `.` (root of repository)
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**How to Select:**

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. In **"Environment"** dropdown, select: **"Node"**
5. Render will auto-detect Node version from your code

---

## 📋 Quick Reference Table

| Service          | Runtime       | Version       | Root Directory |
| ---------------- | ------------- | ------------- | -------------- |
| **PostgreSQL**   | N/A (Managed) | PostgreSQL 16 | N/A            |
| **Backend API**  | **Python 3**  | Python 3.11+  | `backend`      |
| **Frontend App** | **Node**      | Node.js 20+   | `.` (root)     |

---

## 🎯 Step-by-Step: Selecting Runtime in Render Dashboard

### For Backend (FastAPI):

1. **Create New Web Service**

   - Click **"New +"** → **"Web Service"**

2. **Connect Repository**

   - Select your GitHub repository

3. **Configure Service:**

   ```
   Name: music-api
   Region: [Choose closest to you]
   Branch: main
   Root Directory: backend
   ```

4. **Runtime Selection:**

   - Look for **"Environment"** or **"Runtime"** dropdown
   - Select: **"Python 3"**
   - Render will show: "Python 3" or "Python 3.11"

5. **Build & Start Commands:**
   ```
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### For Frontend (Next.js):

1. **Create New Web Service**

   - Click **"New +"** → **"Web Service"**

2. **Connect Repository**

   - Select the same GitHub repository

3. **Configure Service:**

   ```
   Name: music-app
   Region: [Same as backend]
   Branch: main
   Root Directory: . (leave empty or put ".")
   ```

4. **Runtime Selection:**

   - Look for **"Environment"** or **"Runtime"** dropdown
   - Select: **"Node"**
   - Render will show: "Node" or "Node.js 20"

5. **Build & Start Commands:**
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

---

## 🔍 Where to Find Runtime Selection

In Render Dashboard, the runtime selection appears in different places:

### Option 1: During Service Creation

- When creating a new Web Service
- Look for **"Environment"** dropdown
- Usually near the top of the form

### Option 2: In Service Settings

- After creating the service
- Go to **Settings** tab
- Look for **"Environment"** or **"Runtime"** section

### Option 3: Auto-Detection

- Render often auto-detects the runtime
- If it shows the correct one, you don't need to change it
- Verify it matches:
  - Backend: Python 3
  - Frontend: Node

---

## ✅ Verification Checklist

### Backend Service:

- [ ] Runtime: **Python 3** or **Python 3.11**
- [ ] Root Directory: `backend`
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend Service:

- [ ] Runtime: **Node** or **Node.js 20**
- [ ] Root Directory: `.` (root)
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`

---

## 🚨 Common Mistakes

### ❌ Wrong Runtime Selected:

- **Backend:** Don't select "Node" - use "Python 3"
- **Frontend:** Don't select "Python" - use "Node"

### ❌ Wrong Root Directory:

- **Backend:** Must be `backend` (not root)
- **Frontend:** Must be `.` or root (not `backend`)

### ❌ Wrong Build Commands:

- **Backend:** Use `pip install` (not `npm install`)
- **Frontend:** Use `npm install` (not `pip install`)

---

## 💡 Pro Tips

1. **Auto-Detection:** Render usually detects the runtime correctly
2. **Version:** If you can choose a specific version, pick the one matching your local setup
3. **Blueprint:** If using `render.yaml`, runtime is specified as `env: python` or `env: node`
4. **Check Logs:** If build fails, check the logs - wrong runtime will show errors immediately

---

## 📞 Need Help?

If you're unsure which runtime to select:

1. Check your local setup:
   - Backend: `python --version` (should be 3.11+)
   - Frontend: `node --version` (should be 20+)
2. Match that version in Render if available
3. Or use the latest stable version Render offers
