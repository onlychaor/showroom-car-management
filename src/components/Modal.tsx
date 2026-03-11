import React from 'react'

export default function Modal({ open, title, children, onClose }: { open: boolean; title?: string; children: React.ReactNode; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[#071428] rounded-lg shadow-lg p-6 w-full max-w-lg text-white">
        {title && <div className="text-lg font-semibold mb-3">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  )
}

