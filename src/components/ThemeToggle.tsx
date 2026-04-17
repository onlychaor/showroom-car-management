import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      const v = localStorage.getItem('theme')
      if (v) return v === 'light'
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      if (isLight) {
        document.documentElement.classList.add('light')
        localStorage.setItem('theme', 'light')
      } else {
        document.documentElement.classList.remove('light')
        localStorage.setItem('theme', 'dark')
      }
    } catch (e) {}
  }, [isLight])

  return (
    <button
      type="button"
      aria-pressed={isLight}
      onClick={() => setIsLight((s) => !s)}
      className="p-2 rounded-md bg-white/5 hover:bg-white/10 text-sm"
      title="Toggle light / dark"
    >
      {isLight ? '🌞' : '🌜'}
    </button>
  )
}

