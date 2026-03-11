import { useEffect, useState } from 'react'

type CarItem = { id: string; name: string; color?: string; price?: string; daysLeft?: number }

function daysLeftFor(name: string) {
  // deterministic pseudo-random based on name to keep values stable across renders
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i)
  const v = Math.abs(h) % 30 - 5 // range -5..24
  return v
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<CarItem[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/cars')
        const data = await res.json()
        const mapped = (data || []).map((c: any) => ({ ...c, daysLeft: daysLeftFor(c.name || c.id || '') }))
        setItems(mapped)
      } catch (err) {
        // fallback sample
        setItems([
          { id: 'car-1', name: 'Ford Transit', daysLeft: 2 },
          { id: 'car-2', name: 'Honda Civic', daysLeft: -1 },
        ])
      }
    }
    load()
  }, [])

  const urgent = items.filter((i) => i.daysLeft !== undefined && i.daysLeft <= 3)

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 z-40">
        <span role="img" aria-label="bell">🔔</span>
        {urgent.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center text-white">{urgent.length}</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="absolute top-16 right-6 w-96 bg-[#071428] card-bg rounded shadow-2xl p-4 text-sm text-white z-60 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-white">Xe sắp hết hạn</div>
              <div className="text-xs text-slate-300">{urgent.length} sắp hết hạn</div>
            </div>
            <ul className="space-y-2 max-h-72 overflow-auto">
              {items.map((it) => (
                <li key={it.id} className="flex items-center justify-between border border-transparent hover:border-slate-700 p-2 rounded">
                  <div>
                    <div className="font-semibold text-white">{it.name}</div>
                    <div className="text-xs text-slate-400">{it.color || ''} • {it.price || ''}</div>
                  </div>
                  <div className={`text-sm font-medium ${it.daysLeft !== undefined && it.daysLeft <= 0 ? 'text-red-400' : it.daysLeft !== undefined && it.daysLeft <= 3 ? 'text-yellow-300' : 'text-slate-300'}`}>
                    {it.daysLeft !== undefined ? (it.daysLeft <= 0 ? `Đã quá hạn ${Math.abs(it.daysLeft)} ngày` : `Còn ${it.daysLeft} ngày`) : '-'}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

