import { useEffect } from 'react'

export default function SignUpPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth'
    }
  }, [])
  return null
}

