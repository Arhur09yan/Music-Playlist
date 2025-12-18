"use client";

import { useState } from "react";
import { useImportSongsFromSpotify } from "@/lib/hooks/use-spotify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Music, Loader2 } from "lucide-react";

interface SpotifyImportProps {
  onSuccess?: () => void;
}

export const SpotifyImport = ({ onSuccess }: SpotifyImportProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(20);
  const importMutation = useImportSongsFromSpotify();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const result = await importMutation.mutateAsync({
        query: query.trim(),
        limit: Math.min(Math.max(1, limit), 50),
      });
      
      setOpen(false);
      setQuery("");
      setLimit(20);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to import songs:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Music className="size-4" />
          Import from Spotify
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Songs & Albums from Spotify</DialogTitle>
          <DialogDescription>
            Search for music on Spotify and add songs and albums to your
            database. Albums will be automatically created when importing songs.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="spotify-query"
                className="text-sm font-medium leading-none"
              >
                Search Query
              </label>
              <Input
                id="spotify-query"
                type="text"
                placeholder='e.g., "rock music", "jazz classics", "artist:The Beatles"'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={importMutation.isPending}
                aria-label="Spotify search query"
                tabIndex={0}
              />
              <p className="text-xs text-muted-foreground">
                Examples: "pop hits 2024", "genre:electronic", "year:2023"
              </p>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="spotify-limit"
                className="text-sm font-medium leading-none"
              >
                Number of Songs (1-50)
              </label>
              <Input
                id="spotify-limit"
                type="number"
                min={1}
                max={50}
                value={limit}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value)) {
                    setLimit(Math.min(Math.max(1, value), 50));
                  }
                }}
                disabled={importMutation.isPending}
                aria-label="Number of songs to import"
                tabIndex={0}
              />
            </div>
            {importMutation.isError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {importMutation.error instanceof Error
                  ? importMutation.error.message
                  : "Failed to import songs. Please try again."}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setQuery("");
                setLimit(20);
              }}
              disabled={importMutation.isPending}
              tabIndex={0}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!query.trim() || importMutation.isPending}
              tabIndex={0}
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Music className="mr-2 size-4" />
                  Import Songs
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

