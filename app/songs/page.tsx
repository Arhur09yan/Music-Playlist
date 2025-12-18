"use client";

import { useAuth } from "@/lib/auth-context";
import { useSongs, useLikeSong } from "@/lib/hooks/use-songs";
import {
  useCreatePlaylist,
  useAddSongToPlaylist,
} from "@/lib/hooks/use-playlists";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { SongCard } from "@/components/song-card";
import { SpotifyImport } from "@/components/spotify-import";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SongsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  // React Query hooks
  const { data: songs = [], isLoading: songsLoading } = useSongs() as {
    data: any[];
    isLoading: boolean;
  };
  const likeSongMutation = useLikeSong();
  const createPlaylistMutation = useCreatePlaylist();
  const addSongToPlaylistMutation = useAddSongToPlaylist();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLikeSong = async (songId: string) => {
    try {
      await likeSongMutation.mutateAsync(songId);
    } catch (err) {
      console.error("Failed to like song:", err);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) return;

    try {
      const newPlaylist = await createPlaylistMutation.mutateAsync({
        name: playlistName,
        description: "",
      });
      setPlaylistName("");
      setShowPlaylistForm(false);

      // Add selected songs to playlist
      for (const songId of selectedSongs) {
        await addSongToPlaylistMutation.mutateAsync({
          playlistId: newPlaylist.id,
          songId,
        });
      }
      setSelectedSongs(new Set());
    } catch (err) {
      console.error("Failed to create playlist:", err);
    }
  };

  if (loading || songsLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Discover Music</h2>
          <div className="flex gap-2">
            <SpotifyImport />
            {!showPlaylistForm ? (
              <Button onClick={() => setShowPlaylistForm(true)}>
                + New Playlist
              </Button>
            ) : null}
          </div>
        </div>

        {/* Create Playlist Section */}
        {showPlaylistForm && (
          <div className="mb-8">
            <div className="flex gap-2">
              <Input
                placeholder="Playlist name..."
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
              <Button
                onClick={handleCreatePlaylist}
                disabled={
                  !playlistName.trim() || createPlaylistMutation.isPending
                }
              >
                {createPlaylistMutation.isPending ? "Creating..." : "Create"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPlaylistForm(false);
                  setPlaylistName("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Songs Grid */}
        <section>
          {songs.length === 0 ? (
            <p className="text-muted-foreground">No songs available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24">
              {songs.map((song: any) => {
                console.log(song, "song");
                return (
                  <SongCard
                    key={song.id}
                    song={{
                      id: String(song.id),
                      title: song.title,
                      artist: song.artist,
                      album: song.album,
                      duration: song.duration,
                      genre: song.genre,
                      imageUrl: song.image_url,
                      url: song.url || "",
                      local_file_path: song.local_file_path || undefined,
                      album_id: song.album_id
                        ? String(song.album_id)
                        : undefined,
                    }}
                    isLiked={false}
                    onLike={() => handleLikeSong(String(song.id))}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
