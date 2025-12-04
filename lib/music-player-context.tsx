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

  const playSong = (song: Song) => {
    if (!song.url && !song.local_file_path) {
      toast({
        title: "No preview available",
        description: "This song doesn't have a preview URL.",
        variant: "destructive",
      });
      return;
    }

    setCurrentSong(song);

    if (audioRef.current) {
      // Use streaming endpoint if available (preferred - uses cached local file)
      // Otherwise fall back to original preview URL
      let audioUrl: string;

      if (song.id) {
        // Use streaming endpoint from backend (serves cached file or streams from URL)
        const API_BASE =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:8000/api/v1";
        audioUrl = `${API_BASE}/songs/${song.id}/stream`;
      } else if (song.local_file_path) {
        // If we have local file path but no ID, construct URL
        audioUrl = song.local_file_path;
      } else {
        // Fallback to original preview URL
        audioUrl = song.url!;
      }

      audioRef.current.src = audioUrl;
      audioRef.current.load();
      setIsPlaying(true);

      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
        toast({
          title: "Unable to play",
          description: "Error playing this song. Please try another one.",
          variant: "destructive",
        });
      });
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
