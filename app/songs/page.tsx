"use client";

import { useAuth } from "@/lib/auth-context";
import { useSongs, useLikeSong } from "@/lib/hooks/use-songs";
import { useSearch } from "@/lib/hooks/use-search";
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
import { Search } from "lucide-react";

export default function SongsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // React Query hooks
  const { data: songs = [], isLoading: songsLoading } = useSongs() as {
    data: any[];
    isLoading: boolean;
  };
  const { data: searchResults = [], isLoading: isSearching } =
    useSearch(searchQuery);
  const likeSongMutation = useLikeSong();
  const createPlaylistMutation = useCreatePlaylist();
  const addSongToPlaylistMutation = useAddSongToPlaylist();

  // Determine which data to display
  const displaySongs = searchQuery.trim() ? searchResults : songs;
  const isLoading = searchQuery.trim() ? isSearching : songsLoading;

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
          <h2 className="text-3xl font-bold">
            {searchQuery.trim() ? "Search Results" : "Discover Music"}
          </h2>
          <div className="flex gap-2">
            {!showPlaylistForm ? (
              <Button onClick={() => setShowPlaylistForm(true)}>
                + New Playlist
              </Button>
            ) : null}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              type="search"
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
              aria-label="Search songs"
            />
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
          {isLoading ? (
            <p className="text-muted-foreground">
              {searchQuery.trim() ? "Searching..." : "Loading songs..."}
            </p>
          ) : displaySongs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchQuery.trim()
                  ? `No results found for "${searchQuery}"`
                  : "No songs available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24">
              {displaySongs.map((song: any) => {
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
