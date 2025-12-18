// Direct backend API calls (FastAPI)
const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

// Helper to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth-token");
};

// Helper to get refresh token
const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh-token");
};

// Helper to refresh access token
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  // If already refreshing, wait for that promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!res.ok) {
        // Refresh token is invalid, clear everything
        localStorage.removeItem("auth-token");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("auth-user");
        return null;
      }

      const data = await res.json();
      const newAccessToken = data.access_token;
      localStorage.setItem("auth-token", newAccessToken);
      return newAccessToken;
    } catch (error) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("auth-user");
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Helper to create headers with auth
const createHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
};

// Helper to make authenticated requests with automatic token refresh
const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // First attempt
  let token = getAuthToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  let res = await fetch(url, options);

  // If 401, try to refresh token and retry once
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry with new token
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      };
      res = await fetch(url, options);
    }
  }

  return res;
};

export const apiClient = {
  // Auth
  async register(email: string, name: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ email, username: name, password }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || error.message || "Registration failed");
    }
    const user = await res.json();
    // Auto-login after registration
    return apiClient.login(email, password);
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || error.message || "Login failed");
    }
    const data = await res.json();
    // Store refresh token
    if (data.refresh_token) {
      localStorage.setItem("refresh-token", data.refresh_token);
    }
    // Transform backend response to frontend format
    return {
      token: data.access_token,
      refreshToken: data.refresh_token,
      user: {
        id: String(data.user.id),
        email: data.user.email,
        name: data.user.username,
      },
    };
  },

  // Songs
  async getSongs(skip = 0, limit = 20) {
    const url = `${API_BASE}/songs?skip=${skip}&limit=${limit}`;
    console.log("🔵 API Request: GET", url);
    const res = await fetch(url);
    console.log("🔵 API Response status:", res.status, res.statusText);
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error("🔴 API Error:", error);
      throw new Error(error.detail || error.message || "Failed to fetch songs");
    }
    const data = await res.json();
    console.log("🟢 API Success: Received", data.length, "songs");
    return data;
  },

  async getSong(id: string) {
    const res = await fetch(`${API_BASE}/songs/${id}`);
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || error.message || "Failed to fetch song");
    }
    return res.json();
  },

  // Get streaming URL for a song (uses local cached file if available)
  getSongStreamUrl(id: string): string {
    return `${API_BASE}/songs/${id}/stream`;
  },

  async likeSong(songId: string) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("You must be logged in to like songs");
    }

    const res = await authenticatedFetch(`${API_BASE}/likes/${songId}`, {
      method: "POST",
      headers: createHeaders(),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      throw new Error(error.detail || error.message || "Failed to like song");
    }
    return res.json();
  },

  async unlikeSong(songId: string) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("You must be logged in to unlike songs");
    }

    const res = await authenticatedFetch(`${API_BASE}/likes/${songId}`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      throw new Error(error.detail || error.message || "Failed to unlike song");
    }
    return res.json();
  },

  async getLikes(skip = 0, limit = 20) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("You must be logged in to view likes");
    }

    const res = await authenticatedFetch(
      `${API_BASE}/likes?skip=${skip}&limit=${limit}`,
      {
        headers: createHeaders(),
      }
    );
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      throw new Error(error.detail || error.message || "Failed to fetch likes");
    }
    return res.json();
  },

  // Playlists
  async getPlaylists(skip = 0, limit = 20) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("You must be logged in to view playlists");
    }

    const res = await authenticatedFetch(
      `${API_BASE}/playlists?skip=${skip}&limit=${limit}`,
      {
        headers: createHeaders(),
      }
    );
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      }
      throw new Error(
        error.detail || error.message || "Failed to fetch playlists"
      );
    }
    const playlists = await res.json();
    // Transform backend response to frontend format
    return playlists.map((p: any) => ({
      id: String(p.id),
      userId: String(p.user_id),
      name: p.name,
      description: p.description || "",
      createdAt: p.created_at,
      updatedAt: p.updated_at || p.created_at,
    }));
  },

  async createPlaylist(name: string, description: string) {
    const res = await authenticatedFetch(`${API_BASE}/playlists`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ name, description: description || "" }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || "Failed to create playlist"
      );
    }
    const playlist = await res.json();
    // Transform backend response to frontend format
    return {
      id: String(playlist.id),
      userId: String(playlist.user_id),
      name: playlist.name,
      description: playlist.description || "",
      createdAt: playlist.created_at,
      updatedAt: playlist.updated_at || playlist.created_at,
    };
  },

  async getPlaylist(id: string) {
    const res = await fetch(`${API_BASE}/playlists/${id}`);
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || "Failed to fetch playlist"
      );
    }
    const playlist = await res.json();
    // Transform backend response to frontend format
    return {
      id: String(playlist.id),
      userId: String(playlist.user_id),
      name: playlist.name,
      description: playlist.description || "",
      createdAt: playlist.created_at,
      updatedAt: playlist.updated_at || playlist.created_at,
      songs: playlist.songs || [],
    };
  },

  async addSongToPlaylist(playlistId: string, songId: string) {
    const res = await authenticatedFetch(
      `${API_BASE}/playlists/${playlistId}/songs/${songId}`,
      {
        method: "POST",
        headers: createHeaders(),
      }
    );
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || "Failed to add song to playlist"
      );
    }
    return res.json();
  },

  async removeSongFromPlaylist(playlistId: string, songId: string) {
    const res = await authenticatedFetch(
      `${API_BASE}/playlists/${playlistId}/songs/${songId}`,
      {
        method: "DELETE",
        headers: createHeaders(),
      }
    );
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || "Failed to remove song from playlist"
      );
    }
    return res.json();
  },

  // Search
  async search(query: string, skip = 0, limit = 20) {
    const res = await fetch(
      `${API_BASE}/songs/search/query?q=${encodeURIComponent(
        query
      )}&skip=${skip}&limit=${limit}`
    );
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || error.message || "Search failed");
    }
    const data = await res.json();
    return data.results || [];
  },

  // Spotify Import
  async importSongFromSpotify(query: string) {
    const res = await fetch(
      `${API_BASE}/songs/import/spotify?query=${encodeURIComponent(query)}`,
      {
        method: "POST",
        headers: createHeaders(true),
      }
    );
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || "Failed to import song from Spotify"
      );
    }
    return res.json();
  },

  async importSongsFromSpotify(query: string, limit = 20) {
    const res = await fetch(
      `${API_BASE}/songs/import/spotify/bulk?query=${encodeURIComponent(
        query
      )}&limit=${limit}`,
      {
        method: "POST",
        headers: createHeaders(true),
      }
    );
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || "Failed to import songs from Spotify"
      );
    }
    return res.json();
  },

  // Albums
  async getAlbums(skip = 0, limit = 20) {
    const res = await fetch(`${API_BASE}/albums?skip=${skip}&limit=${limit}`);
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || "Failed to fetch albums"
      );
    }
    return res.json();
  },

  async getAlbum(id: string) {
    const res = await fetch(`${API_BASE}/albums/${id}`);
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || error.message || "Failed to fetch album");
    }
    return res.json();
  },

  async createAlbum({
    title,
    artist,
    image_url,
    description,
  }: {
    title: string;
    artist: string;
    image_url?: string;
    description?: string;
  }) {
    const res = await authenticatedFetch(`${API_BASE}/albums`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ title, artist, image_url, description }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || "Failed to create album"
      );
    }
    return res.json();
  },

  async addSongToAlbum(albumId: string, songId: string) {
    const res = await authenticatedFetch(
      `${API_BASE}/albums/${albumId}/songs/${songId}`,
      {
        method: "POST",
        headers: createHeaders(),
      }
    );
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || "Failed to add song to album"
      );
    }
    return res.json();
  },
};
