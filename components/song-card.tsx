"use client";

import type { Song } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { useMusicPlayer } from "@/lib/music-player-context";
import { useToast } from "@/hooks/use-toast";
import { Play } from "lucide-react";
import Image from "next/image";

interface SongCardProps {
  song: Song;
  onLike?: () => void;
  isLiked?: boolean;
  onAddToPlaylist?: () => void;
}

export function SongCard({
  song,
  onLike,
  isLiked = false,
  onAddToPlaylist,
}: SongCardProps) {
  const { playSong, currentSong, isPlaying } = useMusicPlayer();
  const { toast } = useToast();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Check if song has any playable URL (be more lenient)
  const hasPreview = !!(
    (song.local_file_path || song.url || song.id) // If song has an ID, we can try the streaming endpoint
  );

  const handlePlay = () => {
    if (!hasPreview) {
      toast({
        title: "Preview not available",
        description:
          "This song doesn't have a playable preview. Please import songs with preview URLs.",
        variant: "destructive",
      });
      return;
    }
    playSong(song);
  };

  const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all group cursor-pointer">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={
            song.imageUrl ||
            "https://i.scdn.co/image/ab67616d0000b273fa3daa9672f2ace9b1187a3f"
          }
          alt={song.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={handlePlay}
            disabled={!hasPreview}
            aria-disabled={!hasPreview}
            className={`h-12 w-12 ${
              hasPreview
                ? "bg-primary hover:bg-primary/90"
                : "bg-muted cursor-not-allowed"
            }`}
            aria-label={
              hasPreview
                ? "Play song"
                : "Play song (preview may not be available)"
            }
            title={hasPreview ? "Play song" : "Preview may not be available"}
          >
            <Play className="h-6 w-6 fill-current" />
          </Button>
          {onLike && (
            <Button
              size="icon"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className={
                isLiked
                  ? "bg-destructive cursor-pointer text-white hover:bg-destructive/90"
                  : "hover:bg-accent cursor-pointer"
              }
              aria-label={isLiked ? "Unlike song" : "Like song"}
            >
              <span className="text-lg text-white cursor-pointer">♥</span>
            </Button>
          )}
          {onAddToPlaylist && (
            <Button
              size="icon"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onAddToPlaylist();
              }}
              aria-label="Add to playlist"
            >
              +
            </Button>
          )}
        </div>
        {isCurrentlyPlaying && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
            Playing
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
          {song.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{song.artist}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{song.genre}</span>
          <span>{formatDuration(song.duration)}</span>
        </div>
      </div>
    </div>
  );
}
