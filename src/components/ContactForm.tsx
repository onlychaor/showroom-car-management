import { useState } from 'react'

export default function ContactForm({ onSaved, initial }: { onSaved: () => void; initial?: any }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [status, setStatus] = useState(initial?.status || '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { title, email, status }
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
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-pink-400 rounded">Save</button>
      </div>
    </form>
  )
}

