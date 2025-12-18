"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useLikes(skip = 0, limit = 20) {
  return useQuery({
    queryKey: ["likes", skip, limit],
    queryFn: () => apiClient.getLikes(skip, limit),
  });
}

