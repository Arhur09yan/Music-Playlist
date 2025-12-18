"use client";

import { useAuth } from "@/lib/auth-context";
import { useAlbums } from "@/lib/hooks/use-albums";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { SpotifyImport } from "@/components/spotify-import";
import { Button } from "@/components/ui/button";

export default function AlbumsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: albums = [], isLoading } = useAlbums();

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Albums</h2>
          <SpotifyImport />
        </div>

        {albums.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No albums yet. You can create albums and attach songs to them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {albums.map((album: any) => (
              <button
                key={album.id}
                type="button"
                className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/60 transition-all text-left"
                onClick={() => router.push(`/albums/${album.id}`)}
              >
                <div className="aspect-square bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                  <span className="text-4xl text-primary-foreground">♫</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                    {album.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {album.artist}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
