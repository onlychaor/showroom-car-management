import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import ContactForm from '../components/ContactForm'
import Modal from '../components/Modal'

type Contact = { id: string; title: string; email?: string; status?: string }

export default function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState<{ id: string; title?: string } | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    refresh()
  }, [])

  function refresh() {
    fetch('/api/contacts').then((r) => r.json()).then(setItems)
    setShowForm(false)
    setEditing(null)
  }

  async function remove(id: string) {
    await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' })
    refresh()
  }

  const filtered = items.filter((c) => c.title?.toLowerCase().includes(query.toLowerCase()) || c.email?.toLowerCase().includes(query.toLowerCase()))

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <div className="flex items-center gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="px-3 py-2 rounded bg-white/5" />
          <button onClick={() => { setEditing(null); setShowForm(true) }} className="px-4 py-2 bg-pink-400 rounded">Add contact</button>
        </div>
      </div>

      <div className="card-bg p-4 rounded">
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
                  <button onClick={() => { setEditing(c); setShowForm(true) }} className="text-sm text-pink-300 mr-3">Edit</button>
                  <button onClick={() => setShowConfirm({ id: c.id, title: c.title })} className="text-sm text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showForm} title={editing ? 'Edit contact' : 'New contact'} onClose={() => setShowForm(false)}>
        <ContactForm initial={editing} onSaved={refresh} />
      </Modal>

      <Modal open={!!showConfirm} title="Xác nhận xoá" onClose={() => setShowConfirm(null)}>
        <div className="mb-4">Bạn muốn xoá contact <strong>{showConfirm?.title}</strong>?</div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowConfirm(null)} className="px-3 py-1 border rounded">Huỷ</button>
          <button onClick={() => { if (showConfirm) remove(showConfirm.id); }} className="px-3 py-1 bg-pink-400 rounded text-white">Xoá</button>
        </div>
      </Modal>
    </Layout>
  )
}

