# Spotify Import Guide

## How to Import Songs from Spotify into Your Database

### Method 1: Using the API Endpoint (Recommended)

#### Import Multiple Songs (Bulk)

```bash
POST http://localhost:8000/api/v1/songs/import/spotify/bulk?query=rock+music&limit=20
Authorization: Bearer YOUR_TOKEN
```

**Parameters:**

- `query` (required): Search query (e.g., "rock music", "jazz classics", "pop hits 2024")
- `limit` (optional): Number of songs to import (1-50, default: 20)

**Example using curl:**

```bash
curl -X POST \
  "http://localhost:8000/api/v1/songs/import/spotify/bulk?query=rock+music&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Import Single Song

```bash
POST http://localhost:8000/api/v1/songs/import/spotify?query=Bohemian+Rhapsody
Authorization: Bearer YOUR_TOKEN
```

### Method 2: Using the Python Script

```bash
# From the backend directory
cd backend
docker compose exec api python scripts/import_spotify_songs.py "rock music" 20
```

### Method 3: Using Makefile Command

```bash
# Import songs from Spotify
make import-spotify QUERY="jazz classics" LIMIT=30
```

## Example Queries

- `"rock music"` - Popular rock songs
- `"jazz classics"` - Classic jazz tracks
- `"pop hits 2024"` - Recent pop hits
- `"artist:The Beatles"` - Songs by The Beatles
- `"genre:electronic"` - Electronic music
- `"year:2023"` - Songs from 2023

## What Gets Imported

Each song includes:

- **Title**: Song name
- **Artist**: Artist name
- **Album**: Album name
- **Duration**: Song length in seconds
- **Genre**: Music genre (if available)
- **URL**: Spotify link to the song

## Duplicate Detection

The system automatically skips songs that already exist in your database (same title and artist).

## Viewing Imported Songs

After importing, you can:

1. **View in API:**

   ```bash
   GET http://localhost:8000/api/v1/songs
   ```

2. **View in Database:**

   ```bash
   make db-connect
   # Then run: SELECT * FROM songs;
   ```

3. **View in pgAdmin:**
   - Open http://localhost:5050
   - Connect to database
   - Navigate to: `music_db` → `Schemas` → `public` → `Tables` → `songs`

## Requirements

Make sure your `.env` file has Spotify credentials:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

## Troubleshooting

### No songs found

- Check your Spotify API credentials
- Try a different search query
- Check API logs: `make backend-logs`

### Authentication error

- Make sure you're logged in and have a valid token
- Token expires after 30 minutes (default)

### Import errors

- Check Docker logs: `cd backend && docker compose logs api`
- Verify database connection: `make db-status`

