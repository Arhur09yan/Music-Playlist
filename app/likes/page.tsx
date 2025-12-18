"use client";

import { useAuth } from "@/lib/auth-context";
import { useLikes } from "@/lib/hooks/use-likes";
import { useUnlikeSong } from "@/lib/hooks/use-songs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { SongCard } from "@/components/song-card";

export default function LikesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // React Query hooks
  const { data: likesData = [], isLoading: likesLoading } = useLikes() as {
    data: any[];
    isLoading: boolean;
  };
  const unlikeSongMutation = useUnlikeSong();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleUnlikeSong = async (songId: string) => {
    try {
      await unlikeSongMutation.mutateAsync(songId);
    } catch (err) {
      console.error("Failed to unlike song:", err);
    }
  };

  if (loading || likesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Extract songs from likes data
  // The API might return likes with song objects, or just song IDs
  const likedSongs = likesData.map((like: any) => {
    // If the API returns the song object directly in the like
    if (like.song) {
      return like.song;
    }
    // If the API returns song data at the top level
    return like;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Liked Songs</h2>
        </div>

        {/* Liked Songs Grid */}
        <section>
          {likedSongs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No liked songs yet. Start liking songs to see them here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24">
              {likedSongs.map((song: any) => {
                return (
                  <SongCard
                    key={song.id}
                    song={{
                      id: String(song.id),
                      title: song.title,
                      artist: song.artist,
                      album: song.album || "",
                      duration: song.duration || 0,
                      genre: song.genre || "",
                      imageUrl: song.image_url || song.imageUrl || "",
                      url: song.url || "",
                      local_file_path: song.local_file_path || undefined,
                      album_id: song.album_id
                        ? String(song.album_id)
                        : undefined,
                    }}
                    isLiked={true}
                    onLike={() => handleUnlikeSong(String(song.id))}
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

