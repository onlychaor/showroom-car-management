import { useState } from 'react'

export default function ContactForm({ onSaved, initial }: { onSaved: () => void; initial?: any }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [status, setStatus] = useState(initial?.status || '')
  const [scheduledAt, setScheduledAt] = useState(initial?.scheduled_at ? new Date(initial.scheduled_at).toISOString().slice(0,16) : '')
  const [userId, setUserId] = useState(initial?.userId || initial?.user_id || '')
  const [carId, setCarId] = useState(initial?.carId || initial?.car_id || '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload: any = { title, email, status }
    if (scheduledAt) payload.scheduled_at = new Date(scheduledAt).toISOString()
    if (userId) payload.user_id = userId
    if (carId) payload.car_id = carId
    const method = initial?.id ? 'PUT' : 'POST'
    const body = initial?.id ? { id: initial.id, ...payload } : payload
    await fetch('/api/contacts', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
      <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
      <label className="block">
        <div className="text-sm text-slate-400 mb-1">Scheduled at</div>
        <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
      </label>
      <label className="block">
        <div className="text-sm text-slate-400 mb-1">User ID (optional)</div>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="user id" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
      </label>
      <label className="block">
        <div className="text-sm text-slate-400 mb-1">Car ID (optional)</div>
        <input value={carId} onChange={(e) => setCarId(e.target.value)} placeholder="car id" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
      </label>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-pink-400 rounded">Save</button>
      </div>
    </form>
  )
}

