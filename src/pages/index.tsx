import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import dynamic from 'next/dynamic'
import Skeleton from '../components/ui/Skeleton'

const SemiDonut = dynamic(() => import('../components/SemiDonut'), { ssr: false })
const NotificationBell = dynamic(() => import('../components/NotificationBell'), { ssr: false, loading: () => <div style={{width:36,height:36}}><Skeleton className="w-9 h-9 rounded-full" /></div> })

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, cars: 0, contacts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/reports')
        const json = await res.json()
        setStats({
          users: json?.totals?.users || 0,
          cars: json?.totals?.cars || 0,
          contacts: json?.totals?.contacts || 0,
        })
        setReport(json)
        setLoading(false)
      } catch (err) {
        // fallback to previous approach
        const [u, c, co] = await Promise.all([
          fetch('/api/users').then((r) => r.json()),
          fetch('/api/cars').then((r) => r.json()),
          fetch('/api/contacts').then((r) => r.json()),
        ])
        setStats({ users: (u && u.length) || 0, cars: (c && c.length) || 0, contacts: (co && co.length) || 0 })
        setLoading(false)
      }
    }
    load()
  }, [])

  const [report, setReport] = useState<any>(null)

  return (
    <Layout>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Thống kê</h1>
          <div className="text-sm text-slate-400">Tổng quan & báo cáo</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 px-3 py-2 rounded text-sm text-slate-300">Hôm nay ▾</div>
          <NotificationBell />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="card-bg p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Contact</div>
                  <div className="text-2xl font-bold">{stats.contacts}</div>
                </div>
                <div className="text-xs text-slate-300">20.5% ↑</div>
              </div>
            </div>
            <div className="card-bg p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Đã hoàn thành</div>
                  <div className="text-2xl font-bold">{(report?.byStatus?.find((s: any) => s.status === 'Đã hoàn thành')?.count) || 0}</div>
                </div>
                <div className="text-xs text-red-400">7.0% ↓</div>
              </div>
            </div>
            <div className="card-bg p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Chưa hoàn thành</div>
                  <div className="text-2xl font-bold">{(report?.byStatus?.find((s: any) => s.status === 'Chưa hoàn thành')?.count) || 0}</div>
                </div>
                <div className="text-xs text-yellow-400">17.5% ↑</div>
              </div>
            </div>
            <div className="card-bg p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Đã hủy</div>
                  <div className="text-2xl font-bold">{(report?.byStatus?.find((s: any) => s.status === 'Đã hủy')?.count) || 0}</div>
                </div>
                <div className="text-xs text-slate-300">0%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-8">
          <div className="card-bg p-6 rounded shadow">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <div style={{ width: 380 }}>
                  <SemiDonut value={Math.round((stats.contacts / Math.max(1, stats.cars + stats.contacts + stats.users)) * 100)} />
                  <div className="text-center mt-[-56px]">
                    <div className="text-3xl font-bold">{loading ? <Skeleton className="w-24 h-8 rounded" /> : stats.contacts}</div>
                    <div className="text-sm text-slate-400">Contact</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="grid grid-rows-3 gap-3 h-full">
                  <div className="card-bg p-3 rounded">
                    <div className="text-sm text-slate-400 mb-2">Contact gần đây</div>
                    <div className="space-y-2 text-sm">
                      {(report?.recent || []).slice(0, 4).map((r: any) => (
                        <div key={r.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{r.title}</div>
                            <div className="text-xs text-slate-400">{r.user?.name} • {r.car?.name}</div>
                          </div>
                          <div className="text-xs text-slate-300">{r.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card-bg p-3 rounded">
                    <div className="text-sm text-slate-400 mb-2">User gần đây</div>
                    <div className="space-y-2 text-sm">
                      {(report?.recent || []).slice(0, 3).map((r: any) => (
                        <div key={r.id} className="flex items-center justify-between">
                          <div className="text-sm">{r.user?.name}</div>
                          <div className="text-xs text-slate-400">{r.user?.email}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card-bg p-3 rounded">
                    <div className="text-sm text-slate-400 mb-2">Car phổ biến</div>
                    <div className="space-y-2 text-sm">
                      {(report?.recent || []).slice(0, 3).map((r: any) => (
                        <div key={r.id} className="flex items-center justify-between">
                          <div className="text-sm">{r.car?.name}</div>
                          <div className="text-xs text-slate-400">800tr</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="card-bg p-4 rounded shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-400">Contact gần đây</div>
              <div className="text-xs text-slate-400">Tất cả ▾</div>
            </div>
            <div className="space-y-3">
              {(report?.recent || []).map((r: any) => (
                <div key={r.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-xs text-slate-300">{r.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

