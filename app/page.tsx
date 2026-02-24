'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, router])

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">Growth</div>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-foreground">
            Your Personal Growth Journey Starts Here
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track, manage, and achieve your personal and professional goals with our comprehensive growth platform.
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 bg-secondary border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2">Track Progress</h3>
            <p className="text-muted-foreground">
              Monitor your achievements and stay motivated on your growth journey.
            </p>
          </div>

          <div className="p-6 bg-secondary border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2">Set Goals</h3>
            <p className="text-muted-foreground">
              Define clear, measurable goals and work towards them systematically.
            </p>
          </div>

          <div className="p-6 bg-secondary border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-2">Stay Organized</h3>
            <p className="text-muted-foreground">
              Keep all your growth initiatives organized in one place.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
