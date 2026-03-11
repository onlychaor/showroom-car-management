import { useState } from 'react'
import AuthLayout from '../../components/AuthLayout'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    // simple local dev auth: store dev_user and redirect
    localStorage.setItem('dev_user', JSON.stringify({ id: 'dev-' + Math.random().toString(36).slice(2,8), email }))
    setLoading(false)
    window.location.href = '/'
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (password.length < 6) {
      setError('Mật khẩu cần có ít nhất 6 ký tự.')
      return
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    // local dev signup: store dev_user and redirect after delay
    localStorage.setItem('dev_user', JSON.stringify({ id: 'dev-' + Math.random().toString(36).slice(2,8), email, name: email.split('@')[0] }))
    setMessage('Đăng ký thành công (dev). Chuyển vào trong sau 3 giây...')
    setTimeout(() => {
      window.location.href = '/'
    }, 3000)
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
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 rounded border border-gray-200"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 rounded border border-gray-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {!isSignIn && (
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-3 py-2 rounded border border-gray-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
            )}

            {error && <div className="text-sm text-red-500">{error}</div>}
            {message && <div className="text-sm text-green-600">{message}</div>}

            <button
              disabled={loading}
              className="w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold"
            >
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

