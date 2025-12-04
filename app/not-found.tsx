import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-6">Page not found. Let's get you back to the music.</p>
        <Link href="/songs">
          <Button>Go to Songs</Button>
        </Link>
      </div>
    </div>
  )
}
