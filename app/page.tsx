"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/songs")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-background to-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-4">StreamBeats</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-background to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-xl">♪</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">StreamBeats</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-balance mb-6">Your Music, Your Way</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8 text-balance">
            Discover millions of songs, create playlists, and enjoy unlimited music streaming
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg bg-transparent">
                Already a member? Log In
              </Button>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">© 2025 StreamBeats. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
