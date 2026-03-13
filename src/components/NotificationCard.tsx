import React from 'react'

export default function NotificationCard({ item, onEdit, onDelete }: { item: any; onEdit?: (i: any) => void; onDelete?: (id: string) => void }) {
  const due = item.scheduled_at ? new Date(item.scheduled_at) : null
  const now = new Date()
  let remaining = null
  if (due) {
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    remaining = diff
  }

  return (
    <div className="card-bg p-4 rounded border border-slate-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-semibold mb-1">{item.title}</div>
          <div className="text-sm text-slate-400 mb-3">{item.email || 'Không có mô tả'}</div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-slate-900 rounded text-primary">Mức độ: Khẩn cấp</span>
            {item.scheduled_at && <span className="px-2 py-1 bg-slate-900 rounded text-sky-300">Duration: {new Date(item.scheduled_at).toLocaleDateString()}</span>}
            {remaining !== null && <span className="px-2 py-1 bg-slate-900 rounded text-red-400">{remaining <= 0 ? `Đã quá hạn ${Math.abs(remaining)}d` : `Còn ${remaining} ngày`}</span>}
          </div>
        </div>

        <div className="ml-4 flex flex-col gap-2">
          <button onClick={() => onEdit?.(item)} className="text-slate-400 hover:text-white">✎</button>
          <button onClick={() => onDelete?.(item.id)} className="text-red-400 hover:text-red-200">🗑</button>
        </div>
      </div>
    </div>
  )
}

