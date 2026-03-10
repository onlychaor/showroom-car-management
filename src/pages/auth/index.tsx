import { useState } from 'react'
import AuthLayout from '../../components/AuthLayout'
import { supabase } from '../../lib/supabaseClient'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else window.location.href = '/'
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }

    // If a session was returned, redirect. Otherwise inform user to confirm email.
    if ((data as any)?.session) {
      window.location.href = '/'
    } else {
      setMessage('Đăng ký thành công. Nếu cần, vui lòng kiểm tra email để xác nhận trước khi đăng nhập.')
    }
  }

  const isSignIn = mode === 'signin'

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-center gap-4 mb-4">
            <button onClick={() => setMode('signin')} className={`px-4 py-2 rounded ${isSignIn ? 'bg-primary text-white' : 'bg-white/20'}`}>Sign in</button>
            <button onClick={() => setMode('signup')} className={`px-4 py-2 rounded ${!isSignIn ? 'bg-primary text-white' : 'bg-white/20'}`}>Sign up</button>
          </div>

          <h2 className="text-center text-lg font-semibold mb-1 text-black">{isSignIn ? 'Sign in' : 'Đăng ký'}</h2>
          <p className="text-center text-sm text-slate-600 mb-6">{isSignIn ? 'Đăng nhập để tiếp tục' : 'Tạo tài khoản mới'}</p>

          <form onSubmit={isSignIn ? handleSignIn : handleSignUp} className="space-y-3">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded border border-gray-200" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 rounded border border-gray-200" />

            {error && <div className="text-sm text-red-500">{error}</div>}
            {message && <div className="text-sm text-green-600">{message}</div>}

            <button disabled={loading} className="w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold">
              {loading ? 'Processing...' : isSignIn ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="text-center text-sm text-slate-600 mt-4">
            {isSignIn ? (
              <>Không có tài khoản? <button onClick={() => setMode('signup')} className="text-primary font-medium">Đăng ký</button></>
            ) : (
              <>Đã có tài khoản? <button onClick={() => setMode('signin')} className="text-primary font-medium">Sign in</button></>
            )}
          </div>
      </div>
    </AuthLayout>
  )
}

