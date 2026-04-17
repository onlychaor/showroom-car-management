import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isLight, setIsLight] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    try {
      const v = localStorage.getItem('theme')
      const prefers = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      const initial = v ? v === 'light' : Boolean(prefers)
      setIsLight(initial)
      if (initial) document.documentElement.classList.add('light')
      else document.documentElement.classList.remove('light')
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      if (isLight) {
        document.documentElement.classList.add('light')
        localStorage.setItem('theme', 'light')
      } else {
        document.documentElement.classList.remove('light')
        localStorage.setItem('theme', 'dark')
      }
    } catch (e) {}
  }, [isLight, mounted])

  if (!mounted) return null

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

