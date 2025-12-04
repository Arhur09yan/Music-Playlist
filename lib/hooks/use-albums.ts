"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useAlbums(skip = 0, limit = 20) {
  return useQuery({
    queryKey: ["albums", skip, limit],
    queryFn: () => apiClient.getAlbums(skip, limit),
  });
}

export function useAlbum(id: string) {
  return useQuery({
    queryKey: ["album", id],
    queryFn: () => apiClient.getAlbum(id),
    enabled: !!id,
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      artist,
      image_url,
      description,
    }: {
      title: string;
      artist: string;
      image_url?: string;
      description?: string;
    }) => apiClient.createAlbum({ title, artist, image_url, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });
}

export function useAddSongToAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ albumId, songId }: { albumId: string; songId: string }) =>
      apiClient.addSongToAlbum(albumId, songId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["album", variables.albumId],
      });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });
}
