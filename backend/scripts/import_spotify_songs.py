#!/usr/bin/env python3
"""
Script to import songs from Spotify into the database.
Usage: python scripts/import_spotify_songs.py "search query" [limit]
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.services.spotify_service import SpotifyService


def import_songs(query: str, limit: int = 20):
    """Import songs from Spotify into the database"""
    db = SessionLocal()
    try:
        print(f"\n{'='*80}")
        print(f"Importing songs from Spotify: '{query}' (limit: {limit})")
        print(f"{'='*80}\n")
        
        songs = SpotifyService.import_songs_from_spotify(db, query, limit)
        
        print(f"\n{'='*80}")
        print(f"IMPORT COMPLETE!")
        print(f"{'='*80}")
        print(f"Total songs imported: {len(songs)}")
        print(f"\nImported songs:")
        for i, song in enumerate(songs, 1):
            print(f"  {i}. {song.title} - {song.artist} (ID: {song.id})")
        print(f"{'='*80}\n")
        
        return songs
    except Exception as e:
        print(f"\n❌ Error importing songs: {e}\n")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/import_spotify_songs.py 'search query' [limit]")
        print("\nExamples:")
        print("  python scripts/import_spotify_songs.py 'rock music' 20")
        print("  python scripts/import_spotify_songs.py 'jazz classics' 30")
        print("  python scripts/import_spotify_songs.py 'pop hits 2024' 50")
        sys.exit(1)
    
    query = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    
    import_songs(query, limit)


