import React from 'react'
import { motion } from 'framer-motion'

function StatCard({ title, value, children }: { title: string; value: string | number; children?: React.ReactNode }) {
  return (
    <motion.div
      className="card-bg p-4 rounded-lg shadow min-h-[100px]"
      whileHover={{ y: -6, boxShadow: '0 18px 40px rgba(2,6,23,0.6)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-400">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <div>{children}</div>
      </div>
    </motion.div>
  )
}
export default React.memo(StatCard)
