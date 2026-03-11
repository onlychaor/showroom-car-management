import Layout from '../components/Layout'
import { useEffect, useMemo, useState } from 'react'
import NotificationCard from '../components/NotificationCard'
import Modal from '../components/Modal'
import ContactForm from '../components/ContactForm'

function isSameDay(a?: string, b?: Date) {
  if (!a) return false
  const d = new Date(a)
  return d.toDateString() === (b || new Date()).toDateString()
}

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetch('/api/contacts').then((r) => r.json()).then((data) => setItems(data || []))
  }, [])

  const today = useMemo(() => items.filter((i) => isSameDay(i.scheduled_at, new Date())), [items])
  const yesterday = useMemo(() => {
    const y = new Date()
    y.setDate(y.getDate() - 1)
    return items.filter((i) => isSameDay(i.scheduled_at, y))
  }, [items])
  const others = useMemo(() => {
    return items.filter((i) => {
      const d = new Date(i.scheduled_at || i.created_at)
      const now = new Date()
      const same = d.toDateString() === now.toDateString()
      const y = new Date(); y.setDate(y.getDate() - 1)
      const sameY = d.toDateString() === y.toDateString()
      return !same && !sameY
    })
  }, [items])

  function refresh() {
    fetch('/api/contacts').then((r) => r.json()).then((data) => setItems(data || []))
    setShowForm(false)
    setEditing(null)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' })
    refresh()
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <div />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <div className="text-sm text-slate-400 mb-3">Hôm nay <span className="ml-2 text-xs bg-slate-900 px-2 py-1 rounded">{today.length}</span></div>
          <div className="space-y-3">
            {today.map((it) => <NotificationCard key={it.id} item={it} onEdit={(i) => { setEditing(i); setShowForm(true) }} onDelete={handleDelete} />)}
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-400 mb-3">Hôm qua <span className="ml-2 text-xs bg-slate-900 px-2 py-1 rounded">{yesterday.length}</span></div>
          <div className="space-y-3">
            {yesterday.map((it) => <NotificationCard key={it.id} item={it} onEdit={(i) => { setEditing(i); setShowForm(true) }} onDelete={handleDelete} />)}
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-400 mb-3">Tất cả <span className="ml-2 text-xs bg-slate-900 px-2 py-1 rounded">{others.length}</span></div>
          <div className="space-y-3">
            {others.map((it) => <NotificationCard key={it.id} item={it} onEdit={(i) => { setEditing(i); setShowForm(true) }} onDelete={handleDelete} />)}
          </div>
        </div>
      </div>

      <Modal open={showForm} title={editing ? 'Edit Notification' : 'New Notification'} onClose={() => setShowForm(false)}>
        <ContactForm initial={editing} onSaved={refresh} />
      </Modal>
    </Layout>
  )
}

