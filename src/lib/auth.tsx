import React, { createContext, useContext, useEffect, useState } from 'react'

type User = { id: string; email?: string; name?: string } | null

const AuthContext = createContext<{
  user: User
  loading: boolean
  signOut: () => Promise<void>
  updateUser: (payload: { name?: string; email?: string }) => Promise<any>
}>({
  user: null,
  loading: true,
  signOut: async () => {},
  updateUser: async () => ({}),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dev fallback: localStorage 'dev_user' only
    const dev = typeof window !== 'undefined' && localStorage.getItem('dev_user')
    if (dev) {
      try {
        const parsed = JSON.parse(dev)
        setUser({ id: parsed.id || 'dev', email: parsed.email, name: parsed.name || parsed.displayName || null })
      } catch {
        setUser(null)
      }
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [])

  async function updateUser(payload: { name?: string; email?: string }) {
    // Dev fallback: update localStorage
    if (typeof window !== 'undefined' && localStorage.getItem('dev_user')) {
      const parsed = JSON.parse(localStorage.getItem('dev_user') || '{}')
      const merged = { ...parsed, ...payload }
      localStorage.setItem('dev_user', JSON.stringify(merged))
      setUser((u) => ({ ...(u || {}), ...payload }))
      return merged
    }

    // If logged-in user (with id) update via API
    if (user?.id) {
      const res = await fetch('/api/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: user.id, ...payload }) })
      const json = await res.json()
      setUser((u) => ({ ...(u || {}), ...(json || {} as any) }))
      return json
    }
    return null
  }

  async function signOut() {
    // clear dev user
    if (typeof window !== 'undefined') localStorage.removeItem('dev_user')
    // no external auth provider configured; just clear local session
    setUser(null)
    // redirect to auth
    if (typeof window !== 'undefined') window.location.href = '/auth'
  }

  return <AuthContext.Provider value={{ user, loading, signOut, updateUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

