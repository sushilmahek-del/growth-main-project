'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { signOut } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [loading, isAuthenticated, router])

  const handleLogout = async () => {
    const { error } = await signOut()
    if (error) {
      setError(error.message)
      return
    }
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Growth Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome back, {user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-secondary rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-2">Overview</h2>
            <p className="text-muted-foreground">Get started with your growth journey</p>
          </div>

          <div className="p-6 bg-secondary rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-2">Goals</h2>
            <p className="text-muted-foreground">Set and track your personal goals</p>
          </div>

          <div className="p-6 bg-secondary rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-2">Progress</h2>
            <p className="text-muted-foreground">Monitor your achievements</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
          <div className="p-6 bg-secondary rounded-lg border border-border text-center text-muted-foreground">
            No activity yet. Start by exploring the dashboard features.
          </div>
        </div>
      </div>
    </main>
  )
}
