import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import CarForm from '../components/CarForm'
import Modal from '../components/Modal'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'

type Car = { id: string; name: string; color?: string; price?: string }

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/cars')
      .then((r) => r.json())
      .then((data) => setCars(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  function refresh() {
    setLoading(true)
    fetch('/api/cars').then((r) => r.json()).then((data) => setCars(Array.isArray(data) ? data : [])).finally(() => setLoading(false))
    setShowForm(false)
    setEditing(null)
  }

  async function remove(id: string) {
    await fetch(`/api/cars?id=${id}`, { method: 'DELETE' })
    refresh()
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Cars</h1>
      <div className="flex items-center justify-between mb-3">
        <div />
        <div>
          <Button onClick={() => { setEditing(null); setShowForm(true) }} variant="primary">Add car</Button>
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
                <th className="py-2">Name</th>
                <th>Color</th>
                <th>Price</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cars.map((c) => (
                <tr key={c.id} className="border-t border-slate-800">
                  <td className="py-3">{c.name}</td>
                  <td>{c.color}</td>
                  <td>{c.price}</td>
                  <td className="text-right">
                    <button onClick={() => { setEditing(c); setShowForm(true) }} className="text-sm text-primary/80 mr-3">Edit</button>
                    <button onClick={() => remove(c.id)} className="text-sm text-red-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={showForm} title={editing ? 'Edit car' : 'New car'} onClose={() => setShowForm(false)}>
        <CarForm initial={editing} onSaved={refresh} />
      </Modal>
    </Layout>
  )
}

