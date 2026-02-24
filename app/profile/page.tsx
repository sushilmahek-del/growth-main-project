'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { signOut, getUserProfile, updateUserProfile } from '@/lib/supabase'

interface Profile {
  bio?: string
  location?: string
  website?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (user?.id) {
      loadProfile()
    }
  }, [user?.id])

  const loadProfile = async () => {
    if (!user?.id) return

    setProfileLoading(true)
    try {
      const { data, error } = await getUserProfile(user.id)
      if (error) {
        setError(error.message)
        return
      }

      if (data) {
        setProfile(data)
        setBio(data.bio || '')
        setLocation(data.location || '')
        setWebsite(data.website || '')
      }
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!user?.id) return

    try {
      const { error } = await updateUserProfile(user.id, {
        bio,
        location,
        website,
      })

      if (error) {
        setError(error.message)
        return
      }

      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update profile')
    }
  }

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
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              Dashboard
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

      <div className="max-w-2xl mx-auto px-4 py-12">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 text-green-700 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="bg-secondary border border-border rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">Account Information</h2>
            <p className="text-muted-foreground text-sm">
              Email: <span className="text-foreground font-medium">{user?.email}</span>
            </p>
            <p className="text-muted-foreground text-sm">
              User ID: <span className="text-foreground font-medium text-xs">{user?.id}</span>
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium text-foreground">
                Bio
              </label>
              <textarea
                id="bio"
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-foreground">
                Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="website" className="block text-sm font-medium text-foreground">
                Website
              </label>
              <input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {profileLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
