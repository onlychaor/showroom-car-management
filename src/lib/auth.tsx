import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

type User = { id: string; email: string } | null

const AuthContext = createContext<{
  user: User
  loading: boolean
  signOut: () => Promise<void>
}>({
  user: null,
  loading: true,
  signOut: async () => {},
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
        setUser({ id: parsed.id || 'dev', email: parsed.email })
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
          if (s?.user) setUser({ id: s.user.id, email: s.user.email })
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
      if (session?.user) setUser({ id: session.user.id, email: session.user.email })
      else setUser(null)
    })

    return () => {
      if (subscription?.unsubscribe) subscription.unsubscribe()
    }
  }, [])

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

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

