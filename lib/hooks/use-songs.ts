"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

export function useSongs(skip = 0, limit = 20) {
  return useQuery({
    queryKey: ["songs", skip, limit],
    queryFn: async () => {
      console.log("Fetching songs from API...");
      const data = await apiClient.getSongs(skip, limit);
      console.log("Songs fetched:", data);
      return data;
    },
    onError: (error) => {
      console.error("Error fetching songs:", error);
    },
  });
}

export function useSong(id: string) {
  return useQuery({
    queryKey: ["song", id],
    queryFn: () => apiClient.getSong(id),
    enabled: !!id,
  });
}

export function useLikeSong() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (songId: string) => {
      if (!user) {
        throw new Error("You must be logged in to like songs");
      }
      return apiClient.likeSong(songId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });
}

export function useUnlikeSong() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (songId: string) => {
      if (!user) {
        throw new Error("You must be logged in to unlike songs");
      }
      return apiClient.unlikeSong(songId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });
}
