"use client";

import { useMusicPlayer } from "@/lib/music-player-context";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
} from "lucide-react";
import { useState } from "react";

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLooping,
    togglePlayPause,
    setCurrentTime,
    setVolume,
    toggleLoop,
    nextSong,
    previousSong,
  } = useMusicPlayer();
  const [showVolume, setShowVolume] = useState(false);

  if (!currentSong) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-secondary rounded overflow-hidden shrink-0">
              {currentSong.imageUrl ? (
                <img
                  src={currentSong.imageUrl}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  🎵
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">
                {currentSong.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={previousSong}
              className="h-8 w-8"
              aria-label="Previous song"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={togglePlayPause}
              className="h-10 w-10"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={nextSong}
              className="h-8 w-8"
              aria-label="Next song"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            {duration <= 35 && (
              <Button
                size="icon"
                variant={isLooping ? "default" : "ghost"}
                onClick={toggleLoop}
                className="h-8 w-8"
                aria-label={isLooping ? "Disable loop" : "Enable loop"}
                title={isLooping ? "Looping preview" : "Click to loop preview"}
              >
                <Repeat
                  className={`h-4 w-4 ${isLooping ? "text-primary" : ""}`}
                />
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-xs text-muted-foreground w-12 text-right shrink-0">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-12 shrink-0">
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowVolume(!showVolume)}
              className="h-8 w-8"
              aria-label="Volume"
            >
              {volume > 0 ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            {showVolume && (
              <div className="w-24">
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    handleVolumeChange([value[0] / 100])
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
