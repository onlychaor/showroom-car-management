import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ open, title, children, onClose }: { open: boolean; title?: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative bg-[#071428] rounded-xl p-6 w-full max-w-2xl text-white border border-slate-800"
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4">
              {title ? <div className="text-lg font-semibold">{title}</div> : <div />}
              <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="pt-2">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

