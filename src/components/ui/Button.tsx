import React from 'react'
import { motion } from 'framer-motion'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-md shadow-sm'
  const sizes: Record<string, string> = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  }
  const variants: Record<string, string> = {
    primary: 'bg-primary text-white',
    neutral: 'bg-white/6 text-slate-100',
    ghost: 'bg-transparent text-slate-200',
  }

  const cls = [base, sizes[size], variants[variant], className].filter(Boolean).join(' ')

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2, boxShadow: '0 10px 20px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={cls}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

