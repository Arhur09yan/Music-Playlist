"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useSearch(query: string, skip = 0, limit = 20) {
  return useQuery({
    queryKey: ["search", query, skip, limit],
    queryFn: () => apiClient.search(query, skip, limit),
    enabled: !!query && query.length > 0,
  });
}
