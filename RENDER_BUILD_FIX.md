# Fix: requirements.txt Not Found Error

## Problem

```
ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'
```

This happens because the build command runs from the repository root, but `requirements.txt` is in the `backend/` directory.

## Solution

### Option 1: Set Root Directory (Recommended)

In Render Dashboard, make sure **Root Directory** is set to `backend`:

1. Go to your backend service in Render
2. Click **Settings** tab
3. Find **Root Directory** field
4. Set it to: `backend`
5. Save changes
6. Redeploy

### Option 2: Update Build Command

If Root Directory is already set correctly, update the build command:

**Current (Wrong):**

```
pip install -r requirements.txt
```

**Fixed:**

```
cd backend && pip install -r requirements.txt
```

Or if Root Directory is `backend`:

```
pip install -r requirements.txt
```

(Should work if root directory is correct)

### Option 3: Use Full Path

```
pip install -r backend/requirements.txt
```

---

## Render Dashboard Settings

### Backend Service Configuration:

```
Name: music-api
Root Directory: backend          ← THIS IS CRITICAL!
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Important:** The **Root Directory** must be `backend` (not `.` or empty)

---

## Verification

After setting Root Directory to `backend`:

1. The build command will run from `backend/` directory
2. `requirements.txt` will be found at `backend/requirements.txt`
3. All Python files will be relative to `backend/` directory

---

## Quick Fix Steps

1. **Go to Render Dashboard**

   - Open your backend service

2. **Settings Tab**

   - Click **Settings** in the left sidebar

3. **Root Directory**

   - Find **"Root Directory"** field
   - Change from `.` or empty to: `backend`
   - Click **Save Changes**

4. **Redeploy**
   - Go to **Manual Deploy** tab
   - Click **Deploy latest commit**
   - Or push a new commit to trigger auto-deploy

---

## If Using render.yaml Blueprint

The `render.yaml` file should have `rootDir: backend` specified. If it doesn't, add it:

```yaml
- type: web
  name: music-api
  env: python
  rootDir: backend # ← Add this line
  buildCommand: pip install -r requirements.txt
  startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Then redeploy the Blueprint.

---

## Common Mistakes

❌ **Root Directory set to `.` (root)**

- Build runs from repository root
- Can't find `requirements.txt` (it's in `backend/`)

✅ **Root Directory set to `backend`**

- Build runs from `backend/` directory
- Finds `requirements.txt` correctly

---

## Test Locally

To verify the setup works:

```bash
cd backend
pip install -r requirements.txt
# Should work without errors
```

If this works locally, the same should work on Render when Root Directory is `backend`.
