"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/songs" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-xl">♪</span>
          </div>
          <h1 className="text-2xl font-bold text-primary hidden sm:block">
            StreamBeats
          </h1>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/songs"
            className="text-foreground hover:text-primary font-medium"
          >
            Discover
          </Link>
          <Link
            href="/albums"
            className="text-foreground hover:text-primary font-medium"
          >
            Albums
          </Link>
          <Link
            href="/playlists"
            className="text-foreground hover:text-primary font-medium"
          >
            Playlists
          </Link>
          <Link
            href="/likes"
            className="text-foreground hover:text-primary font-medium"
          >
            Likes
          </Link>
          <Link
            href="/search"
            className="text-foreground hover:text-primary font-medium"
          >
            Search
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user?.name}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
