// Layout now provided at app level
import { useEffect, useState } from 'react'
import ContactForm from '../components/ContactForm'
import Modal from '../components/Modal'
import Button from '../components/ui/Button'
import useDebounce from '../hooks/useDebounce'
import Skeleton from '../components/ui/Skeleton'

type Contact = { id: string; title: string; email?: string; status?: string }

export default function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState<{ id: string; title?: string } | null>(null)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 200)

  useEffect(() => {
    refresh()
  }, [])

  function refresh() {
    setLoading(true)
    fetch('/api/contacts')
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
    setShowForm(false)
    setEditing(null)
  }

  async function remove(id: string) {
    await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' })
    refresh()
  }

  const filtered = (items || []).filter((c) => {
    const title = (c?.title || '').toString().toLowerCase()
    const email = (c?.email || '').toString().toLowerCase()
    const q = (debouncedQuery || '').toLowerCase()
    return title.includes(q) || email.includes(q)
  })

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <div className="flex items-center gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="px-3 py-2 rounded bg-white/5" />
          <Button onClick={() => { setEditing(null); setShowForm(true) }} variant="primary">Add contact</Button>
        </div>
      </div>

      <div className="card-bg p-4 rounded">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="py-2">Title</th>
                <th>Email</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-slate-800">
                  <td className="py-3">{c.title}</td>
                  <td>{c.email}</td>
                  <td>{c.status}</td>
                  <td className="text-right">
                  <button type="button" onClick={() => { setEditing(c); setShowForm(true) }} className="text-sm text-primary/80 mr-3">Edit</button>
                  <button type="button" onClick={() => setShowConfirm({ id: c.id, title: c.title })} className="text-sm text-red-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={showForm} title={editing ? 'Edit contact' : 'New contact'} onClose={() => setShowForm(false)}>
        <ContactForm initial={editing} onSaved={refresh} />
      </Modal>

      <Modal open={!!showConfirm} title="Xác nhận xoá" onClose={() => setShowConfirm(null)}>
        <div className="mb-4">Bạn muốn xoá contact <strong>{showConfirm?.title}</strong>?</div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setShowConfirm(null)} className="px-3 py-1 border rounded">Huỷ</button>
          <Button onClick={() => { if (showConfirm) remove(showConfirm.id); }} variant="primary" size="sm">Xoá</Button>
        </div>
      </Modal>
    </Layout>
  )
}

