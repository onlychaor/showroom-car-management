import React from 'react'

export default function Modal({ open, title, children, onClose }: { open: boolean; title?: string; children: React.ReactNode; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#071428] rounded-xl shadow-2xl p-6 w-full max-w-2xl text-white border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          {title ? <div className="text-lg font-semibold">{title}</div> : <div />}
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="pt-2">{children}</div>
      </div>
    </div>
  )
}

