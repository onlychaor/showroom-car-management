import { useState } from 'react'

export default function CarForm({ onSaved, initial }: { onSaved: () => void; initial?: any }) {
  const [name, setName] = useState(initial?.name || '')
  const [color, setColor] = useState(initial?.color || '')
  const [price, setPrice] = useState(initial?.price || '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { name, color, price }
    const method = initial?.id ? 'PUT' : 'POST'
    const body = initial?.id ? { id: initial.id, ...payload } : payload
    await fetch('/api/cars', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên xe" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
      <input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-primary rounded">Save</button>
      </div>
    </form>
  )
}

