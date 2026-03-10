import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import ContactForm from '../components/ContactForm'

type Contact = { id: string; title: string; email?: string; status?: string }

export default function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetch('/api/contacts')
      .then((r) => r.json())
      .then(setItems)
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

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Contacts</h1>
      <div className="card-bg p-4 rounded">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="py-2">Title</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-slate-800">
                <td className="py-3">{c.title}</td>
                <td>{c.email}</td>
                <td>{c.status}</td>
                <td className="text-right">
                  <button onClick={() => { setEditing(c); setShowForm(true) }} className="text-sm text-pink-300 mr-3">Edit</button>
                  <button onClick={() => remove(c.id)} className="text-sm text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="mt-4 card-bg p-4 rounded">
          <h3 className="mb-3">{editing ? 'Edit contact' : 'Add contact'}</h3>
          <ContactForm initial={editing} onSaved={refresh} />
        </div>
      )}
    </Layout>
  )
}

