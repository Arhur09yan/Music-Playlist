"use client";

import { useAuth } from "@/lib/auth-context";
import {
  usePlaylist,
  useRemoveSongFromPlaylist,
  useDeletePlaylist,
} from "@/lib/hooks/use-playlists";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { SongCard } from "@/components/song-card";
import { Button } from "@/components/ui/button";

export default function PlaylistDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const playlistId = params.id as string;

  const { data: playlist, isLoading: playlistLoading } =
    usePlaylist(playlistId);
  const removeSongMutation = useRemoveSongFromPlaylist();
  const deletePlaylistMutation = useDeletePlaylist();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleRemoveSong = async (songId: string) => {
    try {
      await removeSongMutation.mutateAsync({
        playlistId,
        songId,
      });
    } catch (err) {
      console.error("Failed to remove song:", err);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      await deletePlaylistMutation.mutateAsync(playlistId);
      router.push("/playlists");
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  if (loading || playlistLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !playlist) {
    return null;
  }

  const songs = playlist.songs || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Playlist Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" onClick={() => router.back()}>
              ← Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePlaylist}
              disabled={deletePlaylistMutation.isPending}
            >
              Delete playlist
            </Button>
          </div>
          <div className="flex gap-6 items-start">
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-5xl text-white">♪</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
              {playlist.description && (
                <p className="text-muted-foreground mb-4">
                  {playlist.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {songs.length} {songs.length === 1 ? "song" : "songs"}
              </p>
            </div>
          </div>
        </div>

        {/* Songs List */}
        {songs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No songs in this playlist yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24">
            {songs.map((song: any) => (
              <div key={song.id} className="relative group">
                <SongCard
                  song={{
                    id: String(song.id),
                    title: song.title,
                    artist: song.artist,
                    album: song.album,
                    duration: song.duration,
                    genre: song.genre,
                    imageUrl:
                      song.image_url && song.image_url.trim() !== ""
                        ? song.image_url
                        : "",
                    url: song.url || "",
                    local_file_path: song.local_file_path || undefined,
                    album_id: song.album_id ? String(song.album_id) : undefined,
                  }}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveSong(String(song.id))}
                  disabled={removeSongMutation.isPending}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
