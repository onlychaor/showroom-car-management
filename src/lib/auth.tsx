import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

type User = { id: string; email: string } | null

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
    // Dev fallback: localStorage 'dev_user'
    const dev = typeof window !== 'undefined' && localStorage.getItem('dev_user')
    if (dev) {
      try {
        const parsed = JSON.parse(dev)
        setUser({ id: parsed.id || 'dev', email: parsed.email, name: parsed.name || parsed.displayName || null })
        setLoading(false)
        return
      } catch {
        // ignore
      }
    }

    if (!supabase || !(supabase as any).auth || typeof (supabase as any).auth.getSessionAsync !== 'function') {
      // supabase-js v2 provides getSession; try to use getSession
      if ((supabase as any)?.auth?.getSession) {
        (supabase as any).auth.getSession().then((r: any) => {
          const s = r?.data?.session
          if (s?.user) setUser({ id: s.user.id, email: s.user.email, name: (s.user.user_metadata && s.user.user_metadata.full_name) || null })
          setLoading(false)
        }).catch(() => setLoading(false))
      } else {
        setLoading(false)
      }
      return
    }

    // subscribe to auth changes
    ;(supabase as any).auth.getSession().then((r: any) => {
      const s = r?.data?.session
      if (s?.user) setUser({ id: s.user.id, email: s.user.email })
      setLoading(false)
    }).catch(() => setLoading(false))

    const {
      data: { subscription },
    } = (supabase as any).auth.onAuthStateChange((event: string, session: any) => {
      if (session?.user) setUser({ id: session.user.id, email: session.user.email, name: (session.user.user_metadata && session.user.user_metadata.full_name) || null })
      else setUser(null)
    })

    return () => {
      if (subscription?.unsubscribe) subscription.unsubscribe()
    }
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
    if (supabase && (supabase as any).auth && typeof (supabase as any).auth.signOut === 'function') {
      await (supabase as any).auth.signOut()
    }
    setUser(null)
    // redirect to auth
    if (typeof window !== 'undefined') window.location.href = '/auth'
  }

  return <AuthContext.Provider value={{ user, loading, signOut, updateUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

