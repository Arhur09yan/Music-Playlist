"use client";

import type React from "react";

import { AuthProvider } from "@/lib/auth-context";
import { QueryProvider } from "@/lib/query-client";
import { MusicPlayerProvider } from "@/lib/music-player-context";
import { MusicPlayer } from "@/components/music-player";
import { Toaster } from "@/components/ui/toaster";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <MusicPlayerProvider>
          {children}
          <MusicPlayer />
          <Toaster />
        </MusicPlayerProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
