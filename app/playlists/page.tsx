"use client";

import { useAuth } from "@/lib/auth-context";
import { usePlaylists } from "@/lib/hooks/use-playlists";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { PlaylistCard } from "@/components/playlist-card";

export default function PlaylistsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: playlists = [], isLoading } = usePlaylists();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-6">Your Playlists</h2>

        {playlists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No playlists yet. Create one to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {playlists.map((playlist: any) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
