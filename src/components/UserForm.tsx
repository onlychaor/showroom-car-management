import { useState } from 'react'

export default function UserForm({ onSaved, initial }: { onSaved: () => void; initial?: any }) {
  const [name, setName] = useState(initial?.name || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [phone, setPhone] = useState(initial?.phone || '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { name, email, phone }
    const method = initial?.id ? 'PUT' : 'POST'
    const body = initial?.id ? { id: initial.id, ...payload } : payload
    await fetch('/api/users', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-pink-400 rounded">Save</button>
      </div>
    </form>
  )
}

