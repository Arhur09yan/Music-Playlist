"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth as useAuthContext } from "@/lib/auth-context";

export function useLogin() {
  const { login: setAuth } = useAuthContext();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await apiClient.login(email, password);
      // Update auth context with the result (this handles localStorage)
      await setAuth(email, password);
      return result;
    },
  });
}

export function useRegister() {
  const { register: setAuth } = useAuthContext();

  return useMutation({
    mutationFn: async ({
      email,
      name,
      password,
    }: {
      email: string;
      name: string;
      password: string;
    }) => {
      const result = await apiClient.register(email, name, password);
      // Update auth context with the result (this handles localStorage)
      await setAuth(email, name, password);
      return result;
    },
  });
}
