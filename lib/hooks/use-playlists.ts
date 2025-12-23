"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

export function usePlaylists(skip = 0, limit = 20) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["playlists", skip, limit],
    queryFn: () => apiClient.getPlaylists(skip, limit),
    enabled: !!user, // Only run query when user is authenticated
  });
}

export function usePlaylist(id: string) {
  return useQuery({
    queryKey: ["playlist", id],
    queryFn: () => apiClient.getPlaylist(id),
    enabled: !!id,
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }) => apiClient.createPlaylist(name, description || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}

export function useAddSongToPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      songId,
    }: {
      playlistId: string;
      songId: string;
    }) => apiClient.addSongToPlaylist(playlistId, songId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["playlist", variables.playlistId],
      });
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}

export function useRemoveSongFromPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      songId,
    }: {
      playlistId: string;
      songId: string;
    }) => apiClient.removeSongFromPlaylist(playlistId, songId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["playlist", variables.playlistId],
      });
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playlistId: string) => apiClient.deletePlaylist(playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}
