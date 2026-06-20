import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2, Users, LayoutGrid, Calendar, Settings,
  TrendingUp, ChevronRight, CheckCircle2, AlertTriangle,
  UserCheck, UserCog, User,
} from 'lucide-react'
import { useAdminStore } from '../../store/adminStore.js'
import { Card } from '../../components/ui/Card.jsx'
import { Badge } from '../../components/ui/Badge.jsx'

const ROLE_LABELS = { admin: 'Quản trị', manager: 'Quản lý', staff: 'Nhân viên' }
const ROLE_COLORS = { admin: 'red', manager: 'blue', staff: 'slate' }
const INDUSTRY_LABELS = {
  manufacturing: 'Sản xuất',
  trading: 'Thương mại',
  services: 'Dịch vụ',
  technology: 'Công nghệ',
  construction: 'Xây dựng',
}

function StatCard({ icon: Icon, label, value, sub, color = 'blue', onClick }) {
  const colorMap = {
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100 text-blue-600',   text: 'text-blue-700' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600',text: 'text-purple-700' },
    emerald:{ bg: 'bg-emerald-50',icon: 'bg-emerald-100 text-emerald-600',text:'text-emerald-700' },
    amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-100 text-amber-600',  text: 'text-amber-700' },
  }
  const c = colorMap[color]
  return (
    <div
      onClick={onClick}
      className={`${c.bg} rounded-xl p-5 border border-white/60 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
          <Icon size={20} />
        </div>
        {onClick && <ChevronRight size={16} className="text-slate-400 mt-1" />}
      </div>
      <div className="mt-3">
        <div className={`text-3xl font-bold ${c.text}`}>{value}</div>
        <div className="text-sm font-medium text-slate-700 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
      </div>
    </div>
  )
}

export default function OverviewPage() {
  const navigate = useNavigate()
  const { company, departments, users, periods, ratingThresholds } = useAdminStore()

  const stats = useMemo(() => {
    const byRole = users.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1
      return acc
    }, {})
    const activePeriod = periods.find((p) => p.isActive)
    const deptWithManager = departments.filter((d) => d.managerId).length
    return { byRole, activePeriod, deptWithManager }
  }, [users, periods, departments])

  const quickLinks = [
    { to: '/company-setup', icon: Building2, label: 'Cấu hình công ty', desc: 'Thông tin & năm tài chính', color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { to: '/departments',   icon: LayoutGrid, label: 'Phòng ban',        desc: `${departments.length} phòng ban`, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { to: '/users',         icon: Users,      label: 'Người dùng',       desc: `${users.length} tài khoản`, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { to: '/periods',       icon: Calendar,   label: 'Kỳ BSC',           desc: `${periods.length} kỳ`, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { to: '/system-config', icon: Settings,   label: 'Cấu hình hệ thống',desc: 'Ngưỡng xếp loại KPI', color: 'text-slate-600 bg-slate-50 border-slate-200' },
  ]

  return (
    <div className="space-y-6">
      {/* Company banner */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Tổng quan hệ thống</p>
            <h2 className="text-2xl font-bold">{company.name}</h2>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {company.industry && (
                <span className="text-xs text-slate-300 bg-slate-700/60 px-2.5 py-1 rounded-full">
                  {INDUSTRY_LABELS[company.industry] ?? company.industry}
                </span>
              )}
              <span className="text-xs text-slate-300 bg-slate-700/60 px-2.5 py-1 rounded-full">
                Năm tài chính {company.currentYear}
              </span>
              {stats.activePeriod && (
                <span className="text-xs text-emerald-300 bg-emerald-900/40 border border-emerald-700/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  Kỳ hiện tại: {stats.activePeriod.label}
                </span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-700 border border-slate-600 shrink-0">
            <img src="/logoSkill.png" alt="logo" className="w-full h-full object-contain scale-110" />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={LayoutGrid}
          label="Phòng ban"
          value={departments.length}
          sub={`${stats.deptWithManager}/${departments.length} có trưởng phòng`}
          color="blue"
          onClick={() => navigate('/departments')}
        />
        <StatCard
          icon={Users}
          label="Người dùng"
          value={users.length}
          sub={`${stats.byRole.admin ?? 0} admin · ${stats.byRole.manager ?? 0} QL · ${stats.byRole.staff ?? 0} NV`}
          color="purple"
          onClick={() => navigate('/users')}
        />
        <StatCard
          icon={Calendar}
          label="Kỳ BSC"
          value={periods.length}
          sub={stats.activePeriod ? `Đang hoạt động: ${stats.activePeriod.label}` : 'Chưa có kỳ active'}
          color="emerald"
          onClick={() => navigate('/periods')}
        />
        <StatCard
          icon={TrendingUp}
          label="Ngưỡng Xuất sắc"
          value={`≥${ratingThresholds.excellent}%`}
          sub={`Tốt ≥${ratingThresholds.good}% · TB ≥${ratingThresholds.average}%`}
          color="amber"
          onClick={() => navigate('/system-config')}
        />
      </div>

      {/* Role breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <Users size={16} className="text-slate-500" />
            Phân bổ vai trò người dùng
          </h3>
          <div className="space-y-3">
            {[
              { role: 'admin',   icon: UserCheck, color: 'text-red-600',    bg: 'bg-red-50',    bar: 'bg-red-500' },
              { role: 'manager', icon: UserCog,   color: 'text-blue-600',   bg: 'bg-blue-50',   bar: 'bg-blue-500' },
              { role: 'staff',   icon: User,      color: 'text-slate-600',  bg: 'bg-slate-100', bar: 'bg-slate-400' },
            ].map(({ role, icon: Icon, color, bg, bar }) => {
              const count = stats.byRole[role] ?? 0
              const pct = users.length > 0 ? Math.round((count / users.length) * 100) : 0
              return (
                <div key={role} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                    <Icon size={15} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{ROLE_LABELS[role]}</span>
                      <span className="text-xs text-slate-500">{count} người ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <LayoutGrid size={16} className="text-slate-500" />
            Danh sách phòng ban
          </h3>
          <div className="space-y-2">
            {departments.slice(0, 6).map((dept) => {
              const memberCount = users.filter((u) => u.deptId === dept.id).length
              const manager = users.find((u) => u.id === dept.managerId)
              return (
                <div key={dept.id} className="flex items-center gap-3 py-1.5">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 truncate">{dept.name}</div>
                    {manager && <div className="text-xs text-slate-400 truncate">{manager.name}</div>}
                  </div>
                  <Badge color="slate">{memberCount} người</Badge>
                </div>
              )
            })}
            {departments.length > 6 && (
              <button
                onClick={() => navigate('/departments')}
                className="text-xs text-blue-600 hover:underline w-full text-center pt-1"
              >
                Xem tất cả {departments.length} phòng ban →
              </button>
            )}
          </div>
        </Card>
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Truy cập nhanh</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {quickLinks.map(({ to, icon: Icon, label, desc, color }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center cursor-pointer hover:shadow-md transition-shadow ${color}`}
            >
              <Icon size={22} />
              <div>
                <div className="text-xs font-semibold">{label}</div>
                <div className="text-[11px] opacity-70 mt-0.5">{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Config status */}
      <Card>
        <h3 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2">
          <Settings size={16} className="text-slate-500" />
          Trạng thái cấu hình hệ thống
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Tên công ty', ok: !!company.name, hint: company.name || 'Chưa cấu hình' },
            { label: 'Phòng ban', ok: departments.length > 0, hint: `${departments.length} phòng ban` },
            { label: 'Người dùng', ok: users.length > 0, hint: `${users.length} tài khoản` },
            { label: 'Kỳ BSC active', ok: !!stats.activePeriod, hint: stats.activePeriod?.label ?? 'Chưa chọn kỳ' },
          ].map(({ label, ok, hint }) => (
            <div key={label} className={`flex items-start gap-2.5 p-3 rounded-lg ${ok ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              {ok
                ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                : <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
              }
              <div>
                <div className="text-xs font-semibold text-slate-700">{label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 truncate">{hint}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
