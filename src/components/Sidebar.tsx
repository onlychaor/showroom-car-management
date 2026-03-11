import Link from 'next/link'
import { useAuth } from '../lib/auth'

export const Sidebar = () => {
  const nav = [
    { href: '/', label: 'Thống kê' },
    { href: '/users', label: 'Quản lý' },
    { href: '/contacts', label: 'Contacts' },
    { href: '/cars', label: 'Cars' },
  ]
  const { user, signOut } = useAuth()

  return (
    <aside className="w-64 min-h-screen p-6 bg-[#071428] text-slate-200 relative">
      <div className="mb-8">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center font-bold">AD</div>
        <div className="mt-3">
          <div className="font-semibold">{user?.email ? `Chào, ${user.email.split('@')[0]}` : 'Chào, John'}</div>
          <div className="text-xs text-slate-400">{user?.email || 'Admin@gmail.com'}</div>
        </div>
      </div>

      <nav className="flex flex-col gap-3">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="px-3 py-2 rounded hover:bg-[#0b1b2b]">
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 text-slate-400">
        <button onClick={signOut} className="text-sm">Logout</button>
      </div>
    </aside>
  )
}

