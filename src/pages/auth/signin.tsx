import { useEffect } from 'react'
import Layout from '../../components/Layout'

export default function SignInPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth'
    }
  }, [])
  return null
}

