// Database schema types
export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Optional - not returned from API
  createdAt?: Date; // Optional - not returned from API
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre: string;
  imageUrl: string;
  url?: string; // Spotify preview URL or Spotify web URL
  local_file_path?: string; // Local cached file path on backend
  album_id?: string; // Related album (if any)
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  image_url?: string;
  description?: string;
  created_at: Date;
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaylistSong {
  id: string;
  playlistId: string;
  songId: string;
  addedAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  songId: string;
  createdAt: Date;
}

// Table schema definitions
export const users = "users";
export const songs = "songs";
export const playlists = "playlists";
export const playlistSongs = "playlist_songs";
export const likes = "likes";
