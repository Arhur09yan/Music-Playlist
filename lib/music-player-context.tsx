"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import type { Song } from "@/lib/schema";
import { useToast } from "@/hooks/use-toast";

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLooping: boolean;
  playSong: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  togglePlayPause: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleLoop: () => void;
  nextSong: () => void;
  previousSong: () => void;
  queue: Song[];
  addToQueue: (songs: Song[]) => void;
  clearQueue: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

export function MusicPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTimeState] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isLooping, setIsLooping] = useState(true); // Auto-loop previews by default
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      // Set crossOrigin to handle CORS for external URLs
      audioRef.current.crossOrigin = "anonymous";

      const audio = audioRef.current;

      audio.addEventListener("timeupdate", () => {
        setCurrentTimeState(audio.currentTime);
      });

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });

      audio.addEventListener("ended", () => {
        // If looping is enabled and it's a preview (30 seconds or less), restart it
        if (isLooping && audio.duration <= 35) {
          // Likely a 30-second preview, restart it
          audio.currentTime = 0;
          audio.play().catch((error) => {
            console.error("Error looping audio:", error);
            setIsPlaying(false);
          });
        } else {
          handleNextSong();
        }
      });

      audio.addEventListener("error", (e) => {
        console.error("Audio error:", e);
        const error = audio.error;
        if (error) {
          let errorMessage = "Unknown audio error";
          switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
              errorMessage = "Audio loading was aborted";
              break;
            case error.MEDIA_ERR_NETWORK:
              errorMessage = "Network error while loading audio";
              break;
            case error.MEDIA_ERR_DECODE:
              errorMessage = "Audio decoding error";
              break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = "Audio source not supported";
              break;
          }
          console.error(
            `Audio error details: ${errorMessage} (code: ${error.code})`
          );
        }
        setIsPlaying(false);
      });

      return () => {
        audio.removeEventListener("timeupdate", () => {});
        audio.removeEventListener("loadedmetadata", () => {});
        audio.removeEventListener("ended", () => {});
        audio.removeEventListener("error", () => {});
      };
    }
  }, []);

  // Update audio source when song changes (handled in playSong function)

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = async (song: Song) => {
    if (!song.url && !song.local_file_path && !song.id) {
      toast({
        title: "No preview available",
        description: "This song doesn't have a preview URL or ID.",
        variant: "destructive",
      });
      return;
    }

    setCurrentSong(song);

    if (audioRef.current) {
      // Stop current playback if any
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Try multiple sources in order of preference
      const sources: string[] = [];

      // Priority 1: Original URL (most reliable for Spotify previews)
      // Spotify preview URLs work best when used directly
      if (song.url && song.url.trim() !== "") {
        sources.push(song.url);
      }

      // Priority 2: Streaming endpoint (if song has ID)
      // This requires backend to be running and endpoint to exist
      if (song.id) {
        const API_BASE =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:8000/api/v1";
        sources.push(`${API_BASE}/songs/${song.id}/stream`);
      }

      // Priority 3: Local file path
      if (song.local_file_path && song.local_file_path.trim() !== "") {
        sources.push(song.local_file_path);
      }

      if (sources.length === 0) {
        toast({
          title: "No preview available",
          description: "This song doesn't have a playable URL.",
          variant: "destructive",
        });
        return;
      }

      // Try each source until one works
      const tryPlaySource = async (sourceIndex: number) => {
        if (sourceIndex >= sources.length) {
          // All sources failed
          setIsPlaying(false);
          toast({
            title: "Unable to play",
            description:
              "None of the available sources could be loaded. The song may not have a valid preview URL.",
            variant: "destructive",
          });
          return;
        }

        const audioUrl = sources[sourceIndex];
        const audio = audioRef.current!;

        // Reset audio element
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";

        // Set up error handler for this attempt
        let errorHandled = false;
        const errorHandler = () => {
          if (errorHandled) return;
          errorHandled = true;

          const error = audio.error;
          if (error) {
            console.warn(
              `Failed to load source ${sourceIndex + 1}/${
                sources.length
              }: ${audioUrl}`
            );
            console.warn(
              `Error code: ${error.code}, Message: ${
                error.message || "Unknown error"
              }`
            );
          }

          // Try next source
          setTimeout(() => {
            tryPlaySource(sourceIndex + 1);
          }, 100);
        };

        // Set up canplay handler for success
        const canPlayHandler = () => {
          audio.removeEventListener("error", errorHandler);
          audio.removeEventListener("canplay", canPlayHandler);
        };

        audio.addEventListener("error", errorHandler, { once: true });
        audio.addEventListener("canplay", canPlayHandler, { once: true });

        // Set source and load
        audio.src = audioUrl;
        audio.crossOrigin = "anonymous"; // Help with CORS
        audio.load();
        setIsPlaying(true);

        // Try to play
        try {
          await audio.play();
          // Success! Remove handlers
          audio.removeEventListener("error", errorHandler);
          audio.removeEventListener("canplay", canPlayHandler);
          console.log(`Successfully playing from source: ${audioUrl}`);
        } catch (error: any) {
          console.error(`Error playing source ${sourceIndex + 1}:`, error);
          // If play() fails, wait a bit then try next source
          // The error event might also fire
          setTimeout(() => {
            if (audio.error && !errorHandled) {
              errorHandler();
            } else if (!errorHandled) {
              // Play failed but no error event, try next source anyway
              errorHandled = true;
              audio.removeEventListener("error", errorHandler);
              audio.removeEventListener("canplay", canPlayHandler);
              tryPlaySource(sourceIndex + 1);
            }
          }, 500);
        }
      };

      // Start trying sources
      tryPlaySource(0);
    }
  };

  const pause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resume = () => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error resuming audio:", error);
        setIsPlaying(false);
      });
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const setCurrentTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTimeState(time);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleNextSong = () => {
    if (queue.length > 0) {
      const currentIndex = queue.findIndex((s) => s.id === currentSong?.id);
      const nextIndex = currentIndex + 1;
      if (nextIndex < queue.length) {
        playSong(queue[nextIndex]);
      } else {
        setCurrentSong(null);
        setIsPlaying(false);
      }
    }
  };

  const nextSong = () => {
    handleNextSong();
  };

  const previousSong = () => {
    if (queue.length > 0) {
      const currentIndex = queue.findIndex((s) => s.id === currentSong?.id);
      const previousIndex = currentIndex - 1;
      if (previousIndex >= 0) {
        playSong(queue[previousIndex]);
      }
    }
  };

  const addToQueue = (songs: Song[]) => {
    setQueue((prev) => [...prev, ...songs]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const toggleLoop = () => {
    setIsLooping((prev) => !prev);
  };

  // Update loop state when isLooping changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping && duration <= 35; // Only loop if it's a short preview
    }
  }, [isLooping, duration]);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isLooping,
        playSong,
        pause,
        resume,
        togglePlayPause,
        setCurrentTime,
        setVolume,
        toggleLoop,
        nextSong,
        previousSong,
        queue,
        addToQueue,
        clearQueue,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
