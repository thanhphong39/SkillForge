import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'
import clsx from 'clsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuthStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    const ok = login(username, password)
    if (ok) {
      // Init BSC context (create company + strategy if first time)
      useBscContextStore.getState().init().then(() => {
        const { strategyId } = useBscContextStore.getState()
        if (strategyId) useBSCWorkflowStore.getState().fetchSteps(strategyId)
      })
      setLoading(false)
      navigate('/dashboard', { replace: true })
    } else {
      setLoading(false)
      setError('Tên đăng nhập hoặc mật khẩu không đúng.')
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">

      {/* ── Bright gradient background ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #EEF2FF 0%, #F8FAFF 40%, #EFF6FF 70%, #F0FDF4 100%)',
        }}
      />

      {/* Orb 1 – blue soft */}
      <div
        className="login-orb-1 absolute w-175 h-175 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)',
          top: '-20%', left: '-15%',
        }}
      />
      {/* Orb 2 – indigo */}
      <div
        className="login-orb-2 absolute w-150 h-150 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(60,80,224,0.10) 0%, transparent 65%)',
          bottom: '-15%', right: '-10%',
        }}
      />
      {/* Orb 3 – emerald accent */}
      <div
        className="login-orb-3 absolute w-100 h-100 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)',
          top: '30%', right: '15%',
        }}
      />

      {/* ── Card ── */}
      <div className="animate-fade-up relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="animate-fade-in flex flex-col items-center mb-7" style={{ animationDelay: '0.1s' }}>
          <img src="/logoSkill.png" alt="SkillForge" className="w-20 h-20 object-contain mb-1" />
          <h1 className="text-xl font-bold text-[#1C2434] tracking-tight">SkillForge</h1>
          <p className="text-sm text-[#64748B] mt-0.5">BSC Management System</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xl shadow-slate-200/60">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1C2434]">Đăng nhập</h2>
            <p className="text-sm text-[#64748B] mt-1">Nhập thông tin để truy cập hệ thống</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={15} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-[#1C2434] mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                autoFocus
                autoComplete="username"
                className="w-full px-4 py-3 text-sm text-[#1C2434] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg outline-none placeholder:text-[#94A3B8] transition-all duration-200 focus:border-[#3C50E0] focus:ring-2 focus:ring-[#3C50E0]/10 focus:bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-[#1C2434]">Mật khẩu</label>
                <button type="button" className="text-xs text-[#3C50E0] hover:text-[#3142C4] transition-colors font-medium">
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 text-sm text-[#1C2434] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg outline-none placeholder:text-[#94A3B8] transition-all duration-200 focus:border-[#3C50E0] focus:ring-2 focus:ring-[#3C50E0]/10 focus:bg-white"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded accent-[#3C50E0] cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-[#64748B] cursor-pointer select-none">
                Ghi nhớ đăng nhập
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={clsx(
                'relative w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden',
                loading
                  ? 'bg-[#3C50E0]/60 text-white cursor-not-allowed'
                  : 'bg-[#3C50E0] hover:bg-[#3142C4] active:scale-[0.99] text-white shadow-md shadow-[#3C50E0]/30 hover:shadow-lg hover:shadow-[#3C50E0]/40'
              )}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang đăng nhập...
                </>
              ) : 'Đăng nhập'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          © 2025 SkillForge · Balanced Scorecard Management
        </p>
      </div>
    </div>
  )
}
