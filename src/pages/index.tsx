import Layout from '../components/Layout'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, cars: 0, contacts: 0 })

  useEffect(() => {
    async function load() {
      const [u, c, co] = await Promise.all([
        fetch('/api/users').then((r) => r.json()),
        fetch('/api/cars').then((r) => r.json()),
        fetch('/api/contacts').then((r) => r.json()),
      ])
      setStats({ users: u.length || 0, cars: c.length || 0, contacts: co.length || 0 })
    }
    load()
  }, [])

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="card-bg p-6 rounded shadow">
          <div className="text-sm text-slate-400">Users</div>
          <div className="text-3xl font-bold">{stats.users}</div>
        </div>
        <div className="card-bg p-6 rounded shadow">
          <div className="text-sm text-slate-400">Cars</div>
          <div className="text-3xl font-bold">{stats.cars}</div>
        </div>
        <div className="card-bg p-6 rounded shadow">
          <div className="text-sm text-slate-400">Contacts</div>
          <div className="text-3xl font-bold">{stats.contacts}</div>
        </div>
      </div>
    </Layout>
  )
}

