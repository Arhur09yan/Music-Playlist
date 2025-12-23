"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "./schema";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  setAuthFromResult: (result: { token: string; refreshToken?: string; user: User }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth-token");
    const storedUser = localStorage.getItem("auth-user");

    if (storedToken) {
      setToken(storedToken);

      // Try to load user from localStorage (set by login/register)
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          // If user data is invalid, clear it
          localStorage.removeItem("auth-user");
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { apiClient } = await import("./api-client");
    const { token, refreshToken, user } = await apiClient.login(
      email,
      password
    );
    setToken(token);
    setUser(user);
    localStorage.setItem("auth-token", token);
    if (refreshToken) {
      localStorage.setItem("refresh-token", refreshToken);
    }
    localStorage.setItem("auth-user", JSON.stringify(user));
  };

  const register = async (email: string, name: string, password: string) => {
    const { apiClient } = await import("./api-client");
    const { token, refreshToken, user } = await apiClient.register(
      email,
      name,
      password
    );
    setToken(token);
    setUser(user);
    localStorage.setItem("auth-token", token);
    if (refreshToken) {
      localStorage.setItem("refresh-token", refreshToken);
    }
    localStorage.setItem("auth-user", JSON.stringify(user));
  };

  const setAuthFromResult = (result: { token: string; refreshToken?: string; user: User }) => {
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem("auth-token", result.token);
    if (result.refreshToken) {
      localStorage.setItem("refresh-token", result.refreshToken);
    }
    localStorage.setItem("auth-user", JSON.stringify(result.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("auth-user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, setAuthFromResult, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
