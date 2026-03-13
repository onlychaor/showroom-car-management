import Layout from '../components/Layout'
import { useEffect, useMemo, useState } from 'react'
import Modal from '../components/Modal'
import ContactForm from '../components/ContactForm'

function startOfWeek(d: Date) {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day
  return new Date(date.setDate(diff))
}

function addDays(d: Date, days: number) {
  const n = new Date(d)
  n.setDate(n.getDate() + days)
  return n
}

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([])
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()))
  const [selected, setSelected] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('/api/contacts').then((r) => r.json()).then((data) => setEvents(Array.isArray(data) ? data : []))
  }, [])

  const days = useMemo(() => {
    const arr = []
    for (let i = 0; i < 7; i++) arr.push(addDays(new Date(weekStart), i))
    return arr
  }, [weekStart])

  const eventsByDay = useMemo(() => {
    const map: Record<string, any[]> = {}
    if (!Array.isArray(events)) return map
    for (const e of events) {
      const date = e.scheduled_at ? new Date(e.scheduled_at) : new Date(e.created_at)
      const key = date.toDateString()
      map[key] = map[key] || []
      map[key].push(e)
    }
    return map
  }, [events])

  function openNewFor(day: Date) {
    setSelected({ scheduled_at: day.toISOString() })
    setShowForm(true)
  }

  function weekdayShort(d: Date) {
    // Use deterministic short names to avoid locale differences between server and client
    const names = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return names[d.getDay()] || d.toString().slice(0,3)
  }

  function formatDateTimeISO(d: string | Date) {
    const dt = new Date(d)
    // YYYY-MM-DD HH:MM
    return dt.toISOString().replace('T', ' ').slice(0, 16)
  }

  function refresh() {
    fetch('/api/contacts').then((r) => r.json()).then(setEvents)
    setShowForm(false)
    setSelected(null)
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Schedular</h1>
        <div className="flex items-center gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="px-3 py-2 rounded bg-white/5" />
          <button onClick={() => { setSelected(null); setShowForm(true) }} className="px-4 py-2 bg-primary rounded">Add +</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9 card-bg p-4 rounded">
          <div className="grid grid-cols-7 gap-2 mb-3">
            {days.map((d) => (
              <div key={d.toDateString()} className="text-center py-2 border-b border-slate-800">
                <div className="font-medium">{weekdayShort(d)}</div>
                <div className="text-sm text-slate-400">{d.getDate()}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => {
              const key = d.toDateString()
              const items = eventsByDay[key] || []
              return (
                <div key={key} className="min-h-[240px] border border-slate-800 rounded p-2">
                  <button onClick={() => openNewFor(d)} className="text-xs text-slate-400 mb-2">+ add</button>
                  <div className="space-y-2">
                    {items.map((it: any) => (
                      <div key={it.id} className="p-2 rounded border border-slate-700 bg-[#071428] hover:bg-[#0b1724] cursor-pointer" onClick={() => { setSelected(it); setShowForm(true) }}>
                        <div className="font-medium">{it.title}</div>
                        <div className="text-xs text-slate-400">{it.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="col-span-3">
          <div className="card-bg p-4 rounded mb-4">
            <div className="mb-2 font-medium">Mini calendar</div>
            <div className="text-sm text-slate-400">Today: {new Date().toISOString().slice(0,10)}</div>
          </div>

          <div className="card-bg p-4 rounded">
            <div className="mb-2 font-medium">Upcoming</div>
          <div className="space-y-3">
              {(Array.isArray(events) ? events : [])
                .filter((e) => (!query || (String(e.title || '').toLowerCase().includes(query.toLowerCase()))))
                .sort((a: any, b: any) => new Date(a.scheduled_at || a.created_at).getTime() - new Date(b.scheduled_at || b.created_at).getTime())
                .slice(0, 8)
                .map((e: any) => (
                  <div key={e.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{e.title}</div>
                      <div className="text-xs text-slate-400">{formatDateTimeISO(e.scheduled_at || e.created_at)}</div>
                    </div>
                    <div className="text-xs text-slate-300">{e.status}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <Modal open={showForm} title={selected?.id ? 'Edit Event' : 'New Event'} onClose={() => setShowForm(false)}>
        <ContactForm initial={selected} onSaved={refresh} />
      </Modal>
    </Layout>
  )
}

