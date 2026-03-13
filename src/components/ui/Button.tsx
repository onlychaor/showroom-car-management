import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-md transition-transform transition-shadow'
  const sizes: Record<string, string> = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  }
  const variants: Record<string, string> = {
    primary: 'bg-primary text-white hover:shadow-lg hover:-translate-y-0.5',
    neutral: 'bg-white/6 text-slate-100 hover:bg-white/8',
    ghost: 'bg-transparent text-slate-200 hover:bg-white/3',
  }

  const cls = [base, sizes[size], variants[variant], className].filter(Boolean).join(' ')

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}

