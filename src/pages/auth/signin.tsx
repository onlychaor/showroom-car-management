import { useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabaseClient'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else window.location.href = '/'
  }

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/5 p-8 rounded-md card-bg">
          <h2 className="text-center text-xl font-semibold mb-2">Sign in</h2>
          <p className="text-center text-sm text-slate-400 mb-6">Đăng nhập để tiếp tục</p>

          <label className="block mb-3">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
          </label>
          <label className="block mb-3">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 rounded bg-transparent border border-slate-700" />
          </label>

          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-slate-400"><input type="checkbox" className="mr-2" /> Remember me</label>
            <a className="text-sm text-pink-400" href="#">Quên mật khẩu?</a>
          </div>

          {error && <div className="text-sm text-red-400 mb-2">{error}</div>}

          <button disabled={loading} className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-pink-400 font-semibold">
            {loading ? 'Signing...' : 'Sign in'}
          </button>

          <div className="text-center text-sm text-slate-400 mt-3">
            Không có tài khoản? <a href="/auth/signup" className="text-pink-400">Đăng ký</a>
          </div>
        </form>
      </div>
    </Layout>
  )
}

