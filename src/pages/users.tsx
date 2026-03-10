import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import UserForm from '../components/UserForm'

type User = { id: string; name: string; email: string; phone?: string }

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
  }, [])

  function refresh() {
    fetch('/api/users').then((r) => r.json()).then(setUsers)
    setShowForm(false)
    setEditing(null)
  }

  async function remove(id: string) {
    await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
    refresh()
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Users</h1>
      <div className="flex items-center justify-between mb-3">
        <div />
        <div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-pink-400 rounded">Add user</button>
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
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-800">
                <td className="py-3">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td className="text-right">
                  <button onClick={() => { setEditing(u); setShowForm(true) }} className="text-sm text-pink-300 mr-3">Edit</button>
                  <button onClick={() => remove(u.id)} className="text-sm text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="mt-4 card-bg p-4 rounded">
          <h3 className="mb-3">{editing ? 'Edit user' : 'Add user'}</h3>
          <UserForm initial={editing} onSaved={refresh} />
        </div>
      )}
    </Layout>
  )
}

