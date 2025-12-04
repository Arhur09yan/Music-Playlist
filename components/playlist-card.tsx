"use client"

import type { Playlist } from "@/lib/schema"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface PlaylistCardProps {
  playlist: Playlist
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link href={`/playlists/${playlist.id}`}>
      <Card className="p-6 hover:border-primary/50 transition-all cursor-pointer">
        <div className="w-full aspect-square bg-gradient-to-br from-primary to-accent rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl text-white">♪</span>
        </div>
        <h3 className="font-semibold text-foreground truncate mb-1">{playlist.name}</h3>
        {playlist.description && <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>}
      </Card>
    </Link>
  )
}
