import { useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [remember, setRemember] = useState(true)
  // redirect to unified auth page
  if (typeof window !== 'undefined') {
    if (window.location.pathname !== '/auth') {
      window.location.href = '/auth'
      return null as any
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else {
      // redirect to dashboard
      window.location.href = '/'
    }
  }

  async function handleForgot() {
    const e = window.prompt('Nhập email để đặt lại mật khẩu:')
    if (!e) return
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(e)
    setLoading(false)
    if (error) setError(error.message)
    else setMessage('Nếu email tồn tại, một liên kết đặt lại đã được gửi.')
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-center text-xl font-semibold mb-1 text-black">Sign in</h2>
          <p className="text-center text-sm text-slate-600 mb-6">Đăng nhập để tiếp tục</p>

          <label className="block mb-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 rounded border border-gray-200 text-black"
            />
          </label>

          <label className="block mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 rounded border border-gray-200 text-black"
            />
          </label>

          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-slate-600">
              <input type="checkbox" className="mr-2" checked={remember} onChange={() => setRemember(!remember)} /> Remember me
            </label>
            <button type="button" onClick={handleForgot} className="text-sm text-primary font-medium">Quên mật khẩu?</button>
          </div>

          {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
          {message && <div className="text-sm text-green-600 mb-2">{message}</div>}

          <button
            disabled={loading}
            className="w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold mb-2"
          >
            {loading ? 'Signing...' : 'Sign in'}
          </button>

          <div className="text-center text-sm text-slate-600 mt-2">
            Không có tài khoản? <a href="/auth/signup" className="text-primary font-medium">Đăng ký</a>
          </div>
        </form>
      </div>
    </Layout>
  )
}

