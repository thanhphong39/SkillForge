import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'
import { useAdminAuthStore } from '../../store/adminAuthStore.js'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAdminAuthStore()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  function onSubmit(data) {
    setError('')
    const ok = login(data.username, data.password)
    if (ok) {
      navigate('/overview', { replace: true })
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl border border-slate-700 mb-4 overflow-hidden">
            <img src="/logoSkill.png" alt="SkillForge" className="w-full h-full object-contain scale-110" />
          </div>
          <h1 className="text-2xl font-bold text-white">SkillForge Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Hệ thống quản trị BSC</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={16} className="text-purple-400" />
            <span className="text-sm font-medium text-slate-300">Đăng nhập quản trị</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle size={15} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Tên đăng nhập</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('username', { required: true })}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('password', { required: true })}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors mt-2 cursor-pointer"
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
            <p className="text-xs text-slate-400 text-center">
              Demo: <span className="text-slate-300 font-medium">admin</span> / <span className="text-slate-300 font-medium">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
