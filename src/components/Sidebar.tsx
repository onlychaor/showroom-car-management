import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/auth'

const Icon = ({ name }: { name: string }) => {
  if (name === 'stats')
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block mr-3" aria-hidden>
        <path d="M4 12h3v8H4zM10.5 6h3v14h-3zM17 2h3v18h-3z" fill="currentColor" />
      </svg>
    )
  if (name === 'manage')
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block mr-3" aria-hidden>
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zM13 21h8v-10h-8v10zm0-18v6h8V3h-8z" fill="currentColor" />
      </svg>
    )
  if (name === 'calendar')
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block mr-3" aria-hidden>
        <path d="M7 11h5v5H7zM3 5h18v16H3zM16 3v4M8 3v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (name === 'log')
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block mr-3" aria-hidden>
        <path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (name === 'bell')
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block mr-3" aria-hidden>
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  return null
}

export const Sidebar = () => {
  const nav: any[] = [
    { href: '/', label: 'Thống kê', icon: 'stats' },
    {
      href: '/users',
      label: 'Quản lý',
      icon: 'manage',
      children: [
        { href: '/users', label: 'Users', icon: 'user' },
        { href: '/contacts', label: 'Contacts', icon: 'contacts' },
        { href: '/cars', label: 'Cars', icon: 'car' },
      ],
    },
    { href: '/calendar', label: 'Lịch', icon: 'calendar' },
    { href: '/notifications', label: 'Thông báo', icon: 'bell' },
  ]
  const { user, signOut, updateUser } = useAuth()
  const [showProfile, setShowProfile] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const { pathname } = useRouter()

  return (
    <aside className="w-64 min-h-screen p-6 bg-[#071428] text-slate-200 relative">
      <div className="mb-8">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center font-bold cursor-pointer" onClick={() => { setNameInput(user?.name || ''); setEmailInput(user?.email || ''); setShowProfile(true) }}>AD</div>
        <div className="mt-3">
          <div className="font-semibold cursor-pointer" onClick={() => { setNameInput(user?.name || ''); setEmailInput(user?.email || ''); setShowProfile(true) }}>{user?.name || (user?.email ? `Chào, ${user.email.split('@')[0]}` : 'Chào, John')}</div>
          <div className="text-xs text-slate-400">{user?.email || 'Admin@gmail.com'}</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((n) =>
          n.children ? (
            <div key={n.href}>
              <div className="px-3 py-2 rounded text-slate-300 flex items-center">
                <Icon name={n.icon} />
                <span className="font-medium">{n.label}</span>
              </div>
              <div className="ml-4 mt-1 space-y-1">
                {n.children.map((c: any) => (
                  <Link key={c.href} href={c.href} className={`block px-3 py-2 rounded hover:bg-[#0b1b2b] flex items-center ${pathname === c.href ? 'bg-[#0b1b2b]' : ''}`}>
                    <Icon name={c.icon} />
                    <span className="text-sm">{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={n.href} href={n.href} className={`px-3 py-2 rounded hover:bg-[#0b1b2b] flex items-center ${pathname === n.href ? 'bg-[#0b1b2b]' : ''}`}>
              <Icon name={n.icon} />
              <span>{n.label}</span>
            </Link>
          )
        )}
      </nav>

      <div className="absolute bottom-6 left-6 text-slate-400">
        <button onClick={signOut} className="text-sm">Logout</button>
      </div>
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowProfile(false)} />
          <div className="relative bg-[#071428] rounded-xl shadow-2xl p-6 w-full max-w-md text-white border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Chỉnh sửa hồ sơ</div>
              <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <label className="block">
                <div className="text-sm text-slate-400 mb-1">Name</div>
                <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
              </label>
              <label className="block">
                <div className="text-sm text-slate-400 mb-1">Email</div>
                <input value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
              </label>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowProfile(false)} className="px-3 py-1 border rounded">Huỷ</button>
                <button onClick={async () => { await updateUser({ name: nameInput, email: emailInput }); setShowProfile(false) }} className="px-3 py-1 bg-pink-400 rounded">Lưu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

