// In-memory database for demo (replace with real DB in production)
export const db = {
  users: [] as any[],
  songs: [] as any[],
  playlists: [] as any[],
  playlistSongs: [] as any[],
  likes: [] as any[],
}

// Initialize with sample data
export function initializeDb() {
  if (db.songs.length === 0) {
    db.songs = [
      {
        id: "1",
        title: "Midnight Dreams",
        artist: "Luna Echo",
        album: "Nocturnal",
        duration: 245,
        genre: "Electronic",
        imageUrl: "/electronic-music-album-art.jpg",
      },
      {
        id: "2",
        title: "Summer Vibes",
        artist: "Coastal Waves",
        album: "Beach Sessions",
        duration: 198,
        genre: "Indie Pop",
        imageUrl: "/indie-pop-album-cover.png",
      },
      {
        id: "3",
        title: "Urban Rhythm",
        artist: "City Lights",
        album: "Metropolitan",
        duration: 212,
        genre: "Hip Hop",
        imageUrl: "/hip-hop-album-art.jpg",
      },
      {
        id: "4",
        title: "Eternal Melody",
        artist: "Symphony Collective",
        album: "Classical Modern",
        duration: 284,
        genre: "Classical",
        imageUrl: "/classical-music-cover.png",
      },
      {
        id: "5",
        title: "Electric Heart",
        artist: "Synth Wave",
        album: "Neon Nights",
        duration: 223,
        genre: "Electronic",
        imageUrl: "/synthwave-album-cover.png",
      },
      {
        id: "6",
        title: "Jazz Reflections",
        artist: "Smooth Trio",
        album: "Late Night Sessions",
        duration: 267,
        genre: "Jazz",
        imageUrl: "/jazz-album-art.jpg",
      },
    ]
  }
}
