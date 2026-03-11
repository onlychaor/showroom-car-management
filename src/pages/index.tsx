import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import SemiDonut from '../components/SemiDonut'
import NotificationBell from '../components/NotificationBell'

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, cars: 0, contacts: 0 })

  useEffect(() => {
    async function load() {
      const [u, c, co] = await Promise.all([
        fetch('/api/users').then((r) => r.json()),
        fetch('/api/cars').then((r) => r.json()),
        fetch('/api/contacts').then((r) => r.json()),
      ])
      setStats({ users: (u && u.length) || 0, cars: (c && c.length) || 0, contacts: (co && co.length) || 0 })
    }
    load()
  }, [])

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Thống kê</h1>
        <div className="flex items-center gap-4">
          <NotificationBell />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard title="Users" value={stats.users} />
            <StatCard title="Cars" value={stats.cars} />
            <StatCard title="Contacts" value={stats.contacts} />
          </div>

          <div className="card-bg p-6 rounded shadow">
            <div className="flex items-center gap-6">
              <div style={{ width: 300 }}>
                <SemiDonut value={Math.round((stats.contacts / Math.max(1, stats.cars + stats.contacts + stats.users)) * 100)} />
              </div>
              <div>
                <div className="text-3xl font-bold">42</div>
                <div className="text-sm text-slate-400">Contact</div>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><span className="inline-block w-3 h-3 bg-sky-400 rounded-full mr-2 align-middle" /> Đã hoàn thành</li>
                  <li><span className="inline-block w-3 h-3 bg-indigo-600 rounded-full mr-2 align-middle" /> Chưa hoàn thành</li>
                  <li><span className="inline-block w-3 h-3 bg-pink-500 rounded-full mr-2 align-middle" /> Đã hủy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="card-bg p-4 rounded shadow">
            <div className="text-sm text-slate-400 mb-3">Contact gần đây</div>
            <div className="space-y-2">
              {/* simple placeholder list */}
              <div className="flex items-center justify-between">
                <div className="text-sm">John Carter</div>
                <div className="text-xs text-slate-400">Đang xử lí</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Sophie Moore</div>
                <div className="text-xs text-green-400">Đã xong</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

