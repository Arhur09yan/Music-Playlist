# pgAdmin Setup Guide

## Quick Start

1. **Start the backend services:**

   ```bash
   make backend-up
   ```

2. **Open pgAdmin:**
   ```bash
   make pgadmin
   ```
   Or manually visit: http://localhost:5050

## Login Credentials

- **Email:** `admin@musicapp.com`
- **Password:** `admin`

## Connecting to PostgreSQL Database

After logging into pgAdmin, you need to add a server connection:

### Step 1: Register a New Server

1. Right-click on **"Servers"** in the left sidebar
2. Select **"Register"** → **"Server"**

### Step 2: General Tab

- **Name:** `Music App Database` (or any name you prefer)

### Step 3: Connection Tab

Fill in the following details:

- **Host name/address:** `db` (this is the Docker service name)
- **Port:** `5432`
- **Maintenance database:** `music_db`
- **Username:** `music_user`
- **Password:** `music_password`
- **Save password:** ✓ (optional, for convenience)

### Step 4: Save

Click **"Save"** to connect.

## Database Connection Details

### From pgAdmin (inside Docker)

- **Host name/address:** `db` (Docker service name)
- **Port:** `5432`
- **Database:** `music_db`
- **Username:** `music_user`
- **Password:** `music_password`

### From Host Machine (e.g., using psql or other tools)

- **Host:** `localhost`
- **Port:** `5433` (mapped from container's 5432 to avoid conflict with local PostgreSQL)
- **Database:** `music_db`
- **Username:** `music_user`
- **Password:** `music_password`

**Connection string:**

```
postgresql://music_user:music_password@localhost:5433/music_db
```

## Troubleshooting

### pgAdmin not accessible?

1. Check if services are running:

   ```bash
   make backend-logs
   ```

2. Restart services:
   ```bash
   make backend-restart
   ```

### Can't connect to database?

1. Ensure the database service is healthy:

   ```bash
   docker ps
   ```

2. Check database logs:

   ```bash
   cd backend && docker compose logs db
   ```

3. Try connecting via psql:
   ```bash
   make db-connect
   ```

## Viewing Your Data

Once connected, you can:

1. Navigate to: **Servers** → **Music App Database** → **Databases** → **music_db** → **Schemas** → **public** → **Tables**
2. Right-click any table → **"View/Edit Data"** → **"All Rows"**

## Common Tables

- `users` - User accounts
- `songs` - Song metadata
- `playlists` - User playlists
- `playlist_songs` - Songs in playlists
- `likes` - User song likes
