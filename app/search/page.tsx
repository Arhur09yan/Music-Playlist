"use client";

import type React from "react";

import { useAuth } from "@/lib/auth-context";
import { useSearch } from "@/lib/hooks/use-search";
import { useLikeSong, useUnlikeSong } from "@/lib/hooks/use-songs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { SongCard } from "@/components/song-card";
import { Input } from "@/components/ui/input";

export default function SearchPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const { data: results = [], isLoading: searching } = useSearch(query);
  const likeSongMutation = useLikeSong();
  const unlikeSongMutation = useUnlikeSong();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="mb-8">
          <Input
            type="search"
            placeholder="Search songs, artists, albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </form>

        {searching && <p className="text-muted-foreground">Searching...</p>}

        {results.length === 0 && !searching && query && (
          <p className="text-muted-foreground text-center py-8">
            No results found for "{query}"
          </p>
        )}

        {results.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6">
              Search Results ({results.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24">
              {results.map((song: any) => (
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
                  isLiked={false}
                  onLike={() => handleLikeSong(String(song.id))}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
