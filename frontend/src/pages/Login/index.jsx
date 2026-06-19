import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuthStore, MOCK_USERS, ROLES } from '../../store/authStore.js'
import clsx from 'clsx'

const ROLE_BADGE_COLOR = {
  CEO:       'bg-purple-100 text-purple-700',
  DEPT_HEAD: 'bg-blue-100 text-blue-700',
  EMPLOYEE:  'bg-emerald-100 text-emerald-700',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuthStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Đã login → redirect thẳng về dashboard
  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu.')
      return
    }
    setLoading(true)
    // Giả lập độ trễ mạng
    await new Promise((r) => setTimeout(r, 400))
    const ok = login(username, password)
    setLoading(false)
    if (ok) {
      navigate('/dashboard', { replace: true })
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.')
    }
  }

  const quickLogin = (u) => {
    setUsername(u.username)
    setPassword(u.password)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <img src="/logoSkill.png" alt="SkillForge" className="w-12 h-12 object-contain" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SkillForge</h1>
            <p className="text-blue-200 text-sm mt-1">Hệ thống Quản lý Chiến lược BSC</p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">Đăng nhập</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                  <AlertCircle size={15} className="shrink-0" />
                  {error}
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập..."
                  autoFocus
                  autoComplete="username"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    autoComplete="current-password"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={clsx(
                  'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all',
                  loading
                    ? 'bg-blue-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                )}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Đăng nhập
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Demo accounts */}
          <div className="px-8 pb-8">
            <div className="border-t border-slate-100 pt-5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3 text-center">
                Tài khoản demo (mật khẩu: 123456)
              </p>
              <div className="space-y-2">
                {MOCK_USERS.map((u) => {
                  const role = ROLES[u.role]
                  const isSelected = username === u.username
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => quickLogin(u)}
                      className={clsx(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all',
                        isSelected
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: role?.color ?? '#64748b' }}
                      >
                        {u.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-700">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.title} · @{u.username}</div>
                      </div>
                      <span className={clsx('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0', ROLE_BADGE_COLOR[u.role])}>
                        {role?.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-5">
          © 2025 SkillForge — Hệ thống BSC nội bộ
        </p>
      </div>
    </div>
  )
}
