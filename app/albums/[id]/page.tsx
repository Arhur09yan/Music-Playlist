"use client";

import { useAuth } from "@/lib/auth-context";
import { useAlbum } from "@/lib/hooks/use-albums";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { SongCard } from "@/components/song-card";
import { Button } from "@/components/ui/button";

export default function AlbumDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const albumId = params.id as string;

  const { data: album, isLoading } = useAlbum(albumId);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !album) {
    return null;
  }

  const songs = (album.songs || []) as any[];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Album Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Back
          </Button>
          <div className="flex gap-6 items-start">
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-5xl text-white">♫</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
              <p className="text-muted-foreground mb-2">{album.artist}</p>
              {album.description && (
                <p className="text-muted-foreground mb-4">
                  {album.description}
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
              No songs in this album yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24">
            {songs.map((song) => (
              <SongCard
                key={song.id}
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
