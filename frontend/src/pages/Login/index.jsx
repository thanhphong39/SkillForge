import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthStore, MOCK_USERS, ROLES } from '../../store/authStore.js'
import clsx from 'clsx'

const ROLE_BADGE = {
  CEO:       { bg: 'bg-zinc-900 text-white',        dot: 'bg-white' },
  DEPT_HEAD: { bg: 'bg-zinc-100 text-zinc-800',     dot: 'bg-zinc-700' },
  EMPLOYEE:  { bg: 'bg-zinc-100 text-zinc-600',     dot: 'bg-zinc-400' },
}

// Decorative left panel geometric lines
function GeometricArt() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Fine hairline cross lines */}
      <div className="absolute top-[18%] left-0 right-0 h-px bg-white/8" />
      <div className="absolute top-[42%] left-0 right-0 h-px bg-white/8" />
      <div className="absolute top-[68%] left-0 right-0 h-px bg-white/8" />
      <div className="absolute top-[85%] left-0 right-0 h-px bg-white/8" />
      <div className="absolute top-0 bottom-0 left-[22%] w-px bg-white/8" />
      <div className="absolute top-0 bottom-0 left-[65%] w-px bg-white/8" />

      {/* Large circle accent */}
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full border border-white/6" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full border border-white/5" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border border-white/5" />

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-white/20" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t border-r border-white/20" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-white/20" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-white/20" />

      {/* Small diamond */}
      <div
        className="absolute"
        style={{ top: '62%', left: '68%', width: 10, height: 10, background: 'rgba(255,255,255,0.15)', transform: 'rotate(45deg)' }}
      />
      <div
        className="absolute"
        style={{ top: '30%', left: '20%', width: 6, height: 6, background: 'rgba(255,255,255,0.1)', transform: 'rotate(45deg)' }}
      />
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuthStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusField, setFocusField] = useState(null)

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
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
    <div className="min-h-screen flex overflow-hidden bg-white">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col bg-zinc-950">
        <GeometricArt />

        {/* Logo top-left */}
        <div className="relative z-10 px-14 pt-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center">
              <img src="/logoSkill.png" alt="SkillForge" className="w-full h-full object-contain" />
            </div>
            <span
              className="text-white tracking-[0.25em] text-sm font-light uppercase"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              SkillForge
            </span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-14">
          <div className="max-w-xs">
            {/* Thin decorative line */}
            <div className="w-8 h-px bg-white/30 mb-10" />

            <h1
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-white font-light leading-[1.15] mb-6"
            >
              <span className="block text-5xl tracking-wide">Strategic</span>
              <span className="block text-5xl tracking-wide italic mt-1">Excellence</span>
              <span className="block text-5xl tracking-wide mt-1">Redefined.</span>
            </h1>

            <p
              className="text-zinc-400 text-sm font-light leading-relaxed tracking-wide"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Hệ thống Balanced Scorecard — chuyển hoá chiến lược thành hành động đo lường được.
            </p>

            <div className="w-8 h-px bg-white/30 mt-10" />
          </div>
        </div>

        {/* Bottom info */}
        <div className="relative z-10 px-14 pb-12">
          <div className="flex items-center gap-6">
            {[
              { num: '8', label: 'Bước BSC' },
              { num: '4', label: 'Góc độ' },
              { num: '∞', label: 'Mục tiêu' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div
                  className="text-white text-xl font-light tracking-widest"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {num}
                </div>
                <div className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 px-8 pt-8 pb-4">
          <img src="/logoSkill.png" alt="SkillForge" className="w-7 h-7 object-contain" />
          <span className="tracking-[0.2em] text-sm uppercase text-zinc-800 font-light">SkillForge</span>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 sm:px-14 py-12">
          <div className="w-full max-w-sm">

            {/* Section label */}
            <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium mb-8">
              Đăng nhập hệ thống
            </p>

            {/* Title */}
            <h2
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-4xl text-zinc-900 font-light tracking-wide mb-10"
            >
              Chào mừng
              <span className="block italic text-zinc-500 text-3xl mt-0.5">trở lại</span>
            </h2>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 mb-6 text-sm text-red-700 border-l-2 border-red-400 pl-3 py-1">
                <AlertCircle size={13} className="shrink-0" />
                <span className="font-light">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Username field — bottom border only */}
              <div className="relative">
                <label
                  className={clsx(
                    'block text-[10px] tracking-[0.25em] uppercase font-medium mb-2 transition-colors duration-200',
                    focusField === 'username' ? 'text-zinc-900' : 'text-zinc-400'
                  )}
                >
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusField('username')}
                  onBlur={() => setFocusField(null)}
                  placeholder="Nhập tên đăng nhập"
                  autoFocus
                  autoComplete="username"
                  className="w-full bg-transparent border-0 border-b text-sm text-zinc-900 outline-none pb-2.5 placeholder:text-zinc-300 font-light transition-all duration-200"
                  style={{
                    borderBottomColor: focusField === 'username' ? '#18181b' : '#e4e4e7',
                    letterSpacing: '0.03em',
                  }}
                />
                {/* Animated underline */}
                <div
                  className="absolute bottom-0 left-0 h-px bg-zinc-900 transition-all duration-300 ease-out"
                  style={{ width: focusField === 'username' ? '100%' : '0%' }}
                />
              </div>

              {/* Password field */}
              <div className="relative">
                <label
                  className={clsx(
                    'block text-[10px] tracking-[0.25em] uppercase font-medium mb-2 transition-colors duration-200',
                    focusField === 'password' ? 'text-zinc-900' : 'text-zinc-400'
                  )}
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusField('password')}
                    onBlur={() => setFocusField(null)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full bg-transparent border-0 border-b text-sm text-zinc-900 outline-none pb-2.5 pr-8 placeholder:text-zinc-300 font-light transition-all duration-200"
                    style={{
                      borderBottomColor: focusField === 'password' ? '#18181b' : '#e4e4e7',
                      letterSpacing: focusField === 'password' && !showPass ? '0.15em' : '0.03em',
                    }}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-0 bottom-2.5 text-zinc-400 hover:text-zinc-700 transition-colors"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div
                  className="absolute bottom-0 left-0 h-px bg-zinc-900 transition-all duration-300 ease-out"
                  style={{ width: focusField === 'password' ? '100%' : '0%' }}
                />
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={clsx(
                    'w-full py-4 text-[11px] tracking-[0.3em] uppercase font-medium transition-all duration-200',
                    loading
                      ? 'bg-zinc-400 text-white cursor-not-allowed'
                      : 'bg-zinc-950 text-white hover:bg-zinc-800 active:scale-[0.99]'
                  )}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                      Đang xử lý
                    </span>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>
              </div>
            </form>

            {/* Demo accounts */}
            <div className="mt-12">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 h-px bg-zinc-100" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400">Tài khoản demo</span>
                <div className="flex-1 h-px bg-zinc-100" />
              </div>

              <div className="space-y-1">
                {MOCK_USERS.map((u) => {
                  const role = ROLES[u.role]
                  const badge = ROLE_BADGE[u.role]
                  const isSelected = username === u.username
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => quickLogin(u)}
                      className={clsx(
                        'w-full flex items-center gap-3.5 px-4 py-3 text-left transition-all duration-150',
                        isSelected
                          ? 'bg-zinc-950'
                          : 'hover:bg-zinc-50'
                      )}
                    >
                      {/* Avatar */}
                      <div
                        className={clsx(
                          'w-7 h-7 flex items-center justify-center text-[10px] font-semibold shrink-0',
                          isSelected ? 'bg-white text-zinc-900' : 'bg-zinc-100 text-zinc-700'
                        )}
                      >
                        {u.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className={clsx(
                          'text-xs font-medium truncate tracking-wide',
                          isSelected ? 'text-white' : 'text-zinc-800'
                        )}>
                          {u.name}
                        </div>
                        <div className={clsx(
                          'text-[10px] truncate tracking-wide mt-0.5',
                          isSelected ? 'text-zinc-400' : 'text-zinc-400'
                        )}>
                          @{u.username} · {u.title}
                        </div>
                      </div>

                      {/* Role badge */}
                      <span className={clsx(
                        'text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 shrink-0',
                        isSelected
                          ? 'bg-white/10 text-white'
                          : badge.bg
                      )}>
                        {role?.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              <p className="text-[10px] text-zinc-300 text-center mt-4 tracking-wide">
                Mật khẩu demo: <span className="text-zinc-500 font-medium">123456</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 sm:px-14 pb-8 flex items-center justify-between">
          <p className="text-[10px] tracking-[0.15em] text-zinc-300 uppercase">
            © 2025 SkillForge
          </p>
          <p className="text-[10px] tracking-[0.15em] text-zinc-300 uppercase">
            BSC Management System
          </p>
        </div>
      </div>
    </div>
  )
}
