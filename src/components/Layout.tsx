import { ReactNode, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { useAuth } from '../lib/auth'
import { useRouter } from 'next/router'

export default function Layout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // protect routes except /auth
    if (!loading && !user && !router.pathname.startsWith('/auth')) {
      router.push('/auth')
    }
  }, [user, loading, router])

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}

