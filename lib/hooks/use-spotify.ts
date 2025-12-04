"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useImportSongFromSpotify() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (query: string) => apiClient.importSongFromSpotify(query),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });
}

export function useImportSongsFromSpotify() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ query, limit = 20 }: { query: string; limit?: number }) =>
      apiClient.importSongsFromSpotify(query, limit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });
}

