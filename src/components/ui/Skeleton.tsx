import React from 'react'

export default function Skeleton({ className = '', style = {} }: { className?: string; style?: any }) {
  return <div className={`animate-pulse bg-white/6 rounded ${className}`} style={style} />
}

