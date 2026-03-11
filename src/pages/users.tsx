import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import UserForm from '../components/UserForm'
import Modal from '../components/Modal'

type User = { id: string; name: string; email: string; phone?: string }

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState<{ id: string; name?: string } | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    refresh()
  }, [])

  function refresh() {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
    setShowForm(false)
    setEditing(null)
  }

  async function remove(id: string) {
    await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
    refresh()
  }

  const filtered = (users || []).filter((u) => {
    const name = (u?.name || '').toString().toLowerCase()
    const email = (u?.email || '').toString().toLowerCase()
    const q = (query || '').toLowerCase()
    return name.includes(q) || email.includes(q)
  })

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="flex items-center gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="px-3 py-2 rounded bg-white/5" />
          <button onClick={() => { setEditing(null); setShowForm(true) }} className="px-4 py-2 bg-pink-400 rounded">Add user</button>
        </div>
      </div>

      <div className="card-bg p-4 rounded">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-slate-800">
                <td className="py-3">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td className="text-right">
                  <button onClick={() => { setEditing(u); setShowForm(true) }} className="text-sm text-pink-300 mr-3">Edit</button>
                  <button onClick={() => setShowConfirm({ id: u.id, name: u.name })} className="text-sm text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showForm} title={editing ? 'Edit user' : 'New user'} onClose={() => setShowForm(false)}>
        <UserForm initial={editing} onSaved={refresh} />
      </Modal>

      <Modal open={!!showConfirm} title="Xác nhận xoá" onClose={() => setShowConfirm(null)}>
        <div className="mb-4">Bạn muốn xoá user <strong>{showConfirm?.name}</strong>?</div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowConfirm(null)} className="px-3 py-1 border rounded">Huỷ</button>
          <button onClick={() => { if (showConfirm) remove(showConfirm.id); }} className="px-3 py-1 bg-pink-400 rounded text-white">Xoá</button>
        </div>
      </Modal>
    </Layout>
  )
}

